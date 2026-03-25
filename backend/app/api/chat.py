"""Chat API routes — SSE streaming for Adam responses."""

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from beanie import PydanticObjectId
from sse_starlette.sse import EventSourceResponse

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse, ChatSessionResponse
from app.services.adam_agent import stream_adam_response

router = APIRouter()


# ── Helpers ──────────────────────────────────────────────────────────────────

def _msg_to_response(msg: ChatMessage) -> ChatMessageResponse:
    return ChatMessageResponse(
        id=str(msg.id),
        role=msg.role,
        content=msg.content,
        timestamp=msg.timestamp,
    )


async def _get_or_create_session(
    session_id: str | None,
    user: User,
) -> ChatSession:
    """Return an existing session or create a new one."""
    if session_id:
        session = await ChatSession.get(PydanticObjectId(session_id))
        if session and session.user_id == user.id:
            return session
    session = ChatSession(user_id=user.id)
    await session.insert()
    return session


# ── Routes ───────────────────────────────────────────────────────────────────

@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
async def create_session(current_user: User = Depends(get_current_user)):
    """Create a new chat session."""
    session = ChatSession(user_id=current_user.id)
    await session.insert()
    return ChatSessionResponse(
        id=str(session.id),
        created_at=session.created_at,
        last_message_at=session.last_message_at,
    )


@router.post("/send")
async def send_message(
    body: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
):
    """Send a message to Adam and receive a streamed SSE response.

    Each SSE event contains a JSON payload: {"token": "..."}.
    The final event contains {"done": true, "message_id": "..."}.
    """
    session = await _get_or_create_session(body.session_id, current_user)

    # Persist the user's message
    user_msg = ChatMessage(
        session_id=session.id,
        user_id=current_user.id,
        role="user",
        content=body.content,
    )
    await user_msg.insert()

    # Update session timestamp
    session.last_message_at = datetime.now(timezone.utc)
    await session.save()

    async def event_generator():
        full_response = []
        try:
            async for token in stream_adam_response(
                user=current_user,
                user_message=body.content,
                session_id=str(session.id),
            ):
                full_response.append(token)
                yield {"data": json.dumps({"token": token})}
        except Exception as exc:
            yield {"data": json.dumps({"error": str(exc)})}
            return

        # Persist Adam's full response
        adam_content = "".join(full_response)
        adam_msg = ChatMessage(
            session_id=session.id,
            user_id=current_user.id,
            role="adam",
            content=adam_content,
        )
        await adam_msg.insert()

        yield {"data": json.dumps({"done": True, "message_id": str(adam_msg.id)})}

    return EventSourceResponse(event_generator())


@router.get("/history", response_model=list[ChatMessageResponse])
async def get_history(
    session_id: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
):
    """Get chat message history.

    If session_id is provided, returns messages for that session.
    Otherwise returns all messages for the user (most recent first).
    """
    query = {"user_id": current_user.id}
    if session_id:
        query["session_id"] = PydanticObjectId(session_id)

    messages = (
        await ChatMessage.find(query)
        .sort("timestamp")
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [_msg_to_response(m) for m in messages]


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_history(
    current_user: User = Depends(get_current_user),
):
    """Delete all chat messages and sessions for the current user."""
    await ChatMessage.find(ChatMessage.user_id == current_user.id).delete()
    await ChatSession.find(ChatSession.user_id == current_user.id).delete()
