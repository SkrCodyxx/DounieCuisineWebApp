from pydantic import BaseModel
from typing import Optional, Union # Ajout de Union
import uuid

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str

class TokenPayload(BaseModel):
    sub: Optional[Union[str, uuid.UUID]] = None
    type: Optional[str] = None

class TokenData(BaseModel):
    user_id: Optional[Union[str, uuid.UUID]] = None
