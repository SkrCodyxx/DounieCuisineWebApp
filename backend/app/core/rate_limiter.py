from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.requests import Request # Pour get_remote_address

# Initialisation du Limiter.
# Par défaut, il utilise un stockage en mémoire ("memory://").
# Pour la production, un backend comme Redis est recommandé : "redis://localhost:6379"
# La clé de limite peut être basée sur l'adresse IP, l'ID utilisateur, etc.
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
# default_limits est une limite globale si aucun décorateur de limite spécifique n'est appliqué à une route.

# On pourrait définir des limites nommées ici pour les réutiliser
# exemple: limiter = Limiter(key_func=get_remote_address, config_filename="rate_limit.yaml")
# Ou les définir directement dans les décorateurs des routes.

# Le handler d'erreur pour RateLimitExceeded est déjà géré par slowapi
# mais si on voulait le personnaliser, on pourrait le faire ici et l'ajouter à l'app FastAPI.
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# (Ceci devrait être fait dans main.py)

# Exemple de comment l'utiliser sur une route dans un routeur FastAPI:
# from app.core.rate_limiter import limiter
# from starlette.requests import Request # Import nécessaire dans le fichier du routeur
#
# @router.post("/login")
# @limiter.limit("5/minute") # Appliquer une limite spécifique à cette route
# async def login(request: Request, ...): # request est nécessaire pour le limiteur par IP
#     ...

# Pour l'instant, ce fichier initialise juste le limiteur.
# L'application aux routes et la gestion de l'exception seront faites dans main.py
# ou directement sur les routeurs concernés.
