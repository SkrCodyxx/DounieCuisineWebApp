from .token import Token, TokenPayload, RefreshToken, TokenData
from .user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserUpdateMe,
    UserRead,
    UserList,
    UserInDB,
    UserInDBBase,
    RoleReadMinimal as UserRoleReadMinimal # Alias pour clarté si utilisé dans UserRead
)
from .role import (
    RoleBase,
    RoleCreate,
    RoleUpdate,
    RoleRead,
    RoleList,
    PermissionReadMinimal as RolePermissionReadMinimal # Alias pour clarté si utilisé dans RoleRead
)
from .permission import (
    PermissionBase,
    PermissionCreate,
    PermissionUpdate,
    PermissionRead,
    PermissionList
)

# Note: RoleReadMinimal était défini dans user.py et role.py.
# Il est préférable de le définir une seule fois (ex: dans permission.py ou un fichier partagé minimal)
# ou de le renommer pour éviter confusion. Ici, j'ai utilisé des alias.
# Pour une meilleure structure, on créerait un  pour de tels schémas partagés
# ou on s'assurerait que les imports sont bien gérés.
# Pour l'instant,  est dans  et  dans .
# On va standardiser :  sera le schéma pour lire une permission dans un rôle.
# Et  sera le schéma pour lire un rôle dans un utilisateur.
# Pour que cela fonctionne, il faut s'assurer que  peut importer
# depuis  et vice-versa, ce qui peut créer des imports circulaires si mal géré.
# Une solution est d'utiliser des Forward References (strings) dans Pydantic ou de déplacer
# les schémas ReadMinimal dans leurs propres fichiers ou un fichier commun.

# Pour simplifier et éviter les imports circulaires pour l'instant :
# On va supposer que RoleReadMinimal dans user.py est OK,
# et que PermissionReadMinimal dans role.py est OK.
# On a aliasé RoleReadMinimal en UserRoleReadMinimal et PermissionReadMinimal en RolePermissionReadMinimal
# pour plus de clarté dans cet __init__.py.
