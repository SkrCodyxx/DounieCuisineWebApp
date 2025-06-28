from typing import Generator, Optional, Union # Ajout de Union et Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError # Utilisé implicitement par Pydantic, mais bon à avoir si on catch
from sqlalchemy.orm import Session
import uuid # Ajout de uuid

from app.core.config import settings
from app import models
from app import schemas
from app.db.session import SessionLocal
from app.services import user_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db() -> Generator[Session, None, None]: # Type hint pour Generator
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.user.User:
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

        # On suppose que 'sub' contient l'ID utilisateur (UUID).
        try:
            user_id_from_token = uuid.UUID(user_identifier)
        except ValueError:
             raise credentials_exception

    except (JWTError, ValidationError):
        raise credentials_exception

    user = user_service.get_user(db, user_id=user_id_from_token)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Utilisateur inactif")
    return user

async def get_current_active_user( # Pas besoin de re-vérifier is_active ici
    current_user: models.user.User = Depends(get_current_user),
) -> models.user.User:
    return current_user

async def get_current_active_superuser(
    current_user: models.user.User = Depends(get_current_active_user),
) -> models.user.User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="L'utilisateur n'a pas les droits de superutilisateur requis."
        )
    return current_user
