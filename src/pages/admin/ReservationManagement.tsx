import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Calendar, Users, MapPin, Clock } from 'lucide-react';

export default function ReservationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');

  // Données d'exemple
  const reservations = [
    {
      id: 1,
      clientName: 'Marie Dubois',
      clientEmail: 'marie.dubois@email.com',
      clientPhone: '(514) 123-4567',
      eventDate: '2024-02-14',
      eventTime: '18:00',
      guestCount: 25,
      eventType: 'Anniversaire',
      venue: 'Salle de réception Le Château',
      specialRequests: 'Menu sans gluten pour 3 personnes',
      status: 'confirmed',
      estimatedBudget: 1250.00,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
    },
    {
      id: 2,
      clientName: 'Jean-Pierre Laurent',
      clientEmail: 'jp.laurent@email.com',
      clientPhone: '(514) 234-5678',
      eventDate: '2024-02-20',
      eventTime: '12:00',
      guestCount: 50,
      eventType: 'Événement corporatif',
      venue: 'Bureau ABC Inc., 123 Rue McGill',
      specialRequests: 'Service buffet, présentation professionnelle',
      status: 'pending',
      estimatedBudget: 2100.00,
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
    },
    {
      id: 3,
      clientName: 'Sophie Martin',
      clientEmail: 'sophie.martin@email.com',
      clientPhone: '(514) 345-6789',
      eventDate: '2024-03-15',
      eventTime: '19:00',
      guestCount: 120,
      eventType: 'Mariage',
      venue: 'Château Vaudreuil',
      specialRequests: 'Menu traditionnel haïtien, musique live',
      status: 'confirmed',
      estimatedBudget: 5400.00,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
    },
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  const eventTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'Mariage', label: 'Mariage' },
    { value: 'Anniversaire', label: 'Anniversaire' },
    { value: 'Événement corporatif', label: 'Événement corporatif' },
    { value: 'Baptême/Communion', label: 'Baptême/Communion' },
    { value: 'Graduation', label: 'Graduation' },
    { value: 'Réunion de famille', label: 'Réunion de famille' },
    { value: 'Autre', label: 'Autre' },
  ];

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus;
    const matchesEventType = selectedEventType === 'all' || reservation.eventType === selectedEventType;
    
    return matchesSearch && matchesStatus && matchesEventType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const updateReservationStatus = (reservationId: number, newStatus: string) => {
    // Ici, vous intégreriez avec Supabase pour mettre à jour le statut
    console.log(`Mise à jour réservation ${reservationId} vers ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Gestion des réservations
          </h1>
          <p className="text-gray-600">
            Gérez toutes vos réservations d'événements
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total réservations</p>
              <p className="text-2xl font-semibold text-gray-900">{reservations.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reservations.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmées</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total invités</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reservations.reduce((sum, r) => sum + r.guestCount, 0)}
              </p>
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
                placeholder="Rechercher une réservation..."
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

          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {reservation.eventType} - {reservation.clientName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Réservation créée le {reservation.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                  {getStatusLabel(reservation.status)}
                </span>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {reservation.estimatedBudget.toFixed(2)} $
                  </p>
                  <p className="text-sm text-gray-600">Budget estimé</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Informations client */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{reservation.clientName}</p>
                  <p>{reservation.clientEmail}</p>
                  <p>{reservation.clientPhone}</p>
                </div>
              </div>

              {/* Date et heure */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Date & Heure</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{reservation.eventDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{reservation.eventTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{reservation.guestCount} invités</span>
                  </div>
                </div>
              </div>

              {/* Lieu */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Lieu</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{reservation.venue}</span>
                  </div>
                </div>
              </div>

              {/* Demandes spéciales */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Demandes spéciales</h4>
                <div className="text-sm text-gray-600">
                  {reservation.specialRequests || 'Aucune demande spéciale'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="text-primary-600 hover:text-primary-800">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              {/* Actions de changement de statut */}
              <div className="flex space-x-2">
                {reservation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </>
                )}
                {reservation.status === 'confirmed' && (
                  <button
                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Annuler
                  </button>
                )}
                <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                  Créer devis
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune réservation trouvée.</p>
        </div>
      )}
    </div>
  );
}