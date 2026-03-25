"""Auth service — Google OAuth flow and user upsert."""

from app.core.security import verify_google_token, create_access_token, create_refresh_token
from app.models.user import User
from app.schemas.auth import TokenResponse


async def google_login(id_token: str) -> TokenResponse:
    """Verify a Google ID token and return JWT credentials.

    Creates the user document on first login (upsert).
    """
    payload = verify_google_token(id_token)

    email = payload["email"]
    name = payload.get("name", "")
    picture = payload.get("picture")

    # Upsert – create if not exists, update profile pic + name on each login
    user = await User.find_one(User.email == email)
    if user is None:
        user = User(email=email, name=name, avatar_url=picture)
        await user.insert()
    else:
        user.name = name
        if picture:
            user.avatar_url = picture
        await user.save()

    return TokenResponse(
        access_token=create_access_token(subject=email),
        refresh_token=create_refresh_token(subject=email),
    )
