import os
import httpx

class SLMModel:
    def __init__(self):
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.api_url = "https://api.mistral.ai/v1/chat/completions"
        self.model = "mistral-small"

    async def generate_response(self, prompt: str, context: str = "") -> str:
        if not self.api_key:
            return "Server Error: MISTRAL_API_KEY is not configured."

        full_prompt = f"System Context: {context}\n\nUser Query: {prompt}" if context else prompt
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": full_prompt}],
            "temperature": 0.7,
            "max_tokens": 1024
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Mistral SLM Error: {e}")
            return "I am currently running in offline mock mode because the Mistral API is unreachable."
        
        return "I am currently running in offline mock mode because the Mistral API is unreachable."

slm = SLMModel()
