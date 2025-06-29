import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText, Globe } from 'lucide-react';

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Données d'exemple
  const pages = [
    {
      id: 1,
      title: 'À propos de nous',
      slug: 'a-propos',
      content: 'Dounie Cuisine Pro est une entreprise de traiteur spécialisée dans la cuisine haïtienne et caribéenne...',
      metaTitle: 'À propos - Dounie Cuisine Pro',
      metaDescription: 'Découvrez l\'histoire et la passion derrière Dounie Cuisine Pro, votre traiteur spécialisé en cuisine haïtienne.',
      isPublished: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      author: 'Admin',
    },
    {
      id: 2,
      title: 'Nos services',
      slug: 'nos-services',
      content: 'Nous offrons une gamme complète de services de traiteur pour tous vos événements...',
      metaTitle: 'Nos services de traiteur - Dounie Cuisine Pro',
      metaDescription: 'Découvrez nos services de traiteur haut de gamme pour mariages, événements corporatifs et célébrations.',
      isPublished: true,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
      author: 'Manager',
    },
    {
      id: 3,
      title: 'Politique de confidentialité',
      slug: 'politique-confidentialite',
      content: 'Cette politique de confidentialité décrit comment nous collectons et utilisons vos informations...',
      metaTitle: 'Politique de confidentialité - Dounie Cuisine Pro',
      metaDescription: 'Consultez notre politique de confidentialité pour comprendre comment nous protégeons vos données.',
      isPublished: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05',
      author: 'Legal',
    },
    {
      id: 4,
      title: 'Conditions d\'utilisation',
      slug: 'conditions-utilisation',
      content: 'En utilisant notre site web et nos services, vous acceptez les conditions suivantes...',
      metaTitle: 'Conditions d\'utilisation - Dounie Cuisine Pro',
      metaDescription: 'Lisez nos conditions d\'utilisation avant d\'utiliser nos services de traiteur.',
      isPublished: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05',
      author: 'Legal',
    },
    {
      id: 5,
      title: 'Notre histoire',
      slug: 'notre-histoire',
      content: 'Fondée en 2010, Dounie Cuisine Pro a commencé comme un petit service de traiteur familial...',
      metaTitle: 'Notre histoire - Dounie Cuisine Pro',
      metaDescription: 'Découvrez l\'histoire fascinante de Dounie Cuisine Pro et notre évolution au fil des années.',
      isPublished: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-08',
      author: 'Admin',
    },
  ];

  const statuses = [
    { value: 'all', label: 'Toutes les pages' },
    { value: 'published', label: 'Publiées' },
    { value: 'draft', label: 'Brouillons' },
  ];

  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && page.isPublished) ||
      (selectedStatus === 'draft' && !page.isPublished);
    
    return matchesSearch && matchesStatus;
  });

  const publishedCount = pages.filter(page => page.isPublished).length;
  const draftCount = pages.filter(page => !page.isPublished).length;

  const togglePublishStatus = (pageId: number) => {
    // Ici, vous intégreriez avec Supabase pour changer le statut
    console.log(`Changement de statut pour la page ${pageId}`);
  };

  const deletePage = (pageId: number) => {
    // Ici, vous intégreriez avec Supabase pour supprimer la page
    console.log(`Suppression de la page ${pageId}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion du contenu
          </h1>
          <p className="text-gray-600">
            Créez et gérez les pages de contenu de votre site
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle page
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total pages</p>
              <p className="text-2xl font-semibold text-gray-900">{pages.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publiées</p>
              <p className="text-2xl font-semibold text-gray-900">{publishedCount}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-semibold text-gray-900">{draftCount}</p>
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
                placeholder="Rechercher une page..."
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

      {/* Liste des pages */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière modification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {page.content.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">/{page.slug}</div>
                    {page.metaTitle && (
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        SEO: {page.metaTitle}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      page.isPublished 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.isPublished ? 'Publiée' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{page.updatedAt}</div>
                    <div className="text-xs text-gray-500">Créée le {page.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-primary-600 hover:text-primary-900"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => togglePublishStatus(page.id)}
                        className={`${page.isPublished ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={page.isPublished ? 'Dépublier' : 'Publier'}
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deletePage(page.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune page trouvée.</p>
          </div>
        )}
      </div>

      {/* Conseils SEO */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-900">Conseils pour le SEO</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Utilisez des titres descriptifs et uniques pour chaque page</li>
                <li>Rédigez des meta descriptions engageantes de 150-160 caractères</li>
                <li>Utilisez des URLs courtes et descriptives (slugs)</li>
                <li>Structurez votre contenu avec des titres hiérarchiques (H1, H2, H3)</li>
                <li>Incluez des mots-clés pertinents naturellement dans le contenu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}