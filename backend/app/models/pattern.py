"""Pattern (AI-generated insight) document model."""

from datetime import datetime

from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel


class Pattern(Document):
    """An AI-detected behavioural pattern for a user."""

    user_id: PydanticObjectId
    type: str  # "mood" | "stress" | "sleep" | "routine"
    description: str
    frequency: int = 1
    detected_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "patterns"
        indexes = [
            IndexModel([("user_id", 1)]),
        ]
