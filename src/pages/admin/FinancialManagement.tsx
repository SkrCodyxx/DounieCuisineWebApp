import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, DollarSign, CreditCard, Download } from 'lucide-react';

export default function FinancialManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');

  // Données d'exemple
  const transactions = [
    {
      id: 1,
      type: 'income',
      category: 'Ventes',
      amount: 1250.75,
      description: 'Commande CMD-2024-001 - Marie Dubois',
      date: '2024-01-15',
      reference: 'CMD-2024-001',
      paymentMethod: 'Carte de crédit',
    },
    {
      id: 2,
      type: 'income',
      category: 'Ventes',
      amount: 2100.00,
      description: 'Événement corporatif - ABC Inc.',
      date: '2024-01-14',
      reference: 'EVT-2024-005',
      paymentMethod: 'Virement bancaire',
    },
    {
      id: 3,
      type: 'expense',
      category: 'Approvisionnement',
      amount: 450.30,
      description: 'Achat ingrédients - Fournisseur ABC',
      date: '2024-01-13',
      reference: 'FACT-2024-012',
      paymentMethod: 'Carte de débit',
    },
    {
      id: 4,
      type: 'expense',
      category: 'Salaires',
      amount: 3200.00,
      description: 'Paie équipe - Janvier 2024',
      date: '2024-01-12',
      reference: 'PAIE-2024-01',
      paymentMethod: 'Virement bancaire',
    },
    {
      id: 5,
      type: 'expense',
      category: 'Équipement',
      amount: 850.00,
      description: 'Achat équipement cuisine',
      date: '2024-01-10',
      reference: 'EQUIP-2024-003',
      paymentMethod: 'Carte de crédit',
    },
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Ventes', label: 'Ventes' },
    { value: 'Approvisionnement', label: 'Approvisionnement' },
    { value: 'Salaires', label: 'Salaires' },
    { value: 'Équipement', label: 'Équipement' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Autres', label: 'Autres' },
  ];

  const periods = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
  ];

  const types = [
    { value: 'all', label: 'Tous les types' },
    { value: 'income', label: 'Revenus' },
    { value: 'expense', label: 'Dépenses' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    return selectedType === 'all' || transaction.type === selectedType;
  });

  // Calculs financiers
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Données pour les graphiques (exemple)
  const monthlyData = [
    { month: 'Nov', income: 8500, expenses: 6200 },
    { month: 'Déc', income: 12300, expenses: 8100 },
    { month: 'Jan', income: 15200, expenses: 9800 },
  ];

  const getTransactionIcon = (type: string) => {
    return type === 'income' ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionBgColor = (type: string) => {
    return type === 'income' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion financière
          </h1>
          <p className="text-gray-600">
            Suivez vos revenus, dépenses et performances financières
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle transaction
          </button>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="flex space-x-4">
        {periods.map(period => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedPeriod === period.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-semibold text-gray-900">{totalIncome.toFixed(2)} $</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dépenses totales</p>
              <p className="text-2xl font-semibold text-gray-900">{totalExpenses.toFixed(2)} $</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className={`${netProfit >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-lg p-3`}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bénéfice net</p>
              <p className={`text-2xl font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netProfit.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Marge bénéficiaire</p>
              <p className={`text-2xl font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)} %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des revenus/dépenses (à intégrer)</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des dépenses</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique en secteurs (à intégrer)</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Transactions récentes</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Voir toutes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getTransactionBgColor(transaction.type)}`}>
                          <Icon className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.reference}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} $
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus par catégorie</h3>
          <div className="space-y-3">
            {categories.slice(1, 4).map(category => {
              const categoryIncome = transactions
                .filter(t => t.type === 'income' && t.category === category.value)
                .reduce((sum, t) => sum + t.amount, 0);
              const percentage = totalIncome > 0 ? (categoryIncome / totalIncome) * 100 : 0;
              
              return (
                <div key={category.value} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {categoryIncome.toFixed(0)} $
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dépenses par catégorie</h3>
          <div className="space-y-3">
            {categories.slice(2, 6).map(category => {
              const categoryExpenses = transactions
                .filter(t => t.type === 'expense' && t.category === category.value)
                .reduce((sum, t) => sum + t.amount, 0);
              const percentage = totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0;
              
              return (
                <div key={category.value} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {categoryExpenses.toFixed(0)} $
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}