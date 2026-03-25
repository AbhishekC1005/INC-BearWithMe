"""Mood entry document model."""

from datetime import datetime

from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel


class MoodEntry(Document):
    """A mood log entry belonging to a user."""

    user_id: PydanticObjectId
    level: str  # "great" | "good" | "okay" | "low" | "bad"
    intensity: int = 5
    note: str | None = None
    triggers: list[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "mood_entries"
        indexes = [
            IndexModel([("user_id", 1), ("timestamp", -1)]),
        ]
