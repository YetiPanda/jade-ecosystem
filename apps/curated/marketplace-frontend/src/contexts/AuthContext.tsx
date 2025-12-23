/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeLazyQuery,
  User,
  LoginInput,
  RegisterInput,
} from '../graphql/generated';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [fetchMe] = useMeLazyQuery();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await fetchMe();
          if (data?.me) {
            setUser(data.me);
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [fetchMe]);

  const login = useCallback(
    async (input: LoginInput): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data } = await loginMutation({
          variables: { input },
        });

        if (data?.login.success && data.login.user && data.login.accessToken) {
          // Store tokens
          localStorage.setItem('accessToken', data.login.accessToken);
          if (data.login.refreshToken) {
            localStorage.setItem('refreshToken', data.login.refreshToken);
          }

          // Update user state
          setUser(data.login.user);

          return { success: true };
        } else {
          const errorMessage =
            data?.login.errors?.[0]?.message || 'Login failed. Please try again.';
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again.',
        };
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data } = await registerMutation({
          variables: { input },
        });

        if (data?.register.success && data.register.user && data.register.accessToken) {
          // Store tokens
          localStorage.setItem('accessToken', data.register.accessToken);
          if (data.register.refreshToken) {
            localStorage.setItem('refreshToken', data.register.refreshToken);
          }

          // Update user state
          setUser(data.register.user);

          return { success: true };
        } else {
          const errorMessage =
            data?.register.errors?.[0]?.message || 'Registration failed. Please try again.';
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again.',
        };
      }
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state and tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, [logoutMutation]);

  const refetchUser = useCallback(async () => {
    try {
      const { data } = await fetchMe();
      if (data?.me) {
        setUser(data.me);
      }
    } catch (error) {
      console.error('Refetch user error:', error);
    }
  }, [fetchMe]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
