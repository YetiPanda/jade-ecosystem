/**
 * Header Component
 *
 * Top navigation bar with branding, search, and user menu
 * Updated: Added UserMenu dropdown, Search link, Appointments/Clients access
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { DualLoginNav } from '../auth/DualLoginNav';
import { UserMenu } from './UserMenu';

export interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src="/assets/jade-logo-6x-enhanced.png" alt="JADE" className="h-12" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 ml-auto">
          {isAuthenticated ? (
            <>
              {/* Main Nav Links */}
              <Link
                to="/app/ecosystem"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden xl:block"
              >
                Ecosystem
              </Link>
              <Link
                to="/app/marketplace"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden xl:block"
              >
                Curated Marketplace
              </Link>
              <Link
                to="/app/skincare-search"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden xl:block"
              >
                Skincare Search
              </Link>
              <Link
                to="/app/dashboard"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden xl:block"
              >
                Curated Dashboard
              </Link>
              <Link
                to="/app/aura"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden xl:block"
              >
                Aura by Jade
              </Link>
              <Link
                to="/app/sanctuary"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden xl:block"
              >
                Sanctuary
              </Link>

              {/* User Menu Dropdown */}
              {user && onLogout && (
                <UserMenu user={user} onLogout={onLogout} />
              )}
            </>
          ) : (
            <>
              {/* Dual Login Navigation - Curated vs Aura */}
              <DualLoginNav variant="header" />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
