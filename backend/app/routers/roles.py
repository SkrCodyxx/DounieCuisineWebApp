import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Body # Ajout de Body
from sqlalchemy.orm import Session

from app import models, schemas, services
from app.core import dependencies
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError

router = APIRouter()

# Dépendance pour s'assurer que l'utilisateur est un superutilisateur
# On pourrait créer une dépendance plus spécifique si on a différents niveaux d'admin plus tard.
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
    """Crée un nouveau rôle."""
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
    """Récupère une liste de tous les rôles."""
    roles = services.role_service.get_roles(db, skip=skip, limit=limit)
    total_roles = db.query(models.Role).count() # TODO: Service pour get_roles_with_count
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
    """Récupère un rôle par son ID."""
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
    """Met à jour un rôle existant."""
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
    response_model=schemas.RoleRead, # Retourne le rôle supprimé
    summary="Supprimer un rôle (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def delete_role_endpoint(
    role_id: uuid.UUID,
    db: Session = Depends(dependencies.get_db),
):
    """Supprime un rôle."""
    role_to_delete = services.role_service.get_role(db, role_id=role_id)
    if not role_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rôle à supprimer non trouvé.")

    # La logique de vérification (si le rôle est utilisé) est dans le service
    # Le service lèvera une HTTPException si la suppression n'est pas permise.
    # On pourrait attraper cette exception spécifique ici si on voulait personnaliser le message.
    # Pour l'instant, on laisse le service lever l'HTTPException (ce qui n'est pas idéal pour la séparation).
    # Idéalement, le service lèverait une exception métier, et le routeur la traduirait en HTTPException.
    # Correction: on va supposer que le service lève une exception métier et la traiter ici.
    try:
        deleted_role = services.role_service.delete_role(db, role_to_delete=role_to_delete)
    except HTTPException as e: # Si le service lève directement HTTPException
        raise e
    except Exception as e_generic: # Pour d'autres erreurs non prévues
        # Logguer e_generic
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erreur interne lors de la suppression du rôle: {e_generic}")
    return deleted_role


# --- Endpoints pour gérer les permissions d'un rôle ---
class RolePermissionsUpdate(BaseModel):
    permission_ids: List[uuid.UUID] = Field(..., description="Liste complète des ID de permissions pour ce rôle.")

@router.put(
    "/{role_id}/permissions",
    response_model=schemas.RoleRead,
    summary="Définir les permissions pour un rôle (Admin)",
    dependencies=[SUPERUSER_DEPENDENCY]
)
def set_permissions_for_role_endpoint(
    role_id: uuid.UUID,
    permissions_update: RolePermissionsUpdate, # Utiliser Body() si on veut le nom du paramètre dans Swagger
    db: Session = Depends(dependencies.get_db),
):
    """
    Assigne un ensemble de permissions à un rôle.
    Ceci REMPLACE toutes les permissions existantes du rôle par celles fournies.
    """
    role = services.role_service.get_role(db, role_id=role_id)
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rôle non trouvé.")

    # Valider que toutes les permissions existent (pourrait être fait dans le service)
    valid_permissions = []
    if permissions_update.permission_ids:
        for perm_id in permissions_update.permission_ids:
            perm = services.permission_service.get_permission(db, permission_id=perm_id)
            if not perm:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Permission avec ID {perm_id} non trouvée.")
            valid_permissions.append(perm) # On passe les objets Permission au service

    # Le service set_role_permissions attend une liste d'ID, pas d'objets.
    # On va ajuster cela ou le service. Pour l'instant, on envoie les IDs.
    updated_role = services.role_service.set_role_permissions(
        db, role=role, permission_ids=permissions_update.permission_ids
    )
    return updated_role

# On pourrait aussi avoir des endpoints pour ajouter/retirer une seule permission à la fois:
# POST /{role_id}/permissions/{permission_id}
# DELETE /{role_id}/permissions/{permission_id}
# Pour l'instant, set_role_permissions est plus simple à gérer.
