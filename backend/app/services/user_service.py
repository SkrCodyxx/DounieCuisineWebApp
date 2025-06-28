from sqlalchemy.orm import Session
from typing import Optional, List
import uuid

from app import models # models.user.User
from app import schemas # schemas.user.UserCreate
from app.core.security import get_password_hash, verify_password

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
    """Crée un nouvel utilisateur."""
    hashed_password = get_password_hash(user_in.password)
    db_user = models.user.User(
        email=user_in.email,
        hashed_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        is_active=user_in.is_active if user_in.is_active is not None else True,
        # is_superuser est False par défaut dans le modèle User
    )
    # Génération de l'ID par défaut (uuid.uuid4) dans le modèle User.

    db.add(db_user)
    db.commit() # Sauvegarder en base
    db.refresh(db_user) # Rafraîchir l'objet avec les données de la DB (ex: ID généré)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.user.User]:
    """Authentifie un utilisateur. Retourne l'utilisateur si authentifié, sinon None."""
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not user.is_active: # Ne pas authentifier un utilisateur inactif
        return None # Ou lever une exception spécifique
    if not verify_password(password, user.hashed_password):
        return None
    return user

# D'autres fonctions de service pour update, delete, etc. seront ajoutées plus tard.
