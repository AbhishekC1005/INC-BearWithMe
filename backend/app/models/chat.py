"""Chat session & message document models."""

from datetime import datetime

from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel


class ChatSession(Document):
    """Groups a sequence of chat messages for one user."""

    user_id: PydanticObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: datetime | None = None

    class Settings:
        name = "chat_sessions"
        indexes = [
            IndexModel([("user_id", 1)]),
        ]


class ChatMessage(Document):
    """A single message in a chat session."""

    session_id: PydanticObjectId
    user_id: PydanticObjectId
    role: str  # "user" | "adam"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_messages"
        indexes = [
            IndexModel([("session_id", 1), ("timestamp", 1)]),
        ]
