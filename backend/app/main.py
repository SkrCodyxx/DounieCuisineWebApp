import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
# from fastapi.exceptions import RequestValidationError # Non utilisé pour l'instant

from .core.config import settings
from .core.exceptions import DounieCuisineBaseException # EntityNotFoundError non utilisé ici
from .core.logging_config import setup_logging

# Importer les routeurs
from .routers import auth as auth_router # Renommer pour éviter conflit avec module auth

setup_logging()
logger = logging.getLogger("app.main") # Utiliser un logger nommé "app" ou sous-module

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG_MODE,
    description=("API pour la gestion intégrée de Dounie Cuisine, service traiteur et organisateur d'événements.")
)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Démarrage de l'application '{settings.APP_NAME}' v{settings.APP_VERSION}.")
    logger.info(f"Mode DEBUG: {settings.DEBUG_MODE}")

# --- Gestionnaires d'exceptions ---
@app.exception_handler(DounieCuisineBaseException)
async def dounie_cuisine_exception_handler(request: Request, exc: DounieCuisineBaseException):
    logger.error(f"Erreur métier interceptée: {exc.message} (URL: {request.url.path})")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Erreur serveur non interceptée (URL: {request.url.path}): {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Une erreur interne du serveur est survenue."},
    )

# --- Inclusion des Routeurs ---
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication & Users"])
# Ajoutez d'autres routeurs ici, par exemple pour les items, commandes, etc.
# app.include_router(items_router.router, prefix="/items", tags=["Items"])


# --- Routes de base (peuvent être retirées si les routeurs couvrent tout) ---
@app.get("/", tags=["Root"])
async def read_root():
    logger.info("Route racine '/' appelée.")
    return {
        "message": f"Bienvenue sur {settings.APP_NAME} v{settings.APP_VERSION}",
        "debug_mode": settings.DEBUG_MODE,
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/ping", tags=["Utilities"])
async def ping():
    logger.debug("Route '/ping' appelée.")
    return {"ping": "pong!"}

# Les exemples de routes d'erreur peuvent être mis dans un routeur de test dédié plus tard.
# @app.get("/test_error/{item_id}", tags=["Tests"])
# async def test_error_route(item_id: str):
#     # ... (logique de test_error_route)
