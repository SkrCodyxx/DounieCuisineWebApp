import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCheck,
  Settings,
  Menu,
  FileText,
  ShoppingCart,
  Calendar,
  Package,
  DollarSign,
  Gift,
  Palette,
  Image,
  FileEdit,
  MessageSquare,
  Activity,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { name: 'Rôles & Permissions', href: '/admin/roles', icon: Shield },
  { name: 'CRM Clients', href: '/admin/crm', icon: UserCheck },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
  { name: 'Menu & Catalogue', href: '/admin/menu', icon: Menu },
  { name: 'Devis', href: '/admin/devis', icon: FileText },
  { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  { name: 'Réservations', href: '/admin/reservations', icon: Calendar },
  { name: 'Calendrier', href: '/admin/calendrier', icon: Calendar },
  { name: 'Inventaire', href: '/admin/inventaire', icon: Package },
  { name: 'Finances', href: '/admin/finances', icon: DollarSign },
  { name: 'Fidélité', href: '/admin/fidelite', icon: Gift },
  { name: 'Thèmes', href: '/admin/themes', icon: Palette },
  { name: 'Médias', href: '/admin/medias', icon: Image },
  { name: 'Contenu', href: '/admin/contenu', icon: FileEdit },
  { name: 'Messagerie', href: '/admin/messagerie', icon: MessageSquare },
  { name: 'Audit', href: '/admin/audit', icon: Activity },
];

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-display font-bold text-gray-900">
              Administration
            </h1>
            <p className="text-xs text-gray-600">Dounie Cuisine Pro</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}