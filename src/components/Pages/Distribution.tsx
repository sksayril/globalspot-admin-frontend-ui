import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Eye,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Wallet,
  CreditCard
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { 
  DistributionOverview, 
  DailyDistributionStats, 
  WeeklyDistributionStats, 
  MonthlyDistributionStats,
  TopEarnersDistribution,
  DistributionUser,
  DailyTopEarner,
  WeeklyTopEarner,
  MonthlyTopEarner,
  TopEarnerDistribution
} from '../../services/api';

const Distribution: React.FC = () => {
  const [overview, setOverview] = useState<DistributionOverview | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyDistributionStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyDistributionStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyDistributionStats | null>(null);
  const [topEarners, setTopEarners] = useState<TopEarnersDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'weekly' | 'monthly' | 'top-earners'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchDistributionData();
  }, [activeTab, selectedDate]);

  const fetchDistributionData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'overview':
          const overviewResponse = await apiClient.getDistributionOverview();
          if (overviewResponse.success) {
            setOverview(overviewResponse.data);
          }
          break;
        case 'daily':
          const dailyResponse = await apiClient.getDailyDistribution(selectedDate);
          if (dailyResponse.success) {
            setDailyStats(dailyResponse.data);
          }
          break;
        case 'weekly':
          const weeklyResponse = await apiClient.getWeeklyDistribution();
          if (weeklyResponse.success) {
            setWeeklyStats(weeklyResponse.data);
          }
          break;
        case 'monthly':
          const monthlyResponse = await apiClient.getMonthlyDistribution();
          if (monthlyResponse.success) {
            setMonthlyStats(monthlyResponse.data);
          }
          break;
        case 'top-earners':
          const topEarnersResponse = await apiClient.getTopEarnersDistribution(20);
          if (topEarnersResponse.success) {
            setTopEarners(topEarnersResponse.data);
          }
          break;
      }
    } catch (err) {
      console.error('Error fetching distribution data:', err);
      setError('Failed to load distribution data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distribution Overview</h1>
          <p className="text-gray-600">Comprehensive distribution statistics and analytics</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'daily', label: 'Daily Stats', icon: Calendar },
            { id: 'weekly', label: 'Weekly Stats', icon: TrendingUp },
            { id: 'monthly', label: 'Monthly Stats', icon: PieChart },
            { id: 'top-earners', label: 'Top Earners', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {overview.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Daily Distribution</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(overview.dailyDistribution)}
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Distribution</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(overview.weeklyDistribution)}
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Distribution</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(overview.monthlyDistribution)}
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Income</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(overview.totalDailyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Level Income</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(overview.totalLevelIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Character Level Income</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(overview.totalCharacterLevelIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Digit Level Income</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(overview.totalDigitLevelIncome)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Wallet Balances</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Normal Wallet Balance</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(overview.totalNormalWalletBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Investment Wallet Balance</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(overview.totalInvestmentWalletBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Referral Bonus</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(overview.totalReferralBonus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Breakdown Table */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">User Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balances
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Levels
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overview.userBreakdown.slice(0, 10).map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Normal: {formatCurrency(user.normalWalletBalance)}</div>
                            <div>Investment: {formatCurrency(user.investmentWalletBalance)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Daily: {formatCurrency(user.dailyIncome)}</div>
                            <div>Total: {formatCurrency(user.totalIncome)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Character: {user.characterLevel}</div>
                            <div>Digit: {user.digitLevel}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(user.lastActive)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'daily' && dailyStats && (
          <div className="space-y-6">
            {/* Daily Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {dailyStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {dailyStats.activeUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Daily Income</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(dailyStats.totalDailyIncome)}
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Income/User</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(dailyStats.averageIncomePerUser)}
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Earners */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Top Earners</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Levels
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailyStats.topEarners.map((earner) => (
                      <tr key={earner.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{earner.name}</div>
                            <div className="text-sm text-gray-500">{earner.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(earner.totalIncome)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(earner.dailyIncome)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Character: {earner.characterLevel}</div>
                            <div>Digit: {earner.digitLevel}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weekly' && weeklyStats && (
          <div className="space-y-6">
            {/* Weekly Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {weeklyStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {weeklyStats.newUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Income</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(weeklyStats.totalDailyIncome)}
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Income/User</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(weeklyStats.averageIncomePerUser)}
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Daily Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Income
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {weeklyStats.dailyBreakdown.map((day) => (
                      <tr key={day.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(day.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(day.dailyIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(day.levelIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(day.totalIncome)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && monthlyStats && (
          <div className="space-y-6">
            {/* Monthly Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {monthlyStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {monthlyStats.newUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Income</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(monthlyStats.totalDailyIncome)}
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Income/User</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(monthlyStats.averageIncomePerUser)}
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Breakdown */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Weekly Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Week
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        New Users
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyStats.weeklyBreakdown.map((week) => (
                      <tr key={week.weekStart} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(week.weekStart)} - {formatDate(week.weekEnd)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(week.dailyIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(week.levelIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(week.totalIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {week.newUsers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'top-earners' && topEarners && (
          <div className="space-y-6">
            {/* Top Earners Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {topEarners.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(topEarners.summary.totalIncome)}
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Income</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(topEarners.summary.averageIncome)}
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Highest Income</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(topEarners.summary.highestIncome)}
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Earners Table */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Top Earners</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balances
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Income
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Levels
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topEarners.topEarners.map((earner) => (
                      <tr key={earner.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{earner.name}</div>
                            <div className="text-sm text-gray-500">{earner.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Normal: {formatCurrency(earner.normalWalletBalance)}</div>
                            <div>Investment: {formatCurrency(earner.investmentWalletBalance)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Daily: {formatCurrency(earner.dailyIncome)}</div>
                            <div>Total: {formatCurrency(earner.totalIncome)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Character: {earner.characterLevel}</div>
                            <div>Digit: {earner.digitLevel}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(earner.joinedDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Distribution; 