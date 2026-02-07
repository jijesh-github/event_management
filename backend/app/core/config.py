import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    MODEL_NAME: str = "gemini-flash-latest"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "../../.env"),
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
