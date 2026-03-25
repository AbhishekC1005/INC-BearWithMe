"""Users API routes."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, OnboardingUpdate

router = APIRouter()


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        nickname=user.nickname,
        avatar_url=user.avatar_url,
        birthday=user.birthday,
        gender=user.gender,
        chat_style=user.chat_style,
        occupation=user.occupation,
        sleep_time=user.sleep_time,
        wake_time=user.wake_time,
        stressors=user.stressors,
        is_onboarded=user.is_onboarded,
        created_at=user.created_at,
    )


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return _user_to_response(current_user)


@router.put("/me", response_model=UserResponse)
async def update_profile(
    body: OnboardingUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update profile fields (general purpose)."""
    update_data = body.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    await current_user.save()
    return _user_to_response(current_user)


@router.put("/me/onboarding", response_model=UserResponse)
async def complete_onboarding(
    body: OnboardingUpdate,
    current_user: User = Depends(get_current_user),
):
    """Save onboarding data (Steps 1-3) and mark as onboarded."""
    update_data = body.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    current_user.is_onboarded = True
    await current_user.save()
    return _user_to_response(current_user)
