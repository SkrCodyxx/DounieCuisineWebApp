import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  // Données d'exemple
  const roles = [
    {
      id: 1,
      name: 'Super Administrateur',
      description: 'Accès complet à toutes les fonctionnalités du système',
      userCount: 2,
      permissions: [
        'user_management',
        'role_management',
        'company_settings',
        'menu_management',
        'order_management',
        'financial_management',
        'inventory_management',
        'crm_management',
        'content_management',
        'system_audit',
      ],
      createdAt: '2023-01-01',
    },
    {
      id: 2,
      name: 'Gestionnaire',
      description: 'Gestion des commandes, réservations et clients',
      userCount: 5,
      permissions: [
        'menu_management',
        'order_management',
        'reservation_management',
        'crm_management',
        'inventory_view',
      ],
      createdAt: '2023-01-15',
    },
    {
      id: 3,
      name: 'Employé',
      description: 'Accès limité aux fonctionnalités opérationnelles',
      userCount: 12,
      permissions: [
        'order_view',
        'reservation_view',
        'menu_view',
        'client_view',
      ],
      createdAt: '2023-02-01',
    },
    {
      id: 4,
      name: 'Client',
      description: 'Accès client standard',
      userCount: 156,
      permissions: [
        'profile_management',
        'order_history',
        'reservation_create',
        'loyalty_points',
      ],
      createdAt: '2023-01-01',
    },
  ];

  const allPermissions = [
    { id: 'user_management', name: 'Gestion des utilisateurs', category: 'Administration' },
    { id: 'role_management', name: 'Gestion des rôles', category: 'Administration' },
    { id: 'company_settings', name: 'Paramètres de l\'entreprise', category: 'Administration' },
    { id: 'system_audit', name: 'Audit système', category: 'Administration' },
    { id: 'menu_management', name: 'Gestion du menu', category: 'Contenu' },
    { id: 'menu_view', name: 'Consultation du menu', category: 'Contenu' },
    { id: 'content_management', name: 'Gestion du contenu', category: 'Contenu' },
    { id: 'order_management', name: 'Gestion des commandes', category: 'Opérations' },
    { id: 'order_view', name: 'Consultation des commandes', category: 'Opérations' },
    { id: 'order_history', name: 'Historique des commandes', category: 'Opérations' },
    { id: 'reservation_management', name: 'Gestion des réservations', category: 'Opérations' },
    { id: 'reservation_view', name: 'Consultation des réservations', category: 'Opérations' },
    { id: 'reservation_create', name: 'Création de réservations', category: 'Opérations' },
    { id: 'crm_management', name: 'Gestion CRM', category: 'Client' },
    { id: 'client_view', name: 'Consultation des clients', category: 'Client' },
    { id: 'profile_management', name: 'Gestion du profil', category: 'Client' },
    { id: 'loyalty_points', name: 'Points de fidélité', category: 'Client' },
    { id: 'financial_management', name: 'Gestion financière', category: 'Finance' },
    { id: 'inventory_management', name: 'Gestion de l\'inventaire', category: 'Inventaire' },
    { id: 'inventory_view', name: 'Consultation de l\'inventaire', category: 'Inventaire' },
  ];

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: typeof allPermissions } = {};
    allPermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const permissionsByCategory = getPermissionsByCategory();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion des rôles et permissions
          </h1>
          <p className="text-gray-600">
            Définissez les rôles et leurs permissions d'accès
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau rôle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des rôles */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rôles existants</h2>
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                    selectedRole === role.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                    <div className="flex items-center space-x-1">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{role.userCount} utilisateur{role.userCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Détails du rôle sélectionné */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="card">
              {(() => {
                const role = roles.find(r => r.id === selectedRole);
                if (!role) return null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{role.name}</h2>
                        <p className="text-gray-600">{role.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="btn-outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </button>
                        <button className="btn-primary">
                          Sauvegarder
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600">Utilisateurs</p>
                              <p className="text-lg font-semibold text-gray-900">{role.userCount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600">Permissions</p>
                              <p className="text-lg font-semibold text-gray-900">{role.permissions.length}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                        <div className="space-y-4">
                          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                            <div key={category} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {permissions.map((permission) => (
                                  <label key={permission.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={role.permissions.includes(permission.id)}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                      readOnly
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un rôle
                </h3>
                <p className="text-gray-600">
                  Choisissez un rôle dans la liste pour voir ses détails et permissions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}