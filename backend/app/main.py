import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
# from fastapi.exceptions import RequestValidationError # Non utilisé pour l'instant

from .core.config import settings
from .core.exceptions import DounieCuisineBaseException
from .core.logging_config import setup_logging

# Importer les routeurs
from .routers import auth as auth_router
from .routers import users as users_router # Ajout du routeur users

setup_logging()
logger = logging.getLogger("app.main")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG_MODE,
    description=("API pour la gestion intégrée de Dounie Cuisine, service traiteur et organisateur d'événements."),
    # On peut ajouter ici une URL racine pour tous les chemins si l'API est servie sous un préfixe global
    # root_path="/api/v1", # Exemple
)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Démarrage de l'application '{settings.APP_NAME}' v{settings.APP_VERSION}.")
    logger.info(f"Mode DEBUG: {settings.DEBUG_MODE}")
    # Ici, on pourrait initialiser des connexions à des services externes, etc.

@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Arrêt de l'application '{settings.APP_NAME}'.")
    # Nettoyer les ressources ici si nécessaire


# --- Gestionnaires d'exceptions ---
@app.exception_handler(DounieCuisineBaseException)
async def dounie_cuisine_exception_handler(request: Request, exc: DounieCuisineBaseException):
    logger.error(f"Erreur métier interceptée: {exc.message} (URL: {request.url.path})", exc_info=settings.DEBUG_MODE)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Erreur serveur non interceptée (URL: {request.url.path}): {exc}", exc_info=True) # Toujours logguer la stack trace pour les erreurs 500
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Une erreur interne du serveur est survenue."},
    )

# --- Inclusion des Routeurs ---
app.include_router(auth_router.router, prefix="/auth", tags=["Authentification & Utilisateurs (Auth)"])
app.include_router(users_router.router, prefix="/users", tags=["Utilisateurs (Admin & Profil)"])
# Le tag pour users_router est plus spécifique.

# Ajoutez d'autres routeurs ici, par exemple pour les items, commandes, etc.
# app.include_router(items_router.router, prefix="/items", tags=["Items"])


# --- Routes de base (peuvent être retirées si les routeurs couvrent tout) ---
@app.get("/", tags=["Racine"]) # Changement de tag pour être plus précis
async def read_root():
    logger.info("Route racine '/' appelée.")
    return {
        "message": f"Bienvenue sur {settings.APP_NAME} v{settings.APP_VERSION}",
        "debug_mode": settings.DEBUG_MODE,
        "docs_url": app.docs_url, # Utiliser les attributs de l'app pour les URLs de doc
        "redoc_url": app.redoc_url
    }

@app.get("/ping", tags=["Utilitaires"]) # Changement de tag
async def ping():
    logger.debug("Route '/ping' appelée.")
    return {"ping": "pong!"}
