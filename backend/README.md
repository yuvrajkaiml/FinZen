# Geopolitical Investment Engine - Backend API

A production-ready MVP for analyzing geopolitical risk and its impact on financial portfolios.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

The `.env` file is already configured with:
- NewsAPI Key: `83071fd019da4f55a28f7344b4bf4dbd`
- Default database: PostgreSQL (optional for MVP)
- Redis: Enabled (optional for MVP)

### 3. Run the Application

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or using the provided script:

```bash
# Windows
python run.py

# Linux/macOS  
python run.py
```

### 4. Access the API

- **API Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **API Info**: http://localhost:8000/api/v1/info

---

## 📚 API Endpoints

### Country Risk Scoring

```http
GET /api/v1/geo/country/{country}/risk
```

**Example:**
```bash
curl http://localhost:8000/api/v1/geo/country/India/risk
```

**Response:**
```json
{
  "country": "India",
  "risk_score": 5.2,
  "risk_level": "moderate",
  "dimensions": {
    "war": 3.5,
    "sanctions": 1.0,
    "economic": 6.2,
    "political": 5.0,
    "currency": 6.0,
    "regulatory": 4.5
  },
  "confidence": 0.8
}
```

---

### Sector Impact Mapping

```http
GET /api/v1/geo/sectors/{country}?event_type=war&severity=0.7
```

**Example:**
```bash
curl "http://localhost:8000/api/v1/geo/sectors/Iran?event_type=sanctions&severity=0.8"
```

**Response:**
```json
{
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
    }
  ]
}
```

---

### Stock-Level Impact

```http
GET /api/v1/geo/sectors/{country}/stocks?event_type=war&severity=0.6
```

**Example:**
```bash
curl "http://localhost:8000/api/v1/geo/sectors/India/stocks?event_type=war&severity=0.6"
```

**Response:**
```json
{
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
      "ticker": "INDIGO",
      "company_name": "InterGlobe Aviation",
      "sector": "Airlines",
      "impact": "bearish",
      "expected_impact_percent": -42.0,
      "confidence": 0.8
    }
  ]
}
```

---

### Portfolio Exposure Analysis

```http
POST /api/v1/geo/portfolio/exposure
```

**Request Body:**
```json
{
  "country": "India",
  "portfolio": [
    {"ticker": "ONGC", "sector": "Oil & Gas", "weight": 0.3},
    {"ticker": "TCS", "sector": "Technology", "weight": 0.25},
    {"ticker": "INDIGO", "sector": "Airlines", "weight": 0.2},
    {"ticker": "HDFCBANK", "sector": "Banking", "weight": 0.25}
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/geo/portfolio/exposure \
  -H "Content-Type: application/json" \
  -d @payload.json
```

**Response:**
```json
{
  "country": "India",
  "risk_level": "high",
  "overall_exposure_score": 7.5,
  "affected_assets": [
    {
      "ticker": "ONGC",
      "company_name": "Oil and Natural Gas Corp",
      "sector": "Oil & Gas",
      "impact": "bullish",
      "expected_impact_percent": 45.0,
      "confidence": 0.84
    }
  ],
  "exposure_by_sector": {
    "Oil & Gas": 0.3,
    "Banking": 0.25
  },
  "metrics": [
    {
      "metric_name": "Sector Concentration Risk",
      "value": 30.0,
      "description": "Highest sector concentration is 30.0%"
    }
  ],
  "recommendation": "REVIEW portfolio. More bearish than bullish exposure. Consider hedging defensively."
}
```

---

### Geopolitical Event Simulation

```http
POST /api/v1/geo/simulate
```

**Request Body:**
```json
{
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
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/geo/simulate \
  -H "Content-Type: application/json" \
  -d @simulation_payload.json
```

---

### Information Endpoints

**List supported event types:**
```bash
curl http://localhost:8000/api/v1/geo/info/events
```

**List all sectors:**
```bash
curl http://localhost:8000/api/v1/geo/info/sectors
```

**List sectors affected by specific event:**
```bash
curl "http://localhost:8000/api/v1/geo/info/sectors?event_type=sanctions"
```

---

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── api/
│   │   └── geo.py             # Geopolitical routes
│   ├── services/
│   │   ├── risk_engine.py      # Country risk scoring logic
│   │   ├── sector_mapper.py    # Event-to-sector mapping
│   │   └── stock_mapper.py     # Sector-to-stock mapping
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   ├── core/
│   │   └── config.py           # Configuration loading
│   └── data/
│       ├── sector_mappings.py  # Sector impact rules
│       └── stock_mappings.py   # Stock-sector mappings
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

---

## 🔧 Configuration

Edit `.env` to configure:

```env
# FastAPI
ENV=development
DEBUG=true
HOST=0.0.0.0
PORT=8000

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/finsight

# Redis (optional)
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379/0

# API Keys
NEWSAPI_KEY=your_key_here
```

---

## 🎯 Key Features

### Risk Scoring (6 Dimensions)
- ⚔️ **War/Conflict**: Military escalation and regional tensions
- 🚫 **Sanctions**: International sanctions and embargoes
- 💰 **Economic**: Inflation, growth, debt, stability
- 🏛️ **Political**: Government stability, elections, unrest
- 💱 **Currency**: Devaluation risk and FX volatility
- 📋 **Regulatory**: Policy changes and capital controls

### Sector Impact Mapping
Maps geopolitical events to 20+ sectors:
- Oil & Gas, Airlines, Banking, Technology
- Defense, Consumer Staples, Healthcare, Utilities
- And more...

### Stock-Level Analysis
Tracks 100+ stocks across major markets:
- India (NSE/BSE)
- USA (NYSE/NASDAQ)
- China (HKEX)
- Pakistan (PSX)
- And emerging markets

### Portfolio Analysis
- Sector concentration risk
- Affected asset identification
- Impact quantification
- Strategic recommendations

---

## 📊 Example Usage in Python

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Get country risk
response = requests.get(f"{BASE_URL}/geo/country/Iran/risk")
print(json.dumps(response.json(), indent=2))

# Get sector impacts
response = requests.get(
    f"{BASE_URL}/geo/sectors/Iran",
    params={"event_type": "sanctions", "severity": 0.8}
)
print(json.dumps(response.json(), indent=2))

# Analyze portfolio
portfolio = {
    "country": "India",
    "portfolio": [
        {"ticker": "ONGC", "sector": "Oil & Gas", "weight": 0.3},
        {"ticker": "TCS", "sector": "Technology", "weight": 0.3},
        {"ticker": "HDFCBANK", "sector": "Banking", "weight": 0.4}
    ]
}

response = requests.post(
    f"{BASE_URL}/geo/portfolio/exposure",
    json=portfolio
)
print(json.dumps(response.json(), indent=2))
```

---

## 🧪 Testing

Run tests with pytest:

```bash
pytest tests/ -v
```

---

## 🚀 Deployment

### Docker Deployment

```bash
docker build -t finsight-geo .
docker run -p 8000:8000 --env-file .env finsight-geo
```

### Production with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

---

## 📝 Notes

- **Rule-based**: No ML models, pure logic-based scoring
- **Hackathon-ready**: Minimal dependencies, quick setup
- **Scalable**: Modular architecture for easy expansion
- **Documented**: Full OpenAPI/Swagger documentation

---

## 🤝 Future Enhancements

- [ ] Real GDELT and NewsAPI integration
- [ ] PostgreSQL persistence
- [ ] Redis caching layer
- [ ] ML-based impact prediction
- [ ] Real-time alerts
- [ ] Mobile app
- [ ] WebSocket real-time updates

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Support

For issues or questions, contact the development team.
