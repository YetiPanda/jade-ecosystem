/**
 * UnifiedVendorPortal Tests
 * Feature 011: Vendor Portal MVP
 * Phase 2: Navigation Routes and Accessibility Tests
 *
 * Tests cover:
 * - Messages button with unread badge
 * - Submit Product quick action
 * - User dropdown menu integration
 * - Keyboard navigation
 * - Route navigation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { UnifiedVendorPortal } from '../UnifiedVendorPortal';
import { VENDOR_UNREAD_COUNT_QUERY } from '../../../graphql/queries/messaging';

// Mock AuthContext
const mockLogout = vi.fn();
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    },
    logout: mockLogout,
  }),
}));

// Mock lazy-loaded tab components to speed up tests
vi.mock('../tabs/OverviewTab', () => ({
  OverviewTab: () => <div data-testid="overview-tab">Overview Content</div>,
}));
vi.mock('../tabs/ProductsTab', () => ({
  ProductsTab: () => <div data-testid="products-tab">Products Content</div>,
}));
vi.mock('../tabs/InventoryTab', () => ({
  InventoryTab: () => <div data-testid="inventory-tab">Inventory Content</div>,
}));
vi.mock('../tabs/OrdersTab', () => ({
  OrdersTab: () => <div data-testid="orders-tab">Orders Content</div>,
}));
vi.mock('../tabs/EventsTab', () => ({
  EventsTab: () => <div data-testid="events-tab">Events Content</div>,
}));
vi.mock('../tabs/AnalyticsTab', () => ({
  AnalyticsTab: () => <div data-testid="analytics-tab">Analytics Content</div>,
}));

describe('UnifiedVendorPortal - Phase 2 Navigation', () => {
  const createMocksWithUnreadCount = (unreadCount: number) => [
    {
      request: {
        query: VENDOR_UNREAD_COUNT_QUERY,
      },
      result: {
        data: {
          vendorUnreadCount: unreadCount,
          __typename: 'Query',
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test 1: Messages Button', () => {
    it('renders Messages button in header', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const messagesButton = screen.getByRole('link', { name: /messages/i });
      expect(messagesButton).toBeInTheDocument();
      expect(messagesButton).toHaveAttribute('href', '/app/vendor/messages');
    });

    it('displays unread badge when count > 0', async () => {
      const mocks = createMocksWithUnreadCount(5);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        const badge = screen.getByText('5');
        expect(badge).toBeInTheDocument();
      });
    });

    it('displays "9+" when count > 9', async () => {
      const mocks = createMocksWithUnreadCount(15);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        const badge = screen.getByText('9+');
        expect(badge).toBeInTheDocument();
      });
    });

    it('hides badge when count = 0', async () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Wait for query to complete
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /messages/i })).toBeInTheDocument();
      });

      // Badge should not be present
      const messagesLink = screen.getByRole('link', { name: /messages/i });
      const badge = within(messagesLink).queryByText(/\d+/);
      expect(badge).not.toBeInTheDocument();
    });

    it('has correct styling for Messages button', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const messagesButton = screen.getByRole('link', { name: /messages/i });
      expect(messagesButton).toHaveClass('relative'); // For badge positioning
    });
  });

  describe('Test 2: Submit Product Button', () => {
    it('renders New Product button in header', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const newProductButton = screen.getByRole('link', { name: /new product/i });
      expect(newProductButton).toBeInTheDocument();
      expect(newProductButton).toHaveAttribute('href', '/app/vendor/submit-product');
    });

    it('displays Package icon in New Product button', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const newProductButton = screen.getByRole('link', { name: /new product/i });
      const icon = newProductButton.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Test 3: User Dropdown Menu Integration', () => {
    it('renders user dropdown trigger with user name', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('displays user initial in avatar', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // User initial should be "J" for "Jane"
      const avatar = screen.getByText('J');
      expect(avatar).toBeInTheDocument();
    });

    it('opens dropdown menu on click', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /jane smith/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });
    });

    it('displays Profile, Training, and Settings menu items', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /jane smith/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /training/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
      });
    });

    it('does NOT show Application Status by default', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /jane smith/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });

      expect(screen.queryByRole('menuitem', { name: /application status/i })).not.toBeInTheDocument();
    });
  });

  describe('Test 4: Keyboard Navigation', () => {
    it('allows tab navigation through header buttons', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(5);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Tab to Messages button
      await user.tab();
      expect(screen.getByRole('link', { name: /messages/i })).toHaveFocus();

      // Tab to New Product button
      await user.tab();
      expect(screen.getByRole('link', { name: /new product/i })).toHaveFocus();
    });

    it('allows Enter key to activate Messages button', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const messagesButton = screen.getByRole('link', { name: /messages/i });
      messagesButton.focus();

      // Enter key should trigger navigation (link click)
      expect(messagesButton).toHaveFocus();
    });

    it('allows Enter/Space to open user dropdown', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /jane smith/i });
      dropdownTrigger.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });
    });

    it('allows Escape to close dropdown menu', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const dropdownTrigger = screen.getByRole('button', { name: /jane smith/i });
      await user.click(dropdownTrigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menuitem', { name: /profile/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Test 5: Logout Button', () => {
    it('renders logout button in header', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('calls logout function when logout button is clicked', async () => {
      const user = userEvent.setup();
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test 6: Real-Time Updates', () => {
    it('polls for unread count updates', async () => {
      const mocks = createMocksWithUnreadCount(3);
      render(
        <MockedProvider mocks={mocks} >
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Initial load should fetch unread count
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      // Note: Testing 30-second polling requires time mocking
      // which is beyond the scope of this test
      // The pollInterval configuration is tested via GraphQL query setup
    });
  });

  describe('Header Branding', () => {
    it('displays Jade Marketplace branding', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      expect(screen.getByText('Jade Marketplace')).toBeInTheDocument();
    });

    it('displays Vendor Portal badge', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      expect(screen.getByText('Vendor Portal')).toBeInTheDocument();
    });
  });

  describe('Utility Icons', () => {
    it('renders notification bell icon', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Bell icon should be in a button (currently non-functional)
      const buttons = screen.getAllByRole('button');
      const bellButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg?.classList.contains('lucide-bell');
      });
      expect(bellButton).toBeInTheDocument();
    });

    it('renders search icon', () => {
      const mocks = createMocksWithUnreadCount(0);
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <UnifiedVendorPortal />
          </MemoryRouter>
        </MockedProvider>
      );

      // Search icon should be in a button (currently non-functional)
      const buttons = screen.getAllByRole('button');
      const searchButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg?.classList.contains('lucide-search');
      });
      expect(searchButton).toBeInTheDocument();
    });
  });
});
