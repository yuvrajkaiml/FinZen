"""
app/main.py
-----------
FastAPI application entry point for FinSight AI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import geo, trust
from app.core.config import settings
from app.models.schemas import HealthCheckResponse
from app.core.database import create_tables, SessionLocal
from app.services.trust_engine import seed_initial_sources
import logging

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Backend API for FinSight AI MVP - Geopolitical Investment Engine"
)

# Ensure DB tables exist and seed trust source baselines.
create_tables()
db = SessionLocal()
try:
    seed_initial_sources(db)
finally:
    db.close()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthCheckResponse)
async def root():
    """Health check endpoint."""
    return HealthCheckResponse(
        status="healthy",
        service=settings.APP_NAME,
        version="1.0.0",
        database_connected=False,
        redis_connected=settings.REDIS_ENABLED,
        newsapi_available=bool(settings.NEWSAPI_KEY),
    )

# ── API Routers ───────────────────────────────────────────────────────────────

app.include_router(geo.router, prefix="/api/v1/geo", tags=["Geopolitical Engine"])
app.include_router(trust.router, prefix="/api/v1/trust", tags=["Information Trust Engine"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
