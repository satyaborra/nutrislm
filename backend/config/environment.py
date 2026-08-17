from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str = "sqlite:///./nutrislm.db"
    jwt_secret: str = "default_secret_key_change_in_production"
    google_client_id: str | None = None
    facebook_app_id: str | None = None
    ollama_model: str = "phi3:mini"
    ollama_base_url: str = "http://localhost:11434"
    mistral_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache()
def get_settings():
    settings = Settings()
    print("[RAG] Settings API Key:", "LOADED" if settings.mistral_api_key else "NOT FOUND")
    return settings
