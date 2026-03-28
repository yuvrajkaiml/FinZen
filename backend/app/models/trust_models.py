"""
Database models for Information Trust Scoring Engine.
"""

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class SourceAccuracy(Base):
    """Historical reliability profile for a source."""

    __tablename__ = "source_accuracy"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_name: Mapped[str] = mapped_column(String(255), index=True)
    sector: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    accuracy_score: Mapped[float] = mapped_column(Float, default=50.0)
    total_articles: Mapped[int] = mapped_column(Integer, default=0)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
