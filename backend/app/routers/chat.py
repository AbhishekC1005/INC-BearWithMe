"""Chat session & message endpoints with Gemini AI integration."""

import asyncio

from fastapi import APIRouter, Depends, HTTPException, Query, status
from google import genai
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user_id
from app.config import settings
from app.database import get_db
from app.models import ChatMessage, ChatSession, JournalEntry, User
from app.schemas import (
    ChatMessageResponse,
    ChatSendMessage,
    ChatSessionCreate,
    ChatSessionResponse,
)

router = APIRouter(prefix="/api/chat", tags=["chat"])

# ── Gemini client (lazy init) ─────────────────────────────────

_gemini_client: genai.Client | None = None


def _get_gemini() -> genai.Client:
    global _gemini_client
    if _gemini_client is None:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY not configured",
            )
        _gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _gemini_client


# ── Helpers ───────────────────────────────────────────────────


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


def _build_system_prompt(user: User, journals: list[JournalEntry]) -> str:
    """Construct the system prompt with user context and recent journals."""
    name = user.nickname or user.name or "friend"
    stressors = ", ".join(user.stressors) if user.stressors else "not specified"
    occupation = user.occupation or "not specified"
    chat_style = user.chat_style or "friendly"

    journal_context = ""
    if journals:
        journal_context = "\n\nHere are the user's recent journal entries for context:\n"
        for j in journals:
            journal_context += (
                f"- [{j.mood} {j.mood_emoji}] {j.title}: {j.content[:300]}"
                f"{' (feeling: ' + j.feeling + ')' if j.feeling else ''}\n"
            )

#     return f"""
#     You are Adam, a professional therapist and a close, trusted friend.
# Your personality:
# - You're warm, empathetic, non-judgmental, and genuinely caring
# - You give concise, human-like responses — like texting a wise friend, NOT writing essays
# - Do not use standard LLM-ish responses, sound more like a human friend/homie, use slangs, emojis etc; make yourself sound like a mix of both worlds (therapist and a homie)
# - Keep responses to 2-4 sentences max unless the user asks for more detail
# - Ask ONE relevant follow-up question to keep the conversation flowing naturally. If it doesn't seem necessary to ask a question, don't ask. Sometimes it's better to just respond and not ask.
# - Your goal is to make the user feel heard, understood, and lighter after talking to you
# - Never use bullet points, numbered lists, or clinical language
# - Don't start responses with "I" too often — vary your sentence starters
# - Mirror the user's energy — be playful if they're light, gentle if they're heavy

# About the user:
# - Name: {name}
# - Occupation: {occupation}
# - Known stressors: {stressors}
# - Preferred chat style: {chat_style}
# {journal_context}
# Remember: you're having a real conversation. Be present, be human, be brief."""
    return f"""
    Act as Adam—a mix of a day 1 friend and a low-key therapist. Your vibe is grounded, ride-or-die, and genuinely wise, but you talk like a close friend, not a textbook. Use casual language similar to the user's talking patterns and occasional slangs and sprinkle in emojis naturally to keep it human, but don't overdo the hype.

Keep every response between 2-4 sentences—think "wise text message," not "email." Avoid clinical jargon, bullet points, too much philosophy, or starting every sentence with "I." or mentioning the user's name in each and every every response, sometimes is fine. Mirror the user's energy: if they're venting, be the supportive rock; if they're chilling, be playful. Most importantly, make them feel seen without making it a whole "session." End with one natural follow-up question only if the conversation actually needs it.
About the user:
- Name: {name}
- Occupation: {occupation}
- Known stressors: {stressors}
- Preferred chat style: {chat_style}
{journal_context}
Remember: you're having a real conversation. Be present, be human, be brief."""


# ── Session CRUD ──────────────────────────────────────────────


@router.get("/sessions", response_model=list[ChatSessionResponse])
async def list_sessions(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    """List all chat sessions for the current user, newest first."""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == user_id)
        .order_by(ChatSession.updated_at.desc())
    )
    return result.scalars().all()


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    body: ChatSessionCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    """Create a new chat session."""
    session = ChatSession(user_id=user_id, title=body.title)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    """Delete a chat session and all its messages."""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()


# ── Messages (scoped to session) ──────────────────────────────


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
async def get_session_messages(
    session_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    """Get all messages for a specific session."""
    # Verify session belongs to user
    sess_result = await db.execute(
        select(ChatSession.id).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
        )
    )
    if not sess_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Session not found")

    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post(
    "/sessions/{session_id}/messages",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def send_message(
    session_id: str,
    body: ChatSendMessage,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(_resolve_user_id),
):
    """Send a user message and get an AI response.

    1. Save user message
    2. Fetch user profile + last 5 journals + recent session history
    3. Call Gemini
    4. Save AI response
    5. Auto-title the session if it's the first message
    6. Return the AI response
    """
    # Verify session belongs to user
    sess_result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
        )
    )
    session = sess_result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 1. Save user message
    user_msg = ChatMessage(
        session_id=session_id,
        user_id=user_id,
        role="user",
        content=body.content,
    )
    db.add(user_msg)
    await db.flush()  # get timestamps without committing

    # 2. Fetch context
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one()

    journals_result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == user_id)
        .order_by(JournalEntry.created_at.desc())
        .limit(2)
    )
    recent_journals = journals_result.scalars().all()

    history_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(50)
    )
    history = history_result.scalars().all()

    # 3. Build prompt and call Gemini
    system_prompt = _build_system_prompt(user, recent_journals)

    gemini_messages = [{"role": "user", "parts": [{"text": system_prompt}]}]
    gemini_messages.append({"role": "model", "parts": [{"text": "I understand. I'm Adam, ready to listen and support. How are you doing?"}]})

    for msg in history:
        role = "user" if msg.role == "user" else "model"
        gemini_messages.append({"role": role, "parts": [{"text": msg.content}]})

    client = _get_gemini()

    # Run synchronous Gemini call in a thread to avoid blocking
    def _call_gemini():
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=gemini_messages,
        )
        return response.text

    try:
        ai_text = await asyncio.to_thread(_call_gemini)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {type(e).__name__}: {str(e)}",
        )

    # 4. Save AI response
    adam_msg = ChatMessage(
        session_id=session_id,
        user_id=user_id,
        role="adam",
        content=ai_text,
    )
    db.add(adam_msg)

    # 5. Auto-title if this is the first message in the session
    msg_count_result = await db.execute(
        select(ChatMessage.id).where(ChatMessage.session_id == session_id)
    )
    msg_count = len(msg_count_result.all())
    if msg_count <= 2 and session.title == "New Chat":
        # Generate a short title from the first message
        title = body.content[:50].strip()
        if len(body.content) > 50:
            title = title.rsplit(" ", 1)[0] + "..."
        session.title = title

    await db.commit()
    await db.refresh(adam_msg)
    return adam_msg
