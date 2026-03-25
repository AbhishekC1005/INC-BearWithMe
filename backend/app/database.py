"""Motor (async MongoDB driver) + Beanie ODM initialisation."""

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import settings

# Will be set at startup
client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    """Connect to MongoDB and initialise Beanie document models."""
    global client

    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]

    # Import all document models so Beanie can discover them
    from app.models.user import User
    from app.models.journal import JournalEntry
    from app.models.mood import MoodEntry
    from app.models.chat import ChatSession, ChatMessage
    from app.models.pattern import Pattern

    await init_beanie(
        database=db,
        document_models=[User, JournalEntry, MoodEntry, ChatSession, ChatMessage, Pattern],
    )


async def close_db() -> None:
    """Close the Motor client."""
    global client
    if client:
        client.close()
        client = None
