from fastapi import APIRouter, Query
from backend.config import settings
from backend.graph.neo4j_client import get_driver
from backend.graph import queries as neo4j_queries
from backend.mock import service as mock_service

router = APIRouter()


@router.get("/entities")
def list_entities(q: str = Query(..., description="Entity name to search")):
    """
    Return entities closely related to the query term (1-hop, max 25).
    Falls back to mock data when Neo4j is unavailable.
    """
    driver = get_driver()
    if driver and not settings.use_mock:
        subgraph = neo4j_queries.get_subgraph(driver, q, limit=25)
        return {"entities": subgraph["nodes"], "source": "neo4j"}

    return {"entities": mock_service.get_entities_for_query(q), "source": "mock"}


@router.get("/entities/{entity_id}/subgraph")
def entity_subgraph(entity_id: str, q: str = Query(..., description="Original search query")):
    """
    Subgraph (nodes + edges) for a specific entity — used by React Flow.
    Uses the search query to look up mock data when Neo4j is offline.
    """
    driver = get_driver()
    if driver and not settings.use_mock:
        subgraph = neo4j_queries.get_subgraph(driver, q, limit=25)
        return {**subgraph, "source": "neo4j"}

    return {**mock_service.build_subgraph(q), "source": "mock"}

