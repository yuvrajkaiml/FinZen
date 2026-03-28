"""
Trust scoring service logic.
"""

from datetime import date, datetime
from typing import Dict, Optional

from sqlalchemy.orm import Session

from app.models.trust_models import SourceAccuracy
from app.services.consensus_engine import calculate_consensus, sentiment_consistency_score

# Simple in-memory cache for source scores: {(source, sector): (score, expires_at)}
_SCORE_CACHE: Dict[tuple, tuple] = {}
_CACHE_TTL_SECONDS = 300


def _cache_get(source: str, sector: Optional[str]) -> Optional[float]:
    key = (source.lower(), (sector or "").lower())
    payload = _SCORE_CACHE.get(key)
    if not payload:
        return None
    score, expires_at = payload
    if datetime.utcnow().timestamp() > expires_at:
        _SCORE_CACHE.pop(key, None)
        return None
    return score


def _cache_set(source: str, sector: Optional[str], score: float) -> None:
    key = (source.lower(), (sector or "").lower())
    _SCORE_CACHE[key] = (score, datetime.utcnow().timestamp() + _CACHE_TTL_SECONDS)


def seed_initial_sources(db: Session) -> None:
    """Seed a few baseline source reliability rows for MVP."""
    seeds = [
        ("Reuters", None, 90.0),
        ("Bloomberg", None, 88.0),
        ("Financial Times", None, 87.0),
        ("CNBC", None, 78.0),
        ("Random Blog", None, 40.0),
    ]
    for name, sector, score in seeds:
        existing = (
            db.query(SourceAccuracy)
            .filter(SourceAccuracy.source_name == name)
            .filter(SourceAccuracy.sector == sector)
            .first()
        )
        if existing:
            continue
        db.add(
            SourceAccuracy(
                source_name=name,
                sector=sector,
                accuracy_score=score,
                total_articles=0,
                last_updated=datetime.utcnow(),
            )
        )
    db.commit()


def upsert_source_score(
    db: Session,
    source_name: str,
    accuracy_score: float,
    total_articles: int,
    sector: Optional[str] = None,
) -> SourceAccuracy:
    """Create or update source reliability row."""
    row = (
        db.query(SourceAccuracy)
        .filter(SourceAccuracy.source_name == source_name)
        .filter(SourceAccuracy.sector == sector)
        .first()
    )
    if row:
        row.accuracy_score = accuracy_score
        row.total_articles = total_articles
        row.last_updated = datetime.utcnow()
    else:
        row = SourceAccuracy(
            source_name=source_name,
            sector=sector,
            accuracy_score=accuracy_score,
            total_articles=total_articles,
            last_updated=datetime.utcnow(),
        )
        db.add(row)
    db.commit()
    db.refresh(row)
    _cache_set(source_name, sector, row.accuracy_score)
    return row


def get_source_score(db: Session, source_name: str, sector: Optional[str] = None) -> SourceAccuracy:
    """Get source reliability row; create default if not found."""
    row = (
        db.query(SourceAccuracy)
        .filter(SourceAccuracy.source_name == source_name)
        .filter(SourceAccuracy.sector == sector)
        .first()
    )
    if row:
        _cache_set(source_name, sector, row.accuracy_score)
        return row

    # Default unknown source reliability for MVP.
    row = SourceAccuracy(
        source_name=source_name,
        sector=sector,
        accuracy_score=50.0,
        total_articles=0,
        last_updated=datetime.utcnow(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    _cache_set(source_name, sector, row.accuracy_score)
    return row


def _recency_score(ts: date) -> float:
    age_days = (date.today() - ts).days
    if age_days <= 1:
        return 100.0
    if age_days <= 7:
        return 85.0
    if age_days <= 30:
        return 65.0
    return 40.0


def score_article(
    db: Session,
    source: str,
    content: str,
    sentiment: str,
    timestamp: date,
    sector: Optional[str] = None,
    peer_articles: Optional[list] = None,
) -> Dict:
    """Compute article trust score using weighted rule-based formula."""
    _ = content  # Content is accepted for extensibility; not parsed deeply in MVP.

    cached_score = _cache_get(source, sector)
    if cached_score is None:
        source_row = get_source_score(db, source, sector)
        source_score = source_row.accuracy_score
    else:
        source_row = get_source_score(db, source, sector)
        source_score = cached_score

    articles_for_consensus = list(peer_articles or [])
    articles_for_consensus.append({"source": source, "sentiment": sentiment})
    consensus_score, agreement_level, consensus_sentiment, outliers = calculate_consensus(articles_for_consensus)

    recency_score = _recency_score(timestamp)
    sentiment_score = sentiment_consistency_score(sentiment, consensus_sentiment)

    trust_score = (
        0.5 * source_score
        + 0.3 * consensus_score
        + 0.1 * recency_score
        + 0.1 * sentiment_score
    )

    this_source_outlier = next((o for o in outliers if o["source"] == source), None)
    is_outlier = bool(this_source_outlier and this_source_outlier["is_outlier"])

    # Update source stats.
    source_row.total_articles += 1
    source_row.last_updated = datetime.utcnow()
    db.commit()

    return {
        "trust_score": round(trust_score, 2),
        "is_outlier": is_outlier,
        "agreement_level": agreement_level,
        "breakdown": {
            "source_score": round(source_score, 2),
            "consensus_score": round(consensus_score, 2),
            "recency_score": round(recency_score, 2),
            "sentiment_score": round(sentiment_score, 2),
        },
    }
