from sqlalchemy.ext.declarative import as_declarative, declared_attr
from typing import Any
import re

@as_declarative()
class Base:
    id: Any
    __name__: str
    @declared_attr
    def __tablename__(cls) -> str:
        name = cls.__name__
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower() + 's'
