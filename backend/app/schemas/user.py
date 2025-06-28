import uuid
import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Union, Any # Ajout de Any pour le validateur
from datetime import datetime

# --- Définition de la politique de mot de passe (description) ---
PASSWORD_POLICY_DESCRIPTION_STR = (
    "Le mot de passe doit contenir entre 8 et 100 caractères, "
    "incluant au moins une majuscule, une minuscule, un chiffre, "
    "et un caractère spécial parmi : @8276%*?&._-" # Liste des caractères spéciaux autorisés
)
# Caractères spéciaux autorisés pour la vérification (doit correspondre à la description)
SPECIAL_CHARACTERS = "@8276%*?&._-"


# --- Validateur de mot de passe personnalisé ---
def password_complexity_validator(cls: Any, value: Optional[str]) -> Optional[str]:
    """
    Valide la complexité du mot de passe.
    S'applique aux champs 'password' qui sont optionnels ou requis.
    """
    if value is None: # Si le mot de passe est optionnel et non fourni, c'est OK.
        return value

    errors = []
    if not re.search(r"[a-z]", value):
        errors.append("doit contenir au moins une lettre minuscule")
    if not re.search(r"[A-Z]", value):
        errors.append("doit contenir au moins une lettre majuscule")
    if not re.search(r"\d", value):
        errors.append("doit contenir au moins un chiffre")
    if not re.search(f"[{re.escape(SPECIAL_CHARACTERS)}]", value): # Utilise la constante SPECIAL_CHARACTERS
        errors.append(f"doit contenir au moins un caractère spécial ({SPECIAL_CHARACTERS})")

    if errors:
        raise ValueError(", ".join(errors))

    return value


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
        example="SolidePass1!",
        description=PASSWORD_POLICY_DESCRIPTION_STR
    )
    is_superuser: Optional[bool] = False

    # Appliquer le validateur personnalisé au champ password
    _validate_password_complexity = field_validator("password", mode="before")(password_complexity_validator)


# --- Schémas de mise à jour ---
class UserUpdateMe(BaseModel):
    email: Optional[EmailStr] = Field(None, example="nouveau_email@example.com")
    first_name: Optional[str] = Field(None, max_length=100, example="Jeanne")
    last_name: Optional[str] = Field(None, max_length=100, example="Durand")
    password: Optional[str] = Field(
        None,
        min_length=8, # min_length est toujours appliqué si la valeur est fournie
        max_length=100,
        description=f"Nouveau mot de passe (optionnel). {PASSWORD_POLICY_DESCRIPTION_STR}",
        example="NouveauPass2@"
    )

    # Appliquer le validateur personnalisé au champ password (s'il est fourni)
    _validate_optional_password_complexity = field_validator("password", mode="before")(password_complexity_validator)


class UserUpdate(UserUpdateMe):
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

# --- Schémas pour les réponses API (lecture) ---
class RoleReadMinimal(BaseModel):
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
