import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Filter, Plus, Eye, Shield, ShieldOff, Users as UsersIcon, Mail, Phone, Calendar, RefreshCw, Key, EyeOff } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { User } from '../../services/api';
import UserDetail from './UserDetail';
import { MobileTable } from '../Common';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [blockingUser, setBlockingUser] = useState<string | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});
  const [userPasswords, setUserPasswords] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

  const fetchUsers = async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getAdminUsers();
      if (data) {
        setUsers(data);
        if (showSuccessMessage) {
          toast.success('Users data refreshed successfully');
        }
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'active':
          filtered = filtered.filter(user => user.isActive && !user.isBlocked);
          break;
        case 'inactive':
          filtered = filtered.filter(user => !user.isActive);
          break;
        case 'blocked':
          filtered = filtered.filter(user => user.isBlocked);
          break;
      }
    }

    setFilteredUsers(filtered);
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      setBlockingUser(userId);
      const result = await dashboardService.blockUser(userId, isBlocked);
      
      if (result.success) {
        // Refresh user data to get the latest state
        await fetchUsers(false);
        
        // Show success message from API
        toast.success(result.message);
        
        // Close user detail modal if open
        if (showUserDetail) {
          setShowUserDetail(false);
          setSelectedUser(null);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('An error occurred while updating user status');
    } finally {
      setBlockingUser(null);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleViewPassword = async (userId: string) => {
    try {
      // Check if password is already loaded
      if (userPasswords[userId]) {
        setPasswordVisibility(prev => ({
          ...prev,
          [userId]: !prev[userId]
        }));
        return;
      }

      // Fetch user details to get password
      const userDetails = await dashboardService.getUserDetails(userId);
      if (userDetails && userDetails.originalPassword) {
        setUserPasswords(prev => ({
          ...prev,
          [userId]: userDetails.originalPassword || ''
        }));
        setPasswordVisibility(prev => ({
          ...prev,
          [userId]: true
        }));
        toast.success('Password loaded successfully');
      } else {
        toast.error('Failed to load password');
      }
    } catch (error) {
      console.error('Error fetching user password:', error);
      toast.error('Failed to load password');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Users Management</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span className="text-sm text-gray-600">Total Users: {users.length}</span>
            <button 
              onClick={() => fetchUsers(true)}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, phone, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'blocked')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <MobileTable
          data={filteredUsers.map(user => ({
            ...user,
            user: (
              <div className="flex items-center space-x-3">
                <div className="bg-sky-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                  <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                </div>
              </div>
            ),
            contact: (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
              </div>
            ),
            wallets: (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Normal:</span>
                  <span className="font-medium">{formatAmount(user.normalWallet.balance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Investment:</span>
                  <span className="font-medium">{formatAmount(user.investmentWallet.balance)}</span>
                </div>
              </div>
            ),
            referral: (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-medium">{user.referralCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{user.referralLevel}</span>
                </div>
                {user.referredBy && (
                  <div className="text-xs text-gray-500">
                    By: {user.referredBy.name}
                  </div>
                )}
              </div>
            ),
            password: (
              <div className="flex items-center space-x-2">
                {userPasswords[user._id] ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {passwordVisibility[user._id] 
                        ? userPasswords[user._id] 
                        : '••••••••'
                      }
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPasswordVisibility(prev => ({
                          ...prev,
                          [user._id]: !prev[user._id]
                        }));
                      }}
                      className="text-gray-500 hover:text-gray-700"
                      title={passwordVisibility[user._id] ? 'Hide Password' : 'Show Password'}
                    >
                      {passwordVisibility[user._id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Not loaded</span>
                )}
              </div>
            ),
            status: (
              <div className="space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.isBlocked && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Blocked
                  </span>
                )}
              </div>
            ),
            joinDate: (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
              </div>
            ),
            actions: (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewUser(user);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUser(user._id, !user.isBlocked);
                  }}
                  disabled={blockingUser === user._id}
                  className={`p-1 ${
                    user.isBlocked 
                      ? 'text-green-600 hover:text-green-800' 
                      : 'text-red-600 hover:text-red-800'
                  } ${blockingUser === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={user.isBlocked ? 'Unblock User' : 'Block User'}
                >
                  {blockingUser === user._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    user.isBlocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />
                  )}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewPassword(user._id);
                  }}
                  className="text-purple-600 hover:text-purple-800 p-1"
                  title="View Password"
                >
                  <Key className="w-4 h-4" />
                </button>
              </div>
            )
          }))}
          columns={[
            { key: 'user', label: 'User', mobilePriority: true },
            { key: 'contact', label: 'Contact', mobilePriority: true },
            { key: 'wallets', label: 'Wallets' },
            { key: 'referral', label: 'Referral' },
            { key: 'password', label: 'Password' },
            { key: 'status', label: 'Status', mobilePriority: true },
            { key: 'joinDate', label: 'Join Date' },
            { key: 'actions', label: 'Actions' }
          ]}
          onRowClick={handleViewUser}
          emptyMessage="No users found"
          loading={loading}
        />
      </div>

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => {
            setShowUserDetail(false);
            setSelectedUser(null);
          }}
          onBlockUser={handleBlockUser}
          blockingUser={blockingUser}
        />
      )}
    </div>
  );
};

export default Users;