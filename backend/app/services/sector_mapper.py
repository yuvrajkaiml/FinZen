"""
Sector Impact Mapper - Maps geopolitical events to sector-level impacts.
Uses rule-based mapping from events to sector impacts.
"""

import logging
from typing import List, Dict, Optional
from datetime import datetime
from app.models.schemas import SectorImpact, SectorImpactResponse, ImpactDirection
from app.data.sector_mappings import SECTOR_IMPACT_MAPPING, DEFAULT_SECTOR_IMPACTS

logger = logging.getLogger(__name__)


class SectorMapper:
    """
    Maps geopolitical events and risk scores to sector impacts.
    Uses rule-based mapping from events to affected sectors.
    """

    def __init__(self):
        """Initialize sector mapper."""
        self.logger = logger
        self.impact_map = SECTOR_IMPACT_MAPPING

    def map_event_to_sectors(
        self,
        country: str,
        event_type: str,
        severity: float = 0.5,
    ) -> SectorImpactResponse:
        """
        Map a geopolitical event to sector impacts.
        
        Args:
            country: Country affected by event
            event_type: Type of event (war, sanctions, economic, etc.)
            severity: Severity of event (0-1)
            
        Returns:
            SectorImpactResponse with affected sectors
        """
        
        # Get base sector impacts for event type
        event_key = event_type.lower()
        base_impacts = self.impact_map.get(event_key, {})
        
        # If no specific mapping, use default impacts
        if not base_impacts:
            base_impacts = DEFAULT_SECTOR_IMPACTS
            self.logger.warning(f"No mapping found for event type '{event_type}', using defaults")
        
        # Convert base impacts to SectorImpact objects and apply severity
        sector_impacts = []
        for sector, impact_data in base_impacts.items():
            impact_direction = impact_data.get("impact", "neutral")
            base_strength = impact_data.get("strength", 0.5)
            
            # Adjust strength by severity
            adjusted_strength = min(base_strength * (0.5 + severity), 1.0)
            
            sector_impacts.append(SectorImpact(
                sector=sector,
                impact=ImpactDirection(impact_direction),
                strength=round(adjusted_strength, 2),
                rationale=impact_data.get("rationale", ""),
            ))
        
        # Sort by strength (highest impact first)
        sector_impacts.sort(key=lambda x: x.strength, reverse=True)
        
        self.logger.info(
            f"Mapped event '{event_type}' for {country} to {len(sector_impacts)} sectors"
        )
        
        return SectorImpactResponse(
            country=country,
            event_type=event_type,
            sector_impacts=sector_impacts,
            timestamp=datetime.utcnow().isoformat(),
        )

    def get_top_affected_sectors(
        self,
        sector_impacts: List[SectorImpact],
        limit: int = 5,
        direction: Optional[ImpactDirection] = None,
    ) -> List[SectorImpact]:
        """
        Get top affected sectors by impact strength.
        
        Args:
            sector_impacts: List of sector impacts
            limit: Maximum number to return
            direction: Filter by impact direction (optional)
            
        Returns:
            Sorted list of top affected sectors
        """
        
        impacts = sector_impacts
        
        # Filter by direction if specified
        if direction:
            impacts = [s for s in impacts if s.impact == direction]
        
        # Sort by strength and return top N
        impacts.sort(key=lambda x: x.strength, reverse=True)
        return impacts[:limit]

    def aggregate_sector_impacts(
        self,
        impacts_list: List[SectorImpactResponse],
    ) -> Dict[str, Dict]:
        """
        Aggregate sector impacts from multiple events.
        Combines impacts and resolves conflicts.
        
        Args:
            impacts_list: List of sector impact responses
            
        Returns:
            Aggregated sector impacts by sector name
        """
        
        aggregated = {}
        
        for impact_response in impacts_list:
            for sector_impact in impact_response.sector_impacts:
                sector_name = sector_impact.sector
                
                if sector_name not in aggregated:
                    aggregated[sector_name] = {
                        "bullish_strength": 0.0,
                        "bearish_strength": 0.0,
                        "events": [],
                    }
                
                # Track bullish and bearish strengths separately
                if sector_impact.impact == ImpactDirection.BULLISH:
                    aggregated[sector_name]["bullish_strength"] += sector_impact.strength
                elif sector_impact.impact == ImpactDirection.BEARISH:
                    aggregated[sector_name]["bearish_strength"] += sector_impact.strength
                
                aggregated[sector_name]["events"].append({
                    "event_type": impact_response.event_type,
                    "strength": sector_impact.strength,
                })
        
        return aggregated

    def determine_net_impact(
        self,
        aggregated: Dict[str, Dict],
    ) -> Dict[str, Dict]:
        """
        Determine net impact for each sector from aggregated impacts.
        Resolves bullish vs bearish conflicts.
        
        Args:
            aggregated: Aggregated sector impacts
            
        Returns:
            Net impacts with direction and strength
        """
        
        net_impacts = {}
        
        for sector, data in aggregated.items():
            bullish = data["bullish_strength"]
            bearish = data["bearish_strength"]
            
            # Determine net direction
            if bullish > bearish:
                impact = "bullish"
                net_strength = (bullish - bearish) / (bullish + bearish + 0.1)
            elif bearish > bullish:
                impact = "bearish"
                net_strength = (bearish - bullish) / (bullish + bearish + 0.1)
            else:
                impact = "neutral"
                net_strength = 0.0
            
            net_impacts[sector] = {
                "impact": impact,
                "strength": round(net_strength, 2),
                "bullish": bullish,
                "bearish": bearish,
                "event_count": len(data["events"]),
            }
        
        return net_impacts

    # ========================================================================
    # Helper Methods
    # ========================================================================

    def get_sector_impact_details(self, sector: str, event_type: str) -> Optional[Dict]:
        """Get detailed impact information for a sector given an event type."""
        event_key = event_type.lower()
        base_impacts = self.impact_map.get(event_key, {})
        return base_impacts.get(sector)

    def list_sectors_impacted_by_event(self, event_type: str) -> List[str]:
        """List all sectors that can be impacted by an event type."""
        event_key = event_type.lower()
        return list(self.impact_map.get(event_key, DEFAULT_SECTOR_IMPACTS).keys())

    def list_all_events(self) -> List[str]:
        """List all event types in the mapping."""
        return list(self.impact_map.keys())

    def validate_event_type(self, event_type: str) -> bool:
        """Validate if event type is in mapping."""
        return event_type.lower() in self.impact_map

    # ========================================================================
    # Analysis Methods
    # ========================================================================

    def get_most_resilient_sectors(
        self,
        impacts_list: List[SectorImpactResponse],
        limit: int = 5,
    ) -> List[str]:
        """
        Get sectors most resilient to the geopolitical events.
        Returns sectors least negatively impacted.
        """
        aggregated = self.aggregate_sector_impacts(impacts_list)
        net_impacts = self.determine_net_impact(aggregated)
        
        # Sort by net impact (neutral or bullish are safest)
        sorted_sectors = sorted(
            net_impacts.items(),
            key=lambda x: (x[1]["strength"] if x[1]["impact"] != "bearish" else -x[1]["strength"]),
            reverse=True,
        )
        
        return [sector for sector, _ in sorted_sectors[:limit]]

    def get_most_exposed_sectors(
        self,
        impacts_list: List[SectorImpactResponse],
        limit: int = 5,
    ) -> List[str]:
        """
        Get sectors most exposed/negatively impacted by the events.
        """
        aggregated = self.aggregate_sector_impacts(impacts_list)
        net_impacts = self.determine_net_impact(aggregated)
        
        # Sort by bearish impact
        sorted_sectors = sorted(
            net_impacts.items(),
            key=lambda x: x[1]["bearish"],
            reverse=True,
        )
        
        return [sector for sector, _ in sorted_sectors[:limit]]


# Singleton instance
sector_mapper = SectorMapper()
