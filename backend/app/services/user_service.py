import uuid
from typing import List, Optional, Any, Dict, Union
from sqlalchemy.orm import Session

from app import models, schemas
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError # EntityNotFoundError pourrait être utile

def get_user(db: Session, user_id: uuid.UUID) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    existing_user = get_user_by_email(db, email=user_in.email)
    if existing_user:
        raise DuplicateEntityError(entity_name="Utilisateur", conflicting_field="email", conflicting_value=user_in.email)

    hashed_password = get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        hashed_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        is_active=user_in.is_active if user_in.is_active is not None else True,
        is_superuser=user_in.is_superuser if user_in.is_superuser is not None else False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(
    db: Session,
    user_to_update: models.User,
    user_in: Union[schemas.UserUpdate, schemas.UserUpdateMe, Dict[str, Any]]
) -> models.User:
    if isinstance(user_in, dict):
        update_data = user_in
    else:
        update_data = user_in.model_dump(exclude_unset=True)

    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        user_to_update.hashed_password = hashed_password
        del update_data["password"]

    if "email" in update_data and update_data["email"] != user_to_update.email:
        existing_user = get_user_by_email(db, email=update_data["email"])
        if existing_user and existing_user.id != user_to_update.id:
            raise DuplicateEntityError(entity_name="Utilisateur", conflicting_field="email", conflicting_value=update_data["email"])

    for field, value in update_data.items():
        if hasattr(user_to_update, field):
            setattr(user_to_update, field, value)

    db.add(user_to_update)
    db.commit()
    db.refresh(user_to_update)
    return user_to_update

def delete_user(db: Session, user_to_delete: models.User) -> models.User:
    db.delete(user_to_delete)
    db.commit()
    return user_to_delete

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email=email)
    if not user or not user.is_active or not verify_password(password, user.hashed_password):
        return None
    return user

# --- Logique d'assignation Rôles <-> Utilisateurs ---

def assign_role_to_user(db: Session, user: models.User, role: models.Role) -> models.User:
    """Ajoute un rôle à un utilisateur s'il ne l'a pas déjà."""
    if role not in user.roles:
        user.roles.append(role)
        # db.add(user) # L'objet user est déjà dans la session et modifié
        db.commit()
        db.refresh(user)
    return user

def remove_role_from_user(db: Session, user: models.User, role: models.Role) -> models.User:
    """Retire un rôle d'un utilisateur s'il l'a."""
    if role in user.roles:
        user.roles.remove(role)
        # db.add(user)
        db.commit()
        db.refresh(user)
    return user

def set_user_roles(db: Session, user: models.User, role_ids: List[uuid.UUID]) -> models.User:
    """
    Définit l'ensemble exact des rôles pour un utilisateur.
    Valide que tous les IDs de rôle fournis existent.
    """
    roles_to_assign: List[models.Role] = []
    if role_ids: # Si la liste n'est pas vide
        roles_to_assign = db.query(models.Role).filter(models.Role.id.in_(role_ids)).all()
        if len(roles_to_assign) != len(set(role_ids)): # set() pour gérer les doublons dans role_ids
            found_ids = {r.id for r in roles_to_assign}
            missing_ids = set(role_ids) - found_ids
            # Lever une exception si un rôle n'est pas trouvé.
            # Le routeur devrait attraper cela et retourner une HTTP 404 ou 400.
            raise EntityNotFoundError(entity_name="Rôle", entity_id=next(iter(missing_ids))) # Prend le premier ID manquant

    user.roles = roles_to_assign # Remplace toutes les associations de rôles existantes
    # db.add(user)
    db.commit()
    db.refresh(user)
    return user
