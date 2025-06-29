import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import models, schemas, services
from app.core import dependencies
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError

router = APIRouter()

# Dépendances de sécurité (exemples)
# Pourrait être plus granulaire avec require_permission si nécessaire
OptionalUser = Depends(dependencies.get_current_user) # Permet les non-authentifiés si pas de protection explicite
AuthenticatedUser = Depends(dependencies.get_current_active_user)
AdminUser = Depends(dependencies.get_current_active_superuser) # Ou une dépendance basée sur un rôle "manager" / "admin_menu"

@router.post(
    "/",
    response_model=schemas.MenuCategoryRead,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une nouvelle catégorie de menu (Admin/Manager)",
    dependencies=[AdminUser] # Exemple de protection
)
def create_menu_category_endpoint(
    category_in: schemas.MenuCategoryCreate,
    db: Session = Depends(dependencies.get_db),
):
    try:
        category = services.menu_service.create_category(db=db, category_in=category_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return category

@router.get(
    "/",
    response_model=schemas.MenuCategoryList,
    summary="Lister les catégories de menu"
    # Pas de dépendance de sécurité ici = public, ou ajouter OptionalUser/AuthenticatedUser
)
def read_menu_categories_endpoint(
    db: Session = Depends(dependencies.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    active_only: bool = Query(True, description="Retourner uniquement les catégories actives") # Par défaut, ne retourne que les actives
):
    categories = services.menu_service.get_categories(db, skip=skip, limit=limit, active_only=active_only)
    total_categories = services.menu_service.get_categories_count(db, active_only=active_only)
    return {"items": categories, "total": total_categories}

@router.get(
    "/{category_id}",
    response_model=schemas.MenuCategoryRead,
    summary="Lire une catégorie de menu spécifique"
    # Pas de dépendance de sécurité ici = public
)
def read_menu_category_by_id_endpoint(
    category_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    db_category = services.menu_service.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catégorie de menu non trouvée")
    # Si la catégorie est inactive et que l'utilisateur n'est pas admin, on pourrait la cacher.
    # if not db_category.is_active and not (current_user and current_user.is_superuser): # Nécessiterait current_user
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catégorie de menu non trouvée")
    return db_category

@router.put(
    "/{category_id}",
    response_model=schemas.MenuCategoryRead,
    summary="Mettre à jour une catégorie de menu (Admin/Manager)",
    dependencies=[AdminUser]
)
def update_menu_category_endpoint(
    category_id: uuid.UUID,
    category_in: schemas.MenuCategoryUpdate,
    db: Session = Depends(dependencies.get_db),
):
    category_to_update = services.menu_service.get_category(db, category_id=category_id)
    if not category_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catégorie à mettre à jour non trouvée.")
    try:
        updated_category = services.menu_service.update_category(db, category_to_update=category_to_update, category_in=category_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_category

@router.delete(
    "/{category_id}",
    response_model=schemas.MenuCategoryRead,
    summary="Supprimer une catégorie de menu (Admin/Manager)",
    dependencies=[AdminUser]
)
def delete_menu_category_endpoint(
    category_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    category_to_delete = services.menu_service.get_category(db, category_id=category_id)
    if not category_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catégorie à supprimer non trouvée.")
    try:
        deleted_category = services.menu_service.delete_category(db, category_to_delete=category_to_delete)
    except HTTPException as http_exc: # Si le service lève une HTTPException (ex: catégorie non vide)
        raise http_exc
    except Exception as e: # Autres erreurs
        # log e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur interne du serveur.")
    return deleted_category
