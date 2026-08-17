from pydantic import BaseModel

class NutritionSummaryResponse(BaseModel):
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    remaining_calories: float
