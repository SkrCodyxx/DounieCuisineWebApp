import uuid
from typing import Generator, Optional, Union, List, Callable # Ajout de List et Callable
from functools import wraps # Pour créer des décorateurs de permission

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app import models # models.user.User, models.role.Role, models.permission.Permission
from app import schemas
from app.db.session import SessionLocal
from app.services import user_service # Pour get_user dans get_current_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db() -> Generator[Session, None, None]:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_identifier: Optional[str] = payload.get("sub")
        token_type: Optional[str] = payload.get("type")

        if user_identifier is None or token_type != "access":
            raise credentials_exception

        try:
            user_id_from_token = uuid.UUID(user_identifier)
        except ValueError:
             raise credentials_exception

    except (JWTError, ValidationError):
        raise credentials_exception

    user = user_service.get_user(db, user_id=user_id_from_token) # Utilisation de user_service
    if user is None:
        raise credentials_exception
    # La vérification is_active est faite dans get_current_active_user
    return user

async def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Utilisateur inactif.")
    return current_user

async def get_current_active_superuser(
    current_user: models.User = Depends(get_current_active_user), # Réutilise get_current_active_user
) -> models.User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="L'utilisateur n'a pas les droits de superutilisateur requis."
        )
    return current_user

# --- Nouvelle dépendance pour la vérification de permission ---

def require_permission(permission_name: str) -> Callable:
    """
    Crée une dépendance FastAPI qui vérifie si l'utilisateur courant (actif)
    possède la permission spécifiée.
    Les permissions sont héritées des rôles de l'utilisateur.
    Les superutilisateurs ont implicitement toutes les permissions.
    """
    def permission_checker(
        current_user: models.User = Depends(get_current_active_user),
        # db: Session = Depends(get_db) # Pas besoin de db ici si les rôles/perms sont déjà chargés sur l'objet user
    ) -> models.User: # Retourne l'utilisateur si la permission est accordée

        # Les superutilisateurs ont toutes les permissions
        if current_user.is_superuser:
            return current_user

        # Collecter toutes les permissions uniques des rôles de l'utilisateur
        user_permissions: set[str] = set()
        for role in current_user.roles: # Suppose que user.roles charge les objets Role
            for perm in role.permissions: # Suppose que role.permissions charge les objets Permission
                user_permissions.add(perm.name)

        if permission_name not in user_permissions:
            # Log l'échec de permission pour audit si nécessaire
            # logger.warning(f"User {current_user.email} (ID: {current_user.id}) FAILED permission check for '{permission_name}'. User permissions: {user_permissions}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission_name}' requise non accordée.",
            )

        # logger.debug(f"User {current_user.email} (ID: {current_user.id}) PASSED permission check for '{permission_name}'.")
        return current_user

    return permission_checker

# Exemples d'utilisation de require_permission dans les routeurs:
# @router.get("/some_protected_resource", dependencies=[Depends(require_permission("resource:read"))])
# async def read_resource(...):
#     ...

# @router.post("/another_resource", dependencies=[Depends(require_permission("resource:create"))])
# async def create_resource(...):
#     ...
