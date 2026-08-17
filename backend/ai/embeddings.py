import os
import glob
import pickle
import json
import csv
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
INDEX_PATH = os.path.join(BASE_DIR, 'ai', 'faiss_index.bin')
CHUNKS_PATH = os.path.join(BASE_DIR, 'ai', 'chunks.pkl')

class DocumentChunk:
    def __init__(self, id: str, content: str, metadata: dict):
        self.id = id
        self.content = content
        self.metadata = metadata

class EmbeddingManager:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.encoder = SentenceTransformer(model_name)
        self.index = None
        self.chunks = [] # List of DocumentChunk
        
        self._initialize()

    def _initialize(self):
        """Loads index if it exists, otherwise builds it."""
        if os.path.exists(INDEX_PATH) and os.path.exists(CHUNKS_PATH):
            self._load_index()
        else:
            self._build_index()

    def _parse_csv_nutrition(self, file_path: str, source_name: str) -> list:
        chunks = []
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if i >= 50: # LIMIT chunks for performance in dev environment
                    break
                    
                food_item = row.get("FoodItem", "Unknown")
                calories = row.get("Calories", "0")
                protein = row.get("Protein", "0")
                carbs = row.get("Carbs", "0")
                fat = row.get("Fat", "0")
                fiber = row.get("Fiber", "0")
                
                content = (
                    f"Food: {food_item}. "
                    f"Calories: {calories} kcal, Protein: {protein}g, "
                    f"Carbohydrates: {carbs}g, Fat: {fat}g, Fiber: {fiber}g."
                )
                
                meta = {
                    "type": "nutrition",
                    "food": food_item.lower(),
                    "source": source_name,
                    "calories": float(calories) if calories else 0.0
                }
                
                chunk = DocumentChunk(id=f"{source_name}_{i}", content=content, metadata=meta)
                chunks.append(chunk)
        return chunks

    def _parse_json_guidelines(self, file_path: str) -> list:
        chunks = []
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            guidelines = data.get("guidelines", [])
            for i, g in enumerate(guidelines):
                meta = {
                    "type": "guideline",
                    "disease": "general", # Mocked for now, can be expanded
                    "topic": "nutrition",
                    "source": "Clinical Guidelines"
                }
                chunk = DocumentChunk(id=f"guideline_{i}", content=g, metadata=meta)
                chunks.append(chunk)
        return chunks

    def _load_files(self) -> list:
        """Parse structural datasets into chunks."""
        all_chunks = []
        
        # Load IFCT
        ifct_path = os.path.join(DATASETS_DIR, "ifct_food_data.csv")
        if os.path.exists(ifct_path):
            all_chunks.extend(self._parse_csv_nutrition(ifct_path, "IFCT 2017"))
            
        # Load USDA
        usda_path = os.path.join(DATASETS_DIR, "usda_food_data.csv")
        if os.path.exists(usda_path):
            all_chunks.extend(self._parse_csv_nutrition(usda_path, "USDA FoodData"))
            
        # Load Guidelines
        guide_path = os.path.join(DATASETS_DIR, "nutrition_guidelines.json")
        if os.path.exists(guide_path):
            all_chunks.extend(self._parse_json_guidelines(guide_path))
            
        print(f"[RAG] Structured Documents Loaded: {len(all_chunks)} chunks")
        return all_chunks

    def _build_index(self):
        """Build FAISS index and save it to disk."""
        self.chunks = self._load_files()
        
        if not self.chunks:
            print("[RAG] No dataset found. Initializing empty FAISS fallback index.")
            self.index = faiss.IndexFlatL2(384)
            return
            
        print(f"[RAG] FAISS Chunks Created: {len(self.chunks)}")
        
        try:
            # Generate embeddings
            texts = [c.content for c in self.chunks]
            embeddings = self.encoder.encode(texts, convert_to_numpy=True)
            dimension = embeddings.shape[1]
            
            # Create and train FAISS index
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(embeddings)
            
            # Save to disk
            faiss.write_index(self.index, INDEX_PATH)
            with open(CHUNKS_PATH, 'wb') as f:
                pickle.dump(self.chunks, f)
            print("[RAG] FAISS Index built and cached successfully.")
        except Exception as e:
            print(f"[RAG] FAISS build failed: {e}")
            self.index = faiss.IndexFlatL2(384)
            self.chunks = []
            
    def _load_index(self):
        """Load FAISS index and chunks from disk."""
        self.index = faiss.read_index(INDEX_PATH)
        with open(CHUNKS_PATH, 'rb') as f:
            self.chunks = pickle.load(f)

# Global unified instance
_manager = None
def get_embedding_manager():
    global _manager
    if _manager is None:
        _manager = EmbeddingManager()
    return _manager
