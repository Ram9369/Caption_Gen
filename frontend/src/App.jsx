import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { Sparkles, Loader } from 'lucide-react';

const NavigationHandler = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-color)',
          gap: '1rem',
        }}
        className="fade-in"
      >
        <div style={{ position: 'relative', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContents: 'center' }}>
          <Loader 
            style={{
              animation: 'rotate 1.5s linear infinite',
              color: 'var(--primary)',
            }} 
            size={36} 
          />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.5px' }}>
          Restoring Session...
        </p>
      </div>
    );
  }

  // Simple and highly effective state-based routing
  return user ? <DashboardPage /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <NavigationHandler />
    </AuthProvider>
  );
}

export default App;
