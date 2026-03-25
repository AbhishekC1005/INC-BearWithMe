"""FastAPI application factory."""

import sys
from pathlib import Path

# Support running `python main.py` directly from within the `app/` directory
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hook."""
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="BearWithMe API",
    version="0.1.0",
    description="Mental wellness companion backend",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}


# ── Register routers ─────────────────────────────────────────────────────────

from app.api.auth import router as auth_router       # noqa: E402
from app.api.users import router as users_router      # noqa: E402
from app.api.journals import router as journals_router # noqa: E402
from app.api.moods import router as moods_router      # noqa: E402
from app.api.chat import router as chat_router        # noqa: E402
from app.api.patterns import router as patterns_router # noqa: E402

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(journals_router, prefix="/api/v1/journals", tags=["Journals"])
app.include_router(moods_router, prefix="/api/v1/moods", tags=["Moods"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(patterns_router, prefix="/api/v1/patterns", tags=["Patterns"])


if __name__ == "__main__":
    import uvicorn
    # If run directly as a script, start uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
