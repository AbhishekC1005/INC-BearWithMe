"""Moods API routes."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.mood import MoodEntry
from app.schemas.mood import MoodCreate, MoodResponse

router = APIRouter()


def _entry_to_response(entry: MoodEntry) -> MoodResponse:
    return MoodResponse(
        id=str(entry.id),
        level=entry.level,
        intensity=entry.intensity,
        note=entry.note,
        triggers=entry.triggers,
        timestamp=entry.timestamp,
    )


@router.get("", response_model=list[MoodResponse])
async def list_moods(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    """List mood entries for the current user (newest first)."""
    entries = (
        await MoodEntry.find(MoodEntry.user_id == current_user.id)
        .sort("-timestamp")
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_entry_to_response(e) for e in entries]


@router.post("", response_model=MoodResponse, status_code=201)
async def create_mood(
    body: MoodCreate,
    current_user: User = Depends(get_current_user),
):
    """Log a new mood entry."""
    entry = MoodEntry(user_id=current_user.id, **body.model_dump())
    await entry.insert()
    return _entry_to_response(entry)


@router.get("/today", response_model=MoodResponse | None)
async def get_today_mood(
    current_user: User = Depends(get_current_user),
):
    """Get today's mood entry (if any)."""
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    entry = await MoodEntry.find_one(
        MoodEntry.user_id == current_user.id,
        MoodEntry.timestamp >= today_start,
    )
    if entry is None:
        return None
    return _entry_to_response(entry)
