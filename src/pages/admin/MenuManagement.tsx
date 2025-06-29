import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Image } from 'lucide-react';

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState('items');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données d'exemple pour les catégories
  const categories = [
    { id: 1, name: 'Entrées', description: 'Plats d\'entrée traditionnels', sortOrder: 1, isActive: true },
    { id: 2, name: 'Plats principaux', description: 'Nos spécialités principales', sortOrder: 2, isActive: true },
    { id: 3, name: 'Accompagnements', description: 'Accompagnements savoureux', sortOrder: 3, isActive: true },
    { id: 4, name: 'Desserts', description: 'Desserts traditionnels', sortOrder: 4, isActive: true },
    { id: 5, name: 'Boissons', description: 'Boissons et rafraîchissements', sortOrder: 5, isActive: true },
  ];

  // Données d'exemple pour les articles
  const menuItems = [
    {
      id: 1,
      name: 'Griot Traditionnel',
      description: 'Porc mariné et frit selon la tradition haïtienne, servi avec du riz collé aux pois rouges',
      price: 28.99,
      categoryId: 2,
      categoryName: 'Plats principaux',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      allergens: [],
      ingredients: ['Porc', 'Épices haïtiennes', 'Ail', 'Oignon'],
      preparationTime: 45,
      calories: 520,
      isAvailable: true,
      isFestive: false,
    },
    {
      id: 2,
      name: 'Poulet Créole',
      description: 'Poulet mijoté dans une sauce créole épicée avec légumes des Caraïbes',
      price: 24.99,
      categoryId: 2,
      categoryName: 'Plats principaux',
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      allergens: [],
      ingredients: ['Poulet', 'Tomates', 'Poivrons', 'Épices créoles'],
      preparationTime: 35,
      calories: 420,
      isAvailable: true,
      isFestive: false,
    },
    {
      id: 3,
      name: 'Accras de Morue',
      description: 'Beignets de morue épicés, croustillants à l\'extérieur et moelleux à l\'intérieur',
      price: 12.99,
      categoryId: 1,
      categoryName: 'Entrées',
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      allergens: ['gluten', 'poisson'],
      ingredients: ['Morue', 'Farine', 'Épices', 'Huile'],
      preparationTime: 20,
      calories: 180,
      isAvailable: true,
      isFestive: false,
    },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion du menu
          </h1>
          <p className="text-gray-600">
            Gérez vos catégories et articles de menu
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel article
        </button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Articles du menu ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Catégories ({categories.length})
          </button>
        </nav>
      </div>

      {activeTab === 'items' && (
        <>
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
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grille des articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {!item.isAvailable && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        Indisponible
                      </span>
                    )}
                    {item.isFestive && (
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                        Festif
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-lg font-bold text-primary-600">{item.price.toFixed(2)} $</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.categoryName}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{item.preparationTime} min</span>
                    <span>{item.calories} cal</span>
                  </div>

                  {item.allergens.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map(allergen => (
                          <span
                            key={allergen}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun article trouvé.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <>
          {/* Liste des catégories */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Catégories de menu</h2>
              <button className="btn-primary flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle catégorie
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{category.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{category.sortOrder}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {menuItems.filter(item => item.categoryId === category.id).length}
                        </div>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}