import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Ajout pour accéder aux modules de l'application
# Cela suppose que alembic est exécuté depuis la racine du répertoire 'backend/'
# et que 'backend/' est dans le PYTHONPATH ou que l'on cd dans 'backend/' avant d'exécuter alembic.
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings # Charger notre config pour DATABASE_URL
# Importer Base et TOUS les modèles pour que Base.metadata les connaisse
from app.db.base_class import Base
import app.models # S'assure que app.models.__init__ est exécuté et enregistre les modèles

config = context.config # L'objet Config d'Alembic
# Surcharger sqlalchemy.url avec notre configuration applicative
if settings.DATABASE_URL:
    config.set_main_option('sqlalchemy.url', str(settings.DATABASE_URL))
else:
    # Gérer le cas où DATABASE_URL n'est pas défini, bien que pydantic devrait le forcer.
    # On pourrait lever une erreur ici ou utiliser une URL de fallback si pertinent.
    raise ValueError("DATABASE_URL not configured in settings for Alembic.")


if config.config_file_name is not None:
    fileConfig(config.config_file_name) # Pour la config de logging depuis alembic.ini

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"})
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}), # Utilise la section [alembic]
        prefix="sqlalchemy.", # Cherche les clés comme sqlalchemy.url
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
