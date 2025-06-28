from fastapi import HTTPException, status

# Exemple d'exception métier personnalisée.
# On pourrait hériter de HTTPException directement ou créer notre propre hiérarchie.

class DounieCuisineBaseException(Exception):
    """Classe de base pour les exceptions personnalisées de l'application."""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class EntityNotFoundError(DounieCuisineBaseException):
    """Levée lorsqu'une entité spécifique n'est pas trouvée."""
    def __init__(self, entity_name: str, entity_id: any):
        message = f"{entity_name} avec ID '{entity_id}' non trouvé(e)."
        super().__init__(message, status_code=status.HTTP_404_NOT_FOUND)

class DuplicateEntityError(DounieCuisineBaseException):
    """Levée lorsqu'une tentative de création d'entité dupliquée est détectée."""
    def __init__(self, entity_name: str, conflicting_field: str, conflicting_value: any):
        message = f"Un(e) {entity_name} avec {conflicting_field} '{conflicting_value}' existe déjà."
        super().__init__(message, status_code=status.HTTP_409_CONFLICT)

class NotPermittedError(DounieCuisineBaseException):
    """Levée lorsque l'utilisateur n'a pas les permissions pour une action."""
    def __init__(self, message: str = "Action non autorisée."):
        super().__init__(message, status_code=status.HTTP_403_FORBIDDEN)

# Vous pouvez ajouter d'autres exceptions spécifiques ici au besoin.
# Par exemple: InvalidInputError, AuthenticationFailedError, etc.

# Note : FastAPI gère déjà très bien les erreurs de validation Pydantic (HTTP 422).
# Ces exceptions personnalisées sont plus pour la logique métier.
