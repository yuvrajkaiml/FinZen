"""
Pydantic schemas for trust scoring APIs.
"""

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


class SourceScoreUpsertRequest(BaseModel):
    source_name: str = Field(min_length=1, max_length=255)
    sector: Optional[str] = Field(default=None, max_length=120)
    accuracy_score: float = Field(ge=0, le=100)
    total_articles: int = Field(default=0, ge=0)


class SourceScoreResponse(BaseModel):
    id: int
    source_name: str
    sector: Optional[str] = None
    accuracy_score: float
    total_articles: int
    last_updated: str


class ConsensusArticleInput(BaseModel):
    source: str = Field(min_length=1)
    sentiment: str = Field(pattern="^(positive|negative|neutral)$")


class ConsensusRequest(BaseModel):
    articles: List[ConsensusArticleInput] = Field(min_length=1)


class OutlierInfo(BaseModel):
    source: str
    is_outlier: bool
    reason: str


class ConsensusResponse(BaseModel):
    consensus_score: float
    agreement_level: str
    consensus_sentiment: str
    outliers: List[OutlierInfo]


class ArticleScoreRequest(BaseModel):
    source: str = Field(min_length=1)
    content: str = Field(min_length=1)
    sentiment: str = Field(pattern="^(positive|negative|neutral)$")
    timestamp: date
    sector: Optional[str] = None
    peer_articles: Optional[List[ConsensusArticleInput]] = None


class ArticleScoreBreakdown(BaseModel):
    source_score: float
    consensus_score: float
    recency_score: float
    sentiment_score: float


class ArticleScoreResponse(BaseModel):
    trust_score: float
    is_outlier: bool
    breakdown: ArticleScoreBreakdown
    agreement_level: str
