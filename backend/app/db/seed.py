import asyncio
import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError # Pour gérer les violations de contrainte unique

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine # engine pour créer les tables si besoin pour le seed standalone
from app import models # Importer tous les modèles pour qu'ils soient connus de Base.metadata
from app import schemas # Pour les types Pydantic si on les utilise pour structurer les données de seed

# Configurer un logger simple pour ce script de seed
logger = logging.getLogger("app.db.seed")
logging.basicConfig(level=logging.INFO, format='%(levelname)-8s | %(name)s - %(message)s')

# --- Données initiales à créer ---
# Superutilisateur
SUPERUSER_EMAIL = "admin@example.com" # Changez ceci !
SUPERUSER_PASSWORD = "ChangeThisPassword123!" # Changez ceci !

# Rôles de base
ROLES = [
    {"name": "admin", "description": "Administrateur avec tous les droits"},
    {"name": "manager", "description": "Manager avec droits étendus sur certaines opérations"},
    {"name": "client", "description": "Utilisateur client standard"},
    # Ajoutez d'autres rôles si nécessaire
]

# Permissions de base (convention: "resource:action" ou "feature_group:action")
# Ces permissions sont des exemples, à affiner selon les besoins réels de l'application.
PERMISSIONS = [
    # Utilisateurs
    {"name": "users:create", "description": "Créer des utilisateurs"},
    {"name": "users:read_all", "description": "Lire la liste de tous les utilisateurs"},
    {"name": "users:read_one", "description": "Lire les détails d'un utilisateur spécifique"},
    {"name": "users:update_any", "description": "Mettre à jour n'importe quel utilisateur"},
    {"name": "users:update_own", "description": "Mettre à jour son propre profil"},
    {"name": "users:delete_any", "description": "Supprimer n'importe quel utilisateur"},
    {"name": "users:manage_roles", "description": "Assigner/Révoquer des rôles aux utilisateurs"},
    # Rôles
    {"name": "roles:create", "description": "Créer des rôles"},
    {"name": "roles:read", "description": "Lire les rôles"},
    {"name": "roles:update", "description": "Mettre à jour les rôles"},
    {"name": "roles:delete", "description": "Supprimer des rôles"},
    {"name": "roles:manage_permissions", "description": "Assigner/Révoquer des permissions aux rôles"},
    # Permissions (généralement non gérées via CRUD API, mais listées pour info)
    {"name": "permissions:read", "description": "Lire la liste des permissions disponibles"},
    # Menu & Catalogue
    {"name": "menu:create", "description": "Créer des catégories/articles de menu"},
    {"name": "menu:read", "description": "Lire le menu/catalogue"},
    {"name": "menu:update", "description": "Mettre à jour des catégories/articles de menu"},
    {"name": "menu:delete", "description": "Supprimer des catégories/articles de menu"},
    # Commandes & Devis
    {"name": "orders:create_own", "description": "Créer ses propres commandes/devis"},
    {"name": "orders:read_own", "description": "Lire ses propres commandes/devis"},
    {"name": "orders:read_all", "description": "Lire toutes les commandes/devis (staff)"},
    {"name": "orders:update_status", "description": "Mettre à jour le statut des commandes (staff)"},
    # Ajoutez d'autres permissions pour chaque module...
]

# Assignations de permissions aux rôles (quelles permissions chaque rôle devrait avoir)
# Le rôle 'admin' aura toutes les permissions créées ci-dessus.
# Les autres rôles auront des sous-ensembles.
ROLE_PERMISSIONS_ASSIGNMENTS = {
    "admin": [p["name"] for p in PERMISSIONS], # L'admin a toutes les permissions listées
    "manager": [
        "users:read_all", "users:read_one",
        "menu:create", "menu:read", "menu:update", "menu:delete",
        "orders:read_all", "orders:update_status"
    ],
    "client": [
        "users:update_own", # Pour /users/me
        "orders:create_own", "orders:read_own",
        "menu:read" # Voir le menu
    ],
}


def seed_initial_data(db: Session) -> None:
    logger.info("Début du seeding des données initiales...")

    # 1. Créer les Rôles
    # ------------------
    created_roles_map = {} # Pour stocker les objets Role créés {name: Role_instance}
    logger.info("Création des rôles de base...")
    for role_data in ROLES:
        role = db.query(models.Role).filter(models.Role.name == role_data["name"]).first()
        if not role:
            try:
                role = models.Role(name=role_data["name"], description=role_data["description"])
                db.add(role)
                db.commit()
                db.refresh(role)
                logger.info(f"Rôle '{role.name}' créé.")
                created_roles_map[role.name] = role
            except IntegrityError: # Au cas où une autre session l'aurait créé entre-temps
                db.rollback()
                logger.warning(f"Rôle '{role_data['name']}' existe déjà (détecté par IntegrityError), récupération...")
                role = db.query(models.Role).filter(models.Role.name == role_data["name"]).first()
                created_roles_map[role.name] = role
            except Exception as e:
                db.rollback()
                logger.error(f"Erreur lors de la création du rôle '{role_data['name']}': {e}")
        else:
            logger.info(f"Rôle '{role.name}' existe déjà.")
            created_roles_map[role.name] = role
    logger.info("Création des rôles terminée.")

    # 2. Créer les Permissions
    # -----------------------
    created_permissions_map = {} # {name: Permission_instance}
    logger.info("Création des permissions de base...")
    for perm_data in PERMISSIONS:
        permission = db.query(models.Permission).filter(models.Permission.name == perm_data["name"]).first()
        if not permission:
            try:
                permission = models.Permission(name=perm_data["name"], description=perm_data["description"])
                db.add(permission)
                db.commit()
                db.refresh(permission)
                logger.info(f"Permission '{permission.name}' créée.")
                created_permissions_map[permission.name] = permission
            except IntegrityError:
                db.rollback()
                logger.warning(f"Permission '{perm_data['name']}' existe déjà (détecté par IntegrityError), récupération...")
                permission = db.query(models.Permission).filter(models.Permission.name == perm_data["name"]).first()
                created_permissions_map[permission.name] = permission
            except Exception as e:
                db.rollback()
                logger.error(f"Erreur lors de la création de la permission '{perm_data['name']}': {e}")
        else:
            logger.info(f"Permission '{permission.name}' existe déjà.")
            created_permissions_map[permission.name] = permission
    logger.info("Création des permissions terminée.")

    # 3. Assigner les Permissions aux Rôles
    # ------------------------------------
    logger.info("Assignation des permissions aux rôles...")
    for role_name, perm_names_for_role in ROLE_PERMISSIONS_ASSIGNMENTS.items():
        role = created_roles_map.get(role_name)
        if not role:
            logger.warning(f"Rôle '{role_name}' non trouvé pour l'assignation des permissions. Skipping.")
            continue

        current_role_permission_names = {p.name for p in role.permissions}
        for perm_name in perm_names_for_role:
            permission = created_permissions_map.get(perm_name)
            if not permission:
                logger.warning(f"Permission '{perm_name}' non trouvée pour assignation au rôle '{role_name}'. Skipping.")
                continue

            if permission.name not in current_role_permission_names:
                try:
                    role.permissions.append(permission)
                    # db.add(role) # L'ajout à la collection devrait suffire si l'objet est déjà dans la session
                    logger.info(f"Permission '{permission.name}' assignée au rôle '{role.name}'.")
                except Exception as e: # Gérer les erreurs potentielles lors de l'append
                    logger.error(f"Erreur lors de l'assignation de la permission '{permission.name}' au rôle '{role.name}': {e}")
            else:
                logger.info(f"Permission '{permission.name}' déjà assignée au rôle '{role.name}'.")
        try:
            db.commit() # Commit après avoir traité toutes les permissions pour un rôle
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors du commit des assignations de permissions pour le rôle '{role.name}': {e}")

    logger.info("Assignation des permissions aux rôles terminée.")


    # 4. Créer l'Utilisateur Superutilisateur
    # --------------------------------------
    logger.info(f"Vérification/Création du superutilisateur (email: {SUPERUSER_EMAIL})...")
    superuser = db.query(models.User).filter(models.User.email == SUPERUSER_EMAIL).first()
    if not superuser:
        try:
            hashed_password = get_password_hash(SUPERUSER_PASSWORD)
            superuser = models.User(
                email=SUPERUSER_EMAIL,
                hashed_password=hashed_password,
                first_name="Admin",
                last_name="DounieCuisine",
                is_active=True,
                is_superuser=True,
            )
            db.add(superuser)
            db.commit()
            db.refresh(superuser)
            logger.info(f"Superutilisateur '{superuser.email}' créé avec succès.")

            # Assigner le rôle 'admin' au superutilisateur
            admin_role = created_roles_map.get("admin")
            if admin_role:
                if admin_role not in superuser.roles:
                    superuser.roles.append(admin_role)
                    # db.add(superuser) # Déjà dans la session et modifié
                    db.commit()
                    db.refresh(superuser)
                    logger.info(f"Rôle 'admin' assigné au superutilisateur '{superuser.email}'.")
                else:
                    logger.info(f"Rôle 'admin' déjà assigné au superutilisateur '{superuser.email}'.")
            else:
                logger.warning("Rôle 'admin' non trouvé, impossible de l'assigner au superutilisateur.")

        except IntegrityError: # Si l'email est déjà pris (devrait être couvert par la vérification initiale)
            db.rollback()
            logger.warning(f"Superutilisateur avec email '{SUPERUSER_EMAIL}' existe déjà (détecté par IntegrityError).")
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la création du superutilisateur : {e}")
    else:
        logger.info(f"Superutilisateur '{superuser.email}' existe déjà.")
        # S'assurer qu'il est bien superuser et actif, et a le rôle admin
        needs_commit = False
        if not superuser.is_superuser:
            superuser.is_superuser = True
            logger.info(f"Superutilisateur '{superuser.email}' marqué comme is_superuser=True.")
            needs_commit = True
        if not superuser.is_active:
            superuser.is_active = True
            logger.info(f"Superutilisateur '{superuser.email}' marqué comme is_active=True.")
            needs_commit = True

        admin_role = created_roles_map.get("admin")
        if admin_role and admin_role not in superuser.roles:
            superuser.roles.append(admin_role)
            logger.info(f"Rôle 'admin' assigné au superutilisateur existant '{superuser.email}'.")
            needs_commit = True

        if needs_commit:
            try:
                db.commit()
                db.refresh(superuser)
            except Exception as e:
                db.rollback()
                logger.error(f"Erreur lors de la mise à jour du superutilisateur existant: {e}")

    logger.info("Seeding des données initiales terminé.")


async def main_async():
    """Fonction principale asynchrone pour le seeding (si on utilise des opérations async plus tard)."""
    # Pour l'instant, on utilise des sessions synchrones.
    # Si on passe à des sessions async avec asyncpg, il faudra adapter.
    logger.info("Initialisation de la base de données (création des tables si elles n'existent pas)...")
    # Ceci est utile si on lance le seed avant Alembic, ou pour des tests simples.
    # Dans un flux normal avec Alembic, Alembic s'occupe de créer les tables.
    # On le commente pour l'instant pour se fier à Alembic.
    # try:
    #     Base.metadata.create_all(bind=engine)
    #     logger.info("Tables créées/vérifiées.")
    # except Exception as e:
    #     logger.error(f"Erreur lors de la création des tables : {e}")
    #     logger.error("Assurez-vous que la base de données est accessible et que l'URL est correcte.")
    #     return # Ne pas continuer si les tables ne peuvent pas être créées

    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()

if __name__ == "__main__":
    # Ce script est destiné à être exécuté avec  depuis le répertoire
    # après avoir activé l'environnement virtuel.
    # Il suppose que la base de données est accessible et que les tables ont été créées (par Alembic).

    # Pour l'exécution directe via  (moins courant),
    # il faut s'assurer que le PYTHONPATH est correctement configuré pour trouver 'app'.
    # Le  dans env.py d'Alembic est un exemple de gestion de path.
    # Si on exécute avec  depuis , le path est géré.

    logger.info("Exécution du script de seeding...")
    # asyncio.run(main_async()) # Si on avait des opérations async
    # Pour l'instant, appel direct de la fonction synchrone de seeding
    db = SessionLocal()
    try:
        seed_initial_data(db)
    except Exception as e:
        logger.error(f"Une erreur majeure est survenue pendant le seeding: {e}", exc_info=True)
    finally:
        db.close()
    logger.info("Script de seeding terminé.")
