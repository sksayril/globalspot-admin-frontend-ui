import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, User, Mail, Phone, Calendar, Wallet, TrendingUp, Users, DollarSign, Shield, ShieldOff, Key, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../../services/api';
import { dashboardService } from '../../services/dashboardService';

interface UserDetailProps {
  user: UserType;
  onClose: () => void;
  onBlockUser: (userId: string, isBlocked: boolean) => void;
  blockingUser?: string | null;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose, onBlockUser, blockingUser }) => {
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'withdrawal':
        return 'bg-red-100 text-red-800';
      case 'referral_bonus':
        return 'bg-blue-100 text-blue-800';
      case 'daily_income':
        return 'bg-purple-100 text-purple-800';
      case 'transfer_to_user':
      case 'transfer_from_user':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLoadPassword = async () => {
    try {
      setLoadingPassword(true);
      const userDetails = await dashboardService.getUserDetails(user._id);
      if (userDetails && userDetails.originalPassword) {
        setUserPassword(userDetails.originalPassword);
        toast.success('Password loaded successfully');
      } else {
        toast.error('Failed to load password');
      }
    } catch (error) {
      console.error('Error loading password:', error);
      toast.error('Failed to load password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-100 rounded-full p-2">
              <User className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Joined: {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Referral Code: {user.referralCode}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Password: </span>
                  {userPassword ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {showPassword ? userPassword : '••••••••'}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleLoadPassword}
                      disabled={loadingPassword}
                      className="text-sky-600 hover:text-sky-700 text-sm disabled:opacity-50"
                    >
                      {loadingPassword ? 'Loading...' : 'Load Password'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Status & Referral</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blocked:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBlocked ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Referral Level:</span>
                  <span className="text-sm font-medium text-gray-800">{user.referralLevel}</span>
                </div>
                {user.referredBy && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Referred By:</span>
                    <span className="text-sm font-medium text-gray-800">{user.referredBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Wallet className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-gray-800">Normal Wallet</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="font-semibold text-gray-800">{formatAmount(user.normalWallet.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transactions:</span>
                  <span className="text-sm text-gray-800">{user.normalWallet.transactions.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-800">Investment Wallet</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="font-semibold text-gray-800">{formatAmount(user.investmentWallet.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transactions:</span>
                  <span className="text-sm text-gray-800">{user.investmentWallet.transactions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Income & Bonus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Daily Income</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Earned:</span>
                  <span className="font-semibold text-gray-800">{formatAmount(user.dailyIncome.totalEarned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Today Earned:</span>
                  <span className="font-semibold text-gray-800">{formatAmount(user.dailyIncome.todayEarned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Claimed:</span>
                  <span className="text-sm text-gray-800">
                    {user.dailyIncome.lastClaimed ? formatDate(user.dailyIncome.lastClaimed) : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-800">First Deposit Bonus</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Received:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.firstDepositBonus.hasReceived ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.firstDepositBonus.hasReceived ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-800">{formatAmount(user.firstDepositBonus.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Percentage:</span>
                  <span className="text-sm text-gray-800">{user.firstDepositBonus.percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {user.normalWallet.transactions.slice(0, 10).map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type.replace('_', ' ')}
                    </span>
                    <span className={`font-semibold ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}{formatAmount(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
              {user.normalWallet.transactions.length === 0 && (
                <p className="text-center text-gray-500 py-4">No transactions found</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onBlockUser(user._id, !user.isBlocked)}
              disabled={blockingUser === user._id}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                user.isBlocked
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } ${blockingUser === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {blockingUser === user._id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                  {user.isBlocked ? 'Unblocking...' : 'Blocking...'}
                </>
              ) : (
                <>
                  {user.isBlocked ? (
                    <>
                      <Shield className="w-4 h-4 inline mr-2" />
                      Unblock User
                    </>
                  ) : (
                    <>
                      <ShieldOff className="w-4 h-4 inline mr-2" />
                      Block User
                    </>
                  )}
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 