import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { VendorDiscoveryPage } from './pages/VendorDiscoveryPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { VendorApplicationPage } from './pages/VendorApplicationPage';
import { VendorOnboardingPage } from './pages/VendorOnboardingPage';
import { AdminApplicationQueuePage } from './pages/AdminApplicationQueuePage';
import { AdminApplicationDetailPage } from './pages/AdminApplicationDetailPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="discovery" element={<VendorDiscoveryPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="application" element={<VendorApplicationPage />} />
          <Route path="onboarding" element={<VendorOnboardingPage />} />
          <Route path="admin/applications" element={<AdminApplicationQueuePage />} />
          <Route path="admin/applications/:id" element={<AdminApplicationDetailPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
