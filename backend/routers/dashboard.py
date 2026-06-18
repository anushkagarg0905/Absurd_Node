from fastapi import APIRouter, Query
from backend.config import settings
from backend.graph.neo4j_client import get_driver
from backend.graph import queries as neo4j_queries
from backend.mock import service as mock_service

router = APIRouter()


@router.get("/dashboard")
def dashboard(q: str = Query(..., description="Entity name to investigate")):
    """
    Single endpoint that returns everything the dashboard page needs:
    metrics, relationships, aiSummary, recentInvestigations.

    This replaces the four separate mock-service calls in dashboard/page.tsx.
    """
    driver = get_driver()
    use_neo4j = driver is not None and not settings.use_mock

    if use_neo4j:
        metrics = neo4j_queries.get_metrics(driver, q)
        relationships = neo4j_queries.get_relationships(driver, q, limit=20)
        # AI summary always uses mock text unless a Gemini call is wired in
        ai_summary = mock_service.get_ai_summary_for_query(q)
    else:
        metrics = mock_service.get_metrics_for_query(q)
        relationships = mock_service.get_relationships_for_query(q)
        ai_summary = mock_service.get_ai_summary_for_query(q)

    return {
        "metrics": metrics,
        "relationships": relationships,
        "aiSummary": ai_summary,
        "recentInvestigations": mock_service.get_recent_investigations(),
        "source": "neo4j" if use_neo4j else "mock",
    }

