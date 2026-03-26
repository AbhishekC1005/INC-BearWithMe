"""Journal entry endpoints — full CRUD with pagination."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user_id
from app.database import get_db
from app.models import JournalEntry, User
from app.schemas import JournalCreate, JournalResponse, JournalUpdate

router = APIRouter(prefix="/api/journals", tags=["journals"])


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


@router.get("", response_model=list[JournalResponse])
async def list_journals(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == user_id)
        .order_by(JournalEntry.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post("", response_model=JournalResponse, status_code=status.HTTP_201_CREATED)
async def create_journal(
    body: JournalCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    entry = JournalEntry(user_id=user_id, **body.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("/{journal_id}", response_model=JournalResponse)
async def get_journal(
    journal_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == journal_id,
            JournalEntry.user_id == user_id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry


@router.patch("/{journal_id}", response_model=JournalResponse)
async def update_journal(
    journal_id: str,
    body: JournalUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == journal_id,
            JournalEntry.user_id == user_id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{journal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal(
    journal_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == journal_id,
            JournalEntry.user_id == user_id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    await db.delete(entry)
    await db.commit()
