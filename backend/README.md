# NutriSLM Offline AI Backend

This is the offline AI nutrition backend powered by FastAPI, SQLite, Ollama (Phi-3/Mistral), and FAISS RAG pipelines.

## Setup Instructions

1. Ensure Python 3.10+ is installed.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Download the spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```
4. Set up `.env` from `.env.example`.
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
