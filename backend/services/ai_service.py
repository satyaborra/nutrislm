import os
import httpx
from typing import Dict, Any, Optional

from ai.rag_router import rag_router

async def generate_ai_response(query: str, user_context: Optional[Dict[str, Any]] = None, mode: str = 'auto') -> Dict[str, Any]:
    # 1. Use the new RagRouter to handle processing
    rag_result = await rag_router.process(mode, query, user_context)
    
    # 2. Return the serialized RAGResult
    return {
        "answer": rag_result.answer,
        "grounded": rag_result.grounded,
        "retrievalStatus": rag_result.retrievalStatus,
        "evidence": [e.model_dump() for e in rag_result.evidence],
        "model": rag_result.model
    }


async def generate_meal_insight(meal: Dict[str, Any], user_context: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    prompt = f"""You are an expert AI nutritionist.
Generate ONE concise, insightful, and non-repetitive explanation for why this meal is beneficial.

Meal Info:
- Name: {meal.get('name', 'Unknown meal')}
- Calories: {meal.get('calories', 0)}
- Macros: {meal.get('macros', {})}

Context: {user_context}

Rules:
- Be specific and contextual.
- Use scientific reasoning (simple language).
- Keep it 1-2 lines max.
- Avoid generic phrases like 'healthy' or 'balanced diet'.
- Focus on: metabolism, fat loss efficiency, satiety, muscle preservation, energy levels, or behavioral patterns.

Return ONLY valid JSON matching this exact format exactly (no backticks, no markdown):
{{
  "insight": "short explanation",
  "category": "metabolism" 
}}
Category must be one of: metabolism, fat_loss, satiety, muscle, timing, behavior, hydration.
"""
    system_prompt = "You are an expert AI nutritionist returning ONLY raw valid JSON."
    
    import json
    # Try mistral explicitly
    mistral_key = os.getenv("MISTRAL_API_KEY")
    if mistral_key:
        try:
            url = "https://api.mistral.ai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {mistral_key}", "Content-Type": "application/json"}
            payload = {
                "model": "mistral-small",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4
            }
            async with httpx.AsyncClient() as client:
                res = await client.post(url, headers=headers, json=payload, timeout=10.0)
                res.raise_for_status()
                content = res.json()["choices"][0]["message"]["content"]
                cleaned = content.replace("```json", "").replace("```", "").strip()
                return json.loads(cleaned)
        except Exception as e:
            print(f"Mistral insight failed: {e}")

    # Fallback default
    return {"insight": "Selected for optimal macronutrient absorption and sustained energy delivery tailored to your metabolic profile.", "category": "timing"}
