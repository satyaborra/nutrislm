from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.user import User
from schemas.auth_schema import LoginRequest, SocialLoginRequest
from auth.jwt_handler import verify_password, create_access_token
from auth.oauth_google import verify_google_token
from auth.oauth_facebook import verify_facebook_token

def authenticate_user(db: Session, request: LoginRequest):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(user.id), "name": user.name, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}

def authenticate_google(db: Session, request: SocialLoginRequest):
    if not verify_google_token(request.token):
        raise HTTPException(status_code=401, detail="Invalid Google token")
    # In reality, extract email from verified token
    email = request.email or "google@default.com"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=request.name or "Google User", auth_provider="google")
        db.add(user)
        db.commit()
        db.refresh(user)
    token = create_access_token(data={"sub": str(user.id), "name": user.name, "email": user.email})
    print(f"[AUTH] Issued JWT for user: {user.email}")
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}

def authenticate_facebook(db: Session, request: SocialLoginRequest):
    if not verify_facebook_token(request.token):
        raise HTTPException(status_code=401, detail="Invalid Facebook token")
    email = request.email or "facebook@default.com"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=request.name or "Facebook User", auth_provider="facebook")
        db.add(user)
        db.commit()
        db.refresh(user)
    token = create_access_token(data={"sub": str(user.id), "name": user.name, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}
