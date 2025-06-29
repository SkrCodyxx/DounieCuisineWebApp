import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle, Package, TrendingDown } from 'lucide-react';

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  // Données d'exemple
  const inventoryItems = [
    {
      id: 1,
      name: 'Riz basmati',
      category: 'Céréales',
      currentStock: 5,
      minimumStock: 10,
      unit: 'kg',
      unitCost: 3.50,
      supplier: 'Fournisseur ABC',
      lastOrderDate: '2024-01-10',
      expirationDate: '2024-06-15',
      location: 'Entrepôt A - Étagère 1',
      totalValue: 17.50,
    },
    {
      id: 2,
      name: 'Poulet entier',
      category: 'Viandes',
      currentStock: 25,
      minimumStock: 15,
      unit: 'pièce',
      unitCost: 8.99,
      supplier: 'Boucherie Martin',
      lastOrderDate: '2024-01-14',
      expirationDate: '2024-01-20',
      location: 'Réfrigérateur 1',
      totalValue: 224.75,
    },
    {
      id: 3,
      name: 'Tomates fraîches',
      category: 'Légumes',
      currentStock: 8,
      minimumStock: 12,
      unit: 'kg',
      unitCost: 4.25,
      supplier: 'Ferme Locale',
      lastOrderDate: '2024-01-15',
      expirationDate: '2024-01-18',
      location: 'Réfrigérateur 2',
      totalValue: 34.00,
    },
    {
      id: 4,
      name: 'Huile de coco',
      category: 'Condiments',
      currentStock: 20,
      minimumStock: 8,
      unit: 'litre',
      unitCost: 12.99,
      supplier: 'Épicerie Tropicale',
      lastOrderDate: '2024-01-05',
      expirationDate: '2024-12-31',
      location: 'Entrepôt B - Étagère 3',
      totalValue: 259.80,
    },
    {
      id: 5,
      name: 'Épices haïtiennes',
      category: 'Épices',
      currentStock: 3,
      minimumStock: 5,
      unit: 'kg',
      unitCost: 25.00,
      supplier: 'Épices du Monde',
      lastOrderDate: '2024-01-08',
      expirationDate: '2024-08-30',
      location: 'Entrepôt A - Étagère 2',
      totalValue: 75.00,
    },
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Céréales', label: 'Céréales' },
    { value: 'Viandes', label: 'Viandes' },
    { value: 'Légumes', label: 'Légumes' },
    { value: 'Condiments', label: 'Condiments' },
    { value: 'Épices', label: 'Épices' },
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLowStock = !showLowStock || item.currentStock <= item.minimumStock;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minimumStock);
  const expiringItems = inventoryItems.filter(item => {
    const expirationDate = new Date(item.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiration <= 7;
  });

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);

  const getStockStatus = (item: typeof inventoryItems[0]) => {
    if (item.currentStock <= item.minimumStock) {
      return { status: 'low', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (item.currentStock <= item.minimumStock * 1.5) {
      return { status: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  const getExpirationStatus = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiration <= 3) {
      return { status: 'urgent', color: 'text-red-600', text: `Expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}` };
    } else if (daysUntilExpiration <= 7) {
      return { status: 'warning', color: 'text-yellow-600', text: `Expire dans ${daysUntilExpiration} jours` };
    } else {
      return { status: 'good', color: 'text-gray-600', text: expirationDate };
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion de l'inventaire
          </h1>
          <p className="text-gray-600">
            Suivez vos stocks et gérez vos approvisionnements
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel article
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total articles</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryItems.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock faible</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expire bientôt</p>
              <p className="text-2xl font-semibold text-gray-900">{expiringItems.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur totale</p>
              <p className="text-2xl font-semibold text-gray-900">{totalValue.toFixed(2)} $</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lowStockItems.length > 0 && (
            <div className="card border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-red-700">Stock faible</h3>
              </div>
              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-900">{item.name}</span>
                    <span className="text-red-600 font-medium">
                      {item.currentStock} {item.unit} (min: {item.minimumStock})
                    </span>
                  </div>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-sm text-gray-500">+{lowStockItems.length - 3} autres articles</p>
                )}
              </div>
            </div>
          )}

          {expiringItems.length > 0 && (
            <div className="card border-l-4 border-yellow-500">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-700">Expiration proche</h3>
              </div>
              <div className="space-y-2">
                {expiringItems.slice(0, 3).map(item => {
                  const expStatus = getExpirationStatus(item.expirationDate);
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-900">{item.name}</span>
                      <span className={expStatus.color}>{expStatus.text}</span>
                    </div>
                  );
                })}
                {expiringItems.length > 3 && (
                  <p className="text-sm text-gray-500">+{expiringItems.length - 3} autres articles</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
            <input
              type="checkbox"
              checked={showLowStock}
              onChange={(e) => setShowLowStock(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Stock faible uniquement</span>
          </label>
        </div>
      </div>

      {/* Tableau de l'inventaire */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût unitaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur totale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                const expStatus = getExpirationStatus(item.expirationDate);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                        <div className="text-xs text-gray-400">{item.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                          {item.currentStock} {item.unit}
                        </span>
                        {item.currentStock <= item.minimumStock && (
                          <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Min: {item.minimumStock} {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.unitCost.toFixed(2)} $ / {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.totalValue.toFixed(2)} $
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.supplier}</div>
                      <div className="text-xs text-gray-500">
                        Dernière commande: {item.lastOrderDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${expStatus.color}`}>
                        {expStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun article trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}