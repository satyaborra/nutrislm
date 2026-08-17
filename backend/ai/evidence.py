from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class EvidenceItem(BaseModel):
    id: str
    source: str
    document: str
    section: Optional[str] = None
    content: str
    relevanceScore: float
    evidenceType: str # e.g. 'nutrition', 'guideline'
    metadata: Dict[str, Any]

class RAGResult(BaseModel):
    answer: str
    grounded: bool
    retrievalStatus: str # e.g. 'SUCCESS', 'OFFLINE_MODEL_MISSING', 'INSUFFICIENT_EVIDENCE'
    evidence: List[EvidenceItem]
    model: str # e.g. 'phi3:mini', 'mistral-small'
