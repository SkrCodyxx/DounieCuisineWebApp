import uuid
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Union # Assurer Union et List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr = Field(..., example="utilisateur@example.com")
    first_name: Optional[str] = Field(None, example="Jean")
    last_name: Optional[str] = Field(None, example="Dupont")
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, example="MotDePasseSolide123")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

class UserInDBBase(UserBase):
    id: uuid.UUID
    is_superuser: bool = False
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class User(UserInDBBase): # Alias pour l'instant
    pass

class UserRead(UserBase):
    id: uuid.UUID
    is_superuser: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    # Pour les rôles, il faudra un schéma RoleRead, on le commente pour l'instant
    # roles: List['RoleRead'] = [] # Attention aux imports circulaires, utiliser des strings
    model_config = {"from_attributes": True}

class UserInDB(UserInDBBase):
    pass
