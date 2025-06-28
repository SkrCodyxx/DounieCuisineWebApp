from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas, services # Importer depuis les __init__ principaux
from app.core import dependencies

router = APIRouter()

@router.get(
    "/",
    response_model=schemas.CompanySettingsRead,
    summary="Lire les paramètres de l'entreprise",
    description="Récupère la configuration actuelle de l'entreprise. Accessible à tous les utilisateurs authentifiés (ou public si désiré)."
    # Pour l'instant, on va le protéger pour les utilisateurs authentifiés simples.
    # Si cela doit être public, retirer la dépendance.
    # dependencies=[Depends(dependencies.get_current_active_user)] # Commenté pour le rendre public pour l'instant
)
def read_company_settings(
    db: Session = Depends(dependencies.get_db),
):
    """
    Récupère les paramètres actuels de l'entreprise.
    Si aucune configuration n'a été définie, cela peut retourner une erreur 404
    ou des valeurs par défaut si le service est conçu pour en créer une au premier accès.
    Notre service actuel retourne None si non trouvé, donc nous devons gérer ce cas.
    """
    settings = services.company_settings_service.get_settings(db)
    if settings is None:
        # Option 1: Retourner une 404 si aucune config n'est définie.
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paramètres de l'entreprise non configurés.")
        # Option 2: Créer une configuration par défaut au premier appel GET (peut être fait dans le service)
        #           ou retourner un objet CompanySettingsRead avec des valeurs par défaut Pydantic.
        # Pour l'instant, on va opter pour une création implicite par le PUT, et le GET retourne 404 si vide.
        # Modification: le service get_settings pourrait créer une instance par défaut si elle n'existe pas.
        # Ou, plus simplement, le service update_settings crée si n'existe pas.
        # Si get_settings retourne None, c'est qu'elle n'a jamais été créée via PUT.
        # On va retourner un objet vide ou avec des valeurs par défaut du schéma Pydantic si rien en DB.
        # Le plus simple est de laisser le service update créer la première instance.
        # Donc, si  est None, c'est qu'il n'y a rien.
        # On peut soit retourner 404, soit un objet vide qui sera rempli par les valeurs par défaut du schéma.
        # Si le modèle SQLAlchemy a des valeurs par défaut, le service
        # les utilisera lors de la première création si rien n'est fourni.
        # Le service  retournera cet objet une fois créé.
        # Donc, si  retourne None, c'est vraiment qu'il n'y a rien.
        # Il est plus logique que la première configuration soit faite par un admin via PUT.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Les paramètres de l'entreprise n'ont pas encore été configurés."
        )
    return settings


@router.put(
    "/",
    response_model=schemas.CompanySettingsRead,
    summary="Mettre à jour les paramètres de l'entreprise (Admin)",
    dependencies=[Depends(dependencies.get_current_active_superuser)] # Seul un superuser peut modifier
)
def update_company_settings(
    settings_in: schemas.CompanySettingsUpdate,
    db: Session = Depends(dependencies.get_db),
    # current_admin: models.User = Depends(dependencies.get_current_active_superuser) # Déjà dans la dépendance globale
):
    """
    Met à jour les paramètres de l'entreprise.
    Si aucune configuration n'existe, elle sera créée.
    Accessible uniquement par les superutilisateurs.
    """
    # Le service company_settings_service.update_settings gère la création si non existant.
    updated_settings = services.company_settings_service.update_settings(db, settings_in=settings_in)
    return updated_settings
