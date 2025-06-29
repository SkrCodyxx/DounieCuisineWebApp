import React, { useState } from 'react';
import { Plus, Edit, Trash2, Palette, Calendar, Eye } from 'lucide-react';

export default function ThemeManagement() {
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);

  // Données d'exemple
  const themes = [
    {
      id: 1,
      name: 'Saint-Valentin',
      description: 'Thème romantique pour la Saint-Valentin',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      isActive: true,
      styles: {
        primaryColor: '#e91e63',
        secondaryColor: '#f8bbd9',
        backgroundColor: '#fce4ec',
        textColor: '#880e4f',
        bannerImage: 'valentine-banner.jpg',
      },
      preview: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Carnaval Haïtien',
      description: 'Célébration du carnaval avec couleurs vives',
      startDate: '2024-02-20',
      endDate: '2024-02-25',
      isActive: false,
      styles: {
        primaryColor: '#ff5722',
        secondaryColor: '#ffcc02',
        backgroundColor: '#fff3e0',
        textColor: '#bf360c',
        bannerImage: 'carnival-banner.jpg',
      },
      preview: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    },
    {
      id: 3,
      name: 'Fête des Mères',
      description: 'Thème doux et élégant pour la fête des mères',
      startDate: '2024-05-10',
      endDate: '2024-05-15',
      isActive: false,
      styles: {
        primaryColor: '#9c27b0',
        secondaryColor: '#e1bee7',
        backgroundColor: '#f3e5f5',
        textColor: '#4a148c',
        bannerImage: 'mothers-day-banner.jpg',
      },
      preview: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Noël Traditionnel',
      description: 'Ambiance chaleureuse de Noël',
      startDate: '2024-12-15',
      endDate: '2024-12-31',
      isActive: false,
      styles: {
        primaryColor: '#c62828',
        secondaryColor: '#4caf50',
        backgroundColor: '#ffebee',
        textColor: '#b71c1c',
        bannerImage: 'christmas-banner.jpg',
      },
      preview: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Menu spécial Saint-Valentin',
      content: 'Découvrez notre menu romantique avec des plats aphrodisiaques traditionnels haïtiens.',
      type: 'info',
      position: 'top',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      isActive: true,
    },
    {
      id: 2,
      title: 'Promotion Carnaval',
      content: '20% de réduction sur tous nos plats festifs pendant le carnaval !',
      type: 'success',
      position: 'modal',
      startDate: '2024-02-20',
      endDate: '2024-02-25',
      isActive: false,
    },
  ];

  const selectedThemeData = selectedTheme ? themes.find(t => t.id === selectedTheme) : null;

  const activateTheme = (themeId: number) => {
    // Ici, vous intégreriez avec Supabase pour activer le thème
    console.log(`Activation du thème ${themeId}`);
  };

  const deactivateTheme = (themeId: number) => {
    // Ici, vous intégreriez avec Supabase pour désactiver le thème
    console.log(`Désactivation du thème ${themeId}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion des thèmes
          </h1>
          <p className="text-gray-600">
            Créez et gérez les thèmes festifs et annonces de votre site
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau thème
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des thèmes */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Thèmes disponibles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedTheme === theme.id
                      ? 'border-primary-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="relative">
                    <img
                      src={theme.preview}
                      alt={theme.name}
                      className="w-full h-32 object-cover"
                    />
                    {theme.isActive && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Actif
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{theme.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{theme.startDate} - {theme.endDate}</span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: theme.styles.primaryColor }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: theme.styles.secondaryColor }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: theme.styles.backgroundColor }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-primary-600 hover:text-primary-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {theme.isActive ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deactivateTheme(theme.id);
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Désactiver
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            activateTheme(theme.id);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Activer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panneau de détails */}
        <div className="space-y-6">
          {selectedThemeData ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails du thème
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedThemeData.name}</h4>
                  <p className="text-sm text-gray-600">{selectedThemeData.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Période d'activation</h4>
                  <div className="text-sm text-gray-600">
                    <p>Début: {selectedThemeData.startDate}</p>
                    <p>Fin: {selectedThemeData.endDate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Couleurs</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Primaire:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: selectedThemeData.styles.primaryColor }}
                        ></div>
                        <span className="text-xs font-mono">{selectedThemeData.styles.primaryColor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Secondaire:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: selectedThemeData.styles.secondaryColor }}
                        ></div>
                        <span className="text-xs font-mono">{selectedThemeData.styles.secondaryColor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Arrière-plan:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: selectedThemeData.styles.backgroundColor }}
                        ></div>
                        <span className="text-xs font-mono">{selectedThemeData.styles.backgroundColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full btn-primary">
                    Modifier le thème
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-8">
                <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un thème
                </h3>
                <p className="text-gray-600">
                  Choisissez un thème pour voir ses détails
                </p>
              </div>
            </div>
          )}

          {/* Annonces */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Annonces</h3>
              <button className="btn-outline text-sm">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle
              </button>
            </div>
            
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{announcement.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{announcement.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{announcement.position}</span>
                    <span>{announcement.startDate} - {announcement.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}