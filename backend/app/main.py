import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from .core.config import settings
from .core.exceptions import DounieCuisineBaseException
from .core.logging_config import setup_logging

# Importer les routeurs
from .routers import auth as auth_router
from .routers import users as users_router
from .routers import roles as roles_router
from .routers import permissions as permissions_router
from .routers import company_settings as company_settings_router
from .routers import menu_categories as menu_categories_router # Ajout du routeur catégories menu
from .routers import menu_items as menu_items_router         # Ajout du routeur articles menu

setup_logging()
logger = logging.getLogger("app.main")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG_MODE,
    description=("API pour la gestion intégrée de Dounie Cuisine, service traiteur et organisateur d'événements."),
    # root_path="/api/v1", # Si l'API est servie sous un préfixe global
)

# --- Middlewares ---
app.state.limiter = None
# from .core.rate_limiter import limiter
# app.state.limiter = limiter
# from slowapi.errors import RateLimitExceeded
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HSTSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        return response
# if not settings.DEBUG_MODE:
#    app.add_middleware(HSTSMiddleware)


@app.on_event("startup")
async def startup_event():
    logger.info(f"Démarrage de l'application '{settings.APP_NAME}' v{settings.APP_VERSION}.")
    logger.info(f"Mode DEBUG: {settings.DEBUG_MODE}")
    logger.info(f"Origines CORS autorisées: {settings.ALLOWED_ORIGINS}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Arrêt de l'application '{settings.APP_NAME}'.")

# --- Gestionnaires d'exceptions ---
@app.exception_handler(DounieCuisineBaseException)
async def dounie_cuisine_exception_handler(request: Request, exc: DounieCuisineBaseException):
    logger.error(f"Erreur métier interceptée: {exc.message} (URL: {request.url.path})", exc_info=settings.DEBUG_MODE)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Erreur serveur non interceptée (URL: {request.url.path}): {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Une erreur interne du serveur est survenue."},
    )

# --- Inclusion des Routeurs ---
API_PREFIX = "/api/v1"

app.include_router(auth_router.router, prefix=f"{API_PREFIX}/auth", tags=["Authentification & Utilisateurs (Auth)"])
app.include_router(users_router.router, prefix=f"{API_PREFIX}/users", tags=["Utilisateurs (Admin & Profil)"])
app.include_router(roles_router.router, prefix=f"{API_PREFIX}/roles", tags=["Rôles (Admin)"])
app.include_router(permissions_router.router, prefix=f"{API_PREFIX}/permissions", tags=["Permissions (Admin)"])
app.include_router(company_settings_router.router, prefix=f"{API_PREFIX}/company-settings", tags=["Paramètres de l'Entreprise"])
app.include_router(menu_categories_router.router, prefix=f"{API_PREFIX}/menu-categories", tags=["Menu - Catégories"]) # Nouveau
app.include_router(menu_items_router.router, prefix=f"{API_PREFIX}/menu-items", tags=["Menu - Articles"])             # Nouveau


# --- Routes de base ---
@app.get("/", tags=["Racine"])
async def read_root():
    logger.info("Route racine '/' appelée.")
    return {
        "message": f"Bienvenue sur {settings.APP_NAME} v{settings.APP_VERSION}",
        "debug_mode": settings.DEBUG_MODE,
        "api_prefix": API_PREFIX,
        "docs_url": app.docs_url,
        "redoc_url": app.redoc_url
    }

@app.get("/ping", tags=["Utilitaires"])
async def ping():
    logger.debug("Route '/ping' appelée.")
    return {"ping": "pong!"}
