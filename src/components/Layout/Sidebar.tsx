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
  MessageSquare
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
  { id: 'distribution', label: 'Distribution Overview', icon: DollarSign }, // Added Distribution Overview
  { id: 'lucky-draw', label: 'Lucky Draw', icon: Gift }, // Added Lucky Draw
  { id: 'first-deposit-bonus', label: 'First Deposit Bonus', icon: Gift },
  { id: 'tickets', label: 'Support Tickets', icon: MessageSquare }, // Added Support Tickets
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 bg-gradient-to-b from-sky-500 to-sky-600 text-white transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0 lg:w-16'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b border-sky-400 ${!isOpen ? 'px-2' : ''}`}>
            {isOpen ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="bg-white rounded-lg p-2">
                    <Menu className="text-sky-600 w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden text-white hover:text-sky-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="bg-white rounded-lg p-2 mx-auto">
                <Menu className="text-sky-600 w-6 h-6" />
              </div>
            )}
          </div>

          {/* User info */}
          {isOpen && (
            <div className="p-4 border-b border-sky-400">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-sky-600 font-semibold">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sky-200 text-sm">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed user avatar */}
          {!isOpen && (
            <div className="p-2 border-b border-sky-400 flex justify-center">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sky-600 font-semibold text-sm">
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
                  className={`w-full flex items-center transition-all
                    ${isOpen ? 'space-x-3 px-4 py-3 justify-start' : 'justify-center px-0 py-3'}
                    rounded-xl
                    ${isActive
                      ? 'bg-white text-sky-600 shadow-lg'
                      : 'text-sky-200 hover:bg-sky-400 hover:text-white'
                    }
                  `}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className={`p-4 border-t border-sky-400 ${!isOpen ? 'px-0' : ''}`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center transition-all
                ${isOpen ? 'space-x-3 px-4 py-3 justify-start' : 'justify-center px-0 py-3'}
                text-sky-200 hover:bg-sky-400 hover:text-white rounded-xl`}
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