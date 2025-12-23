/**
 * React Router Configuration
 *
 * Defines all routes for the application
 */

import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { AuthLayout } from '../components/layouts/AuthLayout';

// Pages
import HomePage from '../pages/Home';
import EcosystemPage from '../pages/Ecosystem';
import AuraPage from '../pages/Aura';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/Dashboard';
import { ProductListPage } from '../pages/products/ProductListPage';
import { ProductDetailPage } from '../pages/products/ProductDetailPage';
import { SearchPage } from '../pages/search/SearchPage';
import AppointmentsPage from '../pages/appointments/AppointmentList';
import ClientsPage from '../pages/clients/ClientList';
import SettingsPage from '../pages/Settings';
import NotFoundPage from '../pages/NotFound';
import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { VendorPortalDashboard } from '../pages/vendor/VendorPortalDashboard';
import { VendorProfilePage } from '../pages/vendor/VendorProfilePage';
import { SubmitProductPage } from '../pages/vendor/SubmitProduct';
import { TrainingPage } from '../pages/vendor/TrainingPage';
import { AnalyticsPage } from '../pages/vendor/AnalyticsPage';
import { VendorOrdersPage } from '../pages/vendor/VendorOrdersPage';
import { VendorOrderDetailPage } from '../pages/vendor/VendorOrderDetailPage';
import { VendorMessagingPage } from '../pages/vendor/VendorMessagingPage';
import { VendorDiscoveryPage } from '../pages/vendor/VendorDiscoveryPage';
import { VendorApplicationPage } from '../pages/vendor/VendorApplicationPage';
import { VendorApplicationStatusPage } from '../pages/vendor/VendorApplicationStatusPage';
import { TaxonomyQualityPage } from '../pages/admin/TaxonomyQualityPage';
import { AdminApplicationQueue } from '../pages/admin/AdminApplicationQueue';
import { ApplicationDetailPage } from '../pages/admin/ApplicationDetailPage';
import { WholesaleApplicationPage } from '../pages/WholesaleApplicationPage';
import { WholesaleApplicationReviewPage } from '../pages/admin/WholesaleApplicationReviewPage';
import { MarketplaceAnalyticsPage } from '../pages/admin/MarketplaceAnalyticsPage';
import { BusinessIntelligencePage } from '../pages/admin/BusinessIntelligencePage';
import { CuratedMarketplacePage } from '../pages/CuratedMarketplacePage';
import CommunityPage from '../pages/community/Community';
import PostDetailPage from '../pages/community/PostDetail';
import CreatePostPage from '../pages/community/CreatePost';
import EventsPage from '../pages/community/Events';
import SkincareSearchPage from '../pages/skincare/SkincareSearchPage';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },

  // Auth routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'login/:userType',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },

  // Protected routes
  {
    path: '/app',
    element: <MainLayout protected />,
    children: [
      {
        path: 'marketplace',
        element: <CuratedMarketplacePage />,
        children: [
          {
            path: 'products',
            children: [
              {
                index: true,
                element: <ProductListPage />,
              },
              {
                path: ':id',
                element: <ProductDetailPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'ecosystem',
        element: <EcosystemPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'aura',
        element: <AuraPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'skincare-search',
        element: <SkincareSearchPage />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'wholesale-application',
        element: <WholesaleApplicationPage />,
      },
      {
        path: 'vendor',
        children: [
          {
            path: 'dashboard',
            element: <VendorDashboardPage />,
          },
          {
            path: 'portal',
            element: <VendorPortalDashboard />,
          },
          {
            path: 'profile',
            element: <VendorProfilePage />,
          },
          {
            path: 'submit-product',
            element: <SubmitProductPage />,
          },
          {
            path: 'training',
            element: <TrainingPage />,
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'discovery',
            element: <VendorDiscoveryPage />,
          },
          {
            path: 'orders',
            element: <VendorOrdersPage />,
          },
          {
            path: 'orders/:orderId',
            element: <VendorOrderDetailPage />,
          },
          {
            path: 'messages',
            element: <VendorMessagingPage />,
          },
          {
            path: 'application',
            element: <VendorApplicationPage />,
          },
          {
            path: 'application/status',
            element: <VendorApplicationStatusPage />,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'analytics',
            element: <MarketplaceAnalyticsPage />,
          },
          {
            path: 'business-intelligence',
            element: <BusinessIntelligencePage />,
          },
          {
            path: 'taxonomy-quality',
            element: <TaxonomyQualityPage />,
          },
          {
            path: 'wholesale-applications',
            element: <WholesaleApplicationReviewPage />,
          },
          {
            path: 'applications',
            element: <AdminApplicationQueue applications={[]} />,
          },
          {
            path: 'applications/:id',
            element: <ApplicationDetailPage />,
          },
        ],
      },
      {
        path: 'sanctuary',
        children: [
          {
            index: true,
            element: <CommunityPage />,
          },
          {
            path: 'post/:postId',
            element: <PostDetailPage />,
          },
          {
            path: 'create-post',
            element: <CreatePostPage />,
          },
          {
            path: 'events',
            element: <EventsPage />,
          },
          {
            path: 'event/:eventId',
            element: <CommunityPage />, // Placeholder - will be replaced with EventDetailPage
          },
          {
            path: 'member/:memberId',
            element: <CommunityPage />, // Placeholder - will be replaced with MemberProfilePage
          },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
