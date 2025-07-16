import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Calendar, UserPlus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { User, Transaction } from '../../services/api';

interface RecentActivityProps {
  users: User[];
  transactions: Transaction[];
  loading: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ users, transactions, loading }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Transactions
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          {users.slice(0, 5).map((user) => (
            <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-sky-100 rounded-full p-2">
                <UserPlus className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-500">Ref: {user.referralCode}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`rounded-full p-2 ${
                transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'deposit' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{transaction.userId.name}</p>
                <p className="text-xs text-gray-500">{transaction.userId.email}</p>
                <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  ${transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sky-600 hover:text-sky-700 text-sm font-medium">
          View all {activeTab === 'users' ? 'users' : 'transactions'} →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity; 