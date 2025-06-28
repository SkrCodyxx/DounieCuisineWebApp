import uuid
from pydantic import BaseModel, Field, HttpUrl, EmailStr # Ajout de HttpUrl, EmailStr
from typing import Optional, List, Dict, Any # Ajout de Dict, Any pour JSON

# --- Schéma de base pour les liens de réseaux sociaux (utilisé dans les schémas principaux) ---
class SocialMediaLink(BaseModel):
    name: str = Field(..., example="Facebook")
    url: HttpUrl = Field(..., example="https://facebook.com/douniecuisine")

# --- Schéma pour lire les paramètres de l'entreprise (réponse API) ---
# Ce schéma reflète tous les champs du modèle SQLAlchemy CompanySettings
class CompanySettingsRead(BaseModel):
    id: uuid.UUID # L'ID de la ligne unique de configuration
    company_name: str = Field(..., example="Dounie Cuisine")
    slogan: Optional[str] = Field(None, example="Saveurs authentiques des Caraïbes")
    address: Optional[str] = Field(None, example="123 Rue Principale, Montréal, QC H1H 1H1")
    contact_email: Optional[EmailStr] = Field(None, example="contact@douniecuisine.com")
    contact_phone: Optional[str] = Field(None, example="+1 (514) 123-4567")
    vat_number: Optional[str] = Field(None, example="TVQ 1234567890TQ0001")
    business_number: Optional[str] = Field(None, example="NEQ 1234567890")

    # Pour opening_hours, on s'attend à un dict. Pydantic peut valider sa structure si on définit un modèle.
    # Pour l'instant, on le laisse en Dict[str, str] ou Any.
    opening_hours: Optional[Dict[str, str]] = Field(None, example={"lundi": "9h-17h", "mardi": "9h-17h"})

    social_media_links: Optional[List[SocialMediaLink]] = Field(None, example=[{"name": "Instagram", "url": "https://instagram.com/douniecuisine"}])

    privacy_policy_url: Optional[HttpUrl] = Field(None, example="https://douniecuisine.com/privacy")
    terms_of_service_url: Optional[HttpUrl] = Field(None, example="https://douniecuisine.com/terms")

    logo_url: Optional[HttpUrl] = Field(None, example="https://douniecuisine.com/logo.png")
    favicon_url: Optional[HttpUrl] = Field(None, example="https://douniecuisine.com/favicon.ico")

    default_tps_rate: Optional[float] = Field(None, ge=0, le=1, example=0.05) # Taux entre 0 et 1
    default_tvq_rate: Optional[float] = Field(None, ge=0, le=1, example=0.09975)

    theme_primary_color: Optional[str] = Field(None, pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$", example="#FF5733")
    theme_secondary_color: Optional[str] = Field(None, pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$", example="#33FF57")

    model_config = {"from_attributes": True}


# --- Schéma pour mettre à jour les paramètres de l'entreprise ---
# Tous les champs sont optionnels, car on met à jour seulement ce qui est fourni.
class CompanySettingsUpdate(BaseModel):
    company_name: Optional[str] = Field(None, example="Dounie Cuisine Inc.")
    slogan: Optional[str] = Field(None, example="Nouvelles saveurs, même passion!")
    address: Optional[str] = Field(None)
    contact_email: Optional[EmailStr] = Field(None)
    contact_phone: Optional[str] = Field(None)
    vat_number: Optional[str] = Field(None)
    business_number: Optional[str] = Field(None)
    opening_hours: Optional[Dict[str, str]] = Field(None) # Permettre de mettre à jour tout le dict
    social_media_links: Optional[List[SocialMediaLink]] = Field(None) # Permettre de mettre à jour toute la liste
    privacy_policy_url: Optional[HttpUrl] = Field(None)
    terms_of_service_url: Optional[HttpUrl] = Field(None)
    logo_url: Optional[HttpUrl] = Field(None)
    favicon_url: Optional[HttpUrl] = Field(None)
    default_tps_rate: Optional[float] = Field(None, ge=0, le=1)
    default_tvq_rate: Optional[float] = Field(None, ge=0, le=1)
    theme_primary_color: Optional[str] = Field(None, pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$")
    theme_secondary_color: Optional[str] = Field(None, pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$")

    # On pourrait ajouter des validateurs ici si des logiques complexes sont nécessaires
    # pour la mise à jour (ex: si un champ est fourni, un autre devient obligatoire).
