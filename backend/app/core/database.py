"""
SQLAlchemy database setup.
"""

import logging

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_engine():
    """Create PostgreSQL engine, fallback to SQLite if DB is unavailable."""
    primary_engine = create_engine(
        settings.DATABASE_URL,
        echo=settings.SQLALCHEMY_ECHO,
        future=True,
    )
    try:
        with primary_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connected using configured DATABASE_URL")
        return primary_engine
    except Exception as exc:
        logger.warning("Primary DB unavailable, falling back to SQLite: %s", exc)
        sqlite_engine = create_engine(
            "sqlite:///./trust_engine.db",
            echo=False,
            future=True,
            connect_args={"check_same_thread": False},
        )
        return sqlite_engine

# SQLAlchemy engine/session setup.
engine = _build_engine()

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


def get_db():
    """Yield a DB session for request lifecycle."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    """Create all registered ORM tables."""
    # Import models here so metadata is registered before create_all.
    from app.models import trust_models  # noqa: F401

    Base.metadata.create_all(bind=engine)
