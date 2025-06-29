import uuid
from typing import List, Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy import func # Pour count

from app import models, schemas # Importer depuis les __init__ principaux
from app.core.exceptions import DuplicateEntityError, EntityNotFoundError

# === Service pour MenuCategory ===

def get_category(db: Session, category_id: uuid.UUID) -> Optional[models.MenuCategory]:
    """Récupère une catégorie de menu par son ID."""
    return db.query(models.MenuCategory).filter(models.MenuCategory.id == category_id).first()

def get_category_by_name(db: Session, name: str) -> Optional[models.MenuCategory]:
    """Récupère une catégorie de menu par son nom."""
    return db.query(models.MenuCategory).filter(func.lower(models.MenuCategory.name) == func.lower(name)).first()

def get_categories(
    db: Session, skip: int = 0, limit: int = 100, active_only: bool = False
) -> List[models.MenuCategory]:
    """Récupère une liste de catégories de menu avec pagination et filtre d'activité."""
    query = db.query(models.MenuCategory)
    if active_only:
        query = query.filter(models.MenuCategory.is_active == True)
    return query.order_by(models.MenuCategory.sort_order, models.MenuCategory.name).offset(skip).limit(limit).all()

def get_categories_count(db: Session, active_only: bool = False) -> int:
    """Compte le nombre total de catégories, avec filtre d'activité optionnel."""
    query = db.query(func.count(models.MenuCategory.id))
    if active_only:
        query = query.filter(models.MenuCategory.is_active == True)
    return query.scalar_one()


def create_category(db: Session, category_in: schemas.MenuCategoryCreate) -> models.MenuCategory:
    """Crée une nouvelle catégorie de menu."""
    existing_category = get_category_by_name(db, name=category_in.name)
    if existing_category:
        raise DuplicateEntityError(entity_name="Catégorie de menu", conflicting_field="nom", conflicting_value=category_in.name)

    db_category = models.MenuCategory(**category_in.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(
    db: Session,
    category_to_update: models.MenuCategory,
    category_in: schemas.MenuCategoryUpdate
) -> models.MenuCategory:
    """Met à jour une catégorie de menu."""
    update_data = category_in.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] != category_to_update.name:
        existing_category = get_category_by_name(db, name=update_data["name"])
        if existing_category and existing_category.id != category_to_update.id:
            raise DuplicateEntityError(entity_name="Catégorie de menu", conflicting_field="nom", conflicting_value=update_data["name"])

    for field, value in update_data.items():
        if hasattr(category_to_update, field):
            setattr(category_to_update, field, value)

    db.add(category_to_update)
    db.commit()
    db.refresh(category_to_update)
    return category_to_update

def delete_category(db: Session, category_to_delete: models.MenuCategory) -> models.MenuCategory:
    """Supprime une catégorie de menu."""
    if category_to_delete.menu_items: # Vérifier si la catégorie contient des articles
         raise HTTPException( # Importer HTTPException et status depuis fastapi dans le service (ou remonter l'erreur)
             status_code=409, # Conflit
             detail=f"Impossible de supprimer la catégorie '{category_to_delete.name}' car elle contient des articles de menu."
         )
    db.delete(category_to_delete)
    db.commit()
    return category_to_delete


# === Service pour MenuItem ===

def get_menu_item(db: Session, item_id: uuid.UUID) -> Optional[models.MenuItem]:
    """Récupère un article de menu par son ID."""
    return db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()

def get_menu_items_by_category(
    db: Session, category_id: uuid.UUID, skip: int = 0, limit: int = 100, active_only: bool = False
) -> List[models.MenuItem]:
    """Récupère les articles de menu pour une catégorie donnée."""
    query = db.query(models.MenuItem).filter(models.MenuItem.category_id == category_id)
    if active_only:
        query = query.filter(models.MenuItem.is_available == True)
    return query.order_by(models.MenuItem.sort_order, models.MenuItem.name).offset(skip).limit(limit).all()

def get_menu_items_by_category_count(db: Session, category_id: uuid.UUID, active_only: bool = False) -> int:
    """Compte le nombre d'articles de menu pour une catégorie donnée."""
    query = db.query(func.count(models.MenuItem.id)).filter(models.MenuItem.category_id == category_id)
    if active_only:
        query = query.filter(models.MenuItem.is_available == True)
    return query.scalar_one()

def get_all_menu_items(
    db: Session, skip: int = 0, limit: int = 100, active_only: bool = False
) -> List[models.MenuItem]:
    """Récupère tous les articles de menu (toutes catégories confondues)."""
    query = db.query(models.MenuItem)
    if active_only:
        query = query.filter(models.MenuItem.is_available == True)
    # On pourrait vouloir trier par catégorie puis par article
    return query.order_by(models.MenuItem.category_id, models.MenuItem.sort_order, models.MenuItem.name).offset(skip).limit(limit).all()

def get_all_menu_items_count(db: Session, active_only: bool = False) -> int:
    """Compte le nombre total d'articles de menu."""
    query = db.query(func.count(models.MenuItem.id))
    if active_only:
        query = query.filter(models.MenuItem.is_available == True)
    return query.scalar_one()


def create_menu_item(db: Session, item_in: schemas.MenuItemCreate) -> models.MenuItem:
    """Crée un nouvel article de menu."""
    # Vérifier si la catégorie parente existe
    category = get_category(db, category_id=item_in.category_id)
    if not category:
        # Lever une erreur si la catégorie n'existe pas.
        # Le routeur devrait retourner un 404 ou 400.
        # On peut utiliser EntityNotFoundError ou une HTTPException spécifique.
        raise EntityNotFoundError(entity_name="Catégorie de menu parente", entity_id=str(item_in.category_id))
        # Ou plus directement, mais moins propre pour la séparation des préoccupations:
        # raise HTTPException(status_code=400, detail=f"La catégorie avec ID {item_in.category_id} n'existe pas.")

    # On pourrait vérifier si un article avec le même nom existe déjà dans la même catégorie
    # existing_item = db.query(models.MenuItem).filter(
    #     models.MenuItem.name == item_in.name,
    #     models.MenuItem.category_id == item_in.category_id
    # ).first()
    # if existing_item:
    #     raise DuplicateEntityError(entity_name="Article de menu", conflicting_field="nom (dans cette catégorie)", conflicting_value=item_in.name)

    db_item = models.MenuItem(**item_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_menu_item(
    db: Session,
    item_to_update: models.MenuItem,
    item_in: schemas.MenuItemUpdate
) -> models.MenuItem:
    """Met à jour un article de menu."""
    update_data = item_in.model_dump(exclude_unset=True)

    if "category_id" in update_data and update_data["category_id"] != item_to_update.category_id:
        new_category = get_category(db, category_id=update_data["category_id"])
        if not new_category:
            raise EntityNotFoundError(entity_name="Nouvelle catégorie de menu parente", entity_id=str(update_data["category_id"]))

    for field, value in update_data.items():
        if hasattr(item_to_update, field):
            setattr(item_to_update, field, value)

    db.add(item_to_update)
    db.commit()
    db.refresh(item_to_update)
    return item_to_update

def delete_menu_item(db: Session, item_to_delete: models.MenuItem) -> models.MenuItem:
    """Supprime un article de menu."""
    # Vérifier si l'article est dans des commandes, etc. avant de supprimer (logique métier plus avancée)
    db.delete(item_to_delete)
    db.commit()
    return item_to_delete
