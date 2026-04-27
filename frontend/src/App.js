import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="splash">
        <span className="logo-icon spin">₹</span>
        <p>Loading…</p>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
