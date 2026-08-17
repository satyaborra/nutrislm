from sqlalchemy.orm import Session
import json
from models.meal import Meal
from schemas.meal_schema import MealAnalyzeRequest
from ai.food_extraction import extract_food_entities
from ai.nutrition_analyzer import nutrition_analyzer_engine
from ai.slm_model import slm
from models.user import User

def analyze_and_store_meal(db: Session, user: User, request: MealAnalyzeRequest):
    # Ask Mistral to act as the extraction engine
    prompt = f"""You are an expert nutritionist AI. The user ate: '{request.text}'.
Analyze the meal and return ONLY a raw JSON object (no markdown formatting, no comments) containing exactly these keys:
"food_items" (list of strings), "calories" (number), "protein" (number), "carbs" (number), "fat" (number), "explanation" (1 sentence short health summary)."""

    response_text = slm.generate_response(prompt)
    
    try:
        # Clean potential markdown wrappers from Mistral
        cleaned = response_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned)
    except Exception as e:
        print(f"Failed to parse Mistral JSON: {e}. Raw response: {response_text}")
        data = {
            "food_items": [request.text],
            "calories": 0, "protein": 0, "carbs": 0, "fat": 0,
            "explanation": "Could not analyze this meal."
        }
        
    # Save to DB
    meal = Meal(
        user_id=user.id,
        name=request.text[:50],
        food_items_raw=",".join(data.get("food_items", [])),
        calories=data.get("calories", 0),
        protein=data.get("protein", 0),
        carbs=data.get("carbs", 0),
        fat=data.get("fat", 0)
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    
    return {
        "id": meal.id,
        "name": meal.name,
        "food_items": data.get("food_items", []),
        "calories": meal.calories,
        "protein": meal.protein,
        "carbs": meal.carbs,
        "fat": meal.fat,
        "explanation": data.get("explanation", ""),
        "created_at": meal.created_at
    }
