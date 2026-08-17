from ai.embeddings import get_embedding_manager

class Retriever:
    def __init__(self, top_k=3):
        self.manager = get_embedding_manager()
        self.top_k = top_k

    def retrieve(self, query: str):
        """Retrieve the top-k relevant chunks for a given query."""
        if not self.manager.index or not self.manager.chunks:
            return []
            
        # Convert query to embedding
        query_embedding = self.manager.encoder.encode([query], convert_to_numpy=True)
        
        # Search FAISS index
        k = min(self.top_k, len(self.manager.chunks))
        if k == 0:
            return []
            
        distances, indices = self.manager.index.search(query_embedding, k)
        
        # Map indices to chunks
        results = []
        for idx in indices[0]:
            if idx != -1 and idx < len(self.manager.chunks):
                results.append(self.manager.chunks[idx])
                
        print(f"[RAG] Retrieved Chunks: {len(results)}")
        return results
