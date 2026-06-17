import React, { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import './App.css';

const AuthPage = lazy(() => import('./pages/AuthPage'));

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

  return (
    <Suspense fallback={
      <div className="splash">
        <span className="logo-icon spin">₹</span>
        <p>Loading…</p>
      </div>
    }>
      {user ? <DashboardPage /> : <AuthPage />}
    </Suspense>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;