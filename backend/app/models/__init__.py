"""SQLAlchemy ORM models for BearWithMe."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100))
    nickname: Mapped[str | None] = mapped_column(String(50))
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    firebase_uid: Mapped[str | None] = mapped_column(String(128), unique=True, index=True)
    birthday: Mapped[str | None] = mapped_column(String(20))
    gender: Mapped[str | None] = mapped_column(String(20))
    chat_style: Mapped[str | None] = mapped_column(String(50))
    occupation: Mapped[str | None] = mapped_column(String(100))
    sleep_time: Mapped[str | None] = mapped_column(String(10))
    wake_time: Mapped[str | None] = mapped_column(String(10))
    work_start_time: Mapped[str | None] = mapped_column(String(10))
    work_end_time: Mapped[str | None] = mapped_column(String(10))
    stressors: Mapped[list | None] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    journal_entries: Mapped[list["JournalEntry"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    mood_entries: Mapped[list["MoodEntry"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    chat_messages: Mapped[list["ChatMessage"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    main_thing: Mapped[str] = mapped_column(Text, default="")
    feeling: Mapped[str | None] = mapped_column(String(50))
    need_from_adam: Mapped[str] = mapped_column(Text, default="")
    mood: Mapped[str] = mapped_column(String(30))
    mood_emoji: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="journal_entries")


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    level: Mapped[str] = mapped_column(String(10))  # great | good | okay | low | bad
    intensity: Mapped[int] = mapped_column(Integer, default=3)
    note: Mapped[str | None] = mapped_column(Text)
    triggers: Mapped[list | None] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="mood_entries")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    role: Mapped[str] = mapped_column(String(10))  # user | adam
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="chat_messages")
