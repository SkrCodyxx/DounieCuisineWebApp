import uuid
import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Union
from datetime import datetime

# --- Définition de la politique de mot de passe ---
# Au moins 8 caractères, max 100, au moins une majuscule, une minuscule, un chiffre, un caractère spécial.
PASSWORD_REGEX_STR = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@6801%*?&._-])[A-Za-z\d@6801%*?&._-]{8,100}$"
PASSWORD_POLICY_DESCRIPTION_STR = (
    "Le mot de passe doit contenir entre 8 et 100 caractères, "
    "incluant au moins une majuscule, une minuscule, un chiffre, "
    "et un caractère spécial parmis : @6801%*?&._-"
)
# Note: Les caractères spéciaux listés sont un exemple, ajustez au besoin.
# Le backslash doit être échappé dans la string Python si utilisé dans la regex pour un caractère spécial.
# Ici, ._- ne nécessitent pas d'échappement spécial dans un set de caractères [].

# --- Schémas de base et de création ---
class UserBase(BaseModel):
    email: EmailStr = Field(..., example="utilisateur@example.com")
    first_name: Optional[str] = Field(None, max_length=100, example="Jean")
    last_name: Optional[str] = Field(None, max_length=100, example="Dupont")
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        pattern=PASSWORD_REGEX_STR, # Utilisation de la constante Python
        example="SolidePass1!",
        description=PASSWORD_POLICY_DESCRIPTION_STR # Utilisation de la constante Python
    )
    is_superuser: Optional[bool] = False

# --- Schémas de mise à jour ---
class UserUpdateMe(BaseModel):
    email: Optional[EmailStr] = Field(None, example="nouveau_email@example.com")
    first_name: Optional[str] = Field(None, max_length=100, example="Jeanne")
    last_name: Optional[str] = Field(None, max_length=100, example="Durand")
    password: Optional[str] = Field(
        None,
        min_length=8,
        max_length=100,
        pattern=PASSWORD_REGEX_STR, # Appliquer aussi la politique ici s'il est fourni
        description=f"Nouveau mot de passe (optionnel). {PASSWORD_POLICY_DESCRIPTION_STR}",
        example="NouveauPass2@"
    )

class UserUpdate(UserUpdateMe):
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

# --- Schémas pour les réponses API (lecture) ---
class RoleReadMinimal(BaseModel): # Reste tel quel pour l'instant
    id: uuid.UUID
    name: str
    model_config = {"from_attributes": True}

class UserRead(UserBase):
    id: uuid.UUID
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
    roles: List[RoleReadMinimal] = []
    model_config = {"from_attributes": True}

class UserList(BaseModel):
    items: List[UserRead]
    total: int

# --- Schémas pour la base de données (usage interne) ---
class UserInDBBase(UserBase):
    id: uuid.UUID
    is_superuser: bool = False
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class UserInDB(UserInDBBase):
    pass
