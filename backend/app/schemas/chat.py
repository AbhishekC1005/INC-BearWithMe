"""Chat request / response schemas."""

from datetime import datetime
from pydantic import BaseModel


class ChatMessageRequest(BaseModel):
    """Payload for sending a message to Adam."""
    content: str
    session_id: str | None = None  # omit to auto-create a new session


class ChatMessageResponse(BaseModel):
    """A single chat message returned by the API."""
    id: str
    role: str                      # "user" | "adam"
    content: str
    timestamp: datetime


class ChatSessionResponse(BaseModel):
    """Chat session metadata."""
    id: str
    created_at: datetime
    last_message_at: datetime | None = None
