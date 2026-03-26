"""Application configuration using Pydantic Settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App-wide settings loaded from environment / .env file."""

    DATABASE_URL: str = "sqlite+aiosqlite:///./bearwithme.db"
    CORS_ORIGINS: list[str] = ["*"]  # tighten in production
    DEBUG: bool = True
    FIREBASE_CREDENTIALS_PATH: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
