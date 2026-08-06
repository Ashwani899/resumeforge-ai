from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./resumeforge.db"
    frontend_url: str = "http://localhost:5173"
    max_file_size_mb: int = 10
    
    class Config:
        env_file = ".env"

settings = Settings()
