"""Chat message endpoints."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import ChatMessage
from app.routers.users import _get_dev_user_id
from app.schemas import ChatMessageCreate, ChatMessageResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/messages", response_model=list[ChatMessageResponse])
async def get_chat_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_get_dev_user_id),
):
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.asc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post("/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    body: ChatMessageCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_get_dev_user_id),
):
    message = ChatMessage(user_id=user_id, **body.model_dump())
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


@router.delete("/messages", status_code=status.HTTP_204_NO_CONTENT)
async def clear_chat(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_get_dev_user_id),
):
    await db.execute(
        delete(ChatMessage).where(ChatMessage.user_id == user_id)
    )
    await db.commit()
