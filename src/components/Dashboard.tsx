import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import Overview from './Dashboard/Overview';
import Users from './Pages/Users';
import RevenuePage from './Pages/Revenue';
import InvestmentPage from './Pages/Investment';
import PaymentRequestsPage from './Pages/PaymentRequests';
import WithdrawalRequestsPage from './Pages/WithdrawalRequests';
import WalletKYCPage from './Pages/WalletKYC';
import FirstDepositBonusPage from './Pages/FirstDepositBonus';
import Distribution from './Pages/Distribution';
import LuckyDraw from './Pages/LuckyDraw';
import Tickets from './Pages/Tickets';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    console.log('Dashboard: Toggling sidebar from', sidebarOpen, 'to', !sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <Users />;
      case 'revenue':
        return <RevenuePage />;
      case 'investment':
        return <InvestmentPage />;
      case 'payment-requests':
        return <PaymentRequestsPage />;
      case 'withdrawal-requests':
        return <WithdrawalRequestsPage />;
      case 'wallet-kyc':
        return <WalletKYCPage />;
      case 'distribution':
        return <Distribution />;
      case 'lucky-draw':
        return <LuckyDraw />;
      case 'first-deposit-bonus':
        return <FirstDepositBonusPage />;
      case 'tickets':
        return <Tickets setActiveTab={setActiveTab} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10">
        <Header 
          onToggleSidebar={handleToggleSidebar}
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;