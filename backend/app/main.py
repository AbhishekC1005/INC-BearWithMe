"""BearWithMe — FastAPI entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import chat, journals, moods, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup and seed a Demo User."""
    from app.database import engine, Base, AsyncSessionLocal
    from app.models import User
    from sqlalchemy.future import select

    # Initialize tables natively
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Auto-seed the Demo User for bypassed API auth
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.firebase_uid == "demo_user_123"))
        demo_user = result.scalar_one_or_none()
        if not demo_user:
            demo_user = User(
                firebase_uid="demo_user_123",
                name="Demo User",
                email="demo@bearwithme.com",
                is_onboarded=True
            )
            session.add(demo_user)
            await session.commit()
            
    yield


app = FastAPI(
    title="BearWithMe API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(journals.router)
app.include_router(moods.router)
app.include_router(chat.router)


from pydantic import BaseModel

class TestRequest(BaseModel):
    message: str

@app.post("/test-chat")
async def test_chat_unauthenticated(body: TestRequest):
    """Temporary test endpoint bypassing Firebase Auth and DB."""
    from google import genai
    from app.config import settings
    
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{"role": "user", "parts": [{"text": body.message}]}]
    )
    return {"reply": response.text}

@app.get("/health")
async def health():
    return {"status": "ok"}
