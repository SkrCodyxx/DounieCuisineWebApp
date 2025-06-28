import uuid
from sqlalchemy import Column, String, Text, Float, JSON # JSON pour stocker des listes simples comme les liens RS
from sqlalchemy.dialects.postgresql import UUID # Si on veut un ID UUID pour la ligne unique
from sqlalchemy.orm import validates # Pour valider les données avant insertion/update
from app.db.base_class import Base

class CompanySettings(Base):
    """
    Modèle SQLAlchemy pour les paramètres de l'entreprise.
    Cette table est conçue pour n'avoir qu'une seule ligne.
    L'unicité sera gérée au niveau du service (créer si n'existe pas, sinon mettre à jour).
    On pourrait aussi ajouter une contrainte CHECK (id = constante) en DB.
    """
    # __tablename__ sera 'company_settingss' par la classe Base, ce qui est un peu étrange.
    # On peut le surcharger ici pour un nom plus approprié.
    __tablename__ = "company_settings"

    # Utiliser un ID simple si on s'assure qu'il n'y a qu'une ligne,
    # ou un UUID si on préfère. Pour une seule ligne, un Integer avec une valeur fixe est courant.
    # Par exemple, un ID=1 pour cette unique ligne de configuration.
    # id = Column(Integer, primary_key=True, default=1)
    # @validates('id')
    # def validate_id(self, key, value):
    #     if value != 1:
    #         raise ValueError("L'ID pour CompanySettings doit toujours être 1.")
    #     return value
    # Pour l'instant, utilisons UUID par cohérence avec les autres modèles,
    # même si c'est pour une seule ligne. Le service s'occupera de l'unicité logique.
    # Ou plus simple : un id auto-incrémenté et le service ne crée que la première ligne.
    # Alternative: pas d'ID auto-généré, mais un ID fixe ou un champ booléen "is_config_row" unique.
    # Pour cet exemple, on va avec un UUID, et le service gérera la logique "une seule ligne".

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    company_name = Column(String(255), nullable=False, default="Dounie Cuisine")
    slogan = Column(String(500), nullable=True)
    address = Column(Text, nullable=True) # Adresse complète

    # Contacts (peuvent être multiples, JSON ou champs séparés)
    # Pour simplifier, on peut utiliser des champs string, ou JSON pour plus de flexibilité.
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    # autre_contact = Column(String(255), nullable=True)

    # Numéros fiscaux (peuvent varier par pays/région, Text est flexible)
    vat_number = Column(String(100), nullable=True) # Numéro de TVA / GST / HST
    business_number = Column(String(100), nullable=True) # NEQ pour Québec, etc.

    # Horaires d'ouverture (pourrait être un JSON structuré ou Text)
    # Exemple JSON: {"lundi": "9h-17h", "mardi": "9h-17h", ... "dimanche": "Fermé"}
    opening_hours = Column(JSON, nullable=True)

    # Liens vers les réseaux sociaux (JSON est bien pour une liste de {name: url})
    # Exemple JSON: [{"name": "Facebook", "url": "..."}, {"name": "Instagram", "url": "..."}]
    social_media_links = Column(JSON, nullable=True)

    # Textes légaux
    privacy_policy_url = Column(String(512), nullable=True) # URL vers une page dédiée
    terms_of_service_url = Column(String(512), nullable=True) # URL vers une page dédiée
    # Alternative: stocker le texte directement si pas trop long et géré via admin
    # privacy_policy_text = Column(Text, nullable=True)
    # terms_of_service_text = Column(Text, nullable=True)

    # Logo et Favicon (URLs)
    logo_url = Column(String(512), nullable=True)
    favicon_url = Column(String(512), nullable=True)

    # Taux de taxes par défaut (TPS, TVQ pour le Canada/Québec)
    # Ces taux peuvent changer, donc stocker les valeurs numériques.
    default_tps_rate = Column(Float, nullable=True, default=0.05) # 5%
    default_tvq_rate = Column(Float, nullable=True, default=0.09975) # 9.975%
    # On pourrait avoir une table de taxes plus complexe si les taxes varient beaucoup.

    # Couleurs de thème (si personnalisables par l'admin)
    # Stocker les codes hexadécimaux des couleurs.
    theme_primary_color = Column(String(7), nullable=True, default="#FF5733") # Exemple: Orange
    theme_secondary_color = Column(String(7), nullable=True, default="#33FF57") # Exemple: Vert

    # Il n'y a pas de created_at / updated_at ici car on s'attend à une seule ligne
    # qui est mise à jour. Si on veut tracer les modifs, on peut les ajouter.

    def __repr__(self):
        return f"<CompanySettings(id={self.id}, name='{self.company_name}')>"
