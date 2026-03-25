"""Auth request / response schemas."""

from pydantic import BaseModel


class GoogleAuthRequest(BaseModel):
    """Payload sent by the React Native app after Google Sign-In."""
    id_token: str


class TokenResponse(BaseModel):
    """JWT token pair returned to the client."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    """Refresh token exchange."""
    refresh_token: str
