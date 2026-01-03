
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OrderManagement } from './components/OrderManagement';
import { ResidentManagement } from './components/ResidentManagement';
import { FinanceView } from './components/FinanceView';
import { ResidentCenter } from './components/ResidentCenter';
import { MarketView } from './components/MarketView';
import { LogisticsView } from './components/LogisticsView';
import { NewsView } from './components/NewsView';
import { RiskView } from './components/RiskView';
import { MutualTradeView } from './components/MutualTradeView';
import { LoginView } from './components/LoginView';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { BilateralTradeView } from './components/BilateralTradeView';
import { CustomsServiceView } from './components/CustomsServiceView';
import { DatabaseManagement } from './components/DatabaseManagement';
import { AIChatbot } from './components/AIChatbot';
import { AGENT_NAV_ITEMS, ENTERPRISE_NAV_ITEMS, RESIDENT_NAV_ITEMS, GUEST_NAV_ITEMS } from './constants';
import { UserRole } from './types';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setShowLoginModal(false);
    if (role === 'agent') setCurrentView('dashboard');
    if (role === 'enterprise') setCurrentView('enterprise-dashboard');
    if (role === 'resident') setCurrentView('resident-dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('dashboard');
  };

  const getNavItems = () => {
    switch (userRole) {
      case 'agent': return AGENT_NAV_ITEMS;
      case 'enterprise': return ENTERPRISE_NAV_ITEMS;
      case 'resident': return RESIDENT_NAV_ITEMS; 
      default: return GUEST_NAV_ITEMS;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'residents': return <ResidentManagement />;
      case 'orders': return <OrderManagement />;
      case 'finance': return <FinanceView />;
      case 'risk': return <RiskView />;
      case 'cloud-db': return <DatabaseManagement />;
      case 'bilateral-trade': return <BilateralTradeView />;
      case 'customs-services': return <CustomsServiceView />;
      case 'news': return <NewsView />;
      case 'enterprise-dashboard': return <EnterpriseDashboard />;
      case 'market': return <MarketView />; 
      case 'resident-dashboard': return <ResidentCenter view="dashboard" />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
          <h2 className="text-xl font-semibold mb-2">404</h2>
          <p>页面未找到或正在建设中...</p>
        </div>
      );
    }
  };

  if (userRole === 'resident') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">
           {renderView()}
        </main>
        <button onClick={handleLogout} className="fixed top-4 right-4 z-50 bg-black/20 text-white text-xs px-2 py-1 rounded backdrop-blur">
           退出演示
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {showLoginModal && (
        <LoginView 
          onLogin={handleLogin} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        navItems={getNavItems()}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          userRole={userRole}
          onLogout={handleLogout}
          onLoginClick={() => setShowLoginModal(true)}
        />
        
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      <AIChatbot 
        userRole={userRole} 
        currentView={currentView} 
        onNavigate={(view) => setCurrentView(view)} 
      />
    </div>
  );
}
