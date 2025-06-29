import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, ShoppingBag, Star, User, CreditCard, Gift } from 'lucide-react';

export default function ClientDashboard() {
  const { user, signOut } = useAuth();

  const stats = [
    { name: 'Commandes', value: '12', icon: ShoppingBag, color: 'bg-blue-500' },
    { name: 'Réservations', value: '3', icon: Calendar, color: 'bg-green-500' },
    { name: 'Points fidélité', value: '1,250', icon: Gift, color: 'bg-purple-500' },
    { name: 'Avis donnés', value: '8', icon: Star, color: 'bg-yellow-500' },
  ];

  const recentOrders = [
    {
      id: 1,
      orderNumber: 'CMD-2024-001',
      date: '2024-01-15',
      status: 'Livré',
      total: 125.50,
      items: ['Griot Traditionnel', 'Riz Collé aux Pois', 'Bananes Plantains'],
    },
    {
      id: 2,
      orderNumber: 'CMD-2024-002',
      date: '2024-01-10',
      status: 'En préparation',
      total: 89.99,
      items: ['Poulet Créole', 'Accras de Morue'],
    },
  ];

  const upcomingReservations = [
    {
      id: 1,
      date: '2024-02-14',
      time: '18:00',
      eventType: 'Anniversaire',
      guests: 25,
      status: 'Confirmé',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Bonjour, {user?.user_metadata?.first_name} !
              </h1>
              <p className="text-gray-600">
                Bienvenue dans votre espace personnel
              </p>
            </div>
            <button
              onClick={signOut}
              className="btn-outline"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commandes récentes */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Livré' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {order.total.toFixed(2)} $
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir toutes les commandes →
                </button>
              </div>
            </div>
          </div>

          {/* Réservations à venir */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Réservations à venir</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.eventType}</p>
                        <p className="text-sm text-gray-600">
                          {reservation.date} à {reservation.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.guests} invités
                        </p>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir toutes les réservations →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <ShoppingBag className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-gray-600">Nouvelle commande</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <Calendar className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-gray-600">Nouvelle réservation</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <User className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-gray-600">Modifier mon profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}