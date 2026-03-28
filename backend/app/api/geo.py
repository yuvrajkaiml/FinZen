"""
Geopolitical Investment Engine API.
Includes live event ingestion from NewsAPI and GDELT.
"""

from collections import Counter
from datetime import datetime
from typing import Dict, List, Optional

import logging
import requests
from fastapi import APIRouter, HTTPException, Query

from app.core.config import settings
from app.models.schemas import (
    CountryRiskResponse,
    PortfolioExposureMetric,
    PortfolioExposureRequest,
    PortfolioExposureResponse,
    SectorImpactResponse,
    RiskLevel,
    SimulationRequest,
    SimulationResult,
    StockImpactResponse,
)
from app.services.risk_engine import risk_engine
from app.services.sector_mapper import sector_mapper
from app.services.stock_mapper import stock_mapper

logger = logging.getLogger(__name__)

router = APIRouter()


def _normalize_event_type(text: str) -> Optional[str]:
    """Normalize raw text into one of the engine's supported event dimensions."""
    t = text.lower()
    keyword_groups = {
        "war": ["war", "conflict", "military", "attack", "invasion", "ceasefire"],
        "sanctions": ["sanction", "embargo", "swift", "export control", "blacklist"],
        "economic": ["inflation", "recession", "debt", "gdp", "economic", "unemployment"],
        "political": ["election", "protest", "unrest", "coup", "government", "parliament"],
        "currency": ["currency", "devaluation", "fx", "exchange rate", "forex"],
        "regulatory": ["regulation", "policy", "compliance", "capital control", "law"],
    }

    for event_type, words in keyword_groups.items():
        if any(word in t for word in words):
            return event_type
    return None


def _event_severity_from_text(text: str) -> float:
    """Infer a simple severity score from text intensity keywords."""
    t = text.lower()
    if any(k in t for k in ["severe", "major", "escalation", "emergency", "crisis", "invasion"]):
        return 0.9
    if any(k in t for k in ["significant", "warning", "sanction", "strike", "protest"]):
        return 0.7
    if any(k in t for k in ["concern", "discussion", "policy", "talks"]):
        return 0.5
    return 0.4


def _fetch_newsapi_events(country: str, max_records: int = 20) -> List[Dict]:
    """Fetch and normalize events from NewsAPI."""
    if not settings.NEWSAPI_KEY:
        logger.warning("NEWSAPI_KEY not configured; skipping NewsAPI ingestion")
        return []

    query = f'"{country}" AND (war OR sanctions OR inflation OR protest OR currency OR regulation)'
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": max_records,
        "apiKey": settings.NEWSAPI_KEY,
    }

    try:
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params=params,
            timeout=10,
        )
        response.raise_for_status()
        payload = response.json()
    except Exception as exc:
        logger.warning("NewsAPI fetch failed for %s: %s", country, exc)
        return []

    events: List[Dict] = []
    for article in payload.get("articles", []):
        text = f"{article.get('title', '')} {article.get('description', '')}"
        event_type = _normalize_event_type(text)
        if not event_type:
            continue
        events.append(
            {
                "type": event_type,
                "severity": _event_severity_from_text(text),
                "source": "newsapi",
                "title": article.get("title", ""),
                "url": article.get("url", ""),
            }
        )
    return events


def _fetch_gdelt_events(country: str, max_records: int = 20) -> List[Dict]:
    """Fetch and normalize events from GDELT DOC API."""
    base = settings.GDELT_BASE_URL.rstrip("/")
    # GDELT DOC endpoint.
    url = f"{base}/doc/doc"
    query = f'"{country}" (war OR sanctions OR inflation OR protest OR currency OR regulation)'
    params = {
        "query": query,
        "mode": "ArtList",
        "maxrecords": max_records,
        "format": "json",
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        payload = response.json()
    except Exception as exc:
        logger.warning("GDELT fetch failed for %s: %s", country, exc)
        return []

    events: List[Dict] = []
    for article in payload.get("articles", []):
        text = f"{article.get('title', '')} {article.get('seendate', '')}"
        event_type = _normalize_event_type(text)
        if not event_type:
            continue
        events.append(
            {
                "type": event_type,
                "severity": _event_severity_from_text(text),
                "source": "gdelt",
                "title": article.get("title", ""),
                "url": article.get("url", ""),
            }
        )
    return events


def _fallback_mock_events(country: str) -> List[Dict]:
    """Fallback events if external sources fail or return empty payloads."""
    by_country = {
        "iran": [{"type": "sanctions", "severity": 0.8}, {"type": "war", "severity": 0.5}],
        "india": [{"type": "economic", "severity": 0.4}, {"type": "political", "severity": 0.3}],
        "pakistan": [{"type": "political", "severity": 0.6}, {"type": "war", "severity": 0.4}],
        "usa": [{"type": "regulatory", "severity": 0.3}],
        "china": [{"type": "regulatory", "severity": 0.4}, {"type": "economic", "severity": 0.3}],
    }
    return by_country.get(country.lower(), [])


def _ingest_country_events(country: str, use_live_data: bool = True) -> Dict[str, object]:
    """Ingest events from configured sources and return event list + source metadata."""
    news_events: List[Dict] = []
    gdelt_events: List[Dict] = []

    if use_live_data:
        news_events = _fetch_newsapi_events(country)
        gdelt_events = _fetch_gdelt_events(country)

    combined = news_events + gdelt_events
    if not combined:
        combined = _fallback_mock_events(country)

    # Dedupe by title/url when available.
    seen = set()
    deduped: List[Dict] = []
    for ev in combined:
        sig = (ev.get("title", "").strip().lower(), ev.get("url", "").strip().lower(), ev.get("type", ""))
        if sig in seen:
            continue
        seen.add(sig)
        deduped.append(ev)

    return {
        "events": deduped,
        "sources": {
            "newsapi_events": len(news_events),
            "gdelt_events": len(gdelt_events),
            "total_events": len(deduped),
            "used_live_data": bool(use_live_data and (news_events or gdelt_events)),
        },
    }


def _dominant_event_type(events: List[Dict]) -> str:
    """Return dominant event type from event list."""
    if not events:
        return "economic"
    counts = Counter(ev.get("type", "economic") for ev in events)
    return counts.most_common(1)[0][0]


def _avg_event_severity(events: List[Dict], event_type: str) -> float:
    """Average severity for selected event type."""
    selected = [float(ev.get("severity", 0.5)) for ev in events if ev.get("type") == event_type]
    if not selected:
        return 0.5
    return round(sum(selected) / len(selected), 2)


@router.get("/risk/{country}", response_model=CountryRiskResponse)
async def get_country_risk(
    country: str,
    use_live_data: bool = Query(True, description="Use NewsAPI + GDELT for event ingestion"),
):
    """Get country risk score based on ingested geopolitical events."""
    try:
        ingestion = _ingest_country_events(country, use_live_data=use_live_data)
        events = ingestion["events"]
        response = risk_engine.calculate_country_risk(country, events=events)
        response.metadata.update(ingestion["sources"])
        return response
    except Exception as exc:
        logger.exception("Failed to calculate country risk for %s", country)
        raise HTTPException(status_code=500, detail=f"Error calculating risk: {exc}")


@router.get("/sectors/{country}", response_model=SectorImpactResponse)
async def get_sector_impact(
    country: str,
    use_live_data: bool = Query(True, description="Use NewsAPI + GDELT for event ingestion"),
):
    """Get sector impacts inferred from ingested geopolitical events."""
    try:
        ingestion = _ingest_country_events(country, use_live_data=use_live_data)
        events = ingestion["events"]
        event_type = _dominant_event_type(events)
        severity = _avg_event_severity(events, event_type)
        return sector_mapper.map_event_to_sectors(country=country, event_type=event_type, severity=severity)
    except Exception as exc:
        logger.exception("Failed to map sectors for %s", country)
        raise HTTPException(status_code=500, detail=f"Error mapping sectors: {exc}")


@router.get("/sectors/{country}/stocks", response_model=StockImpactResponse)
async def get_stock_impact(
    country: str,
    use_live_data: bool = Query(True, description="Use NewsAPI + GDELT for event ingestion"),
):
    """Get stock-level impacts inferred from live event ingestion."""
    try:
        ingestion = _ingest_country_events(country, use_live_data=use_live_data)
        events = ingestion["events"]
        event_type = _dominant_event_type(events)
        severity = _avg_event_severity(events, event_type)
        sector_response = sector_mapper.map_event_to_sectors(country=country, event_type=event_type, severity=severity)
        return stock_mapper.map_sectors_to_stocks(sector_response.sector_impacts, country=country)
    except Exception as exc:
        logger.exception("Failed to map stocks for %s", country)
        raise HTTPException(status_code=500, detail=f"Error mapping stocks: {exc}")


@router.post("/portfolio/exposure", response_model=PortfolioExposureResponse)
async def analyze_portfolio_exposure(request: PortfolioExposureRequest):
    """Analyze portfolio exposure against dominant geopolitical event for a country."""
    try:
        country = request.country
        if not request.portfolio:
            raise HTTPException(status_code=400, detail="Portfolio must contain at least one holding")

        ingestion = _ingest_country_events(country, use_live_data=True)
        events = ingestion["events"]
        event_type = _dominant_event_type(events)
        severity = _avg_event_severity(events, event_type)

        country_risk = risk_engine.calculate_country_risk(country, events=events)
        sector_response = sector_mapper.map_event_to_sectors(country=country, event_type=event_type, severity=severity)
        sector_map = {s.sector: s for s in sector_response.sector_impacts}

        affected_assets = []
        exposure_by_sector: Dict[str, float] = {}

        default_weight = 1.0 / len(request.portfolio)
        for holding in request.portfolio:
            weight = float(holding.weight) if holding.weight is not None else default_weight
            exposure_by_sector[holding.sector] = exposure_by_sector.get(holding.sector, 0.0) + weight
            sector_impact = sector_map.get(holding.sector)
            if not sector_impact:
                continue
            impact = stock_mapper._calculate_stock_impact(
                {"ticker": holding.ticker, "name": holding.ticker, "sector": holding.sector},
                sector_impact,
            )
            if impact is not None:
                affected_assets.append(impact)

        affected_ratio = len(affected_assets) / max(1, len(request.portfolio))
        overall_exposure_score = round(min(10.0, country_risk.risk_score * affected_ratio), 2)
        metrics = [
            PortfolioExposureMetric(
                metric_name="Affected Asset Ratio",
                value=round(affected_ratio, 2),
                description="Fraction of holdings impacted by dominant geopolitical event",
            ),
            PortfolioExposureMetric(
                metric_name="Dominant Event Severity",
                value=severity,
                description=f"Average severity for dominant event: {event_type}",
            ),
        ]

        recommendation = "Maintain current allocation and monitor events."
        if country_risk.risk_level in {RiskLevel.HIGH, RiskLevel.CRITICAL}:
            recommendation = "Reduce exposure to bearish sectors and consider hedging." 

        return PortfolioExposureResponse(
            country=country,
            risk_level=country_risk.risk_level,
            overall_exposure_score=overall_exposure_score,
            affected_assets=affected_assets,
            exposure_by_sector=exposure_by_sector,
            metrics=metrics,
            recommendation=recommendation,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to analyze portfolio exposure")
        raise HTTPException(status_code=500, detail=f"Error analyzing portfolio exposure: {exc}")


@router.post("/simulate", response_model=SimulationResult)
async def simulate_event(request: SimulationRequest):
    """Simulate an explicit event and return updated risk + sector/portfolio impacts."""
    try:
        event = request.event
        synthetic_event = {
            "type": event.event_type,
            "severity": event.severity,
            "source": "simulation",
            "title": event.description or f"Simulated {event.event_type}",
        }
        updated_country_risk = risk_engine.calculate_country_risk(event.country, events=[synthetic_event])
        sector_response = sector_mapper.map_event_to_sectors(
            country=event.country,
            event_type=event.event_type,
            severity=event.severity,
        )

        portfolio_impact: Optional[PortfolioExposureResponse] = None
        if request.portfolio:
            portfolio_request = PortfolioExposureRequest(country=event.country, portfolio=request.portfolio)
            portfolio_impact = await analyze_portfolio_exposure(portfolio_request)

        return SimulationResult(
            event=event,
            updated_country_risk=updated_country_risk,
            sector_impacts=sector_response.sector_impacts,
            portfolio_impact=portfolio_impact,
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as exc:
        logger.exception("Failed to simulate event")
        raise HTTPException(status_code=500, detail=f"Error simulating event: {exc}")

