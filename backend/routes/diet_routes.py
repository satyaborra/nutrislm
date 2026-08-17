from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import User
from auth.dependencies import get_current_user
from schemas.diet_schema import DietPlanRequest, DietPlanResponse
from services.diet_service import generate_diet_plan

router = APIRouter()

@router.post("/diet-plan")
async def create_diet_plan(
    request: DietPlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await generate_diet_plan(db, current_user, request)
