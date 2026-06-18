from fastapi import APIRouter
from backend.config import settings
from backend.graph.neo4j_client import get_driver
from backend.graph import queries as neo4j_queries
from backend.mock import service as mock_service

router = APIRouter()


@router.get("/health")
def health():
    """Liveness check — reports whether Neo4j is live or mock mode is active."""
    driver = get_driver()
    neo4j_live = driver is not None

    return {
        "status": "ok",
        "neo4j": neo4j_live,
        "mock": settings.use_mock or not neo4j_live,
    }

