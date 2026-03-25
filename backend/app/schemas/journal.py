"""Journal request / response schemas."""

from datetime import datetime
from pydantic import BaseModel


class JournalCreate(BaseModel):
    """Payload for creating a new journal entry."""
    title: str
    content: str
    main_thing: str = ""
    need_from_adam: str = ""
    mood: str = ""
    mood_emoji: str = ""
    day: str = ""
    month: str = ""
    year: str = ""


class JournalUpdate(BaseModel):
    """Payload for updating an existing journal entry (all fields optional)."""
    title: str | None = None
    content: str | None = None
    main_thing: str | None = None
    need_from_adam: str | None = None
    mood: str | None = None
    mood_emoji: str | None = None


class JournalResponse(BaseModel):
    """Journal entry returned by the API."""
    id: str
    title: str
    content: str
    main_thing: str
    need_from_adam: str
    mood: str
    mood_emoji: str
    day: str
    month: str
    year: str
    timestamp: datetime
