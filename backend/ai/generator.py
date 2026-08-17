import os
import httpx

class Generator:
    def __init__(self):
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.api_url = "https://api.mistral.ai/v1/chat/completions"
        self.model = "mistral-small"
        
    async def generate(self, query: str, context: list) -> str:
        if not self.api_key:
            return "Error: Mistral API key is not set. Please set MISTRAL_API_KEY environment variable."
            
        context_str = "\n\n".join(context)
        
        prompt =f"""You are a helpful and intelligent AI assistant.
Answer ONLY using the provided context. Follow these rules:
- If the answer is not found in the context, explicitly say "I don't know based on the provided context".
- Do not hallucinate or make up facts.

Context:
{context_str}

User Question: {query}
"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.0,
            "max_tokens": 512
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                print("[RAG] Mistral Response: success")
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[RAG] Mistral Response: failure. Error: {e}")
            return f"Error connecting to AI service. Details: {str(e)}"
