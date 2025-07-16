import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AdminUser } from '../services/authService';
import { tokenManager } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Check for existing authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (tokenManager.isTokenValid()) {
          // Try to get current user info
          const user = await authService.getCurrentUser();
          
          if (user) {
            setAuthState({
              isAuthenticated: true,
              user,
              loading: false,
            });
          } else {
            // Token exists but user info not available
            // For now, we'll consider them authenticated with basic info
            setAuthState({
              isAuthenticated: true,
              user: {
                id: 'current-user',
                name: 'Admin User',
                email: 'admin@example.com',
                phone: '',
                role: 'admin',
              },
              loading: false,
            });
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          loading: false,
        });
        
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the state even if logout API fails
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  // Show loading spinner while checking authentication
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};