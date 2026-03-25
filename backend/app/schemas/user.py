"""User request / response schemas."""

from datetime import datetime
from pydantic import BaseModel


class OnboardingUpdate(BaseModel):
    """Payload from onboarding steps 1-3."""
    nickname: str | None = None
    birthday: str | None = None
    gender: str | None = None
    chat_style: str | None = None
    occupation: str | None = None
    sleep_time: str | None = None
    wake_time: str | None = None
    stressors: list[str] | None = None


class UserResponse(BaseModel):
    """Public user profile returned by the API."""
    id: str
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
    stressors: list[str] = []
    is_onboarded: bool = False
    created_at: datetime
