from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, Literal

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://default_user:default_password@localhost:5432/dounie_cuisine_default_db"
    SECRET_KEY: str = "default_super_secret_key_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    APP_NAME: str = "Dounie Cuisine Pro API"
    APP_VERSION: str = "0.1.0"
    DEBUG_MODE: bool = False
    OPTIONAL_SETTING: Optional[str] = None

    # Paramètres de Logging
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    # Format de log plus détaillé si besoin:
    # LOG_FORMAT: str = "%(asctime)s - %(name)s:%(lineno)d - %(levelname)s - %(message)s"
    LOG_FORMAT: str = "%(levelname)-8s | %(asctime)s | %(name)s:%(funcName)s:%(lineno)d - %(message)s"
    LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
