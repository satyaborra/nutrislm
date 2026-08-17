from ai.rag_pipeline import rag_pipeline
from ai.slm_model import slm
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

def get_chatbot_response(request: ChatRequest):
    # 1. RAG retrieval
    context = rag_pipeline.retrieve_context(request.message, top_k=3)
    
    # 2. SLM logic
    answer = slm.generate_response(request.message, context)
    
    return {
        "answer": answer,
        "evidence_sources": [context] if context else []
    }
