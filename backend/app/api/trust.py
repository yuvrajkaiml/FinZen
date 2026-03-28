"""
API routes for Information Trust Scoring Engine.
"""

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_db
from app.schemas.trust_schema import (
    ArticleScoreRequest,
    ArticleScoreResponse,
    ConsensusRequest,
    ConsensusResponse,
    OutlierInfo,
    SourceScoreResponse,
    SourceScoreUpsertRequest,
)
from app.services.consensus_engine import calculate_consensus
from app.services.trust_engine import get_source_score, score_article, upsert_source_score

router = APIRouter()


@router.post("/source", response_model=SourceScoreResponse)
def add_or_update_source_score(payload: SourceScoreUpsertRequest, db: Session = Depends(get_db)):
    """Add or update source reliability score."""
    row = upsert_source_score(
        db=db,
        source_name=payload.source_name,
        sector=payload.sector,
        accuracy_score=payload.accuracy_score,
        total_articles=payload.total_articles,
    )
    return SourceScoreResponse(
        id=row.id,
        source_name=row.source_name,
        sector=row.sector,
        accuracy_score=row.accuracy_score,
        total_articles=row.total_articles,
        last_updated=row.last_updated.isoformat(),
    )


@router.get("/source/{name}", response_model=SourceScoreResponse)
def get_source_reliability(name: str, sector: str | None = None, db: Session = Depends(get_db)):
    """Fetch reliability profile for a source."""
    row = get_source_score(db, name, sector)
    if not row:
        raise HTTPException(status_code=404, detail="Source not found")

    return SourceScoreResponse(
        id=row.id,
        source_name=row.source_name,
        sector=row.sector,
        accuracy_score=row.accuracy_score,
        total_articles=row.total_articles,
        last_updated=row.last_updated.isoformat(),
    )


@router.post("/article/score", response_model=ArticleScoreResponse)
def score_news_article(payload: ArticleScoreRequest, db: Session = Depends(get_db)):
    """Score single article trust based on source, consensus, recency, sentiment consistency."""
    result = score_article(
        db=db,
        source=payload.source,
        content=payload.content,
        sentiment=payload.sentiment,
        timestamp=payload.timestamp,
        sector=payload.sector,
        peer_articles=[a.model_dump() for a in (payload.peer_articles or [])],
    )
    return ArticleScoreResponse(**result)


@router.post("/consensus", response_model=ConsensusResponse)
def get_consensus(payload: ConsensusRequest):
    """Compute sentiment consensus and outlier flags for article set."""
    score, level, consensus_sentiment, outliers = calculate_consensus([a.model_dump() for a in payload.articles])
    return ConsensusResponse(
        consensus_score=score,
        agreement_level=level,
        consensus_sentiment=consensus_sentiment,
        outliers=[OutlierInfo(**o) for o in outliers],
    )
