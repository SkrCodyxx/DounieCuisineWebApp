import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Données d'exemple
  const orders = [
    {
      id: 1,
      orderNumber: 'CMD-2024-001',
      clientName: 'Marie Dubois',
      clientEmail: 'marie.dubois@email.com',
      clientPhone: '(514) 123-4567',
      status: 'preparing',
      items: [
        { name: 'Griot Traditionnel', quantity: 2, unitPrice: 28.99, total: 57.98 },
        { name: 'Riz Collé aux Pois', quantity: 2, unitPrice: 8.99, total: 17.98 },
      ],
      subtotal: 75.96,
      taxAmount: 11.96,
      discountAmount: 0,
      totalAmount: 87.92,
      deliveryDate: '2024-01-20',
      deliveryAddress: '123 Rue Saint-Laurent, Montréal, QC',
      specialInstructions: 'Livraison entre 18h et 19h',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
    },
    {
      id: 2,
      orderNumber: 'CMD-2024-002',
      clientName: 'Jean-Pierre Laurent',
      clientEmail: 'jp.laurent@email.com',
      clientPhone: '(514) 234-5678',
      status: 'confirmed',
      items: [
        { name: 'Poulet Créole', quantity: 3, unitPrice: 24.99, total: 74.97 },
        { name: 'Accras de Morue', quantity: 6, unitPrice: 12.99, total: 77.94 },
      ],
      subtotal: 152.91,
      taxAmount: 24.07,
      discountAmount: 10.00,
      totalAmount: 166.98,
      deliveryDate: '2024-01-18',
      deliveryAddress: '456 Avenue du Parc, Montréal, QC',
      specialInstructions: '',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15',
    },
    {
      id: 3,
      orderNumber: 'CMD-2024-003',
      clientName: 'Sophie Martin',
      clientEmail: 'sophie.martin@email.com',
      clientPhone: '(514) 345-6789',
      status: 'delivered',
      items: [
        { name: 'Menu végétarien', quantity: 4, unitPrice: 22.99, total: 91.96 },
      ],
      subtotal: 91.96,
      taxAmount: 14.47,
      discountAmount: 5.00,
      totalAmount: 101.43,
      deliveryDate: '2024-01-12',
      deliveryAddress: '789 Boulevard René-Lévesque, Montréal, QC',
      specialInstructions: 'Aucune épice forte',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
    },
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'ready', label: 'Prêt' },
    { value: 'delivered', label: 'Livré' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prêt';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'preparing': return Clock;
      case 'ready': return CheckCircle;
      case 'delivered': return Truck;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    // Ici, vous intégreriez avec Supabase pour mettre à jour le statut
    console.log(`Mise à jour commande ${orderId} vers ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion des commandes
          </h1>
          <p className="text-gray-600">
            Suivez et gérez toutes vos commandes
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmées</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En préparation</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'preparing').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Livrées</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
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
                placeholder="Rechercher une commande..."
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

      {/* Liste des commandes */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(order.status).replace('text-', 'bg-').replace('800', '500')}`}>
                    <StatusIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">Créée le {order.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{order.totalAmount.toFixed(2)} $</p>
                    <p className="text-sm text-gray-600">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations client */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{order.clientName}</p>
                    <p>{order.clientEmail}</p>
                    <p>{order.clientPhone}</p>
                  </div>
                </div>

                {/* Livraison */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Livraison</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Date:</span> {order.deliveryDate}</p>
                    <p><span className="font-medium">Adresse:</span> {order.deliveryAddress}</p>
                    {order.specialInstructions && (
                      <p><span className="font-medium">Instructions:</span> {order.specialInstructions}</p>
                    )}
                  </div>
                </div>

                {/* Articles */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Articles</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{item.total.toFixed(2)} $</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>

                {/* Actions de changement de statut */}
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Confirmer
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                    >
                      En préparation
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Prêt
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Livré
                    </button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune commande trouvée.</p>
        </div>
      )}
    </div>
  );
}