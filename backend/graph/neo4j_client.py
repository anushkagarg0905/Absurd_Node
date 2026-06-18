"""
Neo4j driver singleton.

Returns None gracefully when Neo4j is unreachable so the rest of the app
can fall back to mock data without crashing.
"""

from __future__ import annotations

import logging
from typing import Optional

from neo4j import GraphDatabase, Driver

from backend.config import settings

logger = logging.getLogger(__name__)

_driver: Optional[Driver] = None


def get_driver() -> Optional[Driver]:
    """Return the singleton driver, or None if not connected."""
    return _driver


def connect() -> None:
    """Try to open a Neo4j driver. Logs a warning on failure — does NOT raise."""
    global _driver
    if settings.use_mock:
        logger.info("Mock mode active — skipping Neo4j connection.")
        return
    try:
        _driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
        )
        # Verify connectivity immediately
        _driver.verify_connectivity()
        logger.info("Connected to Neo4j at %s", settings.NEO4J_URI)
    except Exception as exc:
        logger.warning("Neo4j unavailable (%s) — using mock data.", exc)
        _driver = None


def disconnect() -> None:
    """Close the driver on shutdown."""
    global _driver
    if _driver:
        _driver.close()
        _driver = None
        logger.info("Neo4j driver closed.")

