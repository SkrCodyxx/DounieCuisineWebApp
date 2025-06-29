import React, { useState } from 'react';
import { Upload, Search, Filter, Trash2, Download, Eye, Grid, List } from 'lucide-react';

export default function MediaManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  // Données d'exemple
  const mediaFiles = [
    {
      id: 1,
      filename: 'griot-traditionnel.jpg',
      originalName: 'Griot Traditionnel Haïtien.jpg',
      mimeType: 'image/jpeg',
      size: 245760, // en bytes
      url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      altText: 'Griot traditionnel haïtien avec riz collé',
      category: 'plats',
      uploadedAt: '2024-01-15',
      uploadedBy: 'Admin',
    },
    {
      id: 2,
      filename: 'poulet-creole.jpg',
      originalName: 'Poulet Créole Épicé.jpg',
      mimeType: 'image/jpeg',
      size: 198432,
      url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      altText: 'Poulet créole mijoté aux épices',
      category: 'plats',
      uploadedAt: '2024-01-14',
      uploadedBy: 'Chef',
    },
    {
      id: 3,
      filename: 'accras-morue.jpg',
      originalName: 'Accras de Morue Croustillants.jpg',
      mimeType: 'image/jpeg',
      size: 167890,
      url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      altText: 'Accras de morue dorés et croustillants',
      category: 'entrees',
      uploadedAt: '2024-01-13',
      uploadedBy: 'Admin',
    },
    {
      id: 4,
      filename: 'mariage-elegant.jpg',
      originalName: 'Mariage Élégant Service.jpg',
      mimeType: 'image/jpeg',
      size: 312456,
      url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      altText: 'Service traiteur pour mariage élégant',
      category: 'evenements',
      uploadedAt: '2024-01-12',
      uploadedBy: 'Manager',
    },
    {
      id: 5,
      filename: 'chef-cuisine.jpg',
      originalName: 'Chef en Action Cuisine.jpg',
      mimeType: 'image/jpeg',
      size: 278901,
      url: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      altText: 'Chef préparant des plats en cuisine',
      category: 'equipe',
      uploadedAt: '2024-01-11',
      uploadedBy: 'Admin',
    },
    {
      id: 6,
      filename: 'logo-dounie.png',
      originalName: 'Logo Dounie Cuisine Pro.png',
      mimeType: 'image/png',
      size: 45678,
      url: '/logo-placeholder.png',
      altText: 'Logo Dounie Cuisine Pro',
      category: 'branding',
      uploadedAt: '2024-01-10',
      uploadedBy: 'Designer',
    },
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'plats', label: 'Plats' },
    { value: 'entrees', label: 'Entrées' },
    { value: 'evenements', label: 'Événements' },
    { value: 'equipe', label: 'Équipe' },
    { value: 'branding', label: 'Branding' },
    { value: 'autres', label: 'Autres' },
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.altText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const deleteSelectedFiles = () => {
    // Ici, vous intégreriez avec Supabase pour supprimer les fichiers
    console.log('Suppression des fichiers:', selectedFiles);
    setSelectedFiles([]);
  };

  const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0);
  const selectedSize = mediaFiles
    .filter(file => selectedFiles.includes(file.id))
    .reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion des médias
          </h1>
          <p className="text-gray-600">
            Gérez vos images et fichiers multimédias
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Télécharger des fichiers
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Grid className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total fichiers</p>
              <p className="text-2xl font-semibold text-gray-900">{mediaFiles.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Espace utilisé</p>
              <p className="text-2xl font-semibold text-gray-900">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sélectionnés</p>
              <p className="text-2xl font-semibold text-gray-900">{selectedFiles.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taille sélection</p>
              <p className="text-2xl font-semibold text-gray-900">{formatFileSize(selectedSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de téléchargement */}
      <div className="card">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors duration-200">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Glissez-déposez vos fichiers ici
          </h3>
          <p className="text-gray-600 mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <button className="btn-primary">
            Choisir des fichiers
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Formats supportés: JPG, PNG, GIF, SVG (max 10MB par fichier)
          </p>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher des fichiers..."
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
          </div>

          <div className="flex items-center space-x-2">
            {selectedFiles.length > 0 && (
              <button
                onClick={deleteSelectedFiles}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer ({selectedFiles.length})
              </button>
            )}
            
            <button
              onClick={selectAllFiles}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {selectedFiles.length === filteredFiles.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Affichage des fichiers */}
      <div className="card">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedFiles.includes(file.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="aspect-square">
                  <img
                    src={file.url}
                    alt={file.altText}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-gray-900 truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={selectAllFiles}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fichier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléchargé par
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={file.url}
                            alt={file.altText}
                            className="h-10 w-10 object-cover rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.originalName}</div>
                          <div className="text-sm text-gray-500">{file.filename}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {categories.find(cat => cat.value === file.category)?.label || file.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.uploadedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download className="h-4 w-4" />
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
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun fichier trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}