import uuid
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from decimal import Decimal # Pour les prix, afin de conserver la précision
from datetime import datetime # Pour created_at, updated_at si on les ajoute aux schémas Read

# --- Schémas pour MenuItem (pour éviter les dépendances circulaires avec MenuCategoryRead) ---
class MenuItemReadMinimal(BaseModel):
    id: uuid.UUID
    name: str
    price: Decimal # Utiliser Decimal pour les montants monétaires
    image_url: Optional[HttpUrl] = None
    is_available: bool

    model_config = {"from_attributes": True}

# --- Schémas pour MenuCategory ---
class MenuCategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="Entrées Chaudes")
    description: Optional[str] = Field(None, max_length=500, example="Nos délicieuses entrées pour bien commencer.")
    is_active: bool = True
    sort_order: int = Field(0, description="Ordre d'affichage de la catégorie.")

class MenuCategoryCreate(MenuCategoryBase):
    pass

class MenuCategoryUpdate(BaseModel): # Permet des mises à jour partielles
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class MenuCategoryRead(MenuCategoryBase):
    id: uuid.UUID
    # Si on veut inclure les items directement dans la catégorie :
    menu_items: List[MenuItemReadMinimal] = []

    model_config = {"from_attributes": True}

class MenuCategoryList(BaseModel):
    items: List[MenuCategoryRead]
    total: int

# --- Schémas pour MenuItem ---
# Schéma minimal pour MenuCategory (utilisé dans MenuItemRead)
class MenuCategoryReadMinimal(BaseModel):
    id: uuid.UUID
    name: str
    model_config = {"from_attributes": True}

class MenuItemBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200, example="Accras de Morue")
    description: Optional[str] = Field(None, example="Beignets de morue croustillants, spécialité antillaise.")
    price: Decimal = Field(..., gt=0, decimal_places=2, example=12.50) # Prix positif, 2 décimales
    image_url: Optional[HttpUrl] = Field(None, example="https://example.com/images/accras.jpg")
    allergens: Optional[List[str]] = Field(None, example=["gluten", "poisson"])
    ingredients: Optional[str] = Field(None, example="Morue, farine, épices, piment") # Peut être une liste aussi
    preparation_time_minutes: Optional[int] = Field(None, ge=0, example=15)
    calories: Optional[int] = Field(None, ge=0, example=250)
    is_available: bool = True
    is_featured: bool = False
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    is_spicy: bool = False
    sort_order: int = Field(0, description="Ordre d'affichage de l'article dans sa catégorie.")
    category_id: uuid.UUID # ID de la catégorie à laquelle cet article appartient

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel): # Permet des mises à jour partielles
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    category_id: Optional[uuid.UUID] = None
    image_url: Optional[HttpUrl] = None
    allergens: Optional[List[str]] = None
    ingredients: Optional[str] = None
    preparation_time_minutes: Optional[int] = Field(None, ge=0)
    calories: Optional[int] = Field(None, ge=0)
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    is_spicy: Optional[bool] = None
    sort_order: Optional[int] = None

class MenuItemRead(MenuItemBase):
    id: uuid.UUID
    category: MenuCategoryReadMinimal # Informations de base de la catégorie associée

    model_config = {"from_attributes": True}

class MenuItemList(BaseModel):
    items: List[MenuItemRead]
    total: int
