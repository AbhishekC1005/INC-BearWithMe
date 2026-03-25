"""User document model."""

from datetime import datetime

from beanie import Document
from pydantic import Field
from pymongo import IndexModel


class User(Document):
    """Represents a registered app user."""

    email: str
    name: str
    nickname: str | None = None
    avatar_url: str | None = None
    birthday: str | None = None
    gender: str | None = None
    chat_style: str | None = None
    occupation: str | None = None
    sleep_time: str | None = None
    wake_time: str | None = None
    stressors: list[str] = Field(default_factory=list)
    is_onboarded: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", 1)], unique=True),
        ]
