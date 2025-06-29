import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
              </Route>

              {/* Routes d'authentification */}
              <Route path="/connexion" element={<LoginPage />} />

              {/* Administration */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
              </Route>
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;