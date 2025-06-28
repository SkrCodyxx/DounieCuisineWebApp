from app.db.base_class import Base # Assurer que Base est connue

from .user import User, user_role_association
from .role import Role, role_permission_association
from .permission import Permission
from .company_settings import CompanySettings # Ajout du nouveau modèle

# Importer d'autres modèles ici au fur et à mesure de leur création
# from .menu_category import MenuCategory
# from .menu_item import MenuItem
