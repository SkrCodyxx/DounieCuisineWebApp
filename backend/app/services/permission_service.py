import uuid
from typing import List, Optional
from sqlalchemy.orm import Session

from app import models, schemas # Importer depuis les __init__ principaux
from app.core.exceptions import DuplicateEntityError

# Les permissions sont souvent considérées comme plus statiques, définies par le code (comme dans seed.py)
# et moins gérées via une API CRUD complète, sauf pour la lecture.
# Si une gestion CRUD est nécessaire (ex: permissions dynamiques), voici une base.

def get_permission(db: Session, permission_id: uuid.UUID) -> Optional[models.Permission]:
    """Récupère une permission par son ID."""
    return db.query(models.Permission).filter(models.Permission.id == permission_id).first()

def get_permission_by_name(db: Session, name: str) -> Optional[models.Permission]:
    """Récupère une permission par son nom."""
    return db.query(models.Permission).filter(models.Permission.name == name).first()

def get_permissions(db: Session, skip: int = 0, limit: int = 1000) -> List[models.Permission]: # Limite plus élevée par défaut
    """Récupère une liste de permissions."""
    return db.query(models.Permission).order_by(models.Permission.name).offset(skip).limit(limit).all()

def create_permission(db: Session, permission_in: schemas.PermissionCreate) -> models.Permission:
    """
    Crée une nouvelle permission.
    Attention: souvent géré par le code/seed plutôt que dynamiquement.
    """
    existing_permission = get_permission_by_name(db, name=permission_in.name)
    if existing_permission:
        raise DuplicateEntityError(entity_name="Permission", conflicting_field="nom", conflicting_value=permission_in.name)

    db_permission = models.Permission(
        name=permission_in.name,
        description=permission_in.description
    )
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

def update_permission(
    db: Session,
    permission_to_update: models.Permission,
    permission_in: schemas.PermissionUpdate
) -> models.Permission:
    """
    Met à jour une permission (principalement sa description).
    Le nom d'une permission est généralement considéré comme immuable.
    """
    update_data = permission_in.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] != permission_to_update.name:
        # Généralement, on ne change pas le nom d'une permission car il est utilisé dans le code.
        # Si c'est permis, il faut vérifier la duplication.
        existing_permission = get_permission_by_name(db, name=update_data["name"])
        if existing_permission and existing_permission.id != permission_to_update.id:
            raise DuplicateEntityError(entity_name="Permission", conflicting_field="nom", conflicting_value=update_data["name"])
        permission_to_update.name = update_data["name"]

    if "description" in update_data:
        permission_to_update.description = update_data["description"]

    db.add(permission_to_update)
    db.commit()
    db.refresh(permission_to_update)
    return permission_to_update

def delete_permission(db: Session, permission_to_delete: models.Permission) -> models.Permission:
    """
    Supprime une permission.
    Attention: peut avoir des implications si la permission est utilisée par des rôles.
    Il faudrait une logique pour la retirer des rôles ou empêcher la suppression si utilisée.
    """
    # Vérifier si la permission est utilisée par des rôles
    if permission_to_delete.roles:
         raise HTTPException(
             status_code=status.HTTP_409_CONFLICT,
             detail=f"Impossible de supprimer la permission '{permission_to_delete.name}' car elle est assignée à des rôles."
         )

    db.delete(permission_to_delete)
    db.commit()
    return permission_to_delete
