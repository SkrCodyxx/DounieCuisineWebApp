import uuid
from typing import List, Optional, Set # Ajout de Set pour gérer les permissions
from sqlalchemy.orm import Session

from app import models, schemas # Importer depuis les __init__ principaux
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError

def get_role(db: Session, role_id: uuid.UUID) -> Optional[models.Role]:
    """Récupère un rôle par son ID."""
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_role_by_name(db: Session, name: str) -> Optional[models.Role]:
    """Récupère un rôle par son nom."""
    return db.query(models.Role).filter(models.Role.name == name).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100) -> List[models.Role]:
    """Récupère une liste de rôles avec pagination."""
    return db.query(models.Role).offset(skip).limit(limit).all()

def create_role(db: Session, role_in: schemas.RoleCreate) -> models.Role:
    """Crée un nouveau rôle."""
    existing_role = get_role_by_name(db, name=role_in.name)
    if existing_role:
        raise DuplicateEntityError(entity_name="Rôle", conflicting_field="nom", conflicting_value=role_in.name)

    db_role = models.Role(
        name=role_in.name,
        description=role_in.description
    )
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def update_role(
    db: Session,
    role_to_update: models.Role,
    role_in: schemas.RoleUpdate
) -> models.Role:
    """Met à jour un rôle."""
    update_data = role_in.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] != role_to_update.name:
        existing_role = get_role_by_name(db, name=update_data["name"])
        if existing_role and existing_role.id != role_to_update.id:
            raise DuplicateEntityError(entity_name="Rôle", conflicting_field="nom", conflicting_value=update_data["name"])

    for field, value in update_data.items():
        if hasattr(role_to_update, field):
            setattr(role_to_update, field, value)

    db.add(role_to_update)
    db.commit()
    db.refresh(role_to_update)
    return role_to_update

def delete_role(db: Session, role_to_delete: models.Role) -> models.Role:
    """Supprime un rôle."""
    # Avant de supprimer un rôle, il faudrait peut-être vérifier s'il est assigné à des utilisateurs.
    # Ou gérer cela avec des contraintes ON DELETE (SET NULL, RESTRICT) au niveau de la DB.
    # Pour l'instant, suppression directe.
    if role_to_delete.users: # Vérifier si des utilisateurs ont ce rôle
         raise HTTPException(
             status_code=status.HTTP_409_CONFLICT,
             detail=f"Impossible de supprimer le rôle '{role_to_delete.name}' car il est assigné à des utilisateurs."
         )

    db.delete(role_to_delete)
    db.commit()
    return role_to_delete


# --- Logique d'assignation Permissions <-> Rôles ---

def add_permission_to_role(db: Session, role: models.Role, permission: models.Permission) -> models.Role:
    """Ajoute une permission à un rôle."""
    if permission not in role.permissions:
        role.permissions.append(permission)
        db.add(role)
        db.commit()
        db.refresh(role)
    return role

def remove_permission_from_role(db: Session, role: models.Role, permission: models.Permission) -> models.Role:
    """Retire une permission d'un rôle."""
    if permission in role.permissions:
        role.permissions.remove(permission)
        db.add(role)
        db.commit()
        db.refresh(role)
    return role

def set_role_permissions(db: Session, role: models.Role, permission_ids: List[uuid.UUID]) -> models.Role:
    """Définit l'ensemble exact des permissions pour un rôle."""
    # Valider que toutes les permissions existent
    permissions_to_assign: List[models.Permission] = []
    if permission_ids: # Si la liste n'est pas vide
        permissions_to_assign = db.query(models.Permission).filter(models.Permission.id.in_(permission_ids)).all()
        if len(permissions_to_assign) != len(set(permission_ids)): # set() pour gérer les doublons dans permission_ids
            # Certaines permissions n'ont pas été trouvées, lever une erreur ou ignorer.
            # Pour l'instant, on lève une erreur implicite si une permission n'est pas trouvée,
            # ou on pourrait le faire explicitement.
            found_ids = {p.id for p in permissions_to_assign}
            missing_ids = set(permission_ids) - found_ids
            if missing_ids:
                # Idéalement, on utiliserait une exception personnalisée ici.
                # Pour l'instant, on va juste logguer/ignorer ou lever une HTTPException au niveau du routeur.
                # Ou on ne fait rien et on assigne juste celles qui sont trouvées.
                # Pour être strict, on devrait s'assurer que toutes les permissions fournies existent.
                # Ce type de validation est mieux géré au niveau du routeur/schéma d'entrée.
                pass # Pour l'instant, on continue avec les permissions trouvées.

    role.permissions = permissions_to_assign # Remplace toutes les permissions existantes
    db.add(role)
    db.commit()
    db.refresh(role)
    return role
