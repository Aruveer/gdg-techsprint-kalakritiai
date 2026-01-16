import React, { useState } from 'react';
import type { ActiveTool, UserRole } from './types';
import LandingPage from './components/LandingPage';
import MainLayout from './components/MainLayout';
import CoCreationEngine from './components/CoCreationEngine';
import ArtisanHelper from './components/ArtisanHelper';
import ArtisanDashboardPage from './components/ArtisanDashboardPage';
import OrdersPage from './components/OrdersPage';
import ArtisanOrdersPage from './components/ArtisanOrdersPage';
import GuardianOfTradition from './components/GuardianOfTradition';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('Customer');
  const [activeTool, setActiveTool] = useState<ActiveTool>('feed');

  const handleNavigate = (tool: ActiveTool) => {
    setActiveTool(tool);
  };

  const renderPage = () => {
    if (activeTool === 'feed') {
      return <LandingPage onNavigate={handleNavigate} userRole={userRole} setUserRole={setUserRole} />;
    }

    const renderActiveToolComponent = () => {
      // Logic to prevent access to artisan pages for customers and vice-versa
      if (userRole === 'Customer') {
        switch (activeTool) {
          case 'cocreation': return <CoCreationEngine />;
          case 'orders': return <OrdersPage />;
          // Redirect to feed if customer tries to access artisan tools
          case 'helper':
          case 'dashboard':
          case 'guardian':
            setActiveTool('feed'); // This will trigger a re-render to the landing page.
            return null;
          default: return <CoCreationEngine />;
        }
      } else { // Artisan role
        switch (activeTool) {
          case 'dashboard': return <ArtisanDashboardPage />;
          case 'orders': return <ArtisanOrdersPage />;
          case 'helper': return <ArtisanHelper />;
          // Redirect to feed if artisan tries to access customer tools
          case 'cocreation':
             setActiveTool('feed');
             return null;
          default: return <ArtisanDashboardPage />;
        }
      }
    };
    
    return (
      <MainLayout onNavigate={handleNavigate} activeTool={activeTool} userRole={userRole} setUserRole={setUserRole}>
        {renderActiveToolComponent()}
      </MainLayout>
    );
  };

  return (
    <>
      {renderPage()}
      <Chatbot />
    </>
  );
};

export default App;