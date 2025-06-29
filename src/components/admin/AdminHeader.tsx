import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Menu utilisateur */}
            <div className="relative flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}