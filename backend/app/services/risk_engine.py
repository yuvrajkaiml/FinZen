"""
Risk Scoring Engine - Calculates country-level geopolitical risk scores.
Uses rule-based scoring on 6 risk dimensions.
"""

import logging
from typing import Dict, List, Optional
from datetime import datetime
from app.models.schemas import RiskDimension, CountryRiskResponse, RiskLevel

logger = logging.getLogger(__name__)


class RiskScoringEngine:
    """
    Rule-based risk scoring engine for geopolitical analysis.
    Scores 6 dimensions: war, sanctions, economic, political, currency, regulatory.
    """

    # Risk dimension weights (sum = 1.0 for normalized scoring)
    DIMENSION_WEIGHTS = {
        "war": 0.20,           # 20% - War/conflict has high impact
        "sanctions": 0.20,     # 20% - Sanctions are critical
        "economic": 0.18,      # 18% - Economic stability is core
        "political": 0.15,     # 15% - Political stability matters
        "currency": 0.15,      # 15% - Currency risk
        "regulatory": 0.12,    # 12% - Regulatory changes
    }

    def __init__(self):
        """Initialize risk scoring engine."""
        self.logger = logger

    # ========================================================================
    # Core Scoring Functions
    # ========================================================================

    def calculate_country_risk(self, country: str, events: Optional[List[Dict]] = None) -> CountryRiskResponse:
        """
        Calculate overall country risk score based on events and dimensions.
        
        Args:
            country: Country name or code
            events: List of geopolitical events affecting country
            
        Returns:
            CountryRiskResponse with risk scores and metadata
        """
        
        # If no events provided, use default baseline scores
        if not events:
            events = []
        
        # Calculate individual dimension scores
        dimensions = RiskDimension(
            war=self._score_war_risk(country, events),
            sanctions=self._score_sanctions_risk(country, events),
            economic=self._score_economic_risk(country, events),
            political=self._score_political_risk(country, events),
            currency=self._score_currency_risk(country, events),
            regulatory=self._score_regulatory_risk(country, events),
        )
        
        # Calculate weighted overall risk score
        overall_score = self._calculate_weighted_score(dimensions)
        
        # Determine risk level
        risk_level = self._get_risk_level(overall_score)
        
        # Calculate confidence
        confidence = self._calculate_confidence(len(events))
        
        self.logger.info(f"Calculated risk for {country}: {overall_score:.2f} ({risk_level.value})")
        
        return CountryRiskResponse(
            country=country,
            risk_score=overall_score,
            risk_level=risk_level,
            dimensions=dimensions,
            confidence=confidence,
            metadata={
                "calculation_method": "rule-based",
                "timestamp": datetime.utcnow().isoformat(),
                "event_count": len(events),
                "dimensions_used": 6,
            }
        )

    # ========================================================================
    # Individual Dimension Scorers
    # ========================================================================

    def _score_war_risk(self, country: str, events: List[Dict]) -> float:
        """
        Score war/conflict risk for a country.
        Factors: active warfare, proximity to conflicts, military buildup.
        """
        base_score = 2.0  # Baseline for most countries
        
        # Check for war-related events
        for event in events:
            event_type = event.get("type", "").lower()
            if "war" in event_type or "conflict" in event_type:
                severity = event.get("severity", 0.5)
                base_score += severity * 4  # War events add 0-4 points
            elif "military" in event_type:
                base_score += 1.5
        
        # Country-specific risk factors
        high_risk_countries = ["Syria", "Yemen", "Iraq", "Afghanistan", "South Sudan"]
        if country in high_risk_countries:
            base_score += 3.0
        
        medium_risk_countries = ["Pakistan", "Ukraine", "Gaza", "Myanmar"]
        if country in medium_risk_countries:
            base_score += 1.5
        
        return min(base_score, 10.0)  # Cap at 10

    def _score_sanctions_risk(self, country: str, events: List[Dict]) -> float:
        """
        Score sanctions risk for a country.
        Factors: active sanctions, SWIFT restrictions, export controls.
        """
        base_score = 1.5  # Baseline
        
        # Check for sanction events
        for event in events:
            event_type = event.get("type", "").lower()
            if "sanction" in event_type:
                severity = event.get("severity", 0.5)
                base_score += severity * 3
            elif "embargo" in event_type:
                base_score += 2.0
        
        # Country-specific sanctions
        heavily_sanctioned = ["Iran", "North Korea", "Syria", "Russia"]
        if country in heavily_sanctioned:
            base_score += 3.0
        
        partially_sanctioned = ["Venezuela", "Cuba", "Belarus"]
        if country in partially_sanctioned:
            base_score += 1.5
        
        return min(base_score, 10.0)

    def _score_economic_risk(self, country: str, events: List[Dict]) -> float:
        """
        Score economic stability risk.
        Factors: inflation, GDP growth, debt levels, currency stability.
        """
        base_score = 3.0  # Baseline
        
        # Check for economic events
        for event in events:
            event_type = event.get("type", "").lower()
            if "inflation" in event_type or "economic" in event_type:
                severity = event.get("severity", 0.5)
                base_score += severity * 2.5
            elif "recession" in event_type:
                base_score += 2.0
        
        # Country-specific economic factors (simplified)
        crisis_countries = ["Argentina", "Turkey", "Lebanon", "Venezuela"]
        if country in crisis_countries:
            base_score += 2.5
        
        unstable_countries = ["Pakistan", "Egypt", "Kenya"]
        if country in unstable_countries:
            base_score += 1.5
        
        return min(base_score, 10.0)

    def _score_political_risk(self, country: str, events: List[Dict]) -> float:
        """
        Score political stability risk.
        Factors: government instability, elections, protests, coup risk.
        """
        base_score = 2.5
        
        # Check for political events
        for event in events:
            event_type = event.get("type", "").lower()
            if "election" in event_type or "political" in event_type:
                severity = event.get("severity", 0.5)
                base_score += severity * 2
            elif "protest" in event_type or "unrest" in event_type:
                base_score += 1.0
            elif "coup" in event_type:
                base_score += 3.0
        
        # Country-specific political risk
        unstable_govs = ["Myanmar", "Haiti", "Sudan", "Somalia"]
        if country in unstable_govs:
            base_score += 2.0
        
        return min(base_score, 10.0)

    def _score_currency_risk(self, country: str, events: List[Dict]) -> float:
        """
        Score currency/FX risk for a country.
        Factors: currency volatility, devaluation, forex reserves.
        """
        base_score = 2.0
        
        # Check for currency events
        for event in events:
            event_type = event.get("type", "").lower()
            if "currency" in event_type or "devaluation" in event_type:
                severity = event.get("severity", 0.5)
                base_score += severity * 3
        
        # Country-specific currency risk
        high_volatility = ["Turkey", "Argentina", "Venezuela", "Pakistan", "Iran"]
        if country in high_volatility:
            base_score += 2.5
        
        emerging_volatility = ["India", "Brazil", "Mexico", "Russia"]
        if country in emerging_volatility:
            base_score += 1.0
        
        return min(base_score, 10.0)

    def _score_regulatory_risk(self, country: str, events: List[Dict]) -> float:
        """
        Score regulatory/policy change risk.
        Factors: capital controls, FDI restrictions, policy uncertainty.
        """
        base_score = 2.0
        
        # Check for regulatory events
        for event in events:
            event_type = event.get("type", "").lower()
            if "regulation" in event_type or "policy" in event_type:
                severity = event.get("severity", 0.5)
                base_score += severity * 2
            elif "capital control" in event_type:
                base_score += 2.5
        
        # Country-specific regulatory risk
        restrictive_countries = ["China", "Russia", "Iran", "Venezuela"]
        if country in restrictive_countries:
            base_score += 1.5
        
        return min(base_score, 10.0)

    # ========================================================================
    # Helper Methods
    # ========================================================================

    def _calculate_weighted_score(self, dimensions: RiskDimension) -> float:
        """Calculate weighted overall risk score from all dimensions."""
        scores = {
            "war": dimensions.war,
            "sanctions": dimensions.sanctions,
            "economic": dimensions.economic,
            "political": dimensions.political,
            "currency": dimensions.currency,
            "regulatory": dimensions.regulatory,
        }
        
        weighted_sum = sum(
            scores[dim] * weight
            for dim, weight in self.DIMENSION_WEIGHTS.items()
        )
        
        return round(weighted_sum, 2)

    def _get_risk_level(self, score: float) -> RiskLevel:
        """Determine risk level from score."""
        if score < 2.5:
            return RiskLevel.LOW
        elif score < 5.0:
            return RiskLevel.MODERATE
        elif score < 7.5:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL

    def _calculate_confidence(self, event_count: int) -> float:
        """Calculate confidence in score based on event data available."""
        # More events = higher confidence
        base_confidence = 0.6
        event_boost = min(event_count * 0.05, 0.35)  # Max 0.35 boost
        return min(base_confidence + event_boost, 0.95)

    # ========================================================================
    # Public Helper Methods
    # ========================================================================

    def update_dimension_score(self, country: str, dimension: str, new_score: float) -> float:
        """
        Update a specific dimension score (for admin/manual override).
        Scores must be between 0-10.
        """
        score = max(0.0, min(new_score, 10.0))
        self.logger.info(f"Updated {dimension} risk for {country} to {score}")
        return score

    def get_dimension_explanation(self, dimension: str) -> str:
        """Get explanation of a risk dimension."""
        explanations = {
            "war": "Risk of armed conflict or ongoing warfare affecting the country.",
            "sanctions": "International sanctions or export controls affecting the economy.",
            "economic": "Economic stability, inflation, debt, and growth prospects.",
            "political": "Government stability, policy uncertainty, and political unrest.",
            "currency": "Currency volatility and devaluation risk.",
            "regulatory": "Risk of sudden regulatory changes or capital controls.",
        }
        return explanations.get(dimension, "Unknown dimension")


# Singleton instance
risk_engine = RiskScoringEngine()
