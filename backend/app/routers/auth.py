import uuid # Ajout de uuid pour la conversion potentielle
from fastapi import APIRouter, Depends, HTTPException, status, Body # Body est déjà là
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app import schemas # schemas.token.Token, schemas.user.UserRead, schemas.token.RefreshToken
from app import services # services.user_service
from app.core import security # security.create_access_token, security.create_refresh_token, security.decode_refresh_token
from app.core.config import settings
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/login", response_model=schemas.token.Token)
async def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = services.user_service.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = security.create_refresh_token(
        subject=str(user.id), expires_delta=refresh_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
    }

@router.post("/signup", response_model=schemas.user.UserRead, status_code=status.HTTP_201_CREATED)
async def signup_new_user(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.user.UserCreate,
):
    existing_user = services.user_service.get_user_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà.",
        )
    user = services.user_service.create_user(db=db, user_in=user_in)
    return user


@router.post("/refresh_token", response_model=schemas.token.Token)
async def refresh_access_token(
    refresh_token_data: schemas.token.RefreshToken, # Attend un JSON body avec "refresh_token"
    db: Session = Depends(get_db)
):
    """
    Obtient un nouveau token d'accès en utilisant un refresh token valide.
    """
    token_subject_str = security.decode_refresh_token(refresh_token_data.refresh_token)

    # Le sujet du token est l'ID utilisateur (UUID converti en str)
    try:
        user_id = uuid.UUID(token_subject_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Format de sujet de refresh token invalide.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = services.user_service.get_user(db, user_id=user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur du refresh token non trouvé ou inactif.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Générer un nouvel access token
    new_access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = security.create_access_token(
        subject=str(user.id), expires_delta=new_access_token_expires
    )

    # Optionnel : générer aussi un nouveau refresh token (rotation des refresh tokens)
    # Pour l'instant, on ne le fait pas pour simplifier, le refresh token original reste valide.
    # Si on implémentait la rotation, il faudrait invalider l'ancien refresh token.

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token_data.refresh_token # Retourner l'ancien ou un nouveau
    }

# @router.get("/me", response_model=schemas.user.UserRead)
# async def read_users_me(current_user: models.User = Depends(dependencies.get_current_active_user)):
#    return current_user
# Cet endpoint est mieux placé dans users.py, ce qui a été fait.
