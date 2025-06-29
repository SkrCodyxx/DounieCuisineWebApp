import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Send, Download, FileText } from 'lucide-react';

export default function QuoteManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Données d'exemple
  const quotes = [
    {
      id: 1,
      quoteNumber: 'DEV-2024-001',
      clientName: 'Marie Dubois',
      clientEmail: 'marie.dubois@email.com',
      status: 'sent',
      items: [
        { name: 'Griot Traditionnel', quantity: 20, unitPrice: 28.99, total: 579.80 },
        { name: 'Riz Collé aux Pois', quantity: 20, unitPrice: 8.99, total: 179.80 },
      ],
      subtotal: 759.60,
      taxAmount: 119.51,
      discountAmount: 0,
      totalAmount: 879.11,
      validUntil: '2024-02-15',
      createdAt: '2024-01-15',
      notes: 'Événement d\'anniversaire pour 20 personnes',
    },
    {
      id: 2,
      quoteNumber: 'DEV-2024-002',
      clientName: 'Jean-Pierre Laurent',
      clientEmail: 'jp.laurent@email.com',
      status: 'draft',
      items: [
        { name: 'Poulet Créole', quantity: 15, unitPrice: 24.99, total: 374.85 },
        { name: 'Accras de Morue', quantity: 30, unitPrice: 12.99, total: 389.70 },
      ],
      subtotal: 764.55,
      taxAmount: 120.36,
      discountAmount: 50.00,
      totalAmount: 834.91,
      validUntil: '2024-02-20',
      createdAt: '2024-01-12',
      notes: 'Événement corporatif',
    },
    {
      id: 3,
      quoteNumber: 'DEV-2024-003',
      clientName: 'Sophie Martin',
      clientEmail: 'sophie.martin@email.com',
      status: 'accepted',
      items: [
        { name: 'Menu complet mariage', quantity: 80, unitPrice: 45.00, total: 3600.00 },
      ],
      subtotal: 3600.00,
      taxAmount: 566.91,
      discountAmount: 200.00,
      totalAmount: 3966.91,
      validUntil: '2024-03-01',
      createdAt: '2024-01-08',
      notes: 'Mariage - Menu personnalisé',
    },
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'sent', label: 'Envoyé' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'rejected', label: 'Refusé' },
    { value: 'expired', label: 'Expiré' },
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Refusé';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion des devis
          </h1>
          <p className="text-gray-600">
            Créez et gérez vos devis clients
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau devis
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total devis</p>
              <p className="text-2xl font-semibold text-gray-900">{quotes.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quotes.filter(q => q.status === 'sent').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acceptés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quotes.filter(q => q.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur totale</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quotes.reduce((sum, q) => sum + q.totalAmount, 0).toFixed(0)} $
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des devis */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.quoteNumber}</div>
                      <div className="text-sm text-gray-500">Créé le {quote.createdAt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.clientName}</div>
                      <div className="text-sm text-gray-500">{quote.clientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {quote.totalAmount.toFixed(2)} $
                    </div>
                    <div className="text-sm text-gray-500">
                      {quote.items.length} article{quote.items.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.validUntil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-900" title="Voir">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </button>
                      {quote.status === 'draft' && (
                        <button className="text-green-600 hover:text-green-900" title="Envoyer">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900" title="Télécharger PDF">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun devis trouvé.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">1</span> à{' '}
          <span className="font-medium">{filteredQuotes.length}</span> sur{' '}
          <span className="font-medium">{quotes.length}</span> résultats
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Précédent
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}