"""
Cypher query helpers.

All queries are intentionally limited to 1-hop relationships and capped
with LIMIT to prevent entity explosion in large graphs.
"""

from __future__ import annotations

from typing import Any

from neo4j import Driver


# ── Helpers ──────────────────────────────────────────────────────────────────

def _run(driver: Driver, cypher: str, params: dict) -> list[dict]:
    with driver.session() as session:
        result = session.run(cypher, params)
        return [dict(record) for record in result]


# ── Entity / subgraph ─────────────────────────────────────────────────────────

def get_subgraph(driver: Driver, name: str, limit: int = 25) -> dict[str, Any]:
    """
    Return center node + directly-related (1-hop) nodes and edges.
    Capped at `limit` neighbours to prevent graph explosion.
    """
    cypher = """
    MATCH (center:Entity)
    WHERE toLower(center.canonical_name) = toLower($name)
       OR toLower(center.name) = toLower($name)
    WITH center LIMIT 1
    OPTIONAL MATCH (center)-[r]-(neighbour:Entity)
    WITH center, r, neighbour
    ORDER BY coalesce(r.confidence, 0) DESC
    LIMIT $limit
    RETURN
        center,
        collect(DISTINCT neighbour) AS neighbours,
        collect(DISTINCT {
            id: id(r),
            type: type(r),
            source_id: id(startNode(r)),
            target_id: id(endNode(r)),
            confidence: r.confidence
        }) AS edges
    """
    rows = _run(driver, cypher, {"name": name, "limit": limit})
    if not rows:
        return {"nodes": [], "edges": []}

    row = rows[0]
    center = row["center"]
    neighbours = row["neighbours"] or []
    edges = row["edges"] or []

    nodes = [_format_node(center)]
    for n in neighbours:
        if n:
            nodes.append(_format_node(n))

    return {"nodes": nodes, "edges": [_format_edge(e) for e in edges if e.get("id") is not None]}


def get_relationships(driver: Driver, name: str, limit: int = 20) -> list[dict]:
    """Top-N relationships by confidence for the given entity name."""
    cypher = """
    MATCH (a:Entity)-[r]-(b:Entity)
    WHERE toLower(a.canonical_name) = toLower($name)
       OR toLower(a.name) = toLower($name)
    RETURN
        coalesce(a.canonical_name, a.name) AS source,
        a.entity_type AS sourceType,
        type(r) AS relationship,
        coalesce(b.canonical_name, b.name) AS target,
        b.entity_type AS targetType,
        coalesce(r.confidence, 0.8) AS confidenceScore
    ORDER BY confidenceScore DESC
    LIMIT $limit
    """
    return _run(driver, cypher, {"name": name, "limit": limit})


def get_metrics(driver: Driver, name: str) -> dict[str, Any]:
    """Aggregate counts for dashboard metric cards."""
    cypher = """
    MATCH (center:Entity)
    WHERE toLower(center.canonical_name) = toLower($name)
       OR toLower(center.name) = toLower($name)
    WITH center LIMIT 1
    OPTIONAL MATCH (center)-[r]-(neighbour:Entity)
    WITH center, count(DISTINCT neighbour) AS entityCount, count(DISTINCT r) AS relCount
    OPTIONAL MATCH (center)-[:MENTIONED_IN]->(s:Source)
    RETURN
        entityCount    AS totalEntities,
        relCount       AS relationshipsFound,
        count(s)       AS sourcesAnalyzed,
        toInteger(coalesce(center.confidence, 0.85) * 100) AS confidenceScore
    """
    rows = _run(driver, cypher, {"name": name})
    if not rows:
        return {"totalEntities": 0, "relationshipsFound": 0, "sourcesAnalyzed": 0, "confidenceScore": 0}
    return rows[0]


# ── Formatters ────────────────────────────────────────────────────────────────

def _format_node(node: Any) -> dict:
    props = dict(node.items()) if hasattr(node, "items") else dict(node)
    return {
        "id": str(props.get("id", id(node))),
        "name": props.get("canonical_name") or props.get("name", "Unknown"),
        "type": props.get("entity_type", "Organization"),
        "description": props.get("description", ""),
        "confidenceScore": int((props.get("confidence", 0.8) or 0.8) * 100),
        "tags": props.get("aliases", []),
    }


def _format_edge(edge: dict) -> dict:
    return {
        "id": str(edge.get("id", "")),
        "source": str(edge.get("source_id", "")),
        "target": str(edge.get("target_id", "")),
        "relationship": edge.get("type", "RELATED_TO"),
        "confidenceScore": int((edge.get("confidence") or 0.8) * 100),
    }

