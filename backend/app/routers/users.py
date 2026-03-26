"""User endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


# Temporary dev helper — returns a fixed user ID.
# Will be replaced by Firebase auth in Phase 4.
DEV_USER_ID: str | None = None


async def _get_dev_user_id() -> str:
    """Return the dev user ID (set after first user creation)."""
    if DEV_USER_ID is None:
        raise HTTPException(status_code=401, detail="No user created yet. POST /api/users first.")
    return DEV_USER_ID


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)):
    user = User(**body.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Store for dev convenience
    global DEV_USER_ID
    DEV_USER_ID = user.id

    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_get_dev_user_id),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_get_dev_user_id),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user
