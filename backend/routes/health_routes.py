from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import User
from auth.dependencies import get_current_user
from services.health_service import calculate_health_summary

router = APIRouter()

@router.get("/health-summary")
def get_health_summary(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return calculate_health_summary(db, current_user)
