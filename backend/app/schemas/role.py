import uuid
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Schéma de base pour Permission (utilisé dans RoleRead)
# On le définit ici temporairement pour éviter les dépendances circulaires directes
# avec permission.py. Idéalement, on importerait un PermissionReadMinimal.
# Pour l'instant, une version simple suffit.
class PermissionReadMinimal(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    model_config = {"from_attributes": True}


# Schéma de base pour Role
class RoleBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="administrateur_contenu")
    description: Optional[str] = Field(None, max_length=255, example="Peut gérer les articles et les pages.")

# Schéma pour la création d'un rôle
class RoleCreate(RoleBase):
    # Optionnel: on pourrait permettre d'assigner des permissions à la création
    # permission_ids: Optional[List[uuid.UUID]] = None
    pass

# Schéma pour la mise à jour d'un rôle
class RoleUpdate(BaseModel): # Permet des mises à jour partielles
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=255)
    # permission_ids: Optional[List[uuid.UUID]] = None # Pour mettre à jour les permissions associées

# Schéma pour lire un rôle (réponse API)
class RoleRead(RoleBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    permissions: List[PermissionReadMinimal] = [] # Liste des permissions associées à ce rôle

    model_config = {"from_attributes": True}

# Schéma pour une liste de rôles
class RoleList(BaseModel):
    items: List[RoleRead]
    total: int
