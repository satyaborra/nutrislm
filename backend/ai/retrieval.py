from ai.embeddings import get_embedding_manager
from ai.evidence import EvidenceItem
from typing import List

class Retriever:
    def __init__(self, top_k=10):
        self.manager = get_embedding_manager()
        self.top_k = top_k

    def retrieve(self, query: str, metadata_filters: dict = None) -> List[EvidenceItem]:
        """Retrieve relevant chunks, optionally pre-filtered by metadata."""
        if not self.manager.index or not self.manager.chunks:
            return []
            
        # 1. FAISS Semantic Search
        query_embedding = self.manager.encoder.encode([query], convert_to_numpy=True)
        k = min(self.top_k, len(self.manager.chunks))
        if k == 0:
            return []
            
        distances, indices = self.manager.index.search(query_embedding, k)
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx != -1 and idx < len(self.manager.chunks):
                chunk = self.manager.chunks[idx]
                
                # 2. Metadata Filtering (Post-retrieval for simplicity, but logically acts as pre-filter)
                if metadata_filters:
                    match = True
                    for key, val in metadata_filters.items():
                        if chunk.metadata.get(key) != val:
                            match = False
                            break
                    if not match:
                        continue
                
                # Invert distance for a pseudo relevance score (closer to 1.0 is better)
                # Note: This is a placeholder calculation.
                rel_score = max(0.0, 1.0 - float(dist) / 100.0) 
                
                evidence = EvidenceItem(
                    id=chunk.id,
                    source=chunk.metadata.get("source", "Unknown"),
                    document=chunk.metadata.get("type", "Unknown Document"),
                    content=chunk.content,
                    relevanceScore=round(rel_score, 2),
                    evidenceType=chunk.metadata.get("type", "unknown"),
                    metadata=chunk.metadata
                )
                results.append(evidence)
                
        print(f"[RAG] Retrieved {len(results)} chunks after filtering.")
        return results
