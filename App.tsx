
import React, { useState, useEffect } from 'react';
import LandingPage from './app/page';
import DashboardPage from './app/dashboard/page';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmailVerification from './components/Auth/EmailVerification';

/**
 * App Component - Primary router for the KulinaPOS application.
 * Manages transitions between Landing, Auth, and Dashboard states.
 */
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('navigate', handleLocationChange as EventListener);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('navigate', handleLocationChange as EventListener);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('navigate'));
  };

  // Simple Router Logic
  switch (currentPath) {
    case '/dashboard':
      return <DashboardPage />;
    case '/login':
      return (
        <Login 
          onLogin={() => navigateTo('/dashboard')} 
          onNavigate={(page) => navigateTo(`/${page}`)} 
        />
      );
    case '/register':
      return (
        <Register 
          onNavigate={(page) => navigateTo(`/${page}`)} 
        />
      );
    case '/verify':
      return (
        <EmailVerification 
          onNavigate={(page) => navigateTo(`/${page}`)} 
        />
      );
    case '/forgot':
      // Reuse login for demo purposes
      return (
        <Login 
          onLogin={() => navigateTo('/dashboard')} 
          onNavigate={(page) => navigateTo(`/${page}`)} 
        />
      );
    default:
      return <LandingPage />;
  }
};

export default App;
