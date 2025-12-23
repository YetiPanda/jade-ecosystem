/**
 * Main Layout Component
 *
 * Primary layout with header, sidebar (optional), and footer
 */

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';

export interface MainLayoutProps {
  protected?: boolean;
  showSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  protected: isProtected = false,
  showSidebar = true,
}) => {
  const { user, loading, isAuthenticated, logout } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if protected route and not authenticated
  if (isProtected && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const showSidebarForRoute = showSidebar && isProtected && isAuthenticated;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isAuthenticated={isAuthenticated}
        user={
          user
            ? {
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
                email: user.email,
              }
            : undefined
        }
        onLogout={logout}
      />

      <div className="flex flex-1">
        {showSidebarForRoute && <Sidebar />}

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
