"""
Application configuration module.
Loads and validates environment variables.
"""

from pydantic_settings import BaseSettings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # FastAPI
    ENV: str = "development"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    APP_NAME: str = "FinSight AI - Geopolitical Investment Engine"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/finsight_ai"
    SQLALCHEMY_ECHO: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_ENABLED: bool = True

    # API Keys
    NEWSAPI_KEY: str = ""
    GDELT_BASE_URL: str = "http://api.gdeltproject.org/api/v2/"
    YFINANCE_ENABLED: bool = True

    # Logging
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True

    def get_log_level(self):
        """Return logging level."""
        return getattr(logging, self.LOG_LEVEL, logging.INFO)


# Create settings instance
settings = Settings()

# Configure logging
logging.basicConfig(
    level=settings.get_log_level(),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger.info(f"Application: {settings.APP_NAME}")
logger.info(f"Environment: {settings.ENV}")
logger.info(f"Debug: {settings.DEBUG}")
