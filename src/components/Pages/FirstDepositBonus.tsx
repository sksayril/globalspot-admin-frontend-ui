import React, { useState, useEffect } from 'react';
import { Gift, Settings, RefreshCw, X as CloseIcon, TrendingUp, Users, DollarSign } from 'lucide-react';
import { apiClient, UserWithBonus } from '../../services/api';
import { toast } from 'react-hot-toast';

interface BonusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPercentage: number;
  onUpdatePercentage: (percentage: number) => void;
}

const BonusSettingsModal: React.FC<BonusSettingsModalProps> = ({
  isOpen,
  onClose,
  currentPercentage,
  onUpdatePercentage
}) => {
  const [percentage, setPercentage] = useState(currentPercentage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (percentage < 0 || percentage > 100) {
      toast.error('Percentage must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.updateBonusPercentage(percentage);
      
      if (response.success) {
        onUpdatePercentage(percentage);
        toast.success('Bonus percentage updated successfully');
        onClose();
      } else {
        toast.error('Failed to update bonus percentage');
      }
    } catch (error) {
      console.error('Error updating percentage:', error);
      toast.error('Failed to update bonus percentage');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPercentage(currentPercentage);
    onClose();
  };

  // Update local state when currentPercentage prop changes
  useEffect(() => {
    setPercentage(currentPercentage);
  }, [currentPercentage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Update Bonus Percentage</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-sky-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">First Deposit Bonus Settings</h3>
              <p className="text-sm text-gray-600">
                Set the percentage bonus that users will receive on their first deposit.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bonus Percentage *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter percentage (0-100)"
                />
                <div className="absolute right-3 top-2.5 text-gray-500">%</div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Example: 10% means users get $10 bonus for every $100 deposited
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Note</h4>
              <p className="text-sm text-yellow-700">
                Changing the bonus percentage will only affect new users. Existing users who have already received their bonus will not be affected.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || percentage < 0 || percentage > 100 || percentage === currentPercentage}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Percentage'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FirstDepositBonusPage: React.FC = () => {
  const [users, setUsers] = useState<UserWithBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPercentage, setCurrentPercentage] = useState(10);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const fetchBonusData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFirstDepositBonusStatus();
      if (response.success) {
        setUsers(response.data);
        toast.success('Bonus data loaded successfully');
      } else {
        setError('Failed to load bonus data');
        toast.error('Failed to load bonus data');
      }
    } catch (err) {
      console.error('Error fetching bonus data:', err);
      setError('Failed to load bonus data');
      toast.error('Failed to load bonus data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPercentage = async () => {
    try {
      const response = await apiClient.getBonusPercentage();
      if (response.success) {
        setCurrentPercentage(response.data.data.percentage);
      }
    } catch (err) {
      console.error('Error fetching current percentage:', err);
      // Keep default percentage if API fails
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchBonusData(),
        fetchCurrentPercentage()
      ]);
    };
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (hasReceived: boolean) => {
    return hasReceived 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (hasReceived: boolean) => {
    return hasReceived ? 'Received' : 'Pending';
  };

  const stats = {
    totalUsers: users.length,
    receivedBonus: users.filter(user => user.firstDepositBonus.hasReceived).length,
    pendingBonus: users.filter(user => !user.firstDepositBonus.hasReceived).length,
    totalBonusAmount: users.reduce((sum, user) => sum + user.firstDepositBonus.amount, 0)
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-gray-600">Loading bonus data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBonusData}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-sky-500 rounded-full p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Received Bonus</p>
              <p className="text-2xl font-bold text-green-600">{stats.receivedBonus}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Bonus</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingBonus}</p>
            </div>
            <div className="bg-orange-500 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bonus Paid</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalBonusAmount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">First Deposit Bonus Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Current bonus percentage: <span className="font-semibold text-sky-600">{currentPercentage}%</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Change Percentage</span>
            </button>
            <button
              onClick={fetchBonusData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700">User</th>
                <th className="text-left p-4 font-medium text-gray-700">Bonus Amount</th>
                <th className="text-left p-4 font-medium text-gray-700">Percentage</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Received At</th>
                <th className="text-left p-4 font-medium text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                        <br />
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-800">
                        ${user.firstDepositBonus.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {user.firstDepositBonus.percentage}%
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.firstDepositBonus.hasReceived)}`}>
                        {getStatusText(user.firstDepositBonus.hasReceived)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {user.firstDepositBonus.receivedAt 
                        ? formatDate(user.firstDepositBonus.receivedAt)
                        : '-'
                      }
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BonusSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentPercentage={currentPercentage}
        onUpdatePercentage={setCurrentPercentage}
      />
    </div>
  );
};

export default FirstDepositBonusPage; 