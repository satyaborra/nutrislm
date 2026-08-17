from ai.retriever import Retriever
from ai.generator import Generator

class RAGPipeline:
    def __init__(self):
        self.retriever = Retriever(top_k=3)
        self.generator = Generator()

    async def process(self, query: str) -> dict:
        """Runs the entire retrieval augmented generation pipeline."""
        if not query or not query.strip():
            return {
                "answer": "Error: Empty query provided.",
                "context": []
            }
            
        try:
            # 1. Retrieve relevant context
            context_chunks = self.retriever.retrieve(query)
            
            # 2. Generate response using context
            answer = await self.generator.generate(query, context_chunks)
            
            # 3. Format and return
            return {
                "answer": answer,
                "context": context_chunks
            }
        except Exception as e:
            return {"answer": f"Pipeline Error: {str(e)}", "context": []}

    def retrieve_context(self, query: str, top_k: int = 2) -> str:
        """Helper method for backwards compatibility with diet_service."""
        self.retriever.top_k = top_k
        chunks = self.retriever.retrieve(query)
        return "\n\n".join(chunks)

# Backward compatibility global instance
rag_pipeline = RAGPipeline()

# Global instance
_pipeline = None
def get_rag_pipeline():
    global _pipeline
    if _pipeline is None:
        _pipeline = RAGPipeline()
    return _pipeline
