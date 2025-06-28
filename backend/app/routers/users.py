import uuid
from typing import List, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session

from app import models, schemas, services
from app.core import dependencies
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError

router = APIRouter()
SUPERUSER_DEPENDENCY = Depends(dependencies.get_current_active_superuser)

@router.post(
    "/",
    response_model=schemas.UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un nouvel utilisateur (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def create_user_by_admin(
    *,
    db: Session = Depends(dependencies.get_db),
    user_in: schemas.UserCreate,
):
    try:
        user = services.user_service.create_user(db=db, user_in=user_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return user

@router.get(
    "/",
    response_model=schemas.UserList,
    summary="Lister les utilisateurs (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def read_users(
    db: Session = Depends(dependencies.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
):
    users = services.user_service.get_users(db, skip=skip, limit=limit)
    total_users = db.query(models.User).count()
    return {"items": users, "total": total_users}

@router.get(
    "/me",
    response_model=schemas.UserRead,
    summary="Obtenir l'utilisateur courant"
)
def read_user_me(
    current_user: models.User = Depends(dependencies.get_current_active_user),
):
    return current_user

@router.put(
    "/me",
    response_model=schemas.UserRead,
    summary="Mettre à jour l'utilisateur courant"
)
def update_user_me(
    *,
    db: Session = Depends(dependencies.get_db),
    user_in: schemas.user.UserUpdateMe,
    current_user: models.User = Depends(dependencies.get_current_active_user),
):
    try:
        updated_user = services.user_service.update_user(db, user_to_update=current_user, user_in=user_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_user

@router.get(
    "/{user_id}",
    response_model=schemas.UserRead,
    summary="Lire un utilisateur (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def read_user_by_id(
    user_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    db_user = services.user_service.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    return db_user

@router.put(
    "/{user_id}",
    response_model=schemas.UserRead,
    summary="Mettre à jour un utilisateur (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def update_user_by_admin(
    *,
    user_id: uuid.UUID,
    user_in: schemas.user.UserUpdate,
    db: Session = Depends(dependencies.get_db),
):
    user_to_update = services.user_service.get_user(db, user_id=user_id)
    if not user_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé.")
    try:
        updated_user = services.user_service.update_user(db, user_to_update=user_to_update, user_in=user_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_user

@router.delete(
    "/{user_id}",
    response_model=schemas.UserRead,
    summary="Supprimer un utilisateur (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def delete_user_by_admin(
    user_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    user_to_delete = services.user_service.get_user(db, user_id=user_id)
    if not user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé.")
    # On pourrait ajouter une logique pour empêcher la suppression de soi-même ou du dernier superadmin
    # if current_admin.id == user_to_delete.id:
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Suppression de soi-même non autorisée.")
    deleted_user = services.user_service.delete_user(db, user_to_delete=user_to_delete)
    return deleted_user

# --- Endpoints pour gérer les rôles d'un utilisateur ---
class UserRolesUpdate(BaseModel):
    role_ids: List[uuid.UUID] = Field(..., description="Liste complète des ID de rôles pour cet utilisateur.")

@router.put(
    "/{user_id}/roles",
    response_model=schemas.UserRead, # Retourne l'utilisateur avec ses rôles mis à jour
    summary="Définir les rôles pour un utilisateur (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def set_roles_for_user_endpoint(
    user_id: uuid.UUID,
    roles_update: UserRolesUpdate, # Pydantic s'occupe de lire le corps de la requête
    db: Session = Depends(dependencies.get_db),
):
    """
    Assigne un ensemble de rôles à un utilisateur.
    Ceci REMPLACE tous les rôles existants de l'utilisateur par ceux fournis.
    """
    user = services.user_service.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé.")

    try:
        # La validation de l'existence des role_ids est faite dans le service set_user_roles
        updated_user = services.user_service.set_user_roles(
            db, user=user, role_ids=roles_update.role_ids
        )
    except EntityNotFoundError as e: # Si un rôle ID n'est pas trouvé
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e_generic:
        # Logguer e_generic
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erreur interne lors de l'assignation des rôles: {e_generic}")

    return updated_user
