from pydantic import BaseModel
from datetime import datetime

class DietPlanRequest(BaseModel):
    preferences: str = ""

class DietPlanResponse(BaseModel):
    id: int
    breakfast: str
    lunch: str
    dinner: str
    snacks: str
    total_calories: int
    created_at: datetime

    class Config:
        from_attributes = True
