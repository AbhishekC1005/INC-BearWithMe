"""Mood entry endpoints."""

from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user_id
from app.database import get_db
from app.models import MoodEntry, User
from app.schemas import MoodCreate, MoodResponse

router = APIRouter(prefix="/api/moods", tags=["moods"])


async def _resolve_user_id(
    firebase_uid: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> str:
    """Map Firebase UID → internal user id."""
    result = await db.execute(select(User.id).where(User.firebase_uid == firebase_uid))
    user_id = result.scalar_one_or_none()
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found — call POST /api/users first")
    return user_id


@router.get("", response_model=list[MoodResponse])
async def list_moods(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    result = await db.execute(
        select(MoodEntry)
        .where(MoodEntry.user_id == user_id)
        .order_by(MoodEntry.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post("", response_model=MoodResponse, status_code=status.HTTP_201_CREATED)
async def create_mood(
    body: MoodCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    entry = MoodEntry(user_id=user_id, **body.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("/today", response_model=MoodResponse | None)
async def get_today_mood(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    today_start = datetime.combine(date.today(), datetime.min.time(), tzinfo=timezone.utc)
    result = await db.execute(
        select(MoodEntry)
        .where(
            MoodEntry.user_id == user_id,
            MoodEntry.created_at >= today_start,
        )
        .order_by(MoodEntry.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()
