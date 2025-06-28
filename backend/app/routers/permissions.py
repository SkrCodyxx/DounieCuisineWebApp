import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas, services
from app.core import dependencies
from app.core.exceptions import DuplicateEntityError # Si on permet la création/update de nom

router = APIRouter()
SUPERUSER_DEPENDENCY = Depends(dependencies.get_current_active_superuser)

# Les permissions sont souvent considérées comme définies par le système et non gérées via API.
# Si on veut les exposer, ce sera principalement en lecture.
# La création/modification/suppression serait très rare et réservée à des opérations de maintenance.

@router.get(
    "/",
    response_model=schemas.PermissionList,
    summary="Lister toutes les permissions (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def read_permissions_endpoint(
    db: Session = Depends(dependencies.get_db),
    skip: int = 0,
    limit: int = 1000, # Souvent, on veut toutes les voir
):
    """Récupère une liste de toutes les permissions disponibles dans le système."""
    permissions = services.permission_service.get_permissions(db, skip=skip, limit=limit)
    total_permissions = db.query(models.Permission).count() # TODO: Service
    return {"items": permissions, "total": total_permissions}

@router.get(
    "/{permission_id}",
    response_model=schemas.PermissionRead,
    summary="Lire une permission spécifique (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def read_permission_by_id_endpoint(
    permission_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    """Récupère une permission par son ID."""
    db_permission = services.permission_service.get_permission(db, permission_id=permission_id)
    if db_permission is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission non trouvée")
    return db_permission

# CRUD pour les permissions (généralement non recommandé pour une API publique, mais peut être utile pour admin)
# Ces endpoints sont commentés par défaut car leur utilité doit être validée.
# Si décommentés, s'assurer que la protection est adéquate (superuser uniquement).

# @router.post(
#     "/",
#     response_model=schemas.PermissionRead,
#     status_code=status.HTTP_201_CREATED,
#     summary="Créer une nouvelle permission (Superuser - Usage Restreint)",
#     dependencies=[SUPERUSER_DEPENDENCY],
#     include_in_schema=False # Cacher de la doc publique par défaut
# )
# def create_permission_endpoint(
#     permission_in: schemas.PermissionCreate,
#     db: Session = Depends(dependencies.get_db),
# ):
#     try:
#         permission = services.permission_service.create_permission(db=db, permission_in=permission_in)
#     except DuplicateEntityError as e:
#         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
#     return permission

# @router.put(
#     "/{permission_id}",
#     response_model=schemas.PermissionRead,
#     summary="Mettre à jour une permission (Superuser - Usage Restreint)",
#     dependencies=[SUPERUSER_DEPENDENCY],
#     include_in_schema=False
# )
# def update_permission_endpoint(
#     permission_id: uuid.UUID,
#     permission_in: schemas.PermissionUpdate,
#     db: Session = Depends(dependencies.get_db),
# ):
#     permission_to_update = services.permission_service.get_permission(db, permission_id=permission_id)
#     if not permission_to_update:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission non trouvée.")
#     try:
#         updated_permission = services.permission_service.update_permission(
#             db, permission_to_update=permission_to_update, permission_in=permission_in
#         )
#     except DuplicateEntityError as e:
#         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
#     return updated_permission

# @router.delete(
#     "/{permission_id}",
#     response_model=schemas.PermissionRead,
#     summary="Supprimer une permission (Superuser - Usage Restreint)",
#     dependencies=[SUPERUSER_DEPENDENCY],
#     include_in_schema=False
# )
# def delete_permission_endpoint(
#     permission_id: uuid.UUID,
#     db: Session = Depends(dependencies.get_db),
# ):
#     permission_to_delete = services.permission_service.get_permission(db, permission_id=permission_id)
#     if not permission_to_delete:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission non trouvée.")
#     # La logique de service devrait vérifier si la permission est utilisée.
#     # try:
#     #     deleted_permission = services.permission_service.delete_permission(db, permission_to_delete=permission_to_delete)
#     # except HTTPException as e: # Si le service lève une HTTP 409
#     #     raise e
#     # return deleted_permission
#     # Pour l'instant, on retourne juste une confirmation si la logique de suppression est simple.
#     # Il faut que delete_permission dans le service soit robuste.
#     services.permission_service.delete_permission(db, permission_to_delete=permission_to_delete) # Supposons qu'il lève une exception si problème
#     return permission_to_delete # Retourner l'objet supprimé
