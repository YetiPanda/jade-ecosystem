import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VendorUser {
  id: string;
  companyName: string;
  contactEmail: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: VendorUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: VendorUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<VendorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('vendorAuthToken');
    const storedUser = localStorage.getItem('vendorUser');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('vendorAuthToken');
        localStorage.removeItem('vendorUser');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, userData: VendorUser) => {
    localStorage.setItem('vendorAuthToken', token);
    localStorage.setItem('vendorUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vendorAuthToken');
    localStorage.removeItem('vendorUser');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
