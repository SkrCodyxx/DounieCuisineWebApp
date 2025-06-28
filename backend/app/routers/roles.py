import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Body
from pydantic import BaseModel, Field # Ajout de BaseModel et Field
from sqlalchemy.orm import Session

from app import models, schemas, services
from app.core import dependencies
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError

router = APIRouter()

SUPERUSER_DEPENDENCY = Depends(dependencies.get_current_active_superuser)

@router.post(
    "/",
    response_model=schemas.RoleRead,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un nouveau rôle (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def create_role_endpoint(
    role_in: schemas.RoleCreate,
    db: Session = Depends(dependencies.get_db),
):
    try:
        role = services.role_service.create_role(db=db, role_in=role_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return role

@router.get(
    "/",
    response_model=schemas.RoleList,
    summary="Lister tous les rôles (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def read_roles_endpoint(
    db: Session = Depends(dependencies.get_db),
    skip: int = 0,
    limit: int = 100,
):
    roles = services.role_service.get_roles(db, skip=skip, limit=limit)
    total_roles = db.query(models.Role).count()
    return {"items": roles, "total": total_roles}

@router.get(
    "/{role_id}",
    response_model=schemas.RoleRead,
    summary="Lire un rôle spécifique (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def read_role_by_id_endpoint(
    role_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    db_role = services.role_service.get_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rôle non trouvé")
    return db_role

@router.put(
    "/{role_id}",
    response_model=schemas.RoleRead,
    summary="Mettre à jour un rôle (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def update_role_endpoint(
    role_id: uuid.UUID,
    role_in: schemas.RoleUpdate,
    db: Session = Depends(dependencies.get_db),
):
    role_to_update = services.role_service.get_role(db, role_id=role_id)
    if not role_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rôle à mettre à jour non trouvé.")
    try:
        updated_role = services.role_service.update_role(db, role_to_update=role_to_update, role_in=role_in)
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return updated_role

@router.delete(
    "/{role_id}",
    response_model=schemas.RoleRead,
    summary="Supprimer un rôle (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def delete_role_endpoint(
    role_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    role_to_delete = services.role_service.get_role(db, role_id=role_id)
    if not role_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rôle à supprimer non trouvé.")
    try:
        # Le service lèvera une HTTPException si la suppression est bloquée (rôle assigné)
        deleted_role = services.role_service.delete_role(db, role_to_delete=role_to_delete)
    except HTTPException as http_exc: # Capturer l'exception du service
        raise http_exc
    except Exception as e: # Capturer d'autres erreurs potentielles
        # Logguer l'erreur e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur interne du serveur.")
    return deleted_role


# --- Endpoints pour gérer les permissions d'un rôle ---
class RolePermissionsUpdate(BaseModel): # BaseModel est maintenant importé
    permission_ids: List[uuid.UUID] = Field(..., description="Liste complète des ID de permissions pour ce rôle.")

@router.put(
    "/{role_id}/permissions",
    response_model=schemas.RoleRead,
    summary="Définir les permissions pour un rôle (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def set_permissions_for_role_endpoint(
    role_id: uuid.UUID,
    permissions_update: RolePermissionsUpdate,
    db: Session = Depends(dependencies.get_db),
):
    role = services.role_service.get_role(db, role_id=role_id)
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rôle non trouvé.")

    # La validation de l'existence des permission_ids devrait être faite dans le service
    # ou ici avant d'appeler le service.
    # Pour l'instant, le service set_role_permissions ne valide pas explicitement chaque ID,
    # il essaie de les charger. Si un ID n'existe pas, la liste des permissions sera incomplète.
    # Idéalement, le service devrait lever une EntityNotFoundError si un ID de permission est invalide.
    # Ou alors, on valide ici:
    if permissions_update.permission_ids: # Seulement si la liste n'est pas vide
        existing_permissions_count = db.query(models.Permission).filter(models.Permission.id.in_(permissions_update.permission_ids)).count()
        if existing_permissions_count != len(set(permissions_update.permission_ids)):
            # Trouver les IDs manquants pour un message d'erreur plus précis serait mieux.
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Une ou plusieurs permissions fournies n'existent pas.")

    updated_role = services.role_service.set_role_permissions(
        db, role=role, permission_ids=permissions_update.permission_ids
    )
    return updated_role
