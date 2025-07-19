import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTab: string;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, activeTab, sidebarOpen }) => {
  const { user } = useAuth();

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Dashboard Overview';
      case 'users':
        return 'Users Management';
      case 'revenue':
        return 'My Revenue';
      case 'investment':
        return 'Investment';
      case 'payment-requests':
        return 'Payment Requests';
      case 'withdrawal-requests':
        return 'Withdrawal Requests';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-800 transition-colors p-1"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">
              {getPageTitle(activeTab)}
            </h1>
            <span className="text-xs sm:text-sm text-gray-500 sm:ml-2">
              Welcome back, {user?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-64"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-sky-100 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <span className="text-sky-600 font-semibold text-xs sm:text-sm">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;