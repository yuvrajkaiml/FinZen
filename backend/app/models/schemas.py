"""
Pydantic schemas for API request/response models.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


# ============================================================================
# Enums
# ============================================================================

class ImpactDirection(str, Enum):
    """Impact direction enum."""
    BULLISH = "bullish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"


class RiskLevel(str, Enum):
    """Risk level enum."""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


# ============================================================================
# Country Risk Scoring
# ============================================================================

class RiskDimension(BaseModel):
    """Individual risk dimension score."""
    war: float = Field(ge=0, le=10, description="War/conflict risk (0-10)")
    sanctions: float = Field(ge=0, le=10, description="Sanctions risk (0-10)")
    economic: float = Field(ge=0, le=10, description="Economic stability risk (0-10)")
    political: float = Field(ge=0, le=10, description="Political stability risk (0-10)")
    currency: float = Field(ge=0, le=10, description="Currency risk (0-10)")
    regulatory: float = Field(ge=0, le=10, description="Regulatory risk (0-10)")


class CountryRiskResponse(BaseModel):
    """Country risk score response."""
    country: str
    risk_score: float = Field(ge=0, le=10, description="Overall risk score (0-10)")
    risk_level: RiskLevel
    dimensions: RiskDimension
    confidence: float = Field(ge=0, le=1, description="Confidence in score (0-1)")
    metadata: Dict[str, Any] = Field(default_factory=dict)


# ============================================================================
# Sector Impact
# ============================================================================

class SectorImpact(BaseModel):
    """Individual sector impact."""
    sector: str = Field(description="Sector name (e.g., Oil & Gas, Airlines)")
    impact: ImpactDirection = Field(description="Impact direction")
    strength: float = Field(ge=0, le=1, description="Impact strength (0-1)")
    rationale: str = Field(description="Why this sector is affected")


class SectorImpactResponse(BaseModel):
    """Sector impact mapping response."""
    country: str
    event_type: str
    sector_impacts: List[SectorImpact]
    timestamp: str


# ============================================================================
# Stock Level Impact
# ============================================================================

class StockImpact(BaseModel):
    """Individual stock impact."""
    ticker: str
    company_name: str
    sector: str
    impact: ImpactDirection
    expected_impact_percent: float = Field(description="Expected impact percentage")
    confidence: float = Field(ge=0, le=1)


class StockImpactResponse(BaseModel):
    """Stock impact response."""
    country: str
    affected_stocks: List[StockImpact]
    summary: str


# ============================================================================
# Portfolio Exposure
# ============================================================================

class PortfolioHolding(BaseModel):
    """Single portfolio holding."""
    ticker: str
    sector: str
    quantity: Optional[float] = None
    weight: Optional[float] = Field(None, ge=0, le=1)


class PortfolioExposureRequest(BaseModel):
    """Portfolio exposure analysis request."""
    country: str
    portfolio: List[PortfolioHolding]


class PortfolioExposureMetric(BaseModel):
    """Portfolio exposure metric."""
    metric_name: str
    value: float
    description: str


class PortfolioExposureResponse(BaseModel):
    """Portfolio exposure analysis response."""
    country: str
    risk_level: RiskLevel
    overall_exposure_score: float = Field(ge=0, le=10)
    affected_assets: List[StockImpact]
    exposure_by_sector: Dict[str, float]
    metrics: List[PortfolioExposureMetric]
    recommendation: str


# ============================================================================
# Geopolitical Event Simulation
# ============================================================================

class GeoEvent(BaseModel):
    """Geopolitical event."""
    event_type: str = Field(description="Event type: war, sanctions, economic, political, currency, regulatory")
    country: str
    severity: float = Field(ge=0, le=1, description="Severity (0-1)")
    description: Optional[str] = None


class SimulationRequest(BaseModel):
    """Event simulation request."""
    event: GeoEvent
    portfolio: Optional[List[PortfolioHolding]] = None


class SimulationResult(BaseModel):
    """Event simulation result."""
    event: GeoEvent
    updated_country_risk: CountryRiskResponse
    sector_impacts: List[SectorImpact]
    portfolio_impact: Optional[PortfolioExposureResponse] = None
    timestamp: str


# ============================================================================
# Health Check
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Health check response."""
    status: str
    service: str
    version: str = "1.0.0"
    database_connected: bool = False
    redis_connected: bool = False
    newsapi_available: bool = False


# ============================================================================
# Error Response
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    detail: str
    timestamp: str
