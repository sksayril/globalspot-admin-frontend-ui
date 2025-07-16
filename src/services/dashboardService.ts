import { apiClient, DashboardStatistics, RecentUsersResponse, RecentTransactionsResponse, UserGrowthResponse, RevenueChartResponse, TopUsersResponse, User, WithdrawalRequest } from './api';

class DashboardService {
  async getDashboardStatistics(): Promise<DashboardStatistics | null> {
    try {
      const response = await apiClient.getDashboardStatistics();
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return null;
    }
  }

  async getAdminUsers(): Promise<User[] | null> {
    try {
      const response = await apiClient.getAdminUsers();
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return null;
    }
  }

  async blockUser(userId: string, isBlocked: boolean): Promise<{ success: boolean; message: string; updatedUser?: any }> {
    try {
      const response = await apiClient.blockUser(userId, isBlocked);
      if (response.success && response.data) {
        return {
          success: true,
          message: response.data.message,
          updatedUser: response.data.data
        };
      }
      return {
        success: false,
        message: response.message || 'Failed to update user status'
      };
    } catch (error) {
      console.error('Error blocking user:', error);
      return {
        success: false,
        message: 'An error occurred while updating user status'
      };
    }
  }

  async getUserDetails(userId: string): Promise<User | null> {
    try {
      const response = await apiClient.getUserDetails(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }

  async getRecentUsers(page: number = 1, limit: number = 10): Promise<RecentUsersResponse | null> {
    try {
      const response = await apiClient.getRecentUsers(page, limit);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching recent users:', error);
      return null;
    }
  }

  async getRecentTransactions(page: number = 1, limit: number = 20): Promise<RecentTransactionsResponse | null> {
    try {
      const response = await apiClient.getRecentTransactions(page, limit);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return null;
    }
  }

  async getUserGrowth(period: number = 30): Promise<UserGrowthResponse | null> {
    try {
      const response = await apiClient.getUserGrowth(period);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      return null;
    }
  }

  async getRevenueChart(period: number = 30): Promise<RevenueChartResponse | null> {
    try {
      const response = await apiClient.getRevenueChart(period);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      return null;
    }
  }

  async getTopUsers(type: string = 'investment'): Promise<TopUsersResponse | null> {
    try {
      const response = await apiClient.getTopUsers(type);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching top users:', error);
      return null;
    }
  }

  async getWithdrawalRequests(): Promise<WithdrawalRequest[] | null> {
    try {
      const response = await apiClient.getWithdrawalRequests();
      console.log('response:', response);
      if (response.success && response.data && response.data.requests) {
        return response.data.requests;
      }
      return null;
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      return null;
    }
  }
}

export const dashboardService = new DashboardService(); 