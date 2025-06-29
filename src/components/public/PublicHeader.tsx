import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../contexts/AuthContext';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { company } = useCompany();
  const { user } = useAuth();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Réservation', href: '/reservation' },
    { name: 'Galerie', href: '/galerie' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Barre d'information */}
      <div className="bg-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{company?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>{company?.email}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Service traiteur professionnel • Montréal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-display font-bold text-gray-900">
                  {company?.name || 'Dounie Cuisine Pro'}
                </h1>
                <p className="text-xs text-gray-600">
                  {company?.slogan || 'Saveurs authentiques des Caraïbes'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/client"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Mon compte
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/connexion"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="btn-primary text-sm"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <Link
                    to="/client"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon compte
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/connexion"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}