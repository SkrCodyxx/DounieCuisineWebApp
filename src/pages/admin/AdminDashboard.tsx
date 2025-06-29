import React from 'react';
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Package,
  Star,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { 
      name: 'Revenus du mois', 
      value: '24 580 $', 
      change: '+12%', 
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    { 
      name: 'Nouvelles commandes', 
      value: '47', 
      change: '+8%', 
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    { 
      name: 'Réservations', 
      value: '23', 
      change: '+15%', 
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    { 
      name: 'Nouveaux clients', 
      value: '156', 
      change: '+23%', 
      changeType: 'increase',
      icon: Users,
      color: 'bg-orange-500'
    },
  ];

  const recentOrders = [
    {
      id: 'CMD-2024-001',
      client: 'Marie Dubois',
      date: '2024-01-15',
      status: 'En préparation',
      total: 125.50,
    },
    {
      id: 'CMD-2024-002',
      client: 'Jean-Pierre Laurent',
      date: '2024-01-15',
      status: 'Confirmé',
      total: 89.99,
    },
    {
      id: 'CMD-2024-003',
      client: 'Sophie Martin',
      date: '2024-01-14',
      status: 'Livré',
      total: 234.75,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Mariage Dubois-Martin',
      date: '2024-02-14',
      time: '18:00',
      guests: 120,
      status: 'Confirmé',
    },
    {
      id: 2,
      title: 'Événement corporatif ABC Inc.',
      date: '2024-02-16',
      time: '12:00',
      guests: 50,
      status: 'En préparation',
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Stock faible: Riz basmati (5 kg restants)',
      time: 'Il y a 2 heures',
    },
    {
      id: 2,
      type: 'info',
      message: 'Nouvelle réservation pour le 20 février',
      time: 'Il y a 4 heures',
    },
    {
      id: 3,
      type: 'success',
      message: 'Commande CMD-2024-001 livrée avec succès',
      time: 'Il y a 6 heures',
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.client}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'Livré' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'En préparation'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {order.total.toFixed(2)} $
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Événements à venir */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Événements à venir</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    event.status === 'Confirmé' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{event.date} à {event.time}</p>
                  <p>{event.guests} invités</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes récentes</h2>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-400'
                  : alert.type === 'success'
                  ? 'bg-green-400'
                  : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques et métriques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenus mensuels</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des revenus (à intégrer)</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Commandes par mois</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des commandes (à intégrer)</p>
          </div>
        </div>
      </div>
    </div>
  );
}