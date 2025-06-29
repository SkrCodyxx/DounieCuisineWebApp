import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';

export default function PublicFooter() {
  const { company } = useCompany();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informations de l'entreprise */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-display font-bold">
                  {company?.name || 'Dounie Cuisine Pro'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {company?.slogan || 'Saveurs authentiques des Caraïbes'}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Service traiteur haut de gamme spécialisé dans la cuisine haïtienne et caribéenne. 
              Nous créons des expériences culinaires mémorables pour tous vos événements.
            </p>
            <div className="flex space-x-4">
              {company?.social_media?.facebook && (
                <a
                  href={company.social_media.facebook}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {company?.social_media?.instagram && (
                <a
                  href={company.social_media.instagram}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {company?.social_media?.twitter && (
                <a
                  href={company.social_media.twitter}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Réservation
                </Link>
              </li>
              <li>
                <Link to="/galerie" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Galerie
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordonnées */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>{company?.address}</p>
                  <p>{company?.city}, {company?.province} {company?.postal_code}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-gray-300">{company?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-gray-300">{company?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation et copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {company?.name || 'Dounie Cuisine Pro'}. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Politique de confidentialité
              </Link>
              <Link to="/conditions-utilisation" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}