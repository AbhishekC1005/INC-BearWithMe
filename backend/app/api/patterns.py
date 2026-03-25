"""Patterns API routes."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.pattern import Pattern

router = APIRouter()


@router.get("")
async def list_patterns(
    current_user: User = Depends(get_current_user),
):
    """Return AI-detected patterns for the current user."""
    patterns = await Pattern.find(Pattern.user_id == current_user.id).to_list()
    return [
        {
            "id": str(p.id),
            "type": p.type,
            "description": p.description,
            "frequency": p.frequency,
            "detected_at": p.detected_at.isoformat(),
        }
        for p in patterns
    ]
