from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.user_schema import UserResponse, UserUpdate, HealthProfileResponse, HealthProfileUpdate
from models.user import User
from auth.dependencies import get_current_user
from services import user_service

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return user_service.update_user(db, current_user.id, user_data)

@router.get("/health-profile", response_model=HealthProfileResponse)
def get_health_profile(current_user: User = Depends(get_current_user)):
    return {
        "weight": current_user.weight,
        "height": current_user.height,
        "goal": current_user.healthGoal,
        "target_weight": current_user.target_weight,
        "healthCondition": current_user.healthCondition
    }

@router.put("/health-profile", response_model=HealthProfileResponse)
def update_health_profile(
    data: HealthProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(f"[HEALTH] Updated payload received: {data.dict()}")
    if data.weight is not None: current_user.weight = data.weight
    if data.height is not None: current_user.height = data.height
    if data.goal is not None: current_user.healthGoal = data.goal
    if data.target_weight is not None: current_user.target_weight = data.target_weight
    if data.healthCondition is not None: current_user.healthCondition = data.healthCondition
    
    db.commit()
    db.refresh(current_user)
    print(f"[HEALTH] Updated weight: {current_user.weight}, condition: {current_user.healthCondition}")
    
    return {
        "weight": current_user.weight,
        "height": current_user.height,
        "goal": current_user.healthGoal,
        "target_weight": current_user.target_weight,
        "healthCondition": current_user.healthCondition
    }
