"""Application settings loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration read from .env (or environment)."""

    # MongoDB
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "bearwithme"

    # JWT
    JWT_SECRET: str = "change-me-to-a-random-32-char-string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # AI
    NVIDIA_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    AI_BASE_URL: str = "https://integrate.api.nvidia.com/v1"
    AI_MODEL: str = "moonshotai/kimi-k2-instruct"
    AI_TEMPERATURE: float = 0.7

    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def AI_API_KEY(self) -> str:
        """Primary key used by the chat model client.

        Prefer NVIDIA credentials, but keep OPENAI_API_KEY as a fallback
        for local compatibility.
        """
        return self.NVIDIA_API_KEY or self.OPENAI_API_KEY


settings = Settings()
