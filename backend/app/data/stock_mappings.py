"""
Stock sector mappings for major markets.
Maps individual stocks to their sectors for impact analysis.
"""

STOCK_SECTOR_MAPPING = {
    # India (BSE/NSE) - Major Stocks
    "ONGC": {"sector": "Oil & Gas", "market": "NSE", "name": "Oil and Natural Gas Corp"},
    "RELIANCE": {"sector": "Oil & Gas", "market": "NSE", "name": "Reliance Industries"},
    "INFY": {"sector": "Technology", "market": "NSE", "name": "Infosys Limited"},
    "TCS": {"sector": "Technology", "market": "NSE", "name": "Tata Consultancy Services"},
    "WIPRO": {"sector": "Technology", "market": "NSE", "name": "Wipro Limited"},
    "AXISBANK": {"sector": "Banking", "market": "NSE", "name": "Axis Bank"},
    "HDFCBANK": {"sector": "Banking", "market": "NSE", "name": "HDFC Bank"},
    "ICICIBANK": {"sector": "Banking", "market": "NSE", "name": "ICICI Bank"},
    "SBIN": {"sector": "Banking", "market": "NSE", "name": "State Bank of India"},
    "INDIGO": {"sector": "Airlines", "market": "NSE", "name": "InterGlobe Aviation"},
    "SPICEJET": {"sector": "Airlines", "market": "NSE", "name": "SpiceJet Limited"},
    "BHARTIARTL": {"sector": "Telecom", "market": "NSE", "name": "Bharti Airtel"},
    "JIOFINANC": {"sector": "Telecom", "market": "NSE", "name": "Jio Financial Services"},
    "MARUTI": {"sector": "Automotive", "market": "NSE", "name": "Maruti Suzuki"},
    "HEROMOTOCO": {"sector": "Automotive", "market": "NSE", "name": "Hero MotoCorp"},
    "TATASTEEL": {"sector": "Metals", "market": "NSE", "name": "Tata Steel"},
    "HINDALCO": {"sector": "Metals", "market": "NSE", "name": "Hindalco Industries"},
    "NESTLEIND": {"sector": "Consumer Staples", "market": "NSE", "name": "Nestle India"},
    "HINDUNILVR": {"sector": "Consumer Staples", "market": "NSE", "name": "Hindustan Unilever"},
    "BRITANNIA": {"sector": "Consumer Staples", "market": "NSE", "name": "Britannia Industries"},
    "HDFCLIFE": {"sector": "Insurance", "market": "NSE", "name": "HDFC Life Insurance"},
    "LICI": {"sector": "Insurance", "market": "NSE", "name": "Life Insurance Corp"},
    "SUNTV": {"sector": "Media", "market": "NSE", "name": "Sun TV Network"},
    "IRCTC": {"sector": "Transportation", "market": "NSE", "name": "Indian Railway Catering"},
    "BAJAJFINSV": {"sector": "Finance", "market": "NSE", "name": "Bajaj Finserv"},
    "BAJAJFS": {"sector": "Finance", "market": "NSE", "name": "Bajaj Finance"},
    
    # Pakistan
    "HUBCO": {"sector": "Energy", "market": "PSX", "name": "Hub Power Company"},
    "PPL": {"sector": "Oil & Gas", "market": "PSX", "name": "Pakistan Petroleum"},
    "NATL": {"sector": "Banking", "market": "PSX", "name": "National Bank of Pakistan"},
    "UBL": {"sector": "Consumer Staples", "market": "PSX", "name": "United Breweries"},
    "ENGRO": {"sector": "Chemicals", "market": "PSX", "name": "Engro Corporation"},
    
    # USA
    "AAPL": {"sector": "Technology", "market": "NASDAQ", "name": "Apple Inc"},
    "MSFT": {"sector": "Technology", "market": "NASDAQ", "name": "Microsoft Corp"},
    "XOM": {"sector": "Oil & Gas", "market": "NYSE", "name": "ExxonMobil"},
    "CVX": {"sector": "Oil & Gas", "market": "NYSE", "name": "Chevron Corporation"},
    "BA": {"sector": "Defense", "market": "NYSE", "name": "Boeing Company"},
    "LMT": {"sector": "Defense", "market": "NYSE", "name": "Lockheed Martin"},
    "DAL": {"sector": "Airlines", "market": "NYSE", "name": "Delta Air Lines"},
    "AAL": {"sector": "Airlines", "market": "NYSE", "name": "American Airlines"},
    "JPM": {"sector": "Banking", "market": "NYSE", "name": "JPMorgan Chase"},
    "GS": {"sector": "Banking", "market": "NYSE", "name": "Goldman Sachs"},
    
    # China
    "GOOG": {"sector": "Technology", "market": "NASDAQ", "name": "Alphabet (Google)"},
    "BABA": {"sector": "Technology", "market": "NYSE", "name": "Alibaba Group"},
    "BAIDU": {"sector": "Technology", "market": "NASDAQ", "name": "Baidu Inc"},
    "0700.HK": {"sector": "Technology", "market": "HKEX", "name": "Tencent Holdings"},
    
    # Middle East
    "2222.SR": {"sector": "Oil & Gas", "market": "TADAWUL", "name": "Saudi Aramco"},
    "ENOC.AE": {"sector": "Oil & Gas", "market": "DFM", "name": "Emirates National Oil"},
}


def get_stock_info(ticker: str) -> dict:
    """Get stock information from mapping."""
    return STOCK_SECTOR_MAPPING.get(ticker.upper(), {
        "sector": "Unknown",
        "market": "Unknown",
        "name": ticker
    })


def get_sector_stocks(sector: str) -> list:
    """Get all stocks in a specific sector."""
    return [
        {"ticker": k, **v}
        for k, v in STOCK_SECTOR_MAPPING.items()
        if v["sector"].lower() == sector.lower()
    ]
