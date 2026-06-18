  
**AI-POWERED OSINT**

**KNOWLEDGE GRAPH PLATFORM**

Entity Resolution & Relationship Analysis

**TECHNICAL IMPLEMENTATION SPECIFICATION**

Version 1.0  |  For Engineering Team

Classification: Internal

# **1\. Executive Summary**

This document is the authoritative implementation specification for the AI-Powered OSINT Knowledge Graph Platform. It is written for the engineering team and provides sufficient detail to begin development immediately without ambiguity.

The platform ingests publicly available data—news feeds, RSS, Wikipedia, and company websites—applies a multi-stage NLP pipeline (NER → Relation Extraction → Entity Resolution), and persists a structured knowledge graph in Neo4j AuraDB. A FastAPI backend serves graph queries and AI-generated intelligence reports; a Next.js frontend renders an interactive graph explorer and analytics dashboard.

## **Technology Stack Summary**

| Layer | Technology | Purpose |
| :---- | :---- | :---- |
| Frontend | Next.js 14 \+ TypeScript \+ Tailwind CSS \+ shadcn/ui | React app, UI components, styling |
| Graph Visualization | React Flow | Interactive entity-relationship canvas |
| Backend API | FastAPI (Python 3.11) | REST endpoints, orchestration |
| NLP / AI | spaCy 3, HuggingFace Transformers, Gemini API | NER, RE, report generation |
| Graph DB | Neo4j AuraDB | Knowledge graph storage and queries |
| Relational DB | PostgreSQL on Neon | Metadata, jobs, users, audit logs |
| Containerization | Docker \+ Docker Compose | Local and CI environments |
| Deployment — BE | Render (Docker) | Backend \+ worker services |
| Deployment — FE | Vercel | Next.js frontend |

# **2\. Problem Statement**

OSINT analysts currently face three compounding problems:

* Data fragmentation — relevant signals are scattered across hundreds of public sources with no unified schema.

* Entity ambiguity — the same entity ('Apple', 'J. Smith') appears under dozens of surface forms, making cross-source correlation manual and error-prone.

* Relationship opacity — connections between entities (ownership, employment, investment, litigation) are buried in unstructured text and invisible to standard search.

The platform solves all three by automating ingestion, canonicalizing entities, and materializing relationships as a queryable, visual knowledge graph — reducing analyst time from days to minutes.

| Problem | Current State | Platform Solution |
| :---- | :---- | :---- |
| Source fragmentation | Manual browsing of news sites, Wikipedia, filings | Unified ingestion layer with scheduled crawlers |
| Duplicate entities | Multiple records for same real-world entity | ML-based entity resolution with confidence scoring |
| Hidden relationships | Buried in article text | LLM relation extraction → graph edges |
| Insight generation | Analyst writes reports manually | Gemini API generates structured intelligence briefs |
| Visualization | Static spreadsheets or ad-hoc tools | React Flow interactive graph explorer |

# **3\. Functional Requirements**

| ID | Requirement | Priority | Notes |
| :---- | :---- | :---- | :---- |
| FR-01 | Ingest RSS/Atom feeds on a configurable schedule | P0 | Celery beat task |
| FR-02 | Scrape Wikipedia pages for seed entities | P0 | wikipedia-api lib |
| FR-03 | Crawl company websites (1 level deep) | P1 | Playwright headless |
| FR-04 | Run spaCy NER on all ingested text | P0 | en\_core\_web\_trf model |
| FR-05 | Extract typed relations via Gemini API | P0 | See NLP section |
| FR-06 | Resolve duplicate entities (\>0.85 confidence) | P0 | Dedupe \+ embeddings |
| FR-07 | Persist entities and relations to Neo4j | P0 | Bolt driver |
| FR-08 | Expose GraphQL-style REST API over graph | P0 | FastAPI routers |
| FR-09 | Generate intelligence reports via Gemini | P1 | Templated prompts |
| FR-10 | Render interactive graph in browser | P0 | React Flow |
| FR-11 | Dashboard: entity search, timeline, filters | P1 | shadcn/ui components |
| FR-12 | User auth (JWT, role-based) | P0 | Analyst / Admin roles |
| FR-13 | Audit log all ingestion \+ graph mutations | P1 | PostgreSQL |
| FR-14 | Export graph as JSON / CSV | P2 | Download endpoint |

# **4\. Architecture Design**

## **4.1 System Architecture**

The system follows a layered pipeline architecture. External sources feed a Celery-based ingestion worker, output flows through the NLP pipeline, entities are resolved and written to Neo4j \+ PostgreSQL, and the FastAPI layer serves the Next.js frontend.

┌─────────────────────── PUBLIC INTERNET ────────────────────────────┐  
│  RSS/Atom Feeds   Wikipedia API   News Sites   Company Websites    │  
└──────────────┬──────────────────────────────────┬──────────────────┘  
               │                                  │                     
       ┌───────▼──────────────────────────────────▼──────────┐         
       │           DATA INGESTION LAYER (Celery Workers)      │         
       │  FeedParser  │  wikipedia-api  │  Playwright Scraper │         
       └───────────────────────┬──────────────────────────────┘         
                               │ Raw Text                               
       ┌───────────────────────▼──────────────────────────────┐         
       │              NLP PIPELINE (FastAPI Worker)            │         
       │  spaCy NER → Gemini Relation Extraction → Embeddings │         
       └───────────────────────┬──────────────────────────────┘         
                               │ Entities \+ Relations                   
       ┌───────────────────────▼──────────────────────────────┐         
       │           ENTITY RESOLUTION ENGINE                   │         
       │     Blocking → Similarity Scoring → Merge/Link       │         
       └──────────┬────────────────────────┬──────────────────┘         
                  │                        │                            
      ┌───────────▼──────┐    ┌────────────▼────────────┐              
      │   Neo4j AuraDB   │    │   PostgreSQL (Neon)     │              
      │  Knowledge Graph │    │  Metadata \+ Audit Logs  │              
      └───────────┬──────┘    └────────────┬────────────┘              
                  │                        │                            
       ┌──────────▼────────────────────────▼──────────────┐            
       │              FastAPI Backend (Render)             │            
       │   /graph  /entities  /relations  /reports  /auth  │            
       └──────────────────────┬───────────────────────────┘            
                              │ REST/JSON                               
       ┌──────────────────────▼───────────────────────────┐            
       │           Next.js Frontend (Vercel)               │            
       │   React Flow Graph  │  Dashboard  │  Report View  │            
       └──────────────────────────────────────────────────┘        


## **4.2 Repository Structure**

Monorepo managed with a root docker-compose.yml. Two top-level workspace directories: /frontend and /backend.

osint-kg/  
├── docker-compose.yml           \# Dev environment orchestration  
├── .env.example                 \# All required env vars documented  
├── README.md  
│  
├── src/                \# Next.js application  
│   ├── app/                 \# App Router pages  
│   │   ├── (auth)/login/  
│   │   ├── dashboard/  
│   │   ├── graph/  
│   │   └── reports/  
│   ├── components/  
│   │   ├── ui/              \# shadcn/ui generated components  
│   │   ├── graph/           \# React Flow wrappers  
│   │   └── dashboard/  
│   ├── lib/  
│   │   ├── api.ts           \# Typed fetch wrappers  
│   │   └── types.ts         \# Shared TS interfaces  
│   └── store/               \# Zustand state  
├── tailwind.config.ts  
└── package.json  
│  
└── app/  
│   ├── main.py              \# FastAPI app factory  
│   ├── routers/  
│   │   ├── entities.py  
│   │   ├── relations.py  
│   │   ├── graph.py  
│   │   ├── reports.py  
│   │   └── auth.py  
│   ├── models/  
│   │   ├── pg\_models.py     \# SQLAlchemy ORM  
│   │   └── schemas.py       \# Pydantic v2 schemas  
│   ├── nlp/  
│   │   ├── ner.py           \# spaCy pipeline  
│   │   ├── relation.py      \# Gemini RE prompts  
│   │   └── embeddings.py    \# HuggingFace sentence-transformers  
│   ├── resolution/  
│   │   ├── blocker.py       \# Blocking strategies  
│   │   └── resolver.py      \# Similarity \+ merge logic  
│   ├── graph/  
│   │   ├── neo4j\_client.py  \# Driver singleton  
│   │   └── queries.py       \# Cypher templates  
│   ├── ingestion/  
│   │   ├── feed\_parser.py  
│   │   ├── wikipedia.py  
│   │   └── scraper.py  
│   └── workers/  
│       ├── celery\_app.py  
│       └── tasks.py  
├── tests/  
├── Dockerfile  
└── requirements.txt

# **5\. Data Ingestion Layer**

## **5.1 Source Types and Fetchers**

| Source | Library | Schedule | Output |
| :---- | :---- | :---- | :---- |
| RSS / Atom Feeds | feedparser 6.x | Every 15 min | Article title \+ body \+ pub\_date \+ url |
| Wikipedia | wikipedia-api 0.6 | On-demand / daily seed refresh | Page text \+ infobox \+ categories |
| News websites | Playwright 1.x (headless Chromium) | Every 4 hours | Rendered HTML → text via BeautifulSoup |
| Company websites | Playwright (1-level deep crawl) | Daily | Homepage \+ About/News pages |

## **5.2 Ingestion Pipeline**

Each fetcher posts a raw document to the ingestion queue (Redis-backed Celery). The pipeline stages are:

* Stage 1 — Fetch: retrieve raw content, store in PostgreSQL raw\_documents table with source metadata.

* Stage 2 — Deduplicate: SHA-256 hash of content body; skip if already seen.

* Stage 3 — Clean: strip HTML, normalize Unicode (NFKC), remove boilerplate (header/footer/nav detection via trafilatura).

* Stage 4 — Sentence-split: spaCy sentencizer; output sentence list.

* Stage 5 — Enqueue NLP: publish cleaned sentences to nlp\_queue for async processing.

## **5.3 Celery Configuration**

\# backend/app/workers/celery\_app.py

CELERY\_BROKER\_URL \= 'redis://redis:6379/0'

CELERY\_RESULT\_BACKEND \= 'redis://redis:6379/1'

beat\_schedule \= {

    'ingest-rss': { 'task': 'tasks.ingest\_feeds', 'schedule': 900 },

    'ingest-news': { 'task': 'tasks.scrape\_news', 'schedule': 14400 },

    'ingest-wiki': { 'task': 'tasks.refresh\_wikipedia', 'schedule': 86400 },

}

ℹ  All raw documents are stored before NLP processing. Failures in NLP do not require re-fetching; documents are reprocessed from PostgreSQL.

# **6\. NLP Pipeline Design**

## **6.1 Named Entity Recognition (spaCy)**

Model: en\_core\_web\_trf (transformer-based, \~440MB). Run on CPU; upgrade to GPU if throughput demands. Entity types extracted:

| spaCy Label | Maps To | Example |
| :---- | :---- | :---- |
| ORG | Organization | 'OpenAI', 'SEC', 'Goldman Sachs' |
| PERSON | Person | 'Sam Altman', 'Elon Musk' |
| GPE | Location | 'San Francisco', 'Germany' |
| PRODUCT | Product | 'iPhone 15', 'ChatGPT' |
| MONEY | Financial | '$4.2 billion' |
| DATE | Temporal | 'Q3 2024', 'March 15' |

## **6.2 Relation Extraction (Gemini API)**

After NER, sentence-entity pairs are batched and sent to Gemini 1.5 Flash. Prompt template (stored in backend/app/nlp/relation.py):

SYSTEM \= 'You are a structured information extractor. Return only valid JSON.'

USER\_TEMPLATE \= '''

Text: {sentence}

Entities detected: {entities}

Extract all relationships. Return JSON array:

\[{"subject": str, "predicate": str, "object": str, "confidence": float}\]

Use predicates from: OWNS, EMPLOYS, INVESTED\_IN, PARTNERS\_WITH,

COMPETES\_WITH, ACQUIRED, SUED\_BY, LOCATED\_IN, FOUNDED\_BY'''

| Predicate | Direction | Example |
| :---- | :---- | :---- |
| EMPLOYS | ORG → PERSON | 'Google EMPLOYS Sundar Pichai' |
| OWNS | ORG → ORG/PRODUCT | 'Microsoft OWNS GitHub' |
| ACQUIRED | ORG → ORG | 'Adobe ACQUIRED Figma' |
| INVESTED\_IN | ORG/PERSON → ORG | 'Sequoia INVESTED\_IN OpenAI' |
| PARTNERS\_WITH | ORG ↔ ORG | 'Apple PARTNERS\_WITH IBM' |
| COMPETES\_WITH | ORG ↔ ORG | 'Nvidia COMPETES\_WITH AMD' |
| FOUNDED\_BY | ORG → PERSON | 'Tesla FOUNDED\_BY Elon Musk' |
| LOCATED\_IN | ORG/PERSON → GPE | 'Anthropic LOCATED\_IN San Francisco' |
| SUED\_BY | ORG/PERSON → ORG/PERSON | 'OpenAI SUED\_BY NYT' |

## **6.3 Embedding Generation**

Model: sentence-transformers/all-MiniLM-L6-v2 via HuggingFace Transformers. Each canonical entity name is embedded (384-dim float32 vector). Vectors are stored in PostgreSQL (pgvector extension) for similarity search during entity resolution. Batch size: 64 entities per call.

# **7\. Entity Resolution System**

Entity resolution prevents graph pollution from duplicate nodes representing the same real-world entity. It runs in two stages: Blocking (candidate generation) and Scoring (pair-wise comparison).

## **7.1 Blocking**

Blocking limits the comparison space. Three blocking keys are applied in parallel:

| Blocking Key | Logic | Example |
| :---- | :---- | :---- |
| Token sort ratio | Lowercase, sort tokens alphabetically, compare prefix | 'Apple Inc' → 'apple inc' → key='apple' |
| Soundex code | Phonetic key on first significant token | 'Microsoft'→'M262', 'Microsft'→'M262' |
| Embedding ANN | Approximate nearest neighbor (HNSW via pgvector) | cosine distance \< 0.4 → candidate pair |

## **7.2 Similarity Scoring**

Each candidate pair is scored across four features:

| Feature | Weight | Method |
| :---- | :---- | :---- |
| Name similarity | 0.40 | RapidFuzz token\_sort\_ratio |
| Embedding cosine similarity | 0.35 | pgvector \<=\> operator |
| Entity type match | 0.15 | Boolean: same type \= 1, else 0 |
| Shared co-occurrences | 0.10 | Count of shared source documents |

Final score \= weighted sum. Thresholds:

* Score ≥ 0.85 → AUTO MERGE: entities merged into canonical node, aliases stored.

* Score 0.65–0.84 → HUMAN REVIEW QUEUE: written to PostgreSQL resolution\_queue table.

* Score \< 0.65 → DISTINCT: no action.

## **7.3 Merge Behavior**

On merge, the surviving canonical entity retains the earliest created\_at timestamp. All edges from the absorbed entity are re-linked to the canonical node in Neo4j using MATCH/MERGE Cypher. The absorbed node is deleted. The alias list is stored as a property on the canonical node.

// Cypher: re-link absorbed entity's edges

MATCH (old:Entity {id: $old\_id})-\[r\]-\>(n)

MATCH (canon:Entity {id: $canon\_id})

CALL apoc.refactor.from(r, canon) YIELD input

WITH old MATCH (n)-\[r2\]-\>(old)

CALL apoc.refactor.to(r2, canon) YIELD input

DELETE old

# **8\. Knowledge Graph Design**

## **8.1 Graph Model**

The graph uses a labeled property graph model. Nodes represent entities; edges represent typed, directed relationships. Both carry properties.

## **8.2 Node Labels and Properties**

| Label | Core Properties | Index |
| :---- | :---- | :---- |
| Entity (base) | id (UUID), name, canonical\_name, aliases\[\], entity\_type, confidence, created\_at, updated\_at, source\_count | id (unique), name (text), entity\_type |
| Organization | \+ industry, headquarters, founded\_year, website | headquarters, industry |
| Person | \+ title, nationality, birth\_year | name (full-text) |
| Product | \+ category, launch\_date, maker\_id | category |
| Location | \+ country, lat, lon | lat/lon (spatial) |
| Event | \+ event\_date, event\_type, description | event\_date (range) |

## **8.3 Relationship Types and Properties**

| Type | From → To | Properties |
| :---- | :---- | :---- |
| EMPLOYS | Organization → Person | role, start\_date, end\_date, confidence |
| OWNS | Organization → Organization/Product | ownership\_pct, since, confidence |
| ACQUIRED | Organization → Organization | deal\_value, date, confidence |
| INVESTED\_IN | Organization/Person → Organization | amount, round, date, confidence |
| FOUNDED\_BY | Organization → Person | founding\_date, confidence |
| PARTNERS\_WITH | Organization → Organization | partnership\_type, date, confidence |
| COMPETES\_WITH | Organization → Organization | market\_segment, confidence |
| LOCATED\_IN | Organization/Person → Location | location\_type, confidence |
| MENTIONED\_IN | Entity → Source | sentence, pub\_date, url |

## **8.4 Source Provenance**

Every entity and relationship node/edge carries a sources\[\] array of document IDs. A separate MENTIONED\_IN edge connects entities to their Source nodes (label: Source, properties: url, title, pub\_date, feed\_name). This enables filtering the graph by publication date range or news source.

# **9\. Neo4j and PostgreSQL Database Design**

## **9.1 Neo4j AuraDB**

Connection: Neo4j Bolt driver (neo4j==5.x Python package). Use a singleton driver instance initialized on FastAPI startup.

\# backend/app/graph/neo4j\_client.py

from neo4j import GraphDatabase

driver \= GraphDatabase.driver(

    settings.NEO4J\_URI,

    auth=(settings.NEO4J\_USER, settings.NEO4J\_PASSWORD)

)

Required Neo4j Indexes (run on first deploy via migration script):

CREATE CONSTRAINT entity\_id IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;

CREATE INDEX entity\_type IF NOT EXISTS FOR (e:Entity) ON (e.entity\_type);

CREATE FULLTEXT INDEX entity\_name IF NOT EXISTS FOR (e:Entity) ON EACH \[e.canonical\_name, e.aliases\];

CREATE VECTOR INDEX entity\_embedding IF NOT EXISTS FOR (e:Entity) ON e.embedding OPTIONS {indexConfig: {\`vector.dimensions\`: 384, \`vector.similarity\_function\`: 'cosine'}};

## **9.2 PostgreSQL Schema (Neon)**

ORM: SQLAlchemy 2.x with Alembic migrations. Required tables:

### **raw\_documents**

| Column | Type | Notes |
| :---- | :---- | :---- |
| id | UUID PK | gen\_random\_uuid() |
| url | TEXT UNIQUE | Source URL |
| content\_hash | CHAR(64) | SHA-256, deduplicate check |
| title | TEXT |  |
| body | TEXT | Cleaned plain text |
| source\_type | ENUM | rss | wikipedia | scrape |
| feed\_name | TEXT |  |
| pub\_date | TIMESTAMPTZ |  |
| processed | BOOLEAN | False until NLP complete |
| created\_at | TIMESTAMPTZ | DEFAULT NOW() |

### **entities\_metadata**

| Column | Type | Notes |
| :---- | :---- | :---- |
| id | UUID PK | Same UUID as Neo4j node |
| canonical\_name | TEXT |  |
| entity\_type | TEXT |  |
| embedding | VECTOR(384) | pgvector; used for ANN search |
| source\_count | INTEGER |  |
| review\_status | ENUM | auto\_merged | pending | confirmed | rejected |
| created\_at | TIMESTAMPTZ |  |
| updated\_at | TIMESTAMPTZ |  |

### **Other Required Tables**

| Table | Purpose | Key Columns |
| :---- | :---- | :---- |
| resolution\_queue | Manual review pairs (0.65–0.84 score) | entity\_a\_id, entity\_b\_id, score, status, reviewer\_id |
| ingestion\_jobs | Scheduler run log | job\_type, started\_at, finished\_at, doc\_count, status, error |
| intelligence\_reports | Generated report cache | entity\_id, report\_type, content\_md, model\_version, created\_at |
| users | Auth accounts | id, email, password\_hash, role ENUM(analyst|admin), created\_at |
| audit\_log | All graph mutations | user\_id, action, entity\_id, payload, timestamp |

# **10\. Intelligence Report Generation**

## **10.1 Report Types**

| Report Type | Trigger | Sections |
| :---- | :---- | :---- |
| Entity Profile | GET /reports/entity/{id} | Summary, Key Relationships, Recent Activity, Risk Indicators |
| Network Analysis | GET /reports/network/{id}?depth=2 | Ego network stats, Key connectors, Community clusters |
| Relationship Brief | GET /reports/relation/{id} | Relationship timeline, Source evidence, Confidence analysis |
| Threat Intelligence | POST /reports/custom | User-defined entity set \+ question |

## **10.2 Report Generation Flow**

* Step 1 — Query Neo4j: fetch entity node, N-hop subgraph (depth configurable), relationship list with sources.

* Step 2 — Build context: serialize graph to structured JSON; attach top-5 most-recent source document excerpts.

* Step 3 — Call Gemini 1.5 Flash with report-type-specific system prompt \+ graph context.

* Step 4 — Stream response to client via FastAPI StreamingResponse (text/event-stream).

* Step 5 — Cache completed report in PostgreSQL intelligence\_reports table with 24h TTL.

## **10.3 Gemini Prompt Template (Entity Profile)**

SYSTEM \= '''You are an OSINT intelligence analyst. Write a concise,

factual intelligence brief. Cite sources by URL. Do not speculate.

Format output as Markdown with sections: \#\# Summary, \#\# Key Relationships,

\#\# Recent Activity, \#\# Risk Indicators, \#\# Source References.'''

USER \= f'''

Entity: {entity.canonical\_name} ({entity.entity\_type})

Known aliases: {entity.aliases}

Relationship count: {rel\_count}

Relationships (top 20 by confidence):

{json.dumps(relationships, indent=2)}

Recent source excerpts (last 30 days):

{source\_excerpts}

Generate a structured intelligence profile.'''

## **10.4 API Endpoints Summary**

| Method | Endpoint | Auth | Description |
| :---- | :---- | :---- | :---- |
| GET | /api/v1/entities | Analyst | Search/filter entities |
| GET | /api/v1/entities/{id} | Analyst | Single entity \+ immediate relations |
| GET | /api/v1/entities/{id}/subgraph | Analyst | N-hop subgraph for React Flow |
| GET | /api/v1/relations | Analyst | Filter relations by type/date |
| POST | /api/v1/graph/search | Analyst | Cypher-safe search by name/type |
| GET | /api/v1/reports/entity/{id} | Analyst | Stream Gemini entity profile |
| GET | /api/v1/reports/network/{id} | Analyst | Stream network analysis |
| POST | /api/v1/ingestion/feed | Admin | Add new RSS feed URL |
| POST | /api/v1/ingestion/trigger | Admin | Manually trigger ingestion job |
| GET | /api/v1/resolution/queue | Admin | List pending entity pairs |
| POST | /api/v1/resolution/{pair\_id}/decision | Admin | Approve or reject merge |
| POST | /api/v1/auth/login | Public | Returns JWT |
| GET | /api/v1/health | Public | Liveness check |

## **10.5 Environment Variables**

| Variable | Where Used | Notes |
| :---- | :---- | :---- |
| NEO4J\_URI | Backend | bolt+s://xxxx.databases.neo4j.io |
| NEO4J\_USER | Backend | neo4j |
| NEO4J\_PASSWORD | Backend | AuraDB generated password |
| DATABASE\_URL | Backend | PostgreSQL connection string (Neon) |
| REDIS\_URL | Backend / Celery | redis://redis:6379/0 |
| GEMINI\_API\_KEY | Backend | Google AI Studio key |
| JWT\_SECRET | Backend | Min 32-char random string |
| NEXT\_PUBLIC\_API\_URL | Frontend | Backend base URL |
| PLAYWRIGHT\_BROWSERS\_PATH | Backend Docker | Set in Dockerfile |

ℹ  All secrets must be set via Render environment variables (backend) and Vercel environment variables (frontend). Never commit secrets to the repository. Use .env.example with placeholder values for documentation.