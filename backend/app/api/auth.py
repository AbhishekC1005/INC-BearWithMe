"""Auth API routes."""

from fastapi import APIRouter, HTTPException, status
from jose import JWTError

from app.schemas.auth import GoogleAuthRequest, TokenResponse, RefreshRequest
from app.services.auth_service import google_login
from app.core.security import decode_token, create_access_token

router = APIRouter()


@router.post("/google", response_model=TokenResponse)
async def auth_google(body: GoogleAuthRequest):
    """Exchange a Google ID token for JWT credentials."""
    try:
        return await google_login(body.id_token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {exc}",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest):
    """Exchange a refresh token for a new access token."""
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired or invalid")

    return TokenResponse(
        access_token=create_access_token(subject=email),
        refresh_token=body.refresh_token,  # re-use same refresh token
    )
