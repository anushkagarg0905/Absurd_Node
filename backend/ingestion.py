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
    Analyze the following text and extract entities and relationships.
    Return ONLY a JSON object with "nodes" (list of: {"name", "type", "description"}) 
    and "edges" (list of: {"source", "target", "relationship"}).
    Text: {text[:5000]} # Limit text length for token limits
    """
    response = model.generate_content(prompt)
    try:
        # Gemini sometimes wraps JSON in markdown blocks
        json_str = response.text.replace("```json", "").replace("```", "")
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return {"nodes": [], "edges": []}

def ingest_to_neo4j(data: dict):
    driver = get_driver()
    if not driver:
        print("Neo4j driver not available.")
        return

    with driver.session() as session:
        # Create Nodes
        for node in data.get("nodes", []):
            session.run("""
                MERGE (e:Entity {name: $name})
                SET e.entity_type = $type, e.description = $description
            """, name=node['name'], type=node['type'], description=node['description'])

        # Create Edges
        for edge in data.get("edges", []):
            session.run("""
                MATCH (a:Entity {name: $source}), (b:Entity {name: $target})
                MERGE (a)-[r:RELATED_TO]->(b)
                SET r.type = $rel_type
            """, source=edge['source'], target=edge['target'], rel_type=edge['relationship'])
