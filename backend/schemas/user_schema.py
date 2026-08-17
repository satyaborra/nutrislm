from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    auth_provider: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    healthGoal: Optional[str] = None
    gender: Optional[str] = None
    activityLevel: Optional[str] = None
    target_weight: Optional[float] = None
    healthCondition: Optional[str] = None

class HealthProfileResponse(BaseModel):
    weight: Optional[float]
    height: Optional[float]
    goal: Optional[str]
    target_weight: Optional[float]
    healthCondition: Optional[str]

class HealthProfileUpdate(BaseModel):
    weight: Optional[float] = None
    height: Optional[float] = None
    goal: Optional[str] = None
    target_weight: Optional[float] = None
    healthCondition: Optional[str] = None
