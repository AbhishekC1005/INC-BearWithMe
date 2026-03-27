"""User endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user_id
from app.database import get_db
from app.models import User
from app.schemas import UserCheckResponse, UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def bootstrap_user(
    body: UserCreate,
    db: AsyncSession = Depends(get_db),
    firebase_uid: str = Depends(get_current_user_id),
):
    """Idempotent user bootstrap.

    - If the firebase_uid already exists → return the existing user (200).
    - If not → create a minimal record and return it (201).

    This is NOT the onboarding endpoint. It only ensures a DB row exists
    for the authenticated Firebase user.
    """
    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_uid)
    )
    user = result.scalar_one_or_none()

    if user:
        # Already exists — return as-is (override 201 → 200)
        from fastapi.responses import JSONResponse
        return JSONResponse(
            content=UserResponse.model_validate(user).model_dump(mode="json"),
            status_code=200,
        )

    # Create minimal user record
    user = User(
        firebase_uid=firebase_uid,
        name=body.name,
        email=body.email,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/check", response_model=UserCheckResponse)
async def check_user(
    db: AsyncSession = Depends(get_db),
    firebase_uid: str = Depends(get_current_user_id),
):
    """Check whether the authenticated Firebase user has a DB record.

    Returns { exists: bool, is_onboarded: bool }.
    Used by the frontend SplashScreen & Login/SignUp to decide routing.
    """
    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_uid)
    )
    user = result.scalar_one_or_none()

    if user:
        return UserCheckResponse(exists=True, is_onboarded=user.is_onboarded)
    return UserCheckResponse(exists=False, is_onboarded=False)


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    firebase_uid: str = Depends(get_current_user_id),
):
    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_uid)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    firebase_uid: str = Depends(get_current_user_id),
):
    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_uid)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user
