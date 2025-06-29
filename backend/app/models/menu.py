import uuid
from sqlalchemy import Column, String, Text, Float, Boolean, Integer, ForeignKey, Numeric # Ajout de Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY # Ajout de ARRAY pour les allergènes
from app.db.base_class import Base
from datetime import datetime # Bien que non utilisé directement ici, souvent utile

# Modèle pour les Catégories de Menu
class MenuCategory(Base):
    __tablename__ = "menu_categories" # Nom de table explicite et pluriel

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False, index=True) # Pour l'ordre d'affichage

    # Relation: Une catégorie a plusieurs articles de menu
    menu_items = relationship("MenuItem", back_populates="category", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<MenuCategory(id={self.id}, name='{self.name}')>"

# Modèle pour les Articles du Menu
class MenuItem(Base):
    __tablename__ = "menu_items" # Nom de table explicite et pluriel

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Utiliser Numeric pour les prix pour éviter les problèmes d'arrondi avec Float.
    # Précision de 10 chiffres au total, dont 2 après la virgule (ex: 12345678.90)
    price = Column(Numeric(10, 2), nullable=False)

    category_id = Column(UUID(as_uuid=True), ForeignKey("menu_categories.id"), nullable=False, index=True)

    image_url = Column(String(512), nullable=True) # URL vers une image de l'article

    # Allergènes: peut être une liste de strings. ARRAY(String) est spécifique à PostgreSQL.
    # Pour une portabilité maximale, on pourrait utiliser JSON ou une table de liaison.
    # Pour PostgreSQL, ARRAY est simple et efficace.
    allergens = Column(ARRAY(String), nullable=True) # ex: ["gluten", "noix", "lait"]

    ingredients = Column(Text, nullable=True) # Liste simple des ingrédients principaux

    preparation_time_minutes = Column(Integer, nullable=True) # Temps de préparation estimé en minutes
    calories = Column(Integer, nullable=True) # Estimation des calories

    is_available = Column(Boolean, default=True, nullable=False) # Si l'article est actuellement disponible à la commande
    is_featured = Column(Boolean, default=False, nullable=False) # Pour mettre en avant certains articles

    # Attributs diététiques/spécificités
    is_vegetarian = Column(Boolean, default=False, nullable=False)
    is_vegan = Column(Boolean, default=False, nullable=False)
    is_gluten_free = Column(Boolean, default=False, nullable=False)
    is_spicy = Column(Boolean, default=False, nullable=False) # Si le plat est épicé

    sort_order = Column(Integer, default=0, nullable=False, index=True) # Pour l'ordre d'affichage au sein d'une catégorie

    # Champs pour les articles festifs (à développer avec le module Thèmes Festifs)
    # is_festive_item = Column(Boolean, default=False, nullable=False)
    # festive_theme_id = Column(UUID(as_uuid=True), ForeignKey("festive_themes.id"), nullable=True, index=True)
    # festive_theme = relationship("FestiveTheme", back_populates="menu_items")

    # Relation: Un article de menu appartient à une catégorie
    category = relationship("MenuCategory", back_populates="menu_items")

    def __repr__(self):
        return f"<MenuItem(id={self.id}, name='{self.name}', price={self.price})>"

# Si on avait un modèle FestiveTheme (pour plus tard):
# class FestiveTheme(Base):
#     __tablename__ = "festive_themes"
#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     name = Column(String(100), nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     is_active = Column(Boolean, default=False)
#     start_date = Column(DateTime(timezone=True), nullable=True)
#     end_date = Column(DateTime(timezone=True), nullable=True)
#     menu_items = relationship("MenuItem", back_populates="festive_theme")
