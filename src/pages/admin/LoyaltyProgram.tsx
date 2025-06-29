import React, { useState } from 'react';
import { Plus, Edit, Trash2, Gift, Star, Users, TrendingUp } from 'lucide-react';

export default function LoyaltyProgram() {
  const [activeTab, setActiveTab] = useState('overview');

  // Données d'exemple
  const loyaltyStats = {
    totalMembers: 156,
    activeMembers: 142,
    totalPointsIssued: 45230,
    totalPointsRedeemed: 12450,
    averagePointsPerMember: 290,
    redemptionRate: 27.5,
  };

  const rewards = [
    {
      id: 1,
      name: 'Réduction 10%',
      pointsRequired: 500,
      discountType: 'percentage',
      discountValue: 10,
      isActive: true,
      timesRedeemed: 45,
    },
    {
      id: 2,
      name: 'Plat gratuit',
      pointsRequired: 1000,
      discountType: 'fixed',
      discountValue: 25.00,
      isActive: true,
      timesRedeemed: 23,
    },
    {
      id: 3,
      name: 'Menu dégustation',
      pointsRequired: 2000,
      discountType: 'fixed',
      discountValue: 75.00,
      isActive: true,
      timesRedeemed: 8,
    },
    {
      id: 4,
      name: 'Événement VIP',
      pointsRequired: 5000,
      discountType: 'fixed',
      discountValue: 200.00,
      isActive: false,
      timesRedeemed: 2,
    },
  ];

  const topMembers = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      pointsBalance: 2850,
      totalEarned: 4200,
      totalRedeemed: 1350,
      memberSince: '2023-06-15',
    },
    {
      id: 2,
      name: 'Jean-Pierre Laurent',
      email: 'jp.laurent@email.com',
      pointsBalance: 1920,
      totalEarned: 2800,
      totalRedeemed: 880,
      memberSince: '2023-09-20',
    },
    {
      id: 3,
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      pointsBalance: 1650,
      totalEarned: 1950,
      totalRedeemed: 300,
      memberSince: '2024-01-01',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'earned',
      member: 'Marie Dubois',
      points: 125,
      description: 'Commande CMD-2024-001',
      date: '2024-01-15',
    },
    {
      id: 2,
      type: 'redeemed',
      member: 'Jean-Pierre Laurent',
      points: 500,
      description: 'Réduction 10% utilisée',
      date: '2024-01-14',
    },
    {
      id: 3,
      type: 'earned',
      member: 'Sophie Martin',
      points: 89,
      description: 'Commande CMD-2024-003',
      date: '2024-01-12',
    },
  ];

  const programSettings = {
    pointsPerDollar: 10,
    minimumRedemption: 100,
    pointsExpiry: 365, // jours
    welcomeBonus: 100,
    isActive: true,
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Programme de fidélité
          </h1>
          <p className="text-gray-600">
            Gérez votre programme de points et récompenses
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle récompense
        </button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'rewards', label: 'Récompenses' },
            { id: 'members', label: 'Membres' },
            { id: 'settings', label: 'Paramètres' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-lg p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Membres</p>
                  <p className="text-2xl font-semibold text-gray-900">{loyaltyStats.totalMembers}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-lg p-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-semibold text-gray-900">{loyaltyStats.activeMembers}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-lg p-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Points émis</p>
                  <p className="text-2xl font-semibold text-gray-900">{loyaltyStats.totalPointsIssued.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-lg p-3">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Points utilisés</p>
                  <p className="text-2xl font-semibold text-gray-900">{loyaltyStats.totalPointsRedeemed.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="bg-indigo-500 rounded-lg p-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Moyenne/membre</p>
                  <p className="text-2xl font-semibold text-gray-900">{loyaltyStats.averagePointsPerMember}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="bg-pink-500 rounded-lg p-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taux utilisation</p>
                  <p className="text-2xl font-semibold text-gray-900">{loyaltyStats.redemptionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des points</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique des points émis/utilisés (à intégrer)</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'earned' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'earned' ? (
                          <TrendingUp className={`h-4 w-4 ${
                            activity.type === 'earned' ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        ) : (
                          <Gift className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.member}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        activity.type === 'earned' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {activity.type === 'earned' ? '+' : '-'}{activity.points} pts
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Récompenses */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Récompenses disponibles</h2>
              <button className="btn-primary flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle récompense
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Points requis:</span>
                      <span className="font-medium text-primary-600">{reward.pointsRequired} pts</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valeur:</span>
                      <span className="font-medium text-gray-900">
                        {reward.discountType === 'percentage' 
                          ? `${reward.discountValue}%`
                          : `${reward.discountValue.toFixed(2)} $`
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Utilisations:</span>
                      <span className="font-medium text-gray-900">{reward.timesRedeemed}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reward.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reward.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Membres */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top membres fidèles</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points actuels
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total gagné
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total utilisé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membre depuis
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topMembers.map((member, index) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary-600">
                          {member.pointsBalance.toLocaleString()} pts
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.totalEarned.toLocaleString()} pts
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.totalRedeemed.toLocaleString()} pts
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.memberSince}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Paramètres */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration du programme</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points par dollar dépensé
                  </label>
                  <input
                    type="number"
                    defaultValue={programSettings.pointsPerDollar}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum de points pour utilisation
                  </label>
                  <input
                    type="number"
                    defaultValue={programSettings.minimumRedemption}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration des points (jours)
                  </label>
                  <input
                    type="number"
                    defaultValue={programSettings.pointsExpiry}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonus de bienvenue (points)
                  </label>
                  <input
                    type="number"
                    defaultValue={programSettings.welcomeBonus}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={programSettings.isActive}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Programme de fidélité actif
                </label>
              </div>

              <div className="flex justify-end">
                <button className="btn-primary">
                  Sauvegarder les paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}