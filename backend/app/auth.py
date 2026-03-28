"""Firebase Auth dependency — verifies ID tokens on every request."""

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

# ── Firebase Admin SDK initialisation (once) ──────────────────

_bearer_scheme = HTTPBearer(auto_error=False)

if not firebase_admin._apps:
    if settings.FIREBASE_CREDENTIALS_PATH:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    else:
        # Falls back to GOOGLE_APPLICATION_CREDENTIALS env var
        firebase_admin.initialize_app()


# ── Dependency ────────────────────────────────────────────────

async def get_current_user_id(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> str:
    """Verify the Firebase ID token and return the uid.
    
    DEMO MODE ACTIVE: This unconditionally bypasses Firebase security
    and forces the entire backend to use a single mock user profile.
    """
    return "demo_user_123"
