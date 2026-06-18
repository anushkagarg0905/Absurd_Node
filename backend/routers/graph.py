from fastapi import APIRouter
from pydantic import BaseModel
from backend.config import settings
from backend.graph.neo4j_client import get_driver
from backend.graph import queries as neo4j_queries
from backend.mock import service as mock_service

router = APIRouter()


class GraphSearchRequest(BaseModel):
    q: str


@router.post("/graph/search")
def graph_search(body: GraphSearchRequest):
    """
    Return { nodes, edges } shaped for React Flow.

    Neo4j: 1-hop subgraph, max 25 neighbours, ordered by confidence.
    Mock: built from MOCK_ENTITIES + MOCK_RELATIONSHIPS.
    """
    driver = get_driver()
    if driver and not settings.use_mock:
        subgraph = neo4j_queries.get_subgraph(driver, body.q, limit=25)
        return {**subgraph, "source": "neo4j"}

    return {**mock_service.build_subgraph(body.q), "source": "mock"}

