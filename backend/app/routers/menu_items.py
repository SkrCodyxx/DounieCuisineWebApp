import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import models, schemas, services
from app.core import dependencies
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError # EntityNotFoundError pour catégorie non trouvée

router = APIRouter()

# Dépendances de sécurité (exemples)
AuthenticatedUser = Depends(dependencies.get_current_active_user)
AdminUser = Depends(dependencies.get_current_active_superuser)

@router.post(
    "/",
    response_model=schemas.MenuItemRead,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un nouvel article de menu (Admin/Manager)",
    dependencies=[AdminUser] # Protéger la création
)
def create_menu_item_endpoint(
    item_in: schemas.MenuItemCreate,
    db: Session = Depends(dependencies.get_db),
):
    try:
        item = services.menu_service.create_menu_item(db=db, item_in=item_in)
    except EntityNotFoundError as e: # Si la catégorie parente n'est pas trouvée
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DuplicateEntityError as e: # Si un article similaire existe déjà (logique à affiner dans le service)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return item

@router.get(
    "/",
    response_model=schemas.MenuItemList,
    summary="Lister tous les articles de menu"
    # Public ou authentifié simple
)
def read_all_menu_items_endpoint(
    db: Session = Depends(dependencies.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500), # Plus d'items potentiellement
    active_only: bool = Query(True, description="Retourner uniquement les articles disponibles")
):
    items = services.menu_service.get_all_menu_items(db, skip=skip, limit=limit, active_only=active_only)
    total_items = services.menu_service.get_all_menu_items_count(db, active_only=active_only)
    return {"items": items, "total": total_items}

@router.get(
    "/by_category/{category_id}",
    response_model=schemas.MenuItemList, # Ou un schéma spécifique si on veut inclure des infos de la catégorie
    summary="Lister les articles de menu pour une catégorie spécifique"
    # Public ou authentifié simple
)
def read_menu_items_by_category_endpoint(
    category_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    active_only: bool = Query(True, description="Retourner uniquement les articles disponibles de cette catégorie")
):
    # Vérifier si la catégorie existe (optionnel, le service pourrait retourner une liste vide)
    category = services.menu_service.get_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catégorie non trouvée.")
    # Si on ne veut pas afficher les items d'une catégorie inactive (sauf pour admin)
    # if not category.is_active and not (current_user and current_user.is_superuser):
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catégorie non trouvée.")

    items = services.menu_service.get_menu_items_by_category(
        db, category_id=category_id, skip=skip, limit=limit, active_only=active_only
    )
    total_items = services.menu_service.get_menu_items_by_category_count(
        db, category_id=category_id, active_only=active_only
    )
    return {"items": items, "total": total_items}


@router.get(
    "/{item_id}",
    response_model=schemas.MenuItemRead,
    summary="Lire un article de menu spécifique"
    # Public ou authentifié simple
)
def read_menu_item_by_id_endpoint(
    item_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    db_item = services.menu_service.get_menu_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article de menu non trouvé")
    # Gérer la visibilité si l'article est inactif ou sa catégorie inactive (pour non-admin)
    # if not db_item.is_available and not (current_user and current_user.is_superuser):
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article de menu non trouvé")
    # if db_item.category and not db_item.category.is_active and not (current_user and current_user.is_superuser):
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article de menu non trouvé")
    return db_item

@router.put(
    "/{item_id}",
    response_model=schemas.MenuItemRead,
    summary="Mettre à jour un article de menu (Admin/Manager)",
    dependencies=[AdminUser]
)
def update_menu_item_endpoint(
    item_id: uuid.UUID,
    item_in: schemas.MenuItemUpdate,
    db: Session = Depends(dependencies.get_db),
):
    item_to_update = services.menu_service.get_menu_item(db, item_id=item_id)
    if not item_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article à mettre à jour non trouvé.")
    try:
        updated_item = services.menu_service.update_menu_item(db, item_to_update=item_to_update, item_in=item_in)
    except EntityNotFoundError as e: # Si la nouvelle catégorie n'est pas trouvée
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DuplicateEntityError as e: # Si un conflit de nom survient (logique à ajouter dans le service si besoin)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_item

@router.delete(
    "/{item_id}",
    response_model=schemas.MenuItemRead,
    summary="Supprimer un article de menu (Admin/Manager)",
    dependencies=[AdminUser]
)
def delete_menu_item_endpoint(
    item_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    item_to_delete = services.menu_service.get_menu_item(db, item_id=item_id)
    if not item_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article à supprimer non trouvé.")
    # Le service delete_menu_item ne fait pas de vérifications de dépendances pour l'instant.
    deleted_item = services.menu_service.delete_menu_item(db, item_to_delete=item_to_delete)
    return deleted_item
