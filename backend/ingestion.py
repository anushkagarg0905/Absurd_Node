import json
import google.generativeai as genai
from playwright.sync_api import sync_playwright
from backend.config import settings
from backend.graph.neo4j_client import get_driver

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def scrape_text(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        text = page.inner_text("body")
        browser.close()
        return text

def extract_entities_and_relationships(text: str) -> dict:
    prompt = f"""
    Analyze the following text for corporate intelligence.
    1. Extract ONLY high-confidence entities and significant relationships.
    2. IGNORE trivial information.
    3. For each entity and relationship, provide a confidence score (0.0 to 1.0).
    4. Write a concise summary, investigation title, and date.

    Return ONLY a JSON object with:
    "nodes": [ {{"name": "...", "type": "...", "description": "...", "confidence": 0.0}} ],
    "edges": [ {{"source": "...", "target": "...", "relationship": "...", "confidence": 0.0}} ],
    "summary": "...",
    "title": "...",
    "date": "YYYY-MM-DD"

    Text: {text[:5000]}
    """
    response = model.generate_content(prompt)
    try:
        # Gemini sometimes wraps JSON in markdown blocks
        json_str = response.text.replace("```json", "").replace("```", "")
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return {"nodes": [], "edges": [], "summary": "", "title": "Untitled", "date": ""}

def ingest_to_neo4j(data: dict, url: str):
    driver = get_driver()
    if not driver:
        print("Neo4j driver not available.")
        return

    with driver.session() as session:
        # Create Investigation Node
        session.run("""
            MERGE (i:Investigation {title: $title})
            SET i.date = $date, i.summary = $summary
        """, title=data.get('title'), date=data.get('date'), summary=data.get('summary'))

        # Create Source Node
        session.run("MERGE (s:Source {url: $url})", url=url)

        # Create Nodes, link to Investigation and Source
        for node in data.get("nodes", []):
            session.run("""
                MERGE (e:Entity {name: $name})
                SET e.entity_type = $type, e.description = $description, e.confidence = $conf
                WITH e
                MATCH (i:Investigation {title: $title}), (s:Source {url: $url})
                MERGE (i)-[:HAS_ENTITY]->(e)
                MERGE (e)-[:MENTIONED_IN]->(s)
            """, name=node['name'], type=node['type'], description=node['description'], 
                 conf=node.get('confidence', 0.8), title=data.get('title'), url=url)

        # Create Edges
        for edge in data.get("edges", []):
            session.run("""
                MATCH (a:Entity {name: $source}), (b:Entity {name: $target})
                MERGE (a)-[r:RELATED_TO]->(b)
                SET r.type = $rel_type, r.confidence = $conf
            """, source=edge['source'], target=edge['target'], rel_type=edge['relationship'], 
                 conf=edge.get('confidence', 0.8))
