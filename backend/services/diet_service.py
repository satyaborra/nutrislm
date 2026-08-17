from sqlalchemy.orm import Session
from models.diet_plan import DietPlan
from models.user import User
from schemas.diet_schema import DietPlanRequest
from ai.rag_pipeline import rag_pipeline
from ai.slm_model import slm
import json
import asyncio
from datetime import datetime

async def generate_diet_plan(db: Session, user: User, request: DietPlanRequest):
    # 1. Get guidelines using RAG
    context = rag_pipeline.retrieve_context("diet plans daily guidelines", top_k=2)
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    prompt = f"""Create a highly personalized daily diet plan for someone who specifies: '{request.preferences}'. 
Return ONLY a valid raw JSON object (no markdown, no backticks, no comments) exactly matching this interface:
{{
  "id": "gen-1",
  "date": "{today_str}",
  "breakfast": {{ "id": "b1", "name": "...", "description": "...", "calories": 300, "macros": {{ "protein": 20, "carbs": 30, "fat": 10 }} }},
  "lunch": {{ "id": "l1", "name": "...", "description": "...", "calories": 400, "macros": {{ "protein": 30, "carbs": 40, "fat": 15 }} }},
  "dinner": {{ "id": "d1", "name": "...", "description": "...", "calories": 500, "macros": {{ "protein": 40, "carbs": 20, "fat": 20 }} }},
  "snacks": [
    {{ "id": "s1", "name": "...", "description": "...", "calories": 200, "macros": {{ "protein": 10, "carbs": 20, "fat": 10 }} }}
  ],
  "totalCalories": 1400,
  "totalMacros": {{ "protein": 100, "carbs": 110, "fat": 55 }}
}}
Ensure the macros roughly add up correctly."""
    
    response_text = await slm.generate_response(prompt, context)
    
    try:
        cleaned = response_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned)
    except Exception as e:
        print(f"Failed to parse Mistral JSON: {e}. Raw response: {response_text}")
        # Default fallback structure so frontend doesn't crash
        data = {
          "id": "mock-fallback", "date": today_str,
          "breakfast": {"id": "b1", "name": "Oatmeal", "description": "Simple oats.", "calories": 300, "macros": {"protein": 10, "carbs": 50, "fat": 5}},
          "lunch": {"id": "l1", "name": "Chicken Salad", "description": "A light salad.", "calories": 400, "macros": {"protein": 30, "carbs": 20, "fat": 15}},
          "dinner": {"id": "d1", "name": "Salmon", "description": "Baked salmon.", "calories": 500, "macros": {"protein": 40, "carbs": 10, "fat": 20}},
          "snacks": [{"id": "s1", "name": "Almonds", "description": "Handful of almonds.", "calories": 200, "macros": {"protein": 6, "carbs": 6, "fat": 14}}],
          "totalCalories": 1400, "totalMacros": {"protein": 86, "carbs": 86, "fat": 54}
        }
    
    try:
        from services.ai_service import generate_meal_insight
        user_context_payload = {"goal": request.preferences}
        
        tasks_map = {}
        if "breakfast" in data: tasks_map["breakfast"] = generate_meal_insight(data["breakfast"], user_context_payload)
        if "lunch" in data: tasks_map["lunch"] = generate_meal_insight(data["lunch"], user_context_payload)
        if "dinner" in data: tasks_map["dinner"] = generate_meal_insight(data["dinner"], user_context_payload)
        
        snacks_tasks = []
        if "snacks" in data:
            for s in data["snacks"]:
                snacks_tasks.append(generate_meal_insight(s, user_context_payload))
                
        # Await primary meals
        meals_keys = list(tasks_map.keys())
        meals_results = await asyncio.gather(*(tasks_map[k] for k in meals_keys), return_exceptions=True)
        for i, k in enumerate(meals_keys):
            if not isinstance(meals_results[i], Exception):
                data[k]["ai_insight"] = meals_results[i]
                
        # Await snacks
        if snacks_tasks:
            snacks_results = await asyncio.gather(*snacks_tasks, return_exceptions=True)
            for i, s in enumerate(data["snacks"]):
                if not isinstance(snacks_results[i], Exception):
                    s["ai_insight"] = snacks_results[i]

    except Exception as e:
        print(f"Failed to attach AI insights concurrently: {e}")
    
    try:
        # Save flattened versions to database to satisfy SQL schema constraints
        plan = DietPlan(
            user_id=user.id,
            breakfast=data["breakfast"]["name"],
            lunch=data["lunch"]["name"],
            dinner=data["dinner"]["name"],
            snacks=data["snacks"][0]["name"] if data["snacks"] else "None",
            total_calories=data["totalCalories"]
        )
        db.add(plan)
        db.commit()
    except Exception as dbe:
        print(f"Database save ignored for Diet Plan due to constraint schema mismatch: {dbe}")
    
    return data
