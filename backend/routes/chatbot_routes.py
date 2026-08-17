from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user
from services.chatbot_service import get_chatbot_response, ChatRequest
from services.ai_service import generate_ai_response
from pydantic import BaseModel
from typing import Dict, Any, Optional

router = APIRouter()

class AdvancedChatRequest(BaseModel):
    message: str
    user_context: Optional[Dict[str, Any]] = None

@router.post("/chat")
def chat_with_ai_legacy(request: ChatRequest):
    return get_chatbot_response(request)

@router.post("/ai-chat")
async def advanced_multi_model_chat(request: AdvancedChatRequest):
    rag_result = await generate_ai_response(request.message, request.user_context)
    
    # Return the full RAGResult, but also keep 'reply' for backwards compatibility
    response = dict(rag_result)
    response["reply"] = rag_result.get("answer", "")
    
    return response
