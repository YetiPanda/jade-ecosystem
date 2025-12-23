/**
 * Unified Vendor Portal
 * Feature 011: Vendor Portal MVP
 * Phase 1: Unified Navigation
 *
 * Main container for the unified vendor portal with tabbed navigation.
 * Combines Figma UI design with Feature 011 business logic.
 */

import React, { lazy, Suspense } from 'react';
import { Bell, Search, Settings, Loader2, MessageSquare, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { PortalNavigation } from '../../components/vendor/PortalNavigation';
import { VendorPortalProvider, useVendorPortal } from '../../contexts/VendorPortalContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserDropdownMenu } from '../../components/vendor/UserDropdownMenu';
import { VENDOR_UNREAD_COUNT_QUERY } from '../../graphql/queries/messaging';

// Lazy load tab components for better performance
const OverviewTab = lazy(() => import('./tabs/OverviewTab').then(m => ({ default: m.OverviewTab })));
const ProductsTab = lazy(() => import('./tabs/ProductsTab').then(m => ({ default: m.ProductsTab })));
const InventoryTab = lazy(() => import('./tabs/InventoryTab').then(m => ({ default: m.InventoryTab })));
const OrdersTab = lazy(() => import('./tabs/OrdersTab').then(m => ({ default: m.OrdersTab })));
const EventsTab = lazy(() => import('./tabs/EventsTab').then(m => ({ default: m.EventsTab })));
const AnalyticsTab = lazy(() => import('./tabs/AnalyticsTab').then(m => ({ default: m.AnalyticsTab })));

// Loading fallback component
const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-[#2E8B57]" />
    <span className="ml-3 text-muted-foreground">Loading...</span>
  </div>
);

/**
 * Portal Header
 * Phase 2: Enhanced with secondary navigation (Option C - Hybrid)
 * - Messages button with unread badge
 * - Submit Product quick action
 * - User dropdown menu with Profile, Training, Settings
 */
function PortalHeader() {
  const { user, logout } = useAuth();

  // Fetch unread message count
  const { data: unreadData } = useQuery(VENDOR_UNREAD_COUNT_QUERY, {
    pollInterval: 30000, // Poll every 30 seconds
    fetchPolicy: 'cache-and-network',
  });

  const unreadCount = unreadData?.vendorUnreadCount || 0;

  const userInitial = user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'V';
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'Vendor';

  // TODO: Check if user has pending application status
  const showApplicationStatus = false;

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#2E8B57' }}
              >
                <span className="text-white font-medium text-sm">{userInitial}</span>
              </div>
              <span className="font-light text-lg tracking-wide">Jade Marketplace</span>
              <Badge
                variant="outline"
                className="ml-3"
                style={{ borderColor: '#9CAF88', color: '#9CAF88' }}
              >
                Vendor Portal
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Messages Button with Unread Badge */}
            <Button variant="outline" size="sm" asChild className="relative">
              <Link to="/app/vendor/messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Messages</span>
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: '#2E8B57', color: 'white' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Submit Product Quick Action */}
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/vendor/submit-product">
                <Package className="h-4 w-4 mr-2" />
                <span>New Product</span>
              </Link>
            </Button>

            {/* Utility Icons */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Dropdown Menu */}
            <UserDropdownMenu
              userName={userName}
              userInitial={userInitial}
              showApplicationStatus={showApplicationStatus}
            />

            {/* Logout */}
            <Button variant="outline" onClick={logout} className="rounded-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Portal Content
 * Renders the active tab content
 */
function PortalContent() {
  const { activeTab } = useVendorPortal();

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
      <Suspense fallback={<TabLoader />}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </Suspense>
    </main>
  );
}

/**
 * Main Portal Component (with provider)
 */
export function UnifiedVendorPortal() {
  return (
    <VendorPortalProvider>
      <div className="min-h-screen bg-background">
        <PortalHeader />
        <PortalNavigation />
        <PortalContent />
      </div>
    </VendorPortalProvider>
  );
}

export default UnifiedVendorPortal;
