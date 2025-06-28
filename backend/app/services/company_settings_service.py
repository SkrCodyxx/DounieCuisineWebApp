from sqlalchemy.orm import Session
from typing import Optional, Dict, Any

from app import models, schemas # Importer depuis les __init__ principaux
from app.core.exceptions import EntityNotFoundError # Si on voulait une erreur spécifique

# Il n'y aura qu'une seule ligne dans la table company_settings.
# On peut utiliser un ID fixe connu ou simplement prendre la première (et unique) ligne.

def get_settings(db: Session) -> Optional[models.CompanySettings]:
    """
    Récupère l'unique ligne de paramètres de l'entreprise.
    Retourne None si aucune configuration n'a encore été créée.
    """
    return db.query(models.CompanySettings).first()

def update_settings(
    db: Session,
    settings_in: schemas.CompanySettingsUpdate
) -> models.CompanySettings:
    """
    Met à jour les paramètres de l'entreprise.
    Crée la ligne de configuration si elle n'existe pas encore.
    """
    db_settings = db.query(models.CompanySettings).first()

    update_data = settings_in.model_dump(exclude_unset=True)

    if db_settings is None:
        # Aucune configuration n'existe, on la crée.
        # On s'assure que les champs non optionnels dans le modèle ont des valeurs
        # soit depuis  soit par les valeurs par défaut du modèle SQLAlchemy.
        # Pydantic  ne fournira que les champs explicitement définis dans la requête.
        # Il faut donc s'assurer que  (qui est non-nullable dans le modèle) est fourni
        # si on crée une nouvelle entrée à partir de rien, ou qu'il a une valeur par défaut dans le modèle.
        # Notre modèle CompanySettings a une valeur par défaut pour company_name.

        # On peut initialiser avec toutes les données de  si elles sont fournies,
        # les valeurs par défaut du modèle SQLAlchemy s'appliqueront pour les autres.
        db_settings = models.CompanySettings(**update_data)
        db.add(db_settings)
        # logger.info("Création de la première configuration de l'entreprise.")
    else:
        # La configuration existe, on la met à jour.
        for field, value in update_data.items():
            if hasattr(db_settings, field):
                setattr(db_settings, field, value)
        # logger.info("Mise à jour de la configuration de l'entreprise.")

    db.commit()
    db.refresh(db_settings)
    return db_settings

# Alternative pour la création : s'assurer qu'un champ obligatoire est là
# def update_settings_strict_create(
#     db: Session,
#     settings_in: schemas.CompanySettingsUpdate
# ) -> models.CompanySettings:
#     db_settings = db.query(models.CompanySettings).first()
#     update_data = settings_in.model_dump(exclude_unset=True)

#     if db_settings is None:
#         if "company_name" not in update_data or update_data["company_name"] is None:
#              # Lever une exception ou définir une valeur par défaut ici avant de créer
#              # Puisque company_name a une valeur par défaut dans le modèle, cela devrait être géré.
#              # Mais si ce n'était pas le cas, il faudrait une validation.
#              pass # Laisser le modèle SQLAlchemy gérer la valeur par défaut.
#         db_settings = models.CompanySettings(**update_data)
#         db.add(db_settings)
#     else:
#         for field, value in update_data.items():
#             if hasattr(db_settings, field):
#                 setattr(db_settings, field, value)

#     db.commit()
#     db.refresh(db_settings)
#     return db_settings
