from typing import List
from ai.evidence import EvidenceItem

class Reranker:
    def __init__(self, top_k=3):
        self.top_k = top_k
        
    def rerank(self, query: str, candidates: List[EvidenceItem]) -> List[EvidenceItem]:
        """
        Reranks the candidates based on semantic similarity, disease relevance, etc.
        For now, this simply sorts by the FAISS relevance score and returns the top_k.
        In a production system, this would use a Cross-Encoder or similar model.
        """
        if not candidates:
            return []
            
        # Sort by relevanceScore descending
        sorted_candidates = sorted(candidates, key=lambda x: x.relevanceScore, reverse=True)
        
        # Take the top K
        top_candidates = sorted_candidates[:self.top_k]
        
        print(f"[RAG] Reranked down to {len(top_candidates)} top chunks.")
        return top_candidates
