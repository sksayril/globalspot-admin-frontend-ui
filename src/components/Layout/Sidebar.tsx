import React from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  LogOut, 
  X,
  Menu,
  Gift,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Menu },
  { id: 'users', label: 'Users', icon: Users },
  // { id: 'revenue', label: 'My Revenue', icon: DollarSign },
  { id: 'investment', label: 'Investment', icon: TrendingUp },
  { id: 'payment-requests', label: 'Payment Request', icon: CreditCard },
  { id: 'withdrawal-requests', label: 'Withdrawal Request', icon: Wallet },
  { id: 'wallet-kyc', label: 'Users Wallet KYC', icon: Shield }, // Added Wallet KYC
  { id: 'distribution', label: 'Distribution Overview', icon: DollarSign }, // Added Distribution Overview
  { id: 'lucky-draw', label: 'Lucky Draw', icon: Gift }, // Added Lucky Draw
  { id: 'first-deposit-bonus', label: 'First Deposit Bonus', icon: Gift },
  { id: 'tickets', label: 'Support Tickets', icon: MessageSquare }, // Added Support Tickets
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  // Handle body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  // Handle window resize and orientation change
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isOpen, setIsOpen]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-25 lg:hidden"
          onClick={() => setIsOpen(false)}
          onTouchStart={() => setIsOpen(false)}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-30 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white transform transition-all duration-300 ease-in-out shadow-2xl backdrop-blur-sm max-w-[85vw] lg:max-w-none sidebar-mobile
        ${isOpen ? 'w-72 sm:w-80 lg:w-64 translate-x-0' : 'w-0 lg:w-16 -translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b border-gray-700 ${!isOpen ? 'px-2' : ''}`}>
            {isOpen ? (
              <>
                {/* <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-2 shadow-lg">
                    <Menu className="text-white w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Admin Panel</h1>
                </div> */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div >
                {/* <Menu className="text-white w-6 h-6" /> */}
              </div>
            )}
          </div>

          {/* User info */}
          {isOpen && (
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-gray-300 text-sm bg-gray-800 px-2 py-1 rounded-full inline-block">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed user avatar */}
          {!isOpen && (
            <div className="p-2 border-b border-gray-700 flex justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 py-4 space-y-2 flex flex-col items-center ${!isOpen ? 'px-0' : 'px-2 items-stretch'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center transition-all duration-200 ease-in-out
                    ${isOpen ? 'space-x-3 px-4 py-3 justify-start' : 'justify-center px-0 py-3'}
                    rounded-xl mx-2
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105 ring-2 ring-purple-300 ring-opacity-50'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
                    }
                  `}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className={`p-4 border-t border-gray-700 ${!isOpen ? 'px-0' : ''}`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center transition-all duration-200 ease-in-out
                ${isOpen ? 'space-x-3 px-4 py-3 justify-start' : 'justify-center px-0 py-3'}
                text-gray-300 hover:bg-red-600 hover:text-white rounded-xl mx-2 hover:shadow-lg`}
              title={!isOpen ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;