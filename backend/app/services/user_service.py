from sqlalchemy.orm import Session
from typing import Optional, List, Any, Dict, Union # Ajout de Any, Dict, Union
import uuid

from app import models # models.user.User
from app import schemas # schemas.user.UserCreate, schemas.user.UserUpdate
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import DuplicateEntityError # Pour gérer les emails dupliqués

# Note: Les opérations de base de données (db.add, db.commit, db.refresh)
# seront effectives lorsque la session DB sera correctement injectée et utilisée.

def get_user(db: Session, user_id: uuid.UUID) -> Optional[models.user.User]:
    """Récupère un utilisateur par son ID."""
    return db.query(models.user.User).filter(models.user.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.user.User]:
    """Récupère un utilisateur par son email."""
    return db.query(models.user.User).filter(models.user.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.user.User]:
    """Récupère une liste d'utilisateurs avec pagination."""
    return db.query(models.user.User).offset(skip).limit(limit).all()

def create_user(db: Session, user_in: schemas.user.UserCreate) -> models.user.User:
    """
    Crée un nouvel utilisateur.
    Lève DuplicateEntityError si l'email existe déjà.
    """
    existing_user = get_user_by_email(db, email=user_in.email)
    if existing_user:
        raise DuplicateEntityError(entity_name="Utilisateur", conflicting_field="email", conflicting_value=user_in.email)

    hashed_password = get_password_hash(user_in.password)
    db_user = models.user.User(
        email=user_in.email,
        hashed_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        is_active=user_in.is_active if user_in.is_active is not None else True,
        is_superuser=user_in.is_superuser if user_in.is_superuser is not None else False,
    )
    # L'ID est généré par défaut par le modèle User (uuid.uuid4)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(
    db: Session,
    user_to_update: models.user.User,
    user_in: Union[schemas.user.UserUpdate, schemas.user.UserUpdateMe, Dict[str, Any]]
) -> models.user.User:
    """
    Met à jour un utilisateur.
    user_in peut être un schéma Pydantic ou un dictionnaire.
    """
    if isinstance(user_in, dict):
        update_data = user_in
    else:
        # exclude_unset=True permet de ne mettre à jour que les champs fournis
        update_data = user_in.model_dump(exclude_unset=True)

    # Mise à jour du mot de passe s'il est fourni
    if "password" in update_data and update_data["password"]: # Vérifier que password n'est pas None ou vide
        hashed_password = get_password_hash(update_data["password"])
        user_to_update.hashed_password = hashed_password
        del update_data["password"] # Ne pas essayer de le mettre à jour directement sur le modèle

    # Mise à jour des autres champs
    for field, value in update_data.items():
        if hasattr(user_to_update, field): # S'assurer que le champ existe sur le modèle
            setattr(user_to_update, field, value)

    db.add(user_to_update) # Ajoute l'objet modifié à la session
    db.commit()
    db.refresh(user_to_update)
    return user_to_update

def delete_user(db: Session, user_to_delete: models.user.User) -> models.user.User:
    """Supprime un utilisateur."""
    db.delete(user_to_delete)
    db.commit()
    # L'objet user_to_delete est détaché de la session après le commit.
    # On peut le retourner tel quel, ou retourner None, ou un message de succès.
    # Le retourner peut être utile si on veut afficher des infos de l'utilisateur supprimé.
    return user_to_delete


def authenticate_user(db: Session, email: str, password: str) -> Optional[models.user.User]:
    """Authentifie un utilisateur. Retourne l'utilisateur si authentifié, sinon None."""
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# --- Fonctions spécifiques aux rôles (à déplacer dans role_service.py plus tard) ---
# def assign_role_to_user(db: Session, user: models.user.User, role: models.role.Role) -> models.user.User:
#     if role not in user.roles:
#         user.roles.append(role)
#         db.add(user)
#         db.commit()
#         db.refresh(user)
#     return user

# def remove_role_from_user(db: Session, user: models.user.User, role: models.role.Role) -> models.user.User:
#     if role in user.roles:
#         user.roles.remove(role)
#         db.add(user)
#         db.commit()
#         db.refresh(user)
#     return user
