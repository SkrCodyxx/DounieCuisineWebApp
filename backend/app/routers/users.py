import uuid
from typing import List, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query # Ajout de Query pour la pagination
from sqlalchemy.orm import Session

from app import models, schemas, services # Importer depuis les __init__ principaux
from app.core import dependencies # Pour get_db, get_current_active_user, etc.
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError # Nos exceptions personnalisées

router = APIRouter()

@router.post(
    "/",
    response_model=schemas.user.UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un nouvel utilisateur (Admin)",
    dependencies=[Depends(dependencies.get_current_active_superuser)] # Seul un superuser peut créer directement
)
def create_user_by_admin(
    *,
    db: Session = Depends(dependencies.get_db),
    user_in: schemas.user.UserCreate,
):
    """
    Crée un nouvel utilisateur dans le système.
    Accessible uniquement par les superutilisateurs.
    Le flux d'inscription normal passe par /auth/signup.
    """
    try:
        user = services.user_service.create_user(db=db, user_in=user_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return user


@router.get(
    "/",
    response_model=schemas.user.UserList,
    summary="Lister les utilisateurs (Admin)",
    dependencies=[Depends(dependencies.get_current_active_superuser)] # Protéger la liste des utilisateurs
)
def read_users(
    db: Session = Depends(dependencies.get_db),
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter (pour la pagination)"),
    limit: int = Query(100, ge=1, le=200, description="Nombre maximum d'éléments à retourner"),
    # current_user: models.user.User = Depends(dependencies.get_current_active_superuser) # Déjà dans dependencies
):
    """
    Récupère une liste d'utilisateurs avec pagination.
    Accessible uniquement par les superutilisateurs.
    """
    users = services.user_service.get_users(db, skip=skip, limit=limit)
    # Pour obtenir le total, il faudrait une autre requête ou une méthode de service qui le retourne.
    # Pour l'instant, on va simuler le total ou le calculer si la liste est petite.
    # Une meilleure approche est d'avoir une fonction de service qui retourne (items, total).
    # Simplification pour l'instant :
    total_users = db.query(models.user.User).count() # Attention, peut être coûteux sur de grosses tables
    return {"items": users, "total": total_users}


@router.get(
    "/me",
    response_model=schemas.user.UserRead,
    summary="Obtenir les informations de l'utilisateur courant"
)
def read_user_me(
    current_user: models.user.User = Depends(dependencies.get_current_active_user),
):
    """
    Récupère les informations de l'utilisateur actuellement authentifié.
    """
    return current_user


@router.put(
    "/me",
    response_model=schemas.user.UserRead,
    summary="Mettre à jour les informations de l'utilisateur courant"
)
def update_user_me(
    *,
    db: Session = Depends(dependencies.get_db),
    user_in: schemas.user.UserUpdateMe, # Schéma spécifique pour "moi"
    current_user: models.user.User = Depends(dependencies.get_current_active_user),
):
    """
    Met à jour les informations de l'utilisateur actuellement authentifié.
    L'utilisateur ne peut pas changer son statut is_active ou is_superuser via cet endpoint.
    """
    try:
        updated_user = services.user_service.update_user(db, user_to_update=current_user, user_in=user_in)
    except DuplicateEntityError as e: # Si l'email est changé pour un email existant
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_user


@router.get(
    "/{user_id}",
    response_model=schemas.user.UserRead,
    summary="Lire les informations d'un utilisateur spécifique (Admin)",
    dependencies=[Depends(dependencies.get_current_active_superuser)] # Protéger
)
def read_user_by_id(
    user_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
    # current_user: models.user.User = Depends(dependencies.get_current_active_superuser)
):
    """
    Récupère les informations d'un utilisateur spécifique par son ID.
    Accessible uniquement par les superutilisateurs.
    """
    db_user = services.user_service.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    return db_user


@router.put(
    "/{user_id}",
    response_model=schemas.user.UserRead,
    summary="Mettre à jour un utilisateur spécifique (Admin)",
    dependencies=[Depends(dependencies.get_current_active_superuser)] # Protéger
)
def update_user_by_admin(
    *,
    user_id: uuid.UUID,
    user_in: schemas.user.UserUpdate, # Schéma complet pour admin
    db: Session = Depends(dependencies.get_db),
    # current_admin: models.user.User = Depends(dependencies.get_current_active_superuser),
):
    """
    Met à jour les informations d'un utilisateur spécifique par son ID.
    Permet à un admin de changer is_active et is_superuser.
    Accessible uniquement par les superutilisateurs.
    """
    user_to_update = services.user_service.get_user(db, user_id=user_id)
    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="L'utilisateur à mettre à jour n'a pas été trouvé.",
        )
    try:
        updated_user = services.user_service.update_user(db, user_to_update=user_to_update, user_in=user_in)
    except DuplicateEntityError as e: # Si l'email est changé pour un email existant
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_user


@router.delete(
    "/{user_id}",
    response_model=schemas.user.UserRead, # Retourne l'utilisateur supprimé
    summary="Supprimer un utilisateur (Admin)",
    dependencies=[Depends(dependencies.get_current_active_superuser)] # Protéger
)
def delete_user_by_admin(
    user_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
    # current_admin: models.user.User = Depends(dependencies.get_current_active_superuser),
):
    """
    Supprime un utilisateur spécifique par son ID.
    Accessible uniquement par les superutilisateurs.
    """
    user_to_delete = services.user_service.get_user(db, user_id=user_id)
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="L'utilisateur à supprimer n'a pas été trouvé.",
        )
    # Logique additionnelle : ne pas permettre de supprimer le seul superutilisateur, etc. (peut être dans le service)
    # if user_to_delete.is_superuser and not some_other_superuser_exists(db):
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Impossible de supprimer le seul superutilisateur.")

    deleted_user = services.user_service.delete_user(db, user_to_delete=user_to_delete)
    return deleted_user
