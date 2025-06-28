# Ce fichier est crucial pour qu'Alembic et SQLAlchemy puissent découvrir les modèles.
# Il doit importer les classes de modèles et potentiellement les tables d'association si elles sont définies globalement.
from app.db.base_class import Base # Assurer que Base est connue lors de l'import des modèles

from .user import User, user_role_association
from .role import Role, role_permission_association
from .permission import Permission
