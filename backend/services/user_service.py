from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.user import User
from schemas.user_schema import UserCreate, UserUpdate
from auth.jwt_handler import get_password_hash

def create_user(db: Session, user_data: UserCreate):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name, 
        email=user_data.email, 
        password_hash=hashed_pw,
        height=user_data.height,
        weight=user_data.weight,
        age=user_data.age,
        auth_provider="email"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_user(db: Session, user_id: int, user_data: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)
    return user
