import React, { useState } from 'react';
import { Plus, Calendar, Clock, Users, MapPin, Edit, Trash2 } from 'lucide-react';

export default function CalendarManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Données d'exemple pour les événements
  const events = [
    {
      id: 1,
      title: 'Réunion équipe cuisine',
      type: 'meeting',
      date: '2024-01-20',
      startTime: '09:00',
      endTime: '10:30',
      participants: ['Chef principal', 'Sous-chef', 'Commis'],
      location: 'Cuisine principale',
      description: 'Planification du menu de la semaine',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Formation service client',
      type: 'training',
      date: '2024-01-22',
      startTime: '14:00',
      endTime: '17:00',
      participants: ['Équipe service', 'Manager'],
      location: 'Salle de formation',
      description: 'Formation sur les nouvelles procédures de service',
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Mariage Dubois-Martin',
      type: 'event',
      date: '2024-01-25',
      startTime: '16:00',
      endTime: '23:00',
      participants: ['Équipe complète'],
      location: 'Château Vaudreuil',
      description: 'Service traiteur pour mariage de 120 personnes',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Inventaire mensuel',
      type: 'task',
      date: '2024-01-30',
      startTime: '08:00',
      endTime: '12:00',
      participants: ['Responsable inventaire', 'Assistant'],
      location: 'Entrepôt',
      description: 'Inventaire complet des stocks',
      color: 'bg-orange-500',
    },
  ];

  const eventTypes = [
    { value: 'meeting', label: 'Réunion', color: 'bg-blue-500' },
    { value: 'training', label: 'Formation', color: 'bg-green-500' },
    { value: 'event', label: 'Événement', color: 'bg-purple-500' },
    { value: 'task', label: 'Tâche', color: 'bg-orange-500' },
  ];

  // Générer le calendrier du mois
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Calendrier interne
          </h1>
          <p className="text-gray-600">
            Gérez les événements et plannings de votre équipe
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel événement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Navigation du calendrier */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  →
                </button>
              </div>
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {/* En-têtes des jours */}
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Jours du calendrier */}
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonthDay = isCurrentMonth(day);
                const isTodayDay = isToday(day);

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      !isCurrentMonthDay ? 'bg-gray-50 text-gray-400' : ''
                    } ${isTodayDay ? 'bg-primary-50 border-primary-200' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isTodayDay ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Légende des types d'événements */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Types d'événements</h3>
            <div className="space-y-2">
              {eventTypes.map(type => (
                <div key={type.value} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${type.color} mr-3`}></div>
                  <span className="text-sm text-gray-700">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Événements du jour sélectionné */}
          {selectedDate && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Événements du {selectedDate.toLocaleDateString('fr-FR')}
              </h3>
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex space-x-1">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.participants.length} participant{event.participants.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                    )}
                  </div>
                ))}
                {getEventsForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-sm">Aucun événement ce jour.</p>
                )}
              </div>
            </div>
          )}

          {/* Événements à venir */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains événements</h3>
            <div className="space-y-3">
              {events.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date} à {event.startTime}</p>
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