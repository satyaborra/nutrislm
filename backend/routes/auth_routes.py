from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.user_schema import UserCreate, UserResponse
from schemas.auth_schema import LoginRequest, SocialLoginRequest, TokenResponse
from services import auth_service, user_service

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user_data)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.authenticate_user(db, request)

@router.post("/google", response_model=TokenResponse)
def google_login(request: SocialLoginRequest, db: Session = Depends(get_db)):
    return auth_service.authenticate_google(db, request)

@router.post("/facebook", response_model=TokenResponse)
def facebook_login(request: SocialLoginRequest, db: Session = Depends(get_db)):
    return auth_service.authenticate_facebook(db, request)
