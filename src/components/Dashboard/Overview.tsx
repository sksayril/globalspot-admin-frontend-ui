import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, CreditCard, Wallet, UserPlus, ArrowUpRight, ArrowDownRight, BarChart3, Star } from 'lucide-react';
import StatsCard from './StatsCard';
import UserGrowthChart from './UserGrowthChart';
import RevenueChart from './RevenueChart';
import RecentActivity from './RecentActivity';
import TopUsers from './TopUsers';
import { dashboardService } from '../../services/dashboardService';
import { apiClient } from '../../services/api';
import { DashboardStatistics, User, Transaction, UserGrowthData, RevenueData, DistributionOverview } from '../../services/api';

const Overview: React.FC = () => {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [
          statsData,
          usersData,
          transactionsData,
          growthData,
          revenueData,
          distributionData
        ] = await Promise.all([
          dashboardService.getDashboardStatistics(),
          dashboardService.getRecentUsers(1, 5),
          dashboardService.getRecentTransactions(1, 5),
          dashboardService.getUserGrowth(30),
          dashboardService.getRevenueChart(30),
          apiClient.getDistributionOverview()
        ]);

        if (statsData) {
          setStatistics(statsData);
        }

        if (usersData) {
          setRecentUsers(usersData.users);
        }

        if (transactionsData) {
          setRecentTransactions(transactionsData.transactions);
        }

        if (growthData) {
          setUserGrowthData(growthData.growthData);
        }

        if (revenueData) {
          setRevenueData(revenueData.revenueData);
        }

        if (distributionData && distributionData.success) {
          setDistributionData(distributionData.data);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (!statistics) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatsCard
          title="Total Users"
          value={statistics.users.total.toLocaleString()}
          icon={Users}
          trend={{ 
            value: `${statistics.users.newToday} new today`, 
            isPositive: statistics.users.newToday > 0 
          }}
          color="blue"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${statistics.revenue.netRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ 
            value: `$${statistics.revenue.monthlyNetRevenue.toLocaleString()} this month`, 
            isPositive: statistics.revenue.monthlyNetRevenue > 0 
          }}
          color="green"
        />
        <StatsCard
          title="Total Investments"
          value={`$${statistics.revenue.totalInvestments.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ 
            value: `$${statistics.revenue.totalInvestmentReturns.toLocaleString()} returns`, 
            isPositive: statistics.revenue.totalInvestmentReturns > 0 
          }}
          color="purple"
        />
        <StatsCard
          title="Pending Deposits"
          value={statistics.transactions.pendingDeposits.toString()}
          icon={CreditCard}
          trend={{ 
            value: `${statistics.transactions.pendingWithdrawals} pending withdrawals`, 
            isPositive: false 
          }}
          color="orange"
        />
        <StatsCard
          title="Active Users"
          value={statistics.users.active.toLocaleString()}
          icon={UserPlus}
          trend={{ 
            value: `${statistics.users.withReferrals} with referrals`, 
            isPositive: true 
          }}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userGrowthData.length > 0 && (
          <UserGrowthChart data={userGrowthData} period={30} />
        )}
        {revenueData.length > 0 && (
          <RevenueChart data={revenueData} period={30} />
        )}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Deposits</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                ${statistics.revenue.totalDeposits.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Withdrawals</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                ${statistics.revenue.totalWithdrawals.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Investment Balance</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                ${statistics.wallets.totalInvestmentBalance.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Normal Balance</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                ${statistics.wallets.totalNormalBalance.toLocaleString()}
              </p>
            </div>
            <div className="bg-sky-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          users={recentUsers} 
          transactions={recentTransactions} 
          loading={loading} 
        />
        <TopUsers />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors">
            <Users className="w-8 h-8 text-sky-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Add User</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">View Revenue</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">New Investment</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Process Payment</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;