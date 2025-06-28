import uuid
from pydantic import BaseModel, Field
from typing import Optional, List # List pour PermissionList
from datetime import datetime

# Schéma de base pour Permission
class PermissionBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, pattern=r"^[a-z_]+:[a-z_]+$", example="menu:create")
    description: Optional[str] = Field(None, max_length=255, example="Permet de créer un nouvel article de menu.")

# Schéma pour la création d'une permission (généralement non exposé via API, mais utile en interne/seed)
class PermissionCreate(PermissionBase):
    pass

# Schéma pour la mise à jour d'une permission (généralement non exposé via API)
class PermissionUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100, pattern=r"^[a-z_]+:[a-z_]+$")
    description: Optional[str] = Field(None, max_length=255)

# Schéma pour lire une permission (réponse API)
class PermissionRead(PermissionBase):
    id: uuid.UUID
    created_at: datetime # Ajouté pour la cohérence, bien que les permissions soient souvent statiques
    updated_at: datetime # Idem

    model_config = {"from_attributes": True}

# Schéma pour une liste de permissions
class PermissionList(BaseModel):
    items: List[PermissionRead]
    total: int
