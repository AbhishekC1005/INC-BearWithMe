"""Adam — the AI wellness companion powered by LangChain / LangGraph.

Uses:
- LangGraph's `create_react_agent` for tool-calling agent loop
- MongoDB checkpointer for durable graph state
- Streaming token output via async generator
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import AsyncGenerator

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

from app.config import settings
from app.models.user import User
from app.models.journal import JournalEntry


# ── Tools available to Adam ──────────────────────────────────────────────────

@tool
async def get_current_date() -> str:
    """Return the current date and time in ISO format."""
    return datetime.now(timezone.utc).isoformat()


# ── LLM & Agent setup (lazy) ────────────────────────────────────────────────

_agent = None
_checkpointer = None
_tools = [get_current_date]


def _get_agent():
    """Lazily build the agent so the module can be imported without an API key."""
    global _agent, _checkpointer
    if _agent is None:
        if not settings.AI_API_KEY:
            raise ValueError(
                "Missing AI API key. Set NVIDIA_API_KEY in backend/.env to enable chat."
            )

        llm = ChatOpenAI(
            model=settings.AI_MODEL,
            temperature=settings.AI_TEMPERATURE,
            streaming=True,
            api_key=settings.AI_API_KEY,
            base_url=settings.AI_BASE_URL,
        )
        _checkpointer = MemorySaver()
        _agent = create_react_agent(
            model=llm,
            tools=_tools,
            checkpointer=_checkpointer,
        )
    return _agent


# ── System prompt builder ────────────────────────────────────────────────────

def _build_system_prompt(user: User, latest_journal: JournalEntry | None) -> str:
    """Construct a personalised system prompt for Adam."""
    stressors = ", ".join(user.stressors) if user.stressors else "none shared yet"
    journal_ctx = (
        f"Their latest journal entry says: \"{latest_journal.content}\""
        if latest_journal
        else "They haven't written a journal entry today."
    )

    return f"""You are Adam, a warm, emotionally intelligent mental wellness companion \
inside the BearWithMe app. You speak like a wise, caring friend.

About this user:
- Name: {user.nickname or user.name}
- Preferred chat style: {user.chat_style or "empathetic"}
- Known stressors: {stressors}
- Occupation: {user.occupation or "not shared"}

{journal_ctx}

Guidelines:
- Be warm but not overbearing. Ask thoughtful follow-up questions.
- Never give medical advice. Suggest professional help when appropriate.
- Keep responses concise (2-4 sentences usually).
- If the user seems in crisis, gently suggest reaching out to a helpline.
- Use simple, everyday language — no clinical jargon."""


# ── Public API ───────────────────────────────────────────────────────────────

async def stream_adam_response(
    user: User,
    user_message: str,
    session_id: str,
) -> AsyncGenerator[str, None]:
    """Stream Adam's response token-by-token.

    Yields individual text chunks as they arrive from the LLM.
    """
    # Fetch latest journal for context
    latest_journal = await JournalEntry.find_one(
        JournalEntry.user_id == user.id,
        sort=[("timestamp", -1)],  # type: ignore[arg-type]
    )

    system_prompt = _build_system_prompt(user, latest_journal)
    config = {"configurable": {"thread_id": session_id}}

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message),
    ]

    agent = _get_agent()
    async for event in agent.astream_events(
        {"messages": messages},
        config=config,
        version="v2",
    ):
        kind = event.get("event", "")
        if kind == "on_chat_model_stream":
            chunk = event["data"].get("chunk")
            if chunk and hasattr(chunk, "content") and chunk.content:
                yield chunk.content
