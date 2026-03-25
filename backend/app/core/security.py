"""JWT creation / verification and Google ID token validation."""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from app.config import settings


# ── JWT helpers ──────────────────────────────────────────────────────────────

def create_access_token(subject: str) -> str:
    """Create a short-lived access token."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str) -> str:
    """Create a long-lived refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": subject, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT.  Raises JWTError on failure."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


# ── Google OAuth ─────────────────────────────────────────────────────────────

def verify_google_token(token: str) -> dict:
    """Verify a Google ID token and return the payload.

    Returns a dict with keys like 'email', 'name', 'picture', 'sub'.
    Raises ValueError if the token is invalid.
    """
    return google_id_token.verify_oauth2_token(
        token,
        google_requests.Request(),
        audience=settings.GOOGLE_CLIENT_ID,
    )
