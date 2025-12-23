import { lazy, Suspense } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Toaster } from '../../ui/sonner';
import {
  Bell,
  Search,
  Settings,
  Loader2,
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '../../../contexts/DashboardContext';
import { DashboardOverview } from './DashboardOverview';
import { useAuth } from '../../../contexts/AuthContext';

// Lazy load dashboard modules for better performance
const ProductManagement = lazy(() => import('./ProductManagement').then(m => ({ default: m.ProductManagement })));
const InventoryManagement = lazy(() => import('./InventoryManagement').then(m => ({ default: m.InventoryManagement })));
const OrderManagement = lazy(() => import('./OrderManagement').then(m => ({ default: m.OrderManagement })));
const EventManagement = lazy(() => import('./EventManagement').then(m => ({ default: m.EventManagement })));
const MarketingAnalytics = lazy(() => import('./MarketingAnalytics').then(m => ({ default: m.MarketingAnalytics })));

// Loading fallback component
const ModuleLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-jade" />
    <span className="ml-3 text-muted-foreground">Loading module...</span>
  </div>
);

function VendorDashboardContent() {
  const { activeView, setActiveView } = useDashboard();
  const { user, logout } = useAuth();

  const userInitial = user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U';
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{backgroundColor: '#2E8B57'}}
                >
                  <span className="text-white font-medium">{userInitial}</span>
                </div>
                <span className="font-light text-lg tracking-wide">Jade Marketplace</span>
                <Badge
                  variant="outline"
                  className="ml-3"
                  style={{borderColor: '#9CAF88', color: '#9CAF88'}}
                >
                  Vendor Portal
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2 px-3 py-1.5 border border-border rounded-md">
                <span className="text-sm text-muted-foreground">{userName}</span>
              </div>
              <Button variant="outline" onClick={logout} className="rounded-full">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as any)}
          className="space-y-8"
        >
          {/* Navigation */}
          <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="products" className="mt-0">
            <Suspense fallback={<ModuleLoader />}>
              <ProductManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="inventory" className="mt-0">
            <Suspense fallback={<ModuleLoader />}>
              <InventoryManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <Suspense fallback={<ModuleLoader />}>
              <OrderManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <Suspense fallback={<ModuleLoader />}>
              <EventManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <Suspense fallback={<ModuleLoader />}>
              <MarketingAnalytics />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export function VendorDashboard() {
  return (
    <DashboardProvider>
      <VendorDashboardContent />
      <Toaster position="top-right" />
    </DashboardProvider>
  );
}
