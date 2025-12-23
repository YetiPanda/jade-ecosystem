/**
 * Auth Layout Component
 *
 * Simple layout for authentication pages (login, register)
 */

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getAuthToken } from '../../lib/apollo-client';

export const AuthLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(Boolean(token));
  }, []);

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">JADE</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Spa Marketplace Platform
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8">
          <Outlet />
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} JADE Spa Marketplace
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
