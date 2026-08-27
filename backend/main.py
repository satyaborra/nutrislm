import os

# Limit thread allocations to stay within 512MB RAM on free hosting tiers
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

try:
    import torch
    torch.set_num_threads(1)
except Exception:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Debug API key loading
api_key = os.getenv("MISTRAL_API_KEY")

print("[RAG] API KEY STATUS:", "LOADED" if api_key else "NOT FOUND")

if not api_key:
    print("[RAG] ERROR: MISTRAL_API_KEY is missing. Check backend/.env file.")

from database.connection import engine
from database.base import Base

from routes import auth_routes, user_routes, nutrition_routes, diet_routes, health_routes, chatbot_routes, ai_routes, nutrition_ai_routes, notification_routes

app = FastAPI(
    title="NutriSLM AI Backend",
    description="Offline AI Nutrition Backend",
    version="1.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nutrislm.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "NutriSLM Backend is running"}

# Register Routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/api/user", tags=["User"])
app.include_router(nutrition_routes.router, prefix="/api", tags=["Nutrition"])
app.include_router(nutrition_ai_routes.router, prefix="/api", tags=["Nutrition AI"])
app.include_router(diet_routes.router, prefix="/api", tags=["Diet"])
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(chatbot_routes.router, prefix="/api", tags=["Chatbot"])
app.include_router(ai_routes.router, prefix="/api", tags=["AI RAG"])
app.include_router(notification_routes.router, prefix="/api/notifications", tags=["Notifications"])
