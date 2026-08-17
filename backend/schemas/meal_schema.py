from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MealAnalyzeRequest(BaseModel):
    text: str

class MealResponse(BaseModel):
    id: int
    name: str
    food_items: List[str]
    calories: float
    protein: float
    carbs: float
    fat: float
    explanation: Optional[str] = None # Added via SLM response
    created_at: datetime

    class Config:
        from_attributes = True
