/**
 * Vendor Portal Navigation Integration Tests
 * Feature 011: Vendor Portal MVP
 * Phase 2: End-to-End Navigation and Route Tests
 *
 * Tests cover:
 * - All navigation routes are accessible
 * - Links navigate to correct paths
 * - Primary tab navigation works
 * - Secondary navigation (header buttons, dropdown) works
 * - All Feature 011 marketing claims are accessible via UI
 * - No orphaned routes (all routes have navigation paths)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { UnifiedVendorPortal } from '../pages/vendor/UnifiedVendorPortal';
import { VENDOR_UNREAD_COUNT_QUERY } from '../graphql/queries/messaging';

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      firstName: 'Test',
      lastName: 'Vendor',
      email: 'test@vendor.com',
    },
    logout: vi.fn(),
  }),
}));

// Mock all vendor pages with simple placeholders
vi.mock('../pages/vendor/VendorProfilePage', () => ({
  VendorProfilePage: () => <div data-testid="profile-page">Profile Page</div>,
}));

vi.mock('../pages/vendor/VendorMessagingPage', () => ({
  VendorMessagingPage: () => <div data-testid="messaging-page">Messaging Page</div>,
}));

vi.mock('../pages/vendor/SubmitProduct', () => ({
  SubmitProductPage: () => <div data-testid="submit-product-page">Submit Product Page</div>,
}));

vi.mock('../pages/vendor/TrainingPage', () => ({
  TrainingPage: () => <div data-testid="training-page">Training Page</div>,
}));

vi.mock('../pages/vendor/VendorApplicationStatusPage', () => ({
  VendorApplicationStatusPage: () => (
    <div data-testid="application-status-page">Application Status Page</div>
  ),
}));

// Mock lazy-loaded tabs
vi.mock('../pages/vendor/tabs/OverviewTab', () => ({
  OverviewTab: () => <div data-testid="overview-tab">Overview Tab</div>,
}));
vi.mock('../pages/vendor/tabs/ProductsTab', () => ({
  ProductsTab: () => <div data-testid="products-tab">Products Tab</div>,
}));
vi.mock('../pages/vendor/tabs/InventoryTab', () => ({
  InventoryTab: () => <div data-testid="inventory-tab">Inventory Tab</div>,
}));
vi.mock('../pages/vendor/tabs/OrdersTab', () => ({
  OrdersTab: () => <div data-testid="orders-tab">Orders Tab</div>,
}));
vi.mock('../pages/vendor/tabs/EventsTab', () => ({
  EventsTab: () => <div data-testid="events-tab">Events Tab</div>,
}));
vi.mock('../pages/vendor/tabs/AnalyticsTab', () => ({
  AnalyticsTab: () => <div data-testid="analytics-tab">Analytics Tab</div>,
}));

describe('Vendor Portal Navigation Integration', () => {
  const mockGraphQL = [
    {
      request: {
        query: VENDOR_UNREAD_COUNT_QUERY,
      },
      result: {
        data: {
          vendorUnreadCount: 0,
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Primary Navigation - Tab Routes', () => {
    it('starts on Overview tab by default', async () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });
    });

    it('navigates to Products tab when clicked', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const productsTab = screen.getByRole('tab', { name: /products/i });
      await user.click(productsTab);

      await waitFor(() => {
        expect(screen.getByTestId('products-tab')).toBeInTheDocument();
      });
    });

    it('navigates to Inventory tab when clicked', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const inventoryTab = screen.getByRole('tab', { name: /inventory/i });
      await user.click(inventoryTab);

      await waitFor(() => {
        expect(screen.getByTestId('inventory-tab')).toBeInTheDocument();
      });
    });

    it('navigates to Orders tab when clicked', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const ordersTab = screen.getByRole('tab', { name: /orders/i });
      await user.click(ordersTab);

      await waitFor(() => {
        expect(screen.getByTestId('orders-tab')).toBeInTheDocument();
      });
    });

    it('navigates to Events tab when clicked', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const eventsTab = screen.getByRole('tab', { name: /events/i });
      await user.click(eventsTab);

      await waitFor(() => {
        expect(screen.getByTestId('events-tab')).toBeInTheDocument();
      });
    });

    it('navigates to Analytics tab when clicked', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const analyticsTab = screen.getByRole('tab', { name: /analytics/i });
      await user.click(analyticsTab);

      await waitFor(() => {
        expect(screen.getByTestId('analytics-tab')).toBeInTheDocument();
      });
    });

    it('maintains tab state when navigating between tabs', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Navigate to Products
      await user.click(screen.getByRole('tab', { name: /products/i }));
      await waitFor(() => {
        expect(screen.getByTestId('products-tab')).toBeInTheDocument();
      });

      // Navigate to Orders
      await user.click(screen.getByRole('tab', { name: /orders/i }));
      await waitFor(() => {
        expect(screen.getByTestId('orders-tab')).toBeInTheDocument();
      });

      // Navigate back to Products
      await user.click(screen.getByRole('tab', { name: /products/i }));
      await waitFor(() => {
        expect(screen.getByTestId('products-tab')).toBeInTheDocument();
      });
    });
  });

  describe('Secondary Navigation - Header Button Routes', () => {
    it('Messages button has correct route', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const messagesLink = screen.getByRole('link', { name: /messages/i });
      expect(messagesLink).toHaveAttribute('href', '/app/vendor/messages');
    });

    it('New Product button has correct route', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const newProductLink = screen.getByRole('link', { name: /new product/i });
      expect(newProductLink).toHaveAttribute('href', '/app/vendor/submit-product');
    });
  });

  describe('Secondary Navigation - User Dropdown Routes', () => {
    it('Profile link has correct route', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /test vendor/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        const profileLink = screen.getByRole('menuitem', { name: /profile/i });
        expect(profileLink).toHaveAttribute('href', '/app/vendor/profile');
      });
    });

    it('Training link has correct route', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /test vendor/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        const trainingLink = screen.getByRole('menuitem', { name: /training/i });
        expect(trainingLink).toHaveAttribute('href', '/app/vendor/training');
      });
    });

    it('Settings link has correct route', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /test vendor/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        const settingsLink = screen.getByRole('menuitem', { name: /settings/i });
        expect(settingsLink).toHaveAttribute('href', '/app/settings');
      });
    });
  });

  describe('Marketing Claims Accessibility Verification', () => {
    // This test verifies that all Feature 011 marketing claims are accessible via UI

    it('Claim: "Your story, your values, your imagery" - accessible via Profile', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Open user dropdown
      const dropdownTrigger = screen.getByRole('button', { name: /test vendor/i });
      await user.click(dropdownTrigger);

      // Verify Profile link exists
      await waitFor(() => {
        const profileLink = screen.getByRole('menuitem', { name: /profile/i });
        expect(profileLink).toBeInTheDocument();
      });
    });

    it('Claim: "Track orders, manage fulfillment" - accessible via Orders tab', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const ordersTab = screen.getByRole('tab', { name: /orders/i });
      expect(ordersTab).toBeInTheDocument();
    });

    it('Claim: "See reorders, par levels, champions" - accessible via Overview tab', async () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      expect(overviewTab).toBeInTheDocument();
    });

    it('Claim: "Direct messaging with spas" - accessible via Messages button', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const messagesLink = screen.getByRole('link', { name: /messages/i });
      expect(messagesLink).toBeInTheDocument();
    });

    it('Claim: "Discovery optimization" - accessible via Analytics tab', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const analyticsTab = screen.getByRole('tab', { name: /analytics/i });
      expect(analyticsTab).toBeInTheDocument();
    });
  });

  describe('Route Completeness - No Orphaned Routes', () => {
    it('All 6 primary tabs have navigation paths', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Verify all 6 tabs exist
      expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /products/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /inventory/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /orders/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /events/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /analytics/i })).toBeInTheDocument();
    });

    it('All secondary routes have navigation paths', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Header buttons
      expect(screen.getByRole('link', { name: /messages/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /new product/i })).toBeInTheDocument();

      // Dropdown menu items
      const dropdownTrigger = screen.getByRole('button', { name: /test vendor/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /training/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
      });
    });

    it('100% of Feature 011 features accessible (11/11)', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const accessibleFeatures = {
        overview: screen.getByRole('tab', { name: /overview/i }),
        products: screen.getByRole('tab', { name: /products/i }),
        inventory: screen.getByRole('tab', { name: /inventory/i }),
        orders: screen.getByRole('tab', { name: /orders/i }),
        events: screen.getByRole('tab', { name: /events/i }),
        analytics: screen.getByRole('tab', { name: /analytics/i }),
        messages: screen.getByRole('link', { name: /messages/i }),
        submitProduct: screen.getByRole('link', { name: /new product/i }),
      };

      // Open dropdown for remaining features
      const dropdownTrigger = screen.getByRole('button', { name: /test vendor/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        accessibleFeatures.profile = screen.getByRole('menuitem', { name: /profile/i });
        accessibleFeatures.training = screen.getByRole('menuitem', { name: /training/i });
        accessibleFeatures.settings = screen.getByRole('menuitem', { name: /settings/i });
      });

      // Verify all 11 features are accessible
      Object.values(accessibleFeatures).forEach(element => {
        expect(element).toBeInTheDocument();
      });

      // Total count: 6 tabs + 2 header buttons + 3 dropdown items = 11 accessible features
      expect(Object.keys(accessibleFeatures).length).toBe(11);
    });
  });

  describe('Accessibility Standards', () => {
    it('all navigation elements have proper ARIA roles', () => {
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Tabs have proper role
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(6);

      // Links have proper role
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      // Buttons have proper role
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('navigation is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={mockGraphQL} >
          <MemoryRouter initialEntries={['/app/vendor/dashboard']}>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Tab through elements
      await user.tab();
      const firstFocusable = document.activeElement;
      expect(firstFocusable).toBeTruthy();

      await user.tab();
      const secondFocusable = document.activeElement;
      expect(secondFocusable).toBeTruthy();
      expect(secondFocusable).not.toBe(firstFocusable);
    });
  });
});
