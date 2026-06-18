"""
Mock service helpers — Python port of src/lib/mock-data/service.ts.

Provides the same interface that route handlers use, so switching between
mock and Neo4j requires no changes in the routers.
"""

from __future__ import annotations

from backend.mock.data import (
    MOCK_METRICS,
    MOCK_AI_SUMMARIES,
    MOCK_ENTITIES,
    MOCK_RELATIONSHIPS,
    RECENT_INVESTIGATIONS,
)


def _normalize(query: str) -> str:
    """Map raw query string to a mock data key."""
    q = query.lower().strip()
    if "openai" in q:
        return "openai"
    if "microsoft" in q:
        return "microsoft"
    if "google" in q or "deepmind" in q:
        return "google"
    return "default"


def get_metrics_for_query(query: str) -> dict:
    key = _normalize(query)
    return MOCK_METRICS.get(key, MOCK_METRICS["default"])


def get_entities_for_query(query: str) -> list[dict]:
    key = _normalize(query)
    return MOCK_ENTITIES.get(key, MOCK_ENTITIES["default"])


def get_relationships_for_query(query: str) -> list[dict]:
    key = _normalize(query)
    return MOCK_RELATIONSHIPS.get(key, MOCK_RELATIONSHIPS["default"])


def get_ai_summary_for_query(query: str) -> dict:
    key = _normalize(query)
    raw = MOCK_AI_SUMMARIES.get(key, MOCK_AI_SUMMARIES["default"])

    # Personalise default summary with the actual query term
    if key == "default" and query.strip():
        name = query.strip()
        return {
            "target": name,
            "summary": raw["summary"].replace("Target Entity", name),
            "keyInsights": [
                i.replace("target", name).replace("Target", name)
                for i in raw["keyInsights"]
            ],
        }
    return raw


def get_recent_investigations() -> list[dict]:
    return RECENT_INVESTIGATIONS


def build_subgraph(query: str) -> dict:
    """
    Build nodes + edges dict shaped for React Flow from mock data.
    Entities become nodes; relationships become edges (matched by name).
    """
    entities = get_entities_for_query(query)
    relationships = get_relationships_for_query(query)

    nodes = [
        {
            "id": e["id"],
            "name": e["name"],
            "type": e["type"],
            "description": e["description"],
            "confidenceScore": e["confidenceScore"],
            "tags": e.get("tags", []),
        }
        for e in entities
    ]

    # Build a name→id index for fast lookup
    name_to_id = {e["name"].lower(): e["id"] for e in entities}

    edges = []
    for rel in relationships:
        src_id = name_to_id.get(rel["source"].lower())
        tgt_id = name_to_id.get(rel["target"].lower())
        if src_id and tgt_id:
            edges.append({
                "id": rel["id"],
                "source": src_id,
                "target": tgt_id,
                "relationship": rel["relationship"],
                "confidenceScore": rel["confidenceScore"],
            })

    return {"nodes": nodes, "edges": edges}

