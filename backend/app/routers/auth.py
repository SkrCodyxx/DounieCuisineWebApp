from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app import schemas # schemas.token.Token, schemas.user.UserRead
from app import services # services.user_service
from app.core import security # security.create_access_token, security.create_refresh_token
from app.core.config import settings
from app.core.dependencies import get_db # Dépendance pour la session DB

router = APIRouter()

@router.post("/login", response_model=schemas.token.Token)
async def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Endpoint de connexion pour obtenir un token d'accès et de rafraîchissement.
    Utilise OAuth2PasswordRequestForm pour récupérer username (email) et password.
    """
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
        subject=str(user.id), expires_delta=access_token_expires # Utiliser user.id (UUID) comme sujet
    )

    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = security.create_refresh_token(
        subject=str(user.id), expires_delta=refresh_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        # On pourrait aussi retourner des infos sur l'utilisateur ici, ou un message.
        # "user_info": schemas.user.UserRead.from_orm(user) # Si UserRead est défini
    }

# Endpoint pour créer un utilisateur (inscription) - Peut être ici ou dans un routeur users.
@router.post("/signup", response_model=schemas.user.UserRead, status_code=status.HTTP_201_CREATED)
async def signup_new_user(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.user.UserCreate,
):
    """
    Crée un nouvel utilisateur.
    """
    existing_user = services.user_service.get_user_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà.",
        )
    user = services.user_service.create_user(db=db, user_in=user_in)
    # Convertir le modèle SQLAlchemy en schéma Pydantic pour la réponse
    # Note: s'assurer que UserRead est bien défini dans schemas.user
    return user


# TODO: Ajouter un endpoint /refresh_token plus tard
# @router.post("/refresh_token", response_model=schemas.token.Token)
# async def refresh_access_token(
#     db: Session = Depends(get_db),
#     refresh_token_data: schemas.token.RefreshToken = Body(...)
# ):
#    pass

# TODO: Ajouter un endpoint /me pour obtenir les infos de l'utilisateur courant (protégé)
# @router.get("/me", response_model=schemas.user.UserRead)
# async def read_users_me(current_user: models.user.User = Depends(get_current_active_user)):
#    return current_user
