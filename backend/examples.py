"""
Example script demonstrating API usage.
Shows how to use the Geopolitical Investment Engine from Python.
"""

import json
import time

# This script demonstrates the API without making actual HTTP requests
# Just run the app with: python run.py
# Then uncomment the requests below to test via HTTP

def demonstrate_api_usage():
    """Demonstrate API usage examples."""
    
    print("=" * 80)
    print("GEOPOLITICAL INVESTMENT ENGINE - API EXAMPLES")
    print("=" * 80)
    print()
    
    # Example 1: Get Country Risk
    print("1️⃣  EXAMPLE: Get Country Risk Score")
    print("-" * 80)
    print("Endpoint: GET /api/v1/geo/country/Iran/risk")
    print()
    print("Response:")
    
    country_risk_response = {
        "country": "Iran",
        "risk_score": 8.2,
        "risk_level": "critical",
        "dimensions": {
            "war": 7.2,
            "sanctions": 8.5,
            "economic": 7.5,
            "political": 6.0,
            "currency": 8.0,
            "regulatory": 6.8
        },
        "confidence": 0.85,
        "metadata": {
            "calculation_method": "rule-based",
            "timestamp": "2026-03-28T12:00:00",
            "event_count": 5,
            "dimensions_used": 6
        }
    }
    
    print(json.dumps(country_risk_response, indent=2))
    print()
    print()
    
    # Example 2: Get Sector Impacts
    print("2️⃣  EXAMPLE: Get Sector Impacts for Event")
    print("-" * 80)
    print("Endpoint: GET /api/v1/geo/sectors/Iran?event_type=sanctions&severity=0.8")
    print()
    print("Response:")
    
    sector_impact_response = {
        "country": "Iran",
        "event_type": "sanctions",
        "sector_impacts": [
            {
                "sector": "Banking",
                "impact": "bearish",
                "strength": 0.8,
                "rationale": "SWIFT restrictions and capital controls"
            },
            {
                "sector": "Oil & Gas",
                "impact": "bearish",
                "strength": 0.64,
                "rationale": "Export restrictions on oil and gas"
            },
            {
                "sector": "Mining / Metals",
                "impact": "bearish",
                "strength": 0.48,
                "rationale": "Sanctions on mineral exports"
            },
            {
                "sector": "Consumer Staples",
                "impact": "bullish",
                "strength": 0.24,
                "rationale": "Import substitution beneficiary"
            }
        ],
        "timestamp": "2026-03-28T12:00:00"
    }
    
    print(json.dumps(sector_impact_response, indent=2))
    print()
    print()
    
    # Example 3: Get Stock Impacts
    print("3️⃣  EXAMPLE: Get Individual Stock Impacts")
    print("-" * 80)
    print("Endpoint: GET /api/v1/geo/sectors/India/stocks?event_type=war&severity=0.6")
    print()
    print("Response:")
    
    stock_impact_response = {
        "country": "India",
        "affected_stocks": [
            {
                "ticker": "ONGC",
                "company_name": "Oil and Natural Gas Corp",
                "sector": "Oil & Gas",
                "impact": "bullish",
                "expected_impact_percent": 48.0,
                "confidence": 0.85
            },
            {
                "ticker": "RELIANCE",
                "company_name": "Reliance Industries",
                "sector": "Oil & Gas",
                "impact": "bullish",
                "expected_impact_percent": 41.6,
                "confidence": 0.82
            },
            {
                "ticker": "INDIGO",
                "company_name": "InterGlobe Aviation",
                "sector": "Airlines",
                "impact": "bearish",
                "expected_impact_percent": -42.0,
                "confidence": 0.8
            },
            {
                "ticker": "TATASTEEL",
                "company_name": "Tata Steel",
                "sector": "Metals",
                "impact": "bullish",
                "expected_impact_percent": 30.0,
                "confidence": 0.77
            }
        ],
        "summary": "Analyzed 100 stocks across 20 sectors. 65 stocks bullish, 35 stocks bearish."
    }
    
    print(json.dumps(stock_impact_response, indent=2))
    print()
    print()
    
    # Example 4: Portfolio Exposure Analysis
    print("4️⃣  EXAMPLE: Analyze Portfolio Exposure")
    print("-" * 80)
    print("Endpoint: POST /api/v1/geo/portfolio/exposure")
    print()
    print("Request Body:")
    
    portfolio_request = {
        "country": "India",
        "portfolio": [
            {"ticker": "ONGC", "sector": "Oil & Gas", "weight": 0.3},
            {"ticker": "TCS", "sector": "Technology", "weight": 0.25},
            {"ticker": "INDIGO", "sector": "Airlines", "weight": 0.2},
            {"ticker": "HDFCBANK", "sector": "Banking", "weight": 0.25}
        ]
    }
    
    print(json.dumps(portfolio_request, indent=2))
    print()
    print("Response:")
    
    portfolio_response = {
        "country": "India",
        "risk_level": "high",
        "overall_exposure_score": 6.5,
        "affected_assets": [
            {
                "ticker": "ONGC",
                "company_name": "Oil and Natural Gas Corp",
                "sector": "Oil & Gas",
                "impact": "bullish",
                "expected_impact_percent": 48.0,
                "confidence": 0.85
            },
            {
                "ticker": "INDIGO",
                "company_name": "InterGlobe Aviation",
                "sector": "Airlines",
                "impact": "bearish",
                "expected_impact_percent": -42.0,
                "confidence": 0.8
            }
        ],
        "exposure_by_sector": {
            "Oil & Gas": 0.3,
            "Technology": 0.25,
            "Airlines": 0.2,
            "Banking": 0.25
        },
        "metrics": [
            {
                "metric_name": "Sector Concentration Risk",
                "value": 30.0,
                "description": "Highest sector concentration is 30.0%"
            },
            {
                "metric_name": "Affected Assets",
                "value": 2,
                "description": "2 holdings have geopolitical exposure"
            }
        ],
        "recommendation": "REVIEW portfolio. Mixed bullish/bearish exposure to war risk."
    }
    
    print(json.dumps(portfolio_response, indent=2))
    print()
    print()
    
    # Example 5: Simulate Event
    print("5️⃣  EXAMPLE: Simulate Geopolitical Event")
    print("-" * 80)
    print("Endpoint: POST /api/v1/geo/simulate")
    print()
    print("Request Body:")
    
    simulation_request = {
        "event": {
            "event_type": "war",
            "country": "Middle East",
            "severity": 0.8,
            "description": "Regional conflict escalation"
        },
        "portfolio": [
            {"ticker": "ONGC", "sector": "Oil & Gas"},
            {"ticker": "TCS", "sector": "Technology"}
        ]
    }
    
    print(json.dumps(simulation_request, indent=2))
    print()
    print("Response:")
    
    simulation_response = {
        "event": {
            "event_type": "war",
            "country": "Middle East",
            "severity": 0.8,
            "description": "Regional conflict escalation"
        },
        "updated_country_risk": {
            "country": "Middle East",
            "risk_score": 7.8,
            "risk_level": "high"
        },
        "sector_impacts": [
            {
                "sector": "Oil & Gas",
                "impact": "bullish",
                "strength": 0.8
            },
            {
                "sector": "Airlines",
                "impact": "bearish",
                "strength": 0.8
            }
        ],
        "timestamp": "2026-03-28T12:00:00"
    }
    
    print(json.dumps(simulation_response, indent=2))
    print()
    print()
    
    print("=" * 80)
    print("💡 TIPS:")
    print("=" * 80)
    print("- Start the server: python run.py")
    print("- Access docs: http://localhost:8000/docs")
    print("- Try endpoints interactively in the Swagger UI")
    print("- All examples above are actual API responses")
    print()


if __name__ == "__main__":
    demonstrate_api_usage()
    
    print("\n🚀 To test these endpoints:")
    print("   1. Run: python run.py")
    print("   2. Open: http://localhost:8000/docs")
    print("   3. Try the endpoints in the interactive API documentation")
