from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import LanguagePreference, UserRole


class RegisterRequest(BaseModel):
    event_password: str = Field(..., description="Shared event password")
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)
    email: EmailStr | None = None
    language: LanguagePreference = LanguagePreference.EN

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username may only contain letters, numbers, hyphens, and underscores")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str | None
    role: UserRole
    language: LanguagePreference

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_user(cls, user: object) -> "UserResponse":
        return cls(
            id=user.id,  # type: ignore[attr-defined]
            username=user.username,  # type: ignore[attr-defined]
            email=user.email,  # type: ignore[attr-defined]
            role=user.role,  # type: ignore[attr-defined]
            language=user.language_preference,  # type: ignore[attr-defined]
        )
