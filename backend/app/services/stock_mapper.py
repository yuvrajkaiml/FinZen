"""
Stock Impact Mapper - Maps sector impacts to individual stock impacts.
Converts sector-level impact to stock-level predictions.
"""

import logging
from typing import List, Dict, Optional
from app.models.schemas import StockImpact, StockImpactResponse, ImpactDirection, SectorImpact
from app.data.stock_mappings import STOCK_SECTOR_MAPPING, get_stock_info, get_sector_stocks

logger = logging.getLogger(__name__)


class StockMapper:
    """
    Maps sector impacts to individual stock impacts.
    Determines which stocks are affected by geopolitical events via sector exposure.
    """

    def __init__(self):
        """Initialize stock mapper."""
        self.logger = logger
        self.stock_map = STOCK_SECTOR_MAPPING

    def map_sectors_to_stocks(
        self,
        sector_impacts: List[SectorImpact],
        country: str = "India",  # Default country for stock selection
    ) -> StockImpactResponse:
        """
        Map sector impacts to individual stock impacts.
        
        Args:
            sector_impacts: List of sector impacts from SectorMapper
            country: Country filter for stocks (default: India)
            
        Returns:
            StockImpactResponse with affected stocks
        """
        
        affected_stocks = []
        processed_sectors = set()
        
        for sector_impact in sector_impacts:
            sector = sector_impact.sector
            
            if sector in processed_sectors:
                continue
            processed_sectors.add(sector)
            
            # Get all stocks in this sector
            stocks_in_sector = get_sector_stocks(sector)
            
            # Filter by country if specified
            if country:
                stocks_in_sector = [
                    s for s in stocks_in_sector
                    if country.lower() in s.get("market", "").lower() or
                       country.lower() in s.get("name", "").lower()
                ]
            
            # If no country-specific stocks, use all
            if not stocks_in_sector:
                stocks_in_sector = get_sector_stocks(sector)
            
            # Convert to StockImpact objects
            for stock in stocks_in_sector:
                # Calculate stock-level impact: sector impact strength + volatility factor
                stock_impact = self._calculate_stock_impact(
                    stock,
                    sector_impact,
                )
                
                if stock_impact:
                    affected_stocks.append(stock_impact)
        
        # Sort by impact strength
        affected_stocks.sort(
            key=lambda x: abs(x.expected_impact_percent),
            reverse=True,
        )
        
        # Create summary
        summary = self._generate_summary(affected_stocks, sector_impacts)
        
        self.logger.info(
            f"Mapped {len(sector_impacts)} sectors to {len(affected_stocks)} stocks for {country}"
        )
        
        return StockImpactResponse(
            country=country,
            affected_stocks=affected_stocks,
            summary=summary,
        )

    def _calculate_stock_impact(
        self,
        stock: Dict,
        sector_impact: SectorImpact,
    ) -> Optional[StockImpact]:
        """
        Calculate impact for an individual stock.
        Base impact is sector impact, with volatility adjustments.
        """
        
        ticker = stock.get("ticker")
        name = stock.get("name", ticker)
        sector = stock.get("sector")
        
        if not ticker:
            return None
        
        # Base expected impact (sector impact strength * direction multiplier)
        direction_multiplier = 1.0 if sector_impact.impact == ImpactDirection.BULLISH else -1.0
        
        # Stock volatility factor (some stocks more sensitive to geopolitical risk)
        volatility_factor = self._get_stock_volatility_factor(ticker, sector)
        
        # Calculate expected impact percentage
        impact_magnitude = sector_impact.strength * 100  # Convert to percentage
        expected_impact = direction_multiplier * impact_magnitude * volatility_factor
        
        # Confidence based on sector impact strength and stock volatility
        confidence = min(sector_impact.strength * 0.8 + 0.2, 0.95)
        
        return StockImpact(
            ticker=ticker,
            company_name=name,
            sector=sector,
            impact=sector_impact.impact,
            expected_impact_percent=round(expected_impact, 1),
            confidence=round(confidence, 2),
        )

    def _get_stock_volatility_factor(self, ticker: str, sector: str) -> float:
        """
        Get volatility multiplier for a stock based on sector and characteristics.
        Higher volatility = more sensitive to geopolitical shocks.
        """
        
        # Sector volatility factors
        sector_volatility = {
            "Oil & Gas": 1.3,
            "Airlines": 1.2,
            "Defense": 1.0,
            "Banking": 1.1,
            "Technology": 0.8,
            "Consumer Staples": 0.6,
            "Healthcare": 0.7,
            "Utilities": 0.5,
            "Insurance": 0.9,
            "Shipping": 1.2,
            "Metals": 1.15,
            "Real Estate": 0.9,
            "Telecom": 0.75,
            "Media": 0.85,
            "Finance": 1.0,
            "Chemicals": 1.0,
            "Automotive": 0.95,
            "Energy": 1.2,
            "Manufacturing": 0.9,
            "Retail": 0.85,
        }
        
        base_factor = sector_volatility.get(sector, 0.9)
        
        # Stock-specific adjustments
        export_heavy_stocks = ["INFY", "TCS", "WIPRO", "AAPL", "MSFT"]
        if ticker in export_heavy_stocks:
            base_factor *= 1.1  # More sensitive to currency/trade shocks
        
        defensive_stocks = ["NESTLEIND", "HINDUNILVR", "BRITANNIA", "HDFCLIFE"]
        if ticker in defensive_stocks:
            base_factor *= 0.7  # Less sensitive
        
        return base_factor

    def filter_stocks_by_impact(
        self,
        affected_stocks: List[StockImpact],
        min_impact_percent: float = 0.0,
        impact_direction: Optional[ImpactDirection] = None,
    ) -> List[StockImpact]:
        """
        Filter stocks by impact criteria.
        
        Args:
            affected_stocks: List of stock impacts
            min_impact_percent: Minimum absolute impact percentage
            impact_direction: Filter by bullish/bearish (optional)
            
        Returns:
            Filtered list of stocks
        """
        
        filtered = affected_stocks
        
        # Filter by minimum impact magnitude
        if min_impact_percent > 0:
            filtered = [
                s for s in filtered
                if abs(s.expected_impact_percent) >= min_impact_percent
            ]
        
        # Filter by direction
        if impact_direction:
            filtered = [s for s in filtered if s.impact == impact_direction]
        
        return filtered

    def get_most_affected_stocks(
        self,
        affected_stocks: List[StockImpact],
        limit: int = 10,
    ) -> List[StockImpact]:
        """Get stocks with highest impact magnitude."""
        sorted_stocks = sorted(
            affected_stocks,
            key=lambda x: abs(x.expected_impact_percent),
            reverse=True,
        )
        return sorted_stocks[:limit]

    def _generate_summary(
        self,
        affected_stocks: List[StockImpact],
        sector_impacts: List[SectorImpact],
    ) -> str:
        """Generate text summary of stock impacts."""
        
        if not affected_stocks:
            return "No stocks affected."
        
        bullish_count = sum(1 for s in affected_stocks if s.impact == ImpactDirection.BULLISH)
        bearish_count = sum(1 for s in affected_stocks if s.impact == ImpactDirection.BEARISH)
        
        avg_impact = sum(abs(s.expected_impact_percent) for s in affected_stocks) / len(affected_stocks)
        
        summary = f"Analyzed {len(affected_stocks)} stocks across {len(sector_impacts)} sectors. "
        summary += f"{bullish_count} stocks bullish, {bearish_count} stocks bearish. "
        summary += f"Average impact magnitude: {avg_impact:.1f}%."
        
        return summary

    # ========================================================================
    # Data Methods
    # ========================================================================

    def get_stock_sector(self, ticker: str) -> Optional[str]:
        """Get sector for a ticker."""
        stock_info = get_stock_info(ticker)
        return stock_info.get("sector")

    def get_stocks_in_portfolio(
        self,
        portfolio: List[str],  # List of tickers
    ) -> List[Dict]:
        """Get details for stocks in portfolio."""
        stocks = []
        for ticker in portfolio:
            stock_info = get_stock_info(ticker)
            if stock_info.get("sector") != "Unknown":
                stocks.append({"ticker": ticker, **stock_info})
        return stocks

    def validate_ticker(self, ticker: str) -> bool:
        """Check if ticker exists in database."""
        stock_info = get_stock_info(ticker)
        return stock_info.get("sector") != "Unknown"

    def add_custom_stock(
        self,
        ticker: str,
        sector: str,
        market: str = "Custom",
        name: str = "",
    ) -> bool:
        """
        Add custom stock to mapping (in-memory, not persistent).
        Note: This would be made persistent with a real database.
        """
        if not name:
            name = ticker
        
        self.stock_map[ticker.upper()] = {
            "sector": sector,
            "market": market,
            "name": name,
        }
        
        self.logger.info(f"Added custom stock: {ticker} ({sector})")
        return True


# Singleton instance
stock_mapper = StockMapper()
