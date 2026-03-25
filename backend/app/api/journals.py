"""Journals API routes."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from beanie import PydanticObjectId

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.journal import JournalEntry
from app.schemas.journal import JournalCreate, JournalUpdate, JournalResponse

router = APIRouter()


def _entry_to_response(entry: JournalEntry) -> JournalResponse:
    return JournalResponse(
        id=str(entry.id),
        title=entry.title,
        content=entry.content,
        main_thing=entry.main_thing,
        need_from_adam=entry.need_from_adam,
        mood=entry.mood,
        mood_emoji=entry.mood_emoji,
        day=entry.day,
        month=entry.month,
        year=entry.year,
        timestamp=entry.timestamp,
    )


@router.get("", response_model=list[JournalResponse])
async def list_journals(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    """List journal entries for the current user (newest first)."""
    entries = (
        await JournalEntry.find(JournalEntry.user_id == current_user.id)
        .sort("-timestamp")
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_entry_to_response(e) for e in entries]


@router.post("", response_model=JournalResponse, status_code=status.HTTP_201_CREATED)
async def create_journal(
    body: JournalCreate,
    current_user: User = Depends(get_current_user),
):
    """Create a new journal entry."""
    entry = JournalEntry(user_id=current_user.id, **body.model_dump())
    await entry.insert()
    return _entry_to_response(entry)


@router.get("/{journal_id}", response_model=JournalResponse)
async def get_journal(
    journal_id: str,
    current_user: User = Depends(get_current_user),
):
    """Get a single journal entry."""
    entry = await JournalEntry.get(PydanticObjectId(journal_id))
    if entry is None or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")
    return _entry_to_response(entry)


@router.put("/{journal_id}", response_model=JournalResponse)
async def update_journal(
    journal_id: str,
    body: JournalUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update an existing journal entry."""
    entry = await JournalEntry.get(PydanticObjectId(journal_id))
    if entry is None or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")

    update_data = body.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(entry, key, value)
    await entry.save()
    return _entry_to_response(entry)


@router.delete("/{journal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal(
    journal_id: str,
    current_user: User = Depends(get_current_user),
):
    """Delete a journal entry."""
    entry = await JournalEntry.get(PydanticObjectId(journal_id))
    if entry is None or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")
    await entry.delete()
