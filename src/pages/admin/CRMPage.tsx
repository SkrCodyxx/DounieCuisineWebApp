import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Phone, Mail, Calendar, Star } from 'lucide-react';

export default function CRMPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  // Données d'exemple
  const clients = [
    {
      id: 1,
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@email.com',
      phone: '(514) 123-4567',
      segment: 'premium',
      totalOrders: 12,
      totalSpent: 1250.75,
      lastOrder: '2024-01-15',
      loyaltyPoints: 850,
      preferences: ['Cuisine épicée', 'Sans gluten'],
      notes: 'Cliente fidèle, préfère les événements en soirée',
      createdAt: '2023-06-15',
    },
    {
      id: 2,
      firstName: 'Jean-Pierre',
      lastName: 'Laurent',
      email: 'jp.laurent@email.com',
      phone: '(514) 234-5678',
      segment: 'regular',
      totalOrders: 5,
      totalSpent: 425.50,
      lastOrder: '2024-01-10',
      loyaltyPoints: 320,
      preferences: ['Cuisine traditionnelle'],
      notes: 'Organise souvent des événements corporatifs',
      createdAt: '2023-09-20',
    },
    {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@email.com',
      phone: '(514) 345-6789',
      segment: 'new',
      totalOrders: 2,
      totalSpent: 125.00,
      lastOrder: '2024-01-08',
      loyaltyPoints: 95,
      preferences: ['Végétarien'],
      notes: 'Nouvelle cliente, intéressée par les options végétariennes',
      createdAt: '2024-01-01',
    },
  ];

  const segments = [
    { value: 'all', label: 'Tous les segments' },
    { value: 'premium', label: 'Premium' },
    { value: 'regular', label: 'Régulier' },
    { value: 'new', label: 'Nouveau' },
    { value: 'inactive', label: 'Inactif' },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || client.segment === selectedSegment;
    
    return matchesSearch && matchesSegment;
  });

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'premium': return 'Premium';
      case 'regular': return 'Régulier';
      case 'new': return 'Nouveau';
      case 'inactive': return 'Inactif';
      default: return segment;
    }
  };

  const selectedClientData = selectedClient ? clients.find(c => c.id === selectedClient) : null;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            CRM - Gestion des clients
          </h1>
          <p className="text-gray-600">
            Gérez vos relations clients et suivez leur historique
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau client
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total clients</p>
              <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clients premium</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clients.filter(c => c.segment === 'premium').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clients.filter(c => c.segment === 'new').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length).toFixed(0)} $
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des clients */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Filtres et recherche */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {segments.map(segment => (
                  <option key={segment.value} value={segment.value}>
                    {segment.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Liste des clients */}
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedClient === client.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {client.firstName[0]}{client.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(client.segment)}`}>
                            {getSegmentLabel(client.segment)}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {client.totalOrders} commandes
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {client.totalSpent.toFixed(2)} $
                      </p>
                      <p className="text-sm text-gray-500">
                        {client.loyaltyPoints} points
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun client trouvé.</p>
              </div>
            )}
          </div>
        </div>

        {/* Détails du client sélectionné */}
        <div className="lg:col-span-1">
          {selectedClientData ? (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Détails du client</h2>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Informations de base */}
                <div>
                  <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-600 font-medium text-xl">
                      {selectedClientData.firstName[0]}{selectedClientData.lastName[0]}
                    </span>
                  </div>
                  <h3 className="text-center font-medium text-gray-900">
                    {selectedClientData.firstName} {selectedClientData.lastName}
                  </h3>
                  <div className="flex justify-center mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(selectedClientData.segment)}`}>
                      {getSegmentLabel(selectedClientData.segment)}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{selectedClientData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{selectedClientData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Client depuis {selectedClientData.createdAt}</span>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-semibold text-gray-900">{selectedClientData.totalOrders}</p>
                    <p className="text-xs text-gray-600">Commandes</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-semibold text-gray-900">{selectedClientData.totalSpent.toFixed(0)} $</p>
                    <p className="text-xs text-gray-600">Total dépensé</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-semibold text-gray-900">{selectedClientData.loyaltyPoints}</p>
                    <p className="text-xs text-gray-600">Points fidélité</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-semibold text-gray-900">{selectedClientData.lastOrder}</p>
                    <p className="text-xs text-gray-600">Dernière commande</p>
                  </div>
                </div>

                {/* Préférences */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Préférences</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClientData.preferences.map((pref, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedClientData.notes}</p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full btn-primary text-sm">
                    Nouvelle commande
                  </button>
                  <button className="w-full btn-outline text-sm">
                    Envoyer un message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un client
                </h3>
                <p className="text-gray-600">
                  Choisissez un client dans la liste pour voir ses détails
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}