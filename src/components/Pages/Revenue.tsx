import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Filter, RefreshCw, Download, BarChart3, Users, TrendingDown } from 'lucide-react';
import { apiClient, RevenueOverview, RevenueDeposit, RevenueWithdrawal, RevenueInvestment, RevenueChartData, TopRevenueUser } from '../../services/api';
import { toast } from 'react-hot-toast';

const RevenuePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposits' | 'withdrawals' | 'investments' | 'charts' | 'top-users'>('overview');
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Overview Data
  const [overview, setOverview] = useState<RevenueOverview | null>(null);

  // Deposits Data
  const [deposits, setDeposits] = useState<RevenueDeposit[]>([]);
  const [depositsPage, setDepositsPage] = useState(1);
  const [depositsLoading, setDepositsLoading] = useState(false);

  // Withdrawals Data
  const [withdrawals, setWithdrawals] = useState<RevenueWithdrawal[]>([]);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);

  // Investments Data
  const [investments, setInvestments] = useState<RevenueInvestment[]>([]);
  const [investmentsPage, setInvestmentsPage] = useState(1);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);

  // Charts Data
  const [chartData, setChartData] = useState<RevenueChartData[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Top Users Data
  const [topUsers, setTopUsers] = useState<TopRevenueUser[]>([]);
  const [topUsersType, setTopUsersType] = useState<'deposits' | 'withdrawals' | 'investments'>('deposits');
  const [topUsersLoading, setTopUsersLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      const response = await apiClient.getRevenueOverview();
      if (response.success) {
        setOverview(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching revenue overview:', error);
    }
  };

  const fetchDeposits = async (page: number = 1) => {
    try {
      setDepositsLoading(true);
      const response = await apiClient.getRevenueDeposits(page, 10);
      if (response.success) {
        setDeposits(response.data.data.deposits);
        setDepositsPage(page);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Failed to load deposits');
    } finally {
      setDepositsLoading(false);
    }
  };

  const fetchWithdrawals = async (page: number = 1) => {
    try {
      setWithdrawalsLoading(true);
      const response = await apiClient.getRevenueWithdrawals(page, 10);
      if (response.success) {
        setWithdrawals(response.data.data.withdrawals);
        setWithdrawalsPage(page);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to load withdrawals');
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  const fetchInvestments = async (page: number = 1) => {
    try {
      setInvestmentsLoading(true);
      const response = await apiClient.getRevenueInvestments(page, 10);
      if (response.success) {
        setInvestments(response.data.data.investments);
        setInvestmentsPage(page);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast.error('Failed to load investments');
    } finally {
      setInvestmentsLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const period = filterPeriod === 'week' ? 7 : filterPeriod === 'month' ? 30 : 365;
      const response = await apiClient.getRevenueChartData(period);
      if (response.success) {
        setChartData(response.data.data.revenueData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast.error('Failed to load chart data');
    } finally {
      setChartLoading(false);
    }
  };

  const fetchTopUsers = async () => {
    try {
      setTopUsersLoading(true);
      const response = await apiClient.getTopRevenueUsers(topUsersType);
      if (response.success) {
        setTopUsers(response.data.data.topUsers);
      }
    } catch (error) {
      console.error('Error fetching top users:', error);
      toast.error('Failed to load top users');
    } finally {
      setTopUsersLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await fetchOverview();
      toast.success('Revenue data loaded successfully');
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to load revenue data');
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'deposits') {
      fetchDeposits();
    } else if (activeTab === 'withdrawals') {
      fetchWithdrawals();
    } else if (activeTab === 'investments') {
      fetchInvestments();
    } else if (activeTab === 'charts') {
      fetchChartData();
    } else if (activeTab === 'top-users') {
      fetchTopUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'charts') {
      fetchChartData();
    }
  }, [filterPeriod, activeTab]);

  useEffect(() => {
    if (activeTab === 'top-users') {
      fetchTopUsers();
    }
  }, [topUsersType, activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const getInvestmentStatusColor = (investment: RevenueInvestment) => {
    if (investment.isCompleted) return 'bg-green-100 text-green-800';
    if (investment.isWithdrawn) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getInvestmentStatusText = (investment: RevenueInvestment) => {
    if (investment.isCompleted) return 'Completed';
    if (investment.isWithdrawn) return 'Withdrawn';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-gray-600">Loading revenue data...</span>
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
              onClick={fetchData}
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
      {/* Overview Statistics */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${overview.totalRevenue.netRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↗ {overview.totalRevenue.profitMargin}% profit margin</p>
              </div>
              <div className="bg-sky-500 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${overview.monthlyRevenue.netRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↗ {overview.monthlyRevenue.growthRate}% growth</p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amounts</p>
                <p className="text-2xl font-bold text-gray-800">${overview.pendingAmounts.total.toLocaleString()}</p>
                <p className="text-sm text-orange-600 mt-1">⚠ Awaiting confirmation</p>
              </div>
              <div className="bg-orange-500 rounded-full p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-800">{overview.summary.totalUsers}</p>
                <p className="text-sm text-blue-600 mt-1">{overview.summary.activeInvestments} active investments</p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('deposits')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'deposits'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'withdrawals'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Withdrawals
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'investments'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Investments
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'charts'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Charts
            </button>
            <button
              onClick={() => setActiveTab('top-users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'top-users'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Top Users
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {(activeTab === 'charts' || activeTab === 'top-users') && (
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                {activeTab === 'charts' && (
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value as 'week' | 'month' | 'year')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                )}
                {activeTab === 'top-users' && (
                  <select
                    value={topUsersType}
                    onChange={(e) => setTopUsersType(e.target.value as 'deposits' | 'withdrawals' | 'investments')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="deposits">By Deposits</option>
                    <option value="withdrawals">By Withdrawals</option>
                    <option value="investments">By Investments</option>
                  </select>
                )}
              </div>
            )}
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Deposits</span>
                    <span className="font-semibold">${overview.totalRevenue.deposits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Withdrawals</span>
                    <span className="font-semibold">${overview.totalRevenue.withdrawals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Investments</span>
                    <span className="font-semibold">${overview.totalRevenue.investments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Returns</span>
                    <span className="font-semibold">${overview.totalRevenue.investmentReturns.toLocaleString()}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-semibold">Net Revenue</span>
                    <span className="font-bold text-green-600">${overview.totalRevenue.netRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Deposits</span>
                    <span className="font-semibold">${overview.monthlyRevenue.deposits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Withdrawals</span>
                    <span className="font-semibold">${overview.monthlyRevenue.withdrawals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Rate</span>
                    <span className="font-semibold text-green-600">{overview.monthlyRevenue.growthRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Investment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{overview.summary.activeInvestments}</div>
                  <div className="text-sm text-gray-600">Active Investments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{overview.summary.completedInvestments}</div>
                  <div className="text-sm text-gray-600">Completed Investments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{overview.summary.withdrawnInvestments}</div>
                  <div className="text-sm text-gray-600">Withdrawn Investments</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deposits Tab */}
        {activeTab === 'deposits' && (
          <div className="overflow-x-auto">
            {depositsLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">User</th>
                    <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No deposits found
                      </td>
                    </tr>
                  ) : (
                    deposits.map((deposit) => (
                      <tr key={deposit._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <span className="font-medium text-gray-800">{deposit.userId.name}</span>
                            <br />
                            <span className="text-sm text-gray-500">{deposit.userId.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-800">${deposit.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                            {deposit.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{formatDate(deposit.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            {withdrawalsLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">User</th>
                    <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-700">Wallet Address</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No withdrawals found
                      </td>
                    </tr>
                  ) : (
                    withdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <span className="font-medium text-gray-800">{withdrawal.userId.name}</span>
                            <br />
                            <span className="text-sm text-gray-500">{withdrawal.userId.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-800">${withdrawal.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-gray-600">
                          <span className="font-mono text-sm">{withdrawal.walletAddress.slice(0, 10)}...</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{formatDate(withdrawal.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="overflow-x-auto">
            {investmentsLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">User</th>
                    <th className="text-left p-4 font-medium text-gray-700">Plan</th>
                    <th className="text-left p-4 font-medium text-gray-700">Investment Amount</th>
                    <th className="text-left p-4 font-medium text-gray-700">Total Earned</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No investments found
                      </td>
                    </tr>
                  ) : (
                    investments.map((investment) => (
                      <tr key={investment._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <span className="font-medium text-gray-800">{investment.userId.name}</span>
                            <br />
                            <span className="text-sm text-gray-500">{investment.userId.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{investment.planId.title}</td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-800">${investment.investmentAmount.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-green-600">${investment.totalEarned.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestmentStatusColor(investment)}`}>
                            {getInvestmentStatusText(investment)}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{formatDate(investment.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {chartLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Chart Data</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white">
                        <th className="text-left p-4 font-medium text-gray-700">Date</th>
                        <th className="text-left p-4 font-medium text-gray-700">Deposits</th>
                        <th className="text-left p-4 font-medium text-gray-700">Withdrawals</th>
                        <th className="text-left p-4 font-medium text-gray-700">Investments</th>
                        <th className="text-left p-4 font-medium text-gray-700">Net Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">
                            No chart data available
                          </td>
                        </tr>
                      ) : (
                        chartData.map((data, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-white">
                            <td className="p-4 text-gray-600">{data.date}</td>
                            <td className="p-4">
                              <span className="font-semibold text-green-600">${data.deposits.toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-red-600">${data.withdrawals.toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-blue-600">${data.investments.toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-gray-800">${data.netRevenue.toLocaleString()}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Users Tab */}
        {activeTab === 'top-users' && (
          <div className="space-y-6">
            {topUsersLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-700">User</th>
                      <th className="text-left p-4 font-medium text-gray-700">Email</th>
                      <th className="text-left p-4 font-medium text-gray-700">Phone</th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        {topUsersType === 'deposits' ? 'Total Deposits' : 
                         topUsersType === 'withdrawals' ? 'Total Withdrawals' : 'Total Investments'}
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        {topUsersType === 'deposits' ? 'Deposit Count' : 
                         topUsersType === 'withdrawals' ? 'Withdrawal Count' : 'Investment Count'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          No top users found
                        </td>
                      </tr>
                    ) : (
                      topUsers.map((user, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4">
                            <span className="font-medium text-gray-800">{user.name}</span>
                          </td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4 text-gray-600">{user.phone}</td>
                          <td className="p-4">
                            <span className="font-semibold text-gray-800">
                              ${(topUsersType === 'deposits' ? user.totalDeposits :
                                 topUsersType === 'withdrawals' ? user.totalWithdrawals :
                                 user.totalInvestments)?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {topUsersType === 'deposits' ? user.depositCount :
                             topUsersType === 'withdrawals' ? user.withdrawalCount :
                             user.investmentCount || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenuePage;