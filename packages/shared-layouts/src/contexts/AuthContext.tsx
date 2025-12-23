/**
 * Stub AuthContext for Phase 2
 *
 * TODO: Replace with actual auth implementation in Phase 3
 * This is a temporary stub to allow layout components to compile
 */

import React, { createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  userType?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Stub implementation - no actual authentication
  const value: AuthContextType = {
    user: null,
    loading: false,
    isAuthenticated: false,
    logout: () => console.log('Logout stubbed'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
