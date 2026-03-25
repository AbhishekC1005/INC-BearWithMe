"""Mood request / response schemas."""

from datetime import datetime
from pydantic import BaseModel


class MoodCreate(BaseModel):
    """Payload for logging a mood entry."""
    level: str          # "great" | "good" | "okay" | "low" | "bad"
    intensity: int = 5
    note: str | None = None
    triggers: list[str] = []


class MoodResponse(BaseModel):
    """Mood entry returned by the API."""
    id: str
    level: str
    intensity: int
    note: str | None = None
    triggers: list[str]
    timestamp: datetime
