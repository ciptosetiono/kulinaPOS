
import React, { useState, useEffect } from 'react';
import LandingPage from './app/page';
import DashboardPage from './app/dashboard/page';

/**
 * App Component - Acts as the primary router for the ZenPOS application.
 * Manages the transition between the marketing Landing Page and the Enterprise Dashboard.
 */
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  // Listen for navigation events (like clicking 'Get Started' links)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Custom event for programmatic navigation without full page reload
    window.addEventListener('navigate', handleLocationChange as EventListener);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('navigate', handleLocationChange as EventListener);
    };
  }, []);

  // Simple Router Logic
  if (currentPath === '/dashboard') {
    return <DashboardPage />;
  }

  // Default to Landing Page
  return <LandingPage />;
};

export default App;
