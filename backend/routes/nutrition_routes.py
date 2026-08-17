from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import User
from auth.dependencies import get_current_user
from schemas.meal_schema import MealAnalyzeRequest, MealResponse
from services.nutrition_service import analyze_and_store_meal

router = APIRouter()

@router.post("/analyze-meal", response_model=MealResponse)
def analyze_meal(
    request: MealAnalyzeRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return analyze_and_store_meal(db, current_user, request)
