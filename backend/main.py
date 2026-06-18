"""
FastAPI application factory.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.graph.neo4j_client import connect, disconnect
from backend.routers import health, entities, graph, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — try to connect to Neo4j (fails gracefully to mock mode)
    connect()
    yield
    # Shutdown — close driver if open
    disconnect()


app = FastAPI(
    title="OSINT Knowledge Graph API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
PREFIX = "/api/v1"

app.include_router(health.router,     prefix=PREFIX, tags=["health"])
app.include_router(entities.router,   prefix=PREFIX, tags=["entities"])
app.include_router(graph.router,      prefix=PREFIX, tags=["graph"])
app.include_router(dashboard.router,  prefix=PREFIX, tags=["dashboard"])

