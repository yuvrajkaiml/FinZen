"""
Static sector impact mappings based on geopolitical events.
Rule-based system for mapping event types to sector impacts.
"""

SECTOR_IMPACT_MAPPING = {
    # War/Conflict Events
    "war": {
        "Oil & Gas": {"impact": "bullish", "strength": 0.8, "rationale": "Oil prices surge during conflicts"},
        "Defense": {"impact": "bullish", "strength": 0.7, "rationale": "Defense spending increases"},
        "Airlines": {"impact": "bearish", "strength": 0.7, "rationale": "Travel restrictions and increased costs"},
        "Tourism": {"impact": "bearish", "strength": 0.8, "rationale": "Reduced travel to conflict regions"},
        "Shipping": {"impact": "bearish", "strength": 0.5, "rationale": "Increased insurance and rerouting costs"},
        "Metals": {"impact": "bullish", "strength": 0.6, "rationale": "Increased defense manufacturing demand"},
    },
    
    # Sanctions
    "sanctions": {
        "Banking": {"impact": "bearish", "strength": 0.8, "rationale": "SWIFT restrictions and capital controls"},
        "Energy": {"impact": "bearish", "strength": 0.7, "rationale": "Export restrictions on oil and gas"},
        "Technology": {"impact": "bearish", "strength": 0.6, "rationale": "Restricted access to advanced tech"},
        "Shipping": {"impact": "bearish", "strength": 0.5, "rationale": "Logistics and transport complications"},
        "Consumer Staples": {"impact": "bullish", "strength": 0.6, "rationale": "Import substitution opportunities"},
        "Manufacturing": {"impact": "neutral", "strength": 0.5, "rationale": "Supply chain disruptions"},
    },
    
    # Economic Crisis
    "economic": {
        "Consumer Staples": {"impact": "bullish", "strength": 0.7, "rationale": "Defensive consumption during downturn"},
        "Utilities": {"impact": "bullish", "strength": 0.6, "rationale": "Stable dividend yields"},
        "Consumer Discretionary": {"impact": "bearish", "strength": 0.7, "rationale": "Reduced consumer spending"},
        "Technology": {"impact": "bearish", "strength": 0.6, "rationale": "Reduced IT spending and capex"},
        "Metals": {"impact": "bearish", "strength": 0.6, "rationale": "Reduced industrial demand"},
        "Healthcare": {"impact": "bullish", "strength": 0.5, "rationale": "Defensive healthcare sector"},
    },
    
    # Political Instability
    "political": {
        "Banking": {"impact": "bearish", "strength": 0.6, "rationale": "Policy uncertainty affects lending"},
        "Infrastructure": {"impact": "bearish", "strength": 0.5, "rationale": "Delayed government projects"},
        "Real Estate": {"impact": "bearish", "strength": 0.6, "rationale": "Investment uncertainty"},
        "Telecom": {"impact": "neutral", "strength": 0.4, "rationale": "Regulatory changes possible"},
        "Consumer Staples": {"impact": "bullish", "strength": 0.5, "rationale": "Defensive choice"},
    },
    
    # Currency Risk
    "currency": {
        "Export-Heavy Tech": {"impact": "bearish", "strength": 0.6, "rationale": "Currency depreciation reduces export revenue"},
        "Import-Heavy Retail": {"impact": "bearish", "strength": 0.7, "rationale": "Higher import costs"},
        "Domestic Consumers": {"impact": "bullish", "strength": 0.5, "rationale": "Local companies more competitive"},
        "Mining": {"impact": "bullish", "strength": 0.6, "rationale": "Foreign currency earnings benefit"},
        "Tourism": {"impact": "bullish", "strength": 0.7, "rationale": "Cheaper for foreign tourists"},
    },
    
    # Regulatory Changes
    "regulatory": {
        "Technology": {"impact": "bearish", "strength": 0.6, "rationale": "Data protection and tech regulations"},
        "Banking": {"impact": "bearish", "strength": 0.5, "rationale": "Increased compliance costs"},
        "Energy": {"impact": "bearish", "strength": 0.6, "rationale": "Emissions and environmental regulations"},
        "Healthcare": {"impact": "bearish", "strength": 0.4, "rationale": "Pharmaceutical and price regulations"},
        "Consumer Staples": {"impact": "bullish", "strength": 0.3, "rationale": "Stable regulatory environment"},
    },
}


# Default sector impacts when event type is not found
DEFAULT_SECTOR_IMPACTS = {
    "Consumer Staples": {"impact": "neutral", "strength": 0.3},
    "Healthcare": {"impact": "neutral", "strength": 0.3},
    "Utilities": {"impact": "neutral", "strength": 0.2},
}
