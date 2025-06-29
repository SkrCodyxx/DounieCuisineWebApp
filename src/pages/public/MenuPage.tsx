import React, { useState } from 'react';
import { Search, Filter, Clock, Users } from 'lucide-react';

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous les plats' },
    { id: 'entrees', name: 'Entrées' },
    { id: 'plats-principaux', name: 'Plats principaux' },
    { id: 'accompagnements', name: 'Accompagnements' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'boissons', name: 'Boissons' },
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Griot Traditionnel',
      description: 'Porc mariné et frit selon la tradition haïtienne, servi avec du riz collé aux pois rouges',
      price: 28.99,
      category: 'plats-principaux',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      prepTime: 45,
      serves: 4,
      allergens: [],
      isPopular: true,
    },
    {
      id: 2,
      name: 'Poulet Créole',
      description: 'Poulet mijoté dans une sauce créole épicée avec légumes des Caraïbes',
      price: 24.99,
      category: 'plats-principaux',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      prepTime: 35,
      serves: 4,
      allergens: [],
      isPopular: false,
    },
    {
      id: 3,
      name: 'Accras de Morue',
      description: 'Beignets de morue épicés, croustillants à l\'extérieur et moelleux à l\'intérieur',
      price: 12.99,
      category: 'entrees',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      prepTime: 20,
      serves: 6,
      allergens: ['gluten', 'poisson'],
      isPopular: true,
    },
    {
      id: 4,
      name: 'Riz Collé aux Pois Rouges',
      description: 'Riz parfumé cuit avec des haricots rouges et du lait de coco',
      price: 8.99,
      category: 'accompagnements',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      prepTime: 30,
      serves: 6,
      allergens: [],
      isPopular: false,
    },
    {
      id: 5,
      name: 'Bananes Plantains Frites',
      description: 'Bananes plantains dorées et caramélisées, accompagnement parfait',
      price: 6.99,
      category: 'accompagnements',
      image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      prepTime: 15,
      serves: 4,
      allergens: [],
      isPopular: false,
    },
    {
      id: 6,
      name: 'Flan Coco',
      description: 'Dessert traditionnel à base de lait de coco et de vanille',
      price: 7.99,
      category: 'desserts',
      image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      prepTime: 60,
      serves: 8,
      allergens: ['lait', 'œufs'],
      isPopular: true,
    },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Notre Menu
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos spécialités haïtiennes et caribéennes préparées avec passion
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des plats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {item.isPopular && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-lg font-bold text-primary-600">{item.price.toFixed(2)} $</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{item.prepTime} min</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{item.serves} pers.</span>
                  </div>
                </div>

                {item.allergens.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Allergènes :</p>
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

                <button className="w-full btn-primary">
                  Ajouter au devis
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun plat ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>

      {/* Section CTA */}
      <div className="bg-primary-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Besoin d'un menu personnalisé ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nos chefs peuvent créer un menu sur mesure pour votre événement
          </p>
          <button className="btn-secondary">
            Demander un devis personnalisé
          </button>
        </div>
      </div>
    </div>
  );
}