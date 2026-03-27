"""Pydantic schemas for request/response validation."""

from datetime import datetime

from pydantic import BaseModel, Field


# ── User schemas ──────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    nickname: str | None = None
    email: str | None = None
    firebase_uid: str | None = None
    birthday: str | None = None
    gender: str | None = None
    chat_style: str | None = None
    occupation: str | None = None
    sleep_time: str | None = None
    wake_time: str | None = None
    work_start_time: str | None = None
    work_end_time: str | None = None
    stressors: list[str] = Field(default_factory=list)


class UserUpdate(BaseModel):
    name: str | None = None
    nickname: str | None = None
    birthday: str | None = None
    gender: str | None = None
    chat_style: str | None = None
    occupation: str | None = None
    sleep_time: str | None = None
    wake_time: str | None = None
    work_start_time: str | None = None
    work_end_time: str | None = None
    stressors: list[str] | None = None
    is_onboarded: bool | None = None


class UserResponse(BaseModel):
    id: str
    name: str
    nickname: str | None = None
    email: str | None = None
    birthday: str | None = None
    gender: str | None = None
    chat_style: str | None = None
    occupation: str | None = None
    sleep_time: str | None = None
    wake_time: str | None = None
    work_start_time: str | None = None
    work_end_time: str | None = None
    stressors: list[str] = Field(default_factory=list)
    is_onboarded: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCheckResponse(BaseModel):
    exists: bool
    is_onboarded: bool = False


# ── Journal schemas ───────────────────────────────────────────

class JournalCreate(BaseModel):
    title: str
    content: str
    main_thing: str = ""
    feeling: str | None = None
    need_from_adam: str = ""
    mood: str
    mood_emoji: str


class JournalUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    main_thing: str | None = None
    feeling: str | None = None
    need_from_adam: str | None = None
    mood: str | None = None
    mood_emoji: str | None = None


class JournalResponse(BaseModel):
    id: str
    title: str
    content: str
    main_thing: str
    feeling: str | None = None
    need_from_adam: str
    mood: str
    mood_emoji: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Mood schemas ──────────────────────────────────────────────

class MoodCreate(BaseModel):
    level: str  # great | good | okay | low | bad
    intensity: int = Field(default=3, ge=1, le=5)
    note: str | None = None
    triggers: list[str] = Field(default_factory=list)


class MoodResponse(BaseModel):
    id: str
    level: str
    intensity: int
    note: str | None = None
    triggers: list[str] = Field(default_factory=list)
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Chat schemas ──────────────────────────────────────────────

class ChatMessageCreate(BaseModel):
    role: str  # user | adam
    content: str


class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
