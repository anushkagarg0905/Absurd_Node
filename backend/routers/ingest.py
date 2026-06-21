from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.ingestion import scrape_text, extract_entities_and_relationships, ingest_to_neo4j

router = APIRouter()

class IngestRequest(BaseModel):
    url: str

@router.post("/ingest")
async def ingest_url(request: IngestRequest):
    try:
        text = scrape_text(request.url)
        data = extract_entities_and_relationships(text)
        ingest_to_neo4j(data, request.url)
        return {"status": "success", "message": "Data ingested"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
