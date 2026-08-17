from ai.evidence import RAGResult
from ai.retrieval import Retriever
from ai.reranker import Reranker
from typing import List, Dict, Any, Optional
import os
import httpx

class IOfflineKnowledgeRetriever:
    def __init__(self):
        self.retriever = Retriever(top_k=10)
        self.reranker = Reranker(top_k=3)
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model_name = "phi3:mini"
        
    async def retrieve_and_generate(self, query: str, context: Optional[Dict[str, Any]] = None) -> RAGResult:
        # 1. Disease-Aware Query Construction (Extract disease from context if present)
        disease_filter = context.get("healthCondition", "general") if context else "general"
        filters = None
        if disease_filter != "general":
            filters = {"disease": disease_filter}
            
        # 2. Retrieve & Rerank
        candidates = self.retriever.retrieve(query, metadata_filters=filters)
        top_evidence = self.reranker.rerank(query, candidates)
        
        # 3. Insufficient Evidence Check
        if not top_evidence:
            return RAGResult(
                answer="The current knowledge base does not contain sufficient evidence to support this recommendation.",
                grounded=False,
                retrievalStatus="INSUFFICIENT_EVIDENCE",
                evidence=[],
                model=self.model_name
            )
            
        # 4. SLM Generation
        context_str = "\n".join([f"[{i+1}] {e.source} - {e.content}" for i, e in enumerate(top_evidence)])
        system_prompt = "You are an AI nutritionist. Answer ONLY using the provided evidence. Cite the evidence using brackets [1], [2], etc."
        full_prompt = f"Evidence:\n{context_str}\n\nQuestion: {query}"
        
        try:
            payload = {
                "model": self.model_name,
                "prompt": f"{system_prompt}\n\n{full_prompt}",
                "stream": False
            }
            async with httpx.AsyncClient() as client:
                res = await client.post(f"{self.base_url}/api/generate", json=payload, timeout=30.0)
                res.raise_for_status()
                answer = res.json().get("response", "")
                
            return RAGResult(
                answer=answer,
                grounded=True,
                retrievalStatus="SUCCESS",
                evidence=top_evidence,
                model=self.model_name
            )
        except Exception as e:
            print(f"Offline SLM failed: {e}")
            return RAGResult(
                answer="Error: Local AI Runtime unavailable.",
                grounded=False,
                retrievalStatus="OFFLINE_MODEL_MISSING",
                evidence=[],
                model=self.model_name
            )

class IOnlineKnowledgeRetriever:
    def __init__(self):
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.model_name = "mistral-small"
        
    async def retrieve_and_generate(self, query: str, context: Optional[Dict[str, Any]] = None) -> RAGResult:
        # Mocking online search for now, relying on Mistral's internal knowledge
        if not self.api_key:
             return RAGResult(
                answer="Error: Cloud API Key missing.",
                grounded=False,
                retrievalStatus="ONLINE_UNAVAILABLE",
                evidence=[],
                model=self.model_name
            )
            
        system_prompt = "You are an AI nutritionist. Provide safe dietary advice."
        disease_context = f"User has health condition: {context.get('healthCondition')}" if context and context.get("healthCondition") else ""
        
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{disease_context}\n\nQuestion: {query}"}
            ],
            "temperature": 0.2
        }
        
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post("https://api.mistral.ai/v1/chat/completions", headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}, json=payload, timeout=15.0)
                res.raise_for_status()
                answer = res.json()["choices"][0]["message"]["content"]
                
            return RAGResult(
                answer=answer,
                grounded=True, # Implicitly trusting cloud for now
                retrievalStatus="SUCCESS",
                evidence=[], # Cloud doesn't have local structured evidence
                model=self.model_name
            )
        except Exception as e:
            return RAGResult(
                answer=f"Cloud AI Error: {e}",
                grounded=False,
                retrievalStatus="ONLINE_ERROR",
                evidence=[],
                model=self.model_name
            )

class RagRouter:
    def __init__(self):
        self.offline = IOfflineKnowledgeRetriever()
        self.online = IOnlineKnowledgeRetriever()
        
    async def process(self, mode: str, query: str, context: Optional[Dict[str, Any]] = None) -> RAGResult:
        """Route the RAG request completely separately based on processing mode."""
        if mode == 'offline':
            return await self.offline.retrieve_and_generate(query, context)
        elif mode == 'online':
            return await self.online.retrieve_and_generate(query, context)
        else: # auto
            # Try offline first, fallback to online
            res = await self.offline.retrieve_and_generate(query, context)
            if res.retrievalStatus == "OFFLINE_MODEL_MISSING":
                print("[RAG Router] Auto mode: Offline SLM missing, falling back to Online RAG.")
                return await self.online.retrieve_and_generate(query, context)
            return res

rag_router = RagRouter()
