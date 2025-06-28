import logging
import sys
from app.core.config import settings # Importer nos paramètres

# Enlever les handlers existants du logger root pour éviter les duplications
# si cette fonction est appelée plusieurs fois (bien que généralement appelée une fois).
# logging.getLogger().handlers = [] # Peut être trop agressif si d'autres libs configurent le root logger.
# Il est souvent mieux de configurer les loggers spécifiques à l'application.

def setup_logging():
    """
    Configure le logging pour l'application.
    Peut être appelé au démarrage de l'application.
    """
    # Créer un logger pour notre application (peut être le logger root ou un logger nommé)
    # Pour une application, il est souvent bon d'avoir un logger racine pour l'app
    # ou de configurer le logger root de Python.
    # Ici, on va configurer le logger root.

    # Formatter
    log_formatter = logging.Formatter(fmt=settings.LOG_FORMAT, datefmt=settings.LOG_DATE_FORMAT)

    # Handler (console)
    console_handler = logging.StreamHandler(sys.stdout) # Envoyer vers stdout
    console_handler.setFormatter(log_formatter)

    # Configurer le logger root
    # Si on ne veut pas affecter les loggers des bibliothèques tierces,
    # on créerait un logger spécifique pour notre app: app_logger = logging.getLogger("app")
    # et on y ajouterait le handler.
    root_logger = logging.getLogger()

    # Nettoyer les handlers existants sur le root logger pour éviter la duplication
    # si cette fonction est appelée plusieurs fois ou si uvicorn ajoute déjà un handler.
    # Uvicorn ajoute ses propres handlers. Il faut donc être prudent ici.
    # Si on veut contrôler totalement, on peut mettre  dans dictConfig,
    # ou ici, on peut choisir de ne pas ajouter de handler si le root en a déjà un du même type.

    # Pour éviter les logs dupliqués avec Uvicorn, on peut vérifier si un handler similaire existe déjà
    # ou configurer le logger spécifique de notre application au lieu du root.
    # Alternative: configurer le logger "app"
    app_logger = logging.getLogger("app") # Ou settings.APP_NAME

    # Vider les handlers de notre logger applicatif pour éviter la duplication si setup_logging est appelé plusieurs fois
    if app_logger.hasHandlers():
        app_logger.handlers.clear()

    app_logger.addHandler(console_handler)
    app_logger.setLevel(settings.LOG_LEVEL)
    # Empêcher les logs de se propager au logger root si on gère "app" spécifiquement
    # et que le root a ses propres handlers (comme ceux d'Uvicorn)
    app_logger.propagate = False

    # Configurer aussi le logger root pour attraper les logs non gérés par "app"
    # ou les logs des bibliothèques, mais avec un niveau potentiellement différent.
    # Pour l'instant, on se concentre sur le logger de l'application.
    # Si Uvicorn est utilisé, il configure déjà le root logger.
    # On peut aussi configurer le niveau du root logger si on veut plus de verbosité des libs.
    # logging.getLogger().setLevel(settings.LOG_LEVEL) # Attention, peut rendre les libs très verbeuses

    # Exemple de configuration pour les loggers spécifiques d'Uvicorn pour qu'ils respectent notre niveau
    # (Uvicorn utilise 'uvicorn.error' et 'uvicorn.access')
    logging.getLogger("uvicorn.error").setLevel(settings.LOG_LEVEL.upper())
    logging.getLogger("uvicorn.access").setLevel(settings.LOG_LEVEL.upper())
    # Si on veut formater les logs d'accès d'Uvicorn différemment, il faudrait accéder à son handler.

    # Test initial du logger configuré
    # logger_test = logging.getLogger("app.core.logging_config_test") # Ou juste "app"
    # logger_test.info("Logging configuré avec succès depuis setup_logging.")
    # logger_test.debug("Message de debug test depuis setup_logging.")

# Note: L'appel à setup_logging() est fait dans app/main.py lors de l'événement startup.
