import { apiClient, ApiResponse, AdminLoginResponse, tokenManager } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: AdminUser;
    token?: string;
    message?: string;
  }> {
    try {
      const response: ApiResponse<AdminLoginResponse> = await apiClient.post(
        '/admin/login',
        credentials
      );

      if (response.success && response.data) {
        const { admin, token } = response.data;
        
        // Store token in localStorage
        tokenManager.setToken(token);
        
        return {
          success: true,
          user: admin,
          token,
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Remove token from localStorage
      tokenManager.removeToken();
      
      // You can also call a logout API endpoint if needed
      // await apiClient.post('/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      if (!tokenManager.isTokenValid()) {
        return null;
      }

      // You can implement a /me endpoint to get current user info
      // const response = await apiClient.get<AdminUser>('/admin/me');
      // return response.data;
      
      // For now, return null if no /me endpoint is available
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return tokenManager.isTokenValid();
  }
}

export const authService = new AuthService();