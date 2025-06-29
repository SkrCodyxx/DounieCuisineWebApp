import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes les photos' },
    { id: 'plats', name: 'Nos plats' },
    { id: 'evenements', name: 'Événements' },
    { id: 'equipe', name: 'Notre équipe' },
    { id: 'coulisses', name: 'En coulisses' },
  ];

  const images = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Griot traditionnel haïtien',
      category: 'plats',
      title: 'Griot Traditionnel',
      description: 'Notre spécialité haïtienne préparée selon la tradition',
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Poulet créole épicé',
      category: 'plats',
      title: 'Poulet Créole',
      description: 'Mijoté dans nos épices des Caraïbes',
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Accras de morue croustillants',
      category: 'plats',
      title: 'Accras de Morue',
      description: 'Beignets croustillants et savoureux',
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Riz collé aux pois rouges',
      category: 'plats',
      title: 'Riz Collé aux Pois',
      description: 'Accompagnement traditionnel parfumé',
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Bananes plantains dorées',
      category: 'plats',
      title: 'Bananes Plantains',
      description: 'Dorées et caramélisées à la perfection',
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Flan coco maison',
      category: 'plats',
      title: 'Flan Coco',
      description: 'Dessert traditionnel à base de lait de coco',
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Mariage élégant',
      category: 'evenements',
      title: 'Mariage de Rêve',
      description: 'Service traiteur pour un mariage inoubliable',
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Événement corporatif',
      category: 'evenements',
      title: 'Événement Corporatif',
      description: 'Service professionnel pour entreprises',
    },
    {
      id: 9,
      src: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Chef en action',
      category: 'equipe',
      title: 'Nos Chefs',
      description: 'Passion et expertise culinaire',
    },
    {
      id: 10,
      src: 'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Préparation en cuisine',
      category: 'coulisses',
      title: 'En Cuisine',
      description: 'La magie opère dans nos cuisines',
    },
    {
      id: 11,
      src: 'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Service traiteur',
      category: 'coulisses',
      title: 'Service Traiteur',
      description: 'Préparation minutieuse de chaque événement',
    },
    {
      id: 12,
      src: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Équipe souriante',
      category: 'equipe',
      title: 'Notre Équipe',
      description: 'Une équipe passionnée à votre service',
    },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const openModal = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex].id);
  };

  const selectedImageData = selectedImage 
    ? images.find(img => img.id === selectedImage)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Galerie Photo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos créations culinaires et les moments mémorables que nous avons créés
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grille d'images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => openModal(image.id)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <h3 className="font-semibold text-lg">{image.title}</h3>
                  <p className="text-sm opacity-90">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune image dans cette catégorie.
            </p>
          </div>
        )}
      </div>

      {/* Modal de visualisation */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Bouton fermer */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Boutons navigation */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <img
              src={selectedImageData.src}
              alt={selectedImageData.alt}
              className="max-w-full max-h-full object-contain"
            />

            {/* Informations */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-6">
              <h3 className="text-2xl font-semibold mb-2">{selectedImageData.title}</h3>
              <p className="text-gray-200">{selectedImageData.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Section CTA */}
      <div className="bg-primary-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Prêt à créer votre propre événement ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Laissez-nous vous aider à créer des souvenirs inoubliables
          </p>
          <button className="btn-secondary">
            Demander un devis
          </button>
        </div>
      </div>
    </div>
  );
}