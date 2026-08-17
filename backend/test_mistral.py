import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

async def test_mistral():
    api_key = os.getenv("MISTRAL_API_KEY")
    api_url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    user_prompt = """You are a professional nutritionist AI.

Analyze the following meal and return ONLY valid JSON.

Meal: 1 apple and 2 eggs

Return format:
{
"calories": number,
"protein": number,
"carbs": number,
"fat": number,
"fiber": number,
"suggestion": "string"
}

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
            {"role": "system", "content": "You are a certified nutritionist. Provide accurate and safe dietary analysis."},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, headers=headers, json=payload, timeout=30.0)
            with open("test_out_py.txt", "w", encoding="utf-8") as f:
                f.write(response.text)
            print("Done")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_mistral())
