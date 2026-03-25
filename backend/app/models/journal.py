"""Journal entry document model."""

from datetime import datetime

from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel


class JournalEntry(Document):
    """A single journal entry belonging to a user."""

    user_id: PydanticObjectId
    title: str
    content: str
    main_thing: str = ""
    need_from_adam: str = ""
    mood: str = ""
    mood_emoji: str = ""
    day: str = ""
    month: str = ""
    year: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "journal_entries"
        indexes = [
            IndexModel([("user_id", 1), ("timestamp", -1)]),
        ]
