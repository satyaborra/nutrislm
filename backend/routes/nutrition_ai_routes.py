import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class NutritionAiRequest(BaseModel):
    meal: str

@router.post("/nutrition-ai")
async def analyze_nutrition_ai(request: NutritionAiRequest):
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="MISTRAL_API_KEY not found")

    api_url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    system_prompt = "You are a certified nutritionist. Provide accurate and safe dietary analysis."
    user_prompt = f"""You are a professional nutritionist AI.

Analyze the following meal and return ONLY valid JSON.

Meal: {request.meal}

Return format:
{{
"calories": number,
"protein": number,
"carbs": number,
"fat": number,
"fiber": number,
"suggestion": "string"
}}

Rules:
* Values must be realistic
* Units:
  calories in kcal
  macros in grams
* No extra text
* No explanation
* Only JSON output"""

    payload = {
        "model": "mistral-small",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
        
        cleaned = content.replace("```json", "").replace("```", "").strip()
        import json
        data = json.loads(cleaned)
        
        return {
            "calories": data.get("calories", 0),
            "protein": data.get("protein", 0),
            "carbs": data.get("carbs", 0),
            "fat": data.get("fat", 0),
            "fiber": data.get("fiber", 0),
            "suggestion": data.get("suggestion", "No suggestion available.")
        }
    except Exception as e:
        print(f"Nutrition AI Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze meal")
