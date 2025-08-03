import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AccountSetup from './AccountSetup';
import AccountList from './AccountList';
import AutoDownloadScheduler from './AutoDownloadScheduler';
const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAccountAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return (
          <div className="p-6 space-y-6">
            <AccountSetup onAccountAdded={handleAccountAdded} />
            <AccountList refreshTrigger={refreshTrigger} />
          </div>
        );
      case 'scheduler':
        return (
          <div className="p-6">
            <AutoDownloadScheduler />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'w-64'} ${
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
      } transition-transform duration-300 ease-in-out`}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
 {isMobile && (
  <div className="bg-white shadow-sm p-4 flex items-center justify-between">
    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      StatementFetch
    </h1>
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-lg bg-purple-100 text-purple-600"
    >
      ☰
    </button>
  </div>
)}

        {/* Content */}
        {renderContent()}
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
