import uuid
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List # List est important pour UserList
from datetime import datetime

# --- Schémas de base et de création ---
class UserBase(BaseModel):
    email: EmailStr = Field(..., example="utilisateur@example.com")
    first_name: Optional[str] = Field(None, max_length=100, example="Jean")
    last_name: Optional[str] = Field(None, max_length=100, example="Dupont")
    is_active: Optional[bool] = True # Actif par défaut lors de la création/lecture simple

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100, example="MotDePasseSolide123")
    # is_superuser peut être défini à la création par un autre superuser, sinon False par défaut dans le modèle DB.
    is_superuser: Optional[bool] = False

# --- Schémas de mise à jour ---
# Pour la mise à jour par l'utilisateur lui-même (ne peut pas changer son statut is_active ou is_superuser)
class UserUpdateMe(BaseModel):
    email: Optional[EmailStr] = Field(None, example="nouveau_email@example.com")
    first_name: Optional[str] = Field(None, max_length=100, example="Jeanne")
    last_name: Optional[str] = Field(None, max_length=100, example="Durand")
    password: Optional[str] = Field(None, min_length=8, max_length=100, description="Nouveau mot de passe (optionnel)")

# Pour la mise à jour par un administrateur (peut tout changer)
class UserUpdate(UserUpdateMe): # Hérite des champs de UserUpdateMe
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    # On pourrait ajouter la gestion des rôles ici plus tard:
    # role_ids: Optional[List[uuid.UUID]] = None

# --- Schémas pour les réponses API (lecture) ---
# Schéma de base pour un rôle, utilisé dans UserRead (sera défini plus en détail dans schemas/role.py)
# Pour éviter les imports circulaires et définir les modèles plus tard, on utilise une string pour le type.
# Ou on définit un schéma RoleRead minimal ici pour l'instant.
class RoleReadMinimal(BaseModel):
    id: uuid.UUID
    name: str
    model_config = {"from_attributes": True}

# Schéma pour lire un utilisateur individuel
class UserRead(UserBase): # Hérite de UserBase pour email, first_name, last_name, is_active
    id: uuid.UUID
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
    roles: List[RoleReadMinimal] = [] # Liste des rôles de l'utilisateur

    model_config = {"from_attributes": True}

# Schéma pour une liste d'utilisateurs (avec pagination potentielle plus tard)
class UserList(BaseModel):
    items: List[UserRead]
    total: int # Nombre total d'utilisateurs correspondant aux filtres (pour pagination)
    # limit: int
    # offset: int

# --- Schémas pour la base de données (usage interne) ---
# Propriétés additionnelles stockées en base de données mais non modifiables directement via API
class UserInDBBase(UserBase):
    id: uuid.UUID
    is_superuser: bool = False
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    # La relation 'roles' est gérée par SQLAlchemy, pas directement par ce schéma Pydantic pour la DB.
    # Si on voulait la charger, il faudrait un UserWithRolesInDB qui utilise from_attributes.

    model_config = {"from_attributes": True}

# Schéma utilisé pour représenter un utilisateur tel qu'il est dans la base de données
class UserInDB(UserInDBBase):
    pass
