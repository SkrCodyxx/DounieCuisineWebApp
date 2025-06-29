import React, { useState } from 'react';
import { Search, Filter, Download, Eye, User, Calendar, Activity } from 'lucide-react';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  // Données d'exemple
  const auditLogs = [
    {
      id: 1,
      userId: 'admin-1',
      userName: 'Admin Principal',
      action: 'CREATE',
      tableName: 'menu_items',
      recordId: '15',
      description: 'Création d\'un nouvel article de menu',
      oldValues: null,
      newValues: {
        name: 'Griot Traditionnel',
        price: 28.99,
        category: 'Plats principaux',
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-15 14:30:25',
    },
    {
      id: 2,
      userId: 'manager-1',
      userName: 'Manager Restaurant',
      action: 'UPDATE',
      tableName: 'orders',
      recordId: 'CMD-2024-001',
      description: 'Mise à jour du statut de commande',
      oldValues: {
        status: 'pending',
      },
      newValues: {
        status: 'confirmed',
      },
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: '2024-01-15 13:45:12',
    },
    {
      id: 3,
      userId: 'admin-1',
      userName: 'Admin Principal',
      action: 'DELETE',
      tableName: 'users',
      recordId: '42',
      description: 'Suppression d\'un compte utilisateur inactif',
      oldValues: {
        email: 'ancien.user@email.com',
        status: 'inactive',
      },
      newValues: null,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-15 12:20:08',
    },
    {
      id: 4,
      userId: 'chef-1',
      userName: 'Chef Principal',
      action: 'UPDATE',
      tableName: 'inventory',
      recordId: '8',
      description: 'Mise à jour du stock d\'inventaire',
      oldValues: {
        current_stock: 15,
      },
      newValues: {
        current_stock: 8,
      },
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      timestamp: '2024-01-15 11:15:33',
    },
    {
      id: 5,
      userId: 'admin-1',
      userName: 'Admin Principal',
      action: 'CREATE',
      tableName: 'reservations',
      recordId: 'RES-2024-005',
      description: 'Création d\'une nouvelle réservation',
      oldValues: null,
      newValues: {
        client_name: 'Sophie Martin',
        event_date: '2024-02-14',
        guest_count: 25,
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-15 10:30:45',
    },
  ];

  const actions = [
    { value: 'all', label: 'Toutes les actions' },
    { value: 'CREATE', label: 'Création' },
    { value: 'UPDATE', label: 'Modification' },
    { value: 'DELETE', label: 'Suppression' },
    { value: 'LOGIN', label: 'Connexion' },
    { value: 'LOGOUT', label: 'Déconnexion' },
  ];

  const users = [
    { value: 'all', label: 'Tous les utilisateurs' },
    { value: 'admin-1', label: 'Admin Principal' },
    { value: 'manager-1', label: 'Manager Restaurant' },
    { value: 'chef-1', label: 'Chef Principal' },
  ];

  const dateRanges = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tableName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesUser = selectedUser === 'all' || log.userId === selectedUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'LOGIN': return '🔐';
      case 'LOGOUT': return '🚪';
      default: return '📝';
    }
  };

  const exportLogs = () => {
    // Ici, vous intégreriez la fonctionnalité d'export
    console.log('Export des logs d\'audit');
  };

  const viewLogDetails = (logId: number) => {
    // Ici, vous afficheriez les détails complets du log
    console.log(`Affichage des détails du log ${logId}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Journal d'audit
          </h1>
          <p className="text-gray-600">
            Suivez toutes les actions effectuées dans le système
          </p>
        </div>
        <button
          onClick={exportLogs}
          className="btn-outline flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Exporter
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total actions</p>
              <p className="text-2xl font-semibold text-gray-900">{auditLogs.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(auditLogs.map(log => log.userId)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-semibold text-gray-900">
                {auditLogs.filter(log => log.timestamp.startsWith('2024-01-15')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tables modifiées</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(auditLogs.map(log => log.tableName)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {actions.map(action => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {users.map(user => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journal des logs */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table/Enregistrement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horodatage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.description}</div>
                    {log.newValues && (
                      <div className="text-xs text-gray-500 mt-1">
                        Nouvelles valeurs: {Object.keys(log.newValues).join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.tableName}</div>
                    <div className="text-sm text-gray-500">ID: {log.recordId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {log.timestamp.split(' ')[0]}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.timestamp.split(' ')[1]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewLogDetails(log.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun log d'audit trouvé.</p>
          </div>
        )}
      </div>

      {/* Informations de sécurité */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-900">Informations de sécurité</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Tous les logs sont conservés pendant 2 ans pour des raisons de conformité</li>
                <li>Les données sensibles sont automatiquement masquées dans les logs</li>
                <li>L'accès aux logs d'audit est restreint aux administrateurs système</li>
                <li>Les logs sont sauvegardés quotidiennement et stockés de manière sécurisée</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}