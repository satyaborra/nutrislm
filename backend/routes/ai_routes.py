from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.rag_pipeline import get_rag_pipeline

router = APIRouter()

class RAGRequest(BaseModel):
    message: str

@router.post("/rag")
def handle_rag_query(request: RAGRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Missing 'message' in request body.")
        
    pipeline = get_rag_pipeline()
    result = pipeline.process(request.message)
    
    return result
