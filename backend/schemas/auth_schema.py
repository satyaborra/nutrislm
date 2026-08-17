from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SocialLoginRequest(BaseModel):
    token: str
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
