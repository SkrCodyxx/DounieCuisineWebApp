import React, { useState } from 'react';
import { Send, Search, Users, MessageSquare, Bell, User, Podcast as Broadcast } from 'lucide-react';

export default function MessagingCenter() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');

  // Données d'exemple
  const conversations = [
    {
      id: 1,
      type: 'direct',
      participant: {
        name: 'Marie Dubois',
        email: 'marie.dubois@email.com',
        avatar: 'MD',
        isOnline: true,
      },
      lastMessage: 'Merci pour la confirmation de ma commande !',
      lastMessageTime: '2024-01-15 14:30',
      unreadCount: 2,
      messages: [
        {
          id: 1,
          senderId: 'client-1',
          senderName: 'Marie Dubois',
          content: 'Bonjour, j\'aimerais modifier ma commande.',
          timestamp: '2024-01-15 14:15',
          isRead: true,
        },
        {
          id: 2,
          senderId: 'admin-1',
          senderName: 'Admin',
          content: 'Bonjour Marie, bien sûr ! Que souhaitez-vous modifier ?',
          timestamp: '2024-01-15 14:20',
          isRead: true,
        },
        {
          id: 3,
          senderId: 'client-1',
          senderName: 'Marie Dubois',
          content: 'Je voudrais ajouter 5 portions de plus pour le griot.',
          timestamp: '2024-01-15 14:25',
          isRead: true,
        },
        {
          id: 4,
          senderId: 'admin-1',
          senderName: 'Admin',
          content: 'C\'est noté ! J\'ai mis à jour votre commande. Le nouveau total est de 145,50$.',
          timestamp: '2024-01-15 14:28',
          isRead: true,
        },
        {
          id: 5,
          senderId: 'client-1',
          senderName: 'Marie Dubois',
          content: 'Merci pour la confirmation de ma commande !',
          timestamp: '2024-01-15 14:30',
          isRead: false,
        },
      ],
    },
    {
      id: 2,
      type: 'direct',
      participant: {
        name: 'Jean-Pierre Laurent',
        email: 'jp.laurent@email.com',
        avatar: 'JL',
        isOnline: false,
      },
      lastMessage: 'Parfait, merci pour votre réactivité !',
      lastMessageTime: '2024-01-14 16:45',
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 'client-2',
          senderName: 'Jean-Pierre Laurent',
          content: 'Bonjour, pouvez-vous me confirmer l\'heure de livraison ?',
          timestamp: '2024-01-14 16:30',
          isRead: true,
        },
        {
          id: 2,
          senderId: 'admin-1',
          senderName: 'Admin',
          content: 'Bonjour, la livraison est prévue entre 12h et 13h comme convenu.',
          timestamp: '2024-01-14 16:40',
          isRead: true,
        },
        {
          id: 3,
          senderId: 'client-2',
          senderName: 'Jean-Pierre Laurent',
          content: 'Parfait, merci pour votre réactivité !',
          timestamp: '2024-01-14 16:45',
          isRead: true,
        },
      ],
    },
  ];

  const notifications = [
    {
      id: 1,
      type: 'new_order',
      title: 'Nouvelle commande',
      message: 'Commande CMD-2024-001 reçue de Marie Dubois',
      timestamp: '2024-01-15 14:35',
      isRead: false,
    },
    {
      id: 2,
      type: 'new_message',
      title: 'Nouveau message',
      message: 'Message reçu de Jean-Pierre Laurent',
      timestamp: '2024-01-14 16:45',
      isRead: true,
    },
    {
      id: 3,
      type: 'reservation',
      title: 'Nouvelle réservation',
      message: 'Réservation pour le 20 février - Sophie Martin',
      timestamp: '2024-01-14 10:20',
      isRead: true,
    },
    {
      id: 4,
      type: 'low_stock',
      title: 'Stock faible',
      message: 'Riz basmati - Stock critique (5 kg restants)',
      timestamp: '2024-01-13 09:15',
      isRead: false,
    },
  ];

  const onlineUsers = [
    { id: 1, name: 'Marie Dubois', role: 'Client', avatar: 'MD' },
    { id: 2, name: 'Chef Principal', role: 'Employé', avatar: 'CP' },
    { id: 3, name: 'Manager', role: 'Manager', avatar: 'MG' },
  ];

  const selectedConversationData = selectedConversation 
    ? conversations.find(c => c.id === selectedConversation)
    : null;

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    // Ici, vous intégreriez avec Supabase pour envoyer le message
    console.log('Envoi du message:', messageText);
    setMessageText('');
  };

  const sendBroadcast = () => {
    // Ici, vous intégreriez avec Supabase pour envoyer un message de diffusion
    console.log('Envoi d\'un message de diffusion');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order': return '🛒';
      case 'new_message': return '💬';
      case 'reservation': return '📅';
      case 'low_stock': return '⚠️';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Centre de messagerie
        </h1>
        <p className="text-gray-600">
          Communiquez avec votre équipe et vos clients en temps réel
        </p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'online', label: 'En ligne', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.id === 'notifications' && notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Messages */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          {/* Liste des conversations */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
                <button
                  onClick={sendBroadcast}
                  className="btn-outline text-sm flex items-center"
                >
                  <Broadcast className="h-4 w-4 mr-1" />
                  Diffusion
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {conversation.participant.avatar}
                        </span>
                      </div>
                      {conversation.participant.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.participant.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.lastMessageTime.split(' ')[1]}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de conversation */}
          <div className="lg:col-span-2 card overflow-hidden flex flex-col">
            {selectedConversationData ? (
              <>
                {/* En-tête de conversation */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {selectedConversationData.participant.avatar}
                        </span>
                      </div>
                      {selectedConversationData.participant.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedConversationData.participant.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversationData.participant.isOnline ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversationData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId.startsWith('admin') ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId.startsWith('admin')
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId.startsWith('admin') ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.split(' ')[1]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      className="btn-primary flex items-center"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-600">
                    Choisissez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications récentes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {notification.timestamp.split(' ')[1]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    {!notification.isRead && (
                      <div className="mt-2">
                        <button className="text-xs text-primary-600 hover:text-primary-800">
                          Marquer comme lu
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Utilisateurs en ligne */}
      {activeTab === 'online' && (
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Utilisateurs en ligne ({onlineUsers.length})
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}