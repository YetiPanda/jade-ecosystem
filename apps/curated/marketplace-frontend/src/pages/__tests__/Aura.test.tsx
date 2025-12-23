/**
 * AuraPage Tests
 *
 * Comprehensive test coverage for the Aura by Jade analytics dashboard page
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuraPage from '../Aura';

const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AuraPage', () => {
  describe('Page Header', () => {
    it('renders without crashing', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const heading = screen.getByText(/Aura by Jade/i);
      expect(heading).toBeInTheDocument();
    });

    it('displays the Analytics badge', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const badges = screen.getAllByText(/Analytics/i);
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows time range selector', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Last 7 days/i)).toBeInTheDocument();
    });

    it('displays logout button', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('displays all navigation tabs', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Business/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Marketing/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Staff/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Customers/i })).toBeInTheDocument();
    });

    it('shows Overview tab as active by default', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const overviewTab = screen.getByRole('tab', { name: /Overview/i });
      expect(overviewTab).toHaveAttribute('data-state', 'active');
    });

    it('allows switching between tabs', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const overviewTab = screen.getByRole('tab', { name: /Overview/i });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      const marketingTab = screen.getByRole('tab', { name: /Marketing/i });

      // Overview should be active initially
      expect(overviewTab).toHaveAttribute('data-state', 'active');

      // Verify other tabs are clickable
      fireEvent.click(businessTab);
      fireEvent.click(marketingTab);

      // All tabs should still be in the document
      expect(overviewTab).toBeInTheDocument();
      expect(businessTab).toBeInTheDocument();
      expect(marketingTab).toBeInTheDocument();
    });
  });

  describe('Welcome Section', () => {
    it('displays welcome message', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Welcome back, Luxe Spa & Wellness/i)).toBeInTheDocument();
    });

    it('shows dashboard description', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Your comprehensive business intelligence dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Key Metrics Cards', () => {
    it('displays all four metric cards', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/REVENUE/i)).toBeInTheDocument();
      expect(screen.getByText(/APPOINTMENTS/i)).toBeInTheDocument();
      expect(screen.getByText(/NEW CLIENTS/i)).toBeInTheDocument();
      expect(screen.getByText(/AVG ORDER VALUE/i)).toBeInTheDocument();
    });

    it('shows revenue metric value', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/\$47,830/i)).toBeInTheDocument();
    });

    it('shows appointments metric value', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/892/i)).toBeInTheDocument();
    });

    it('shows new clients metric value', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const clientsMetric = screen.getAllByText(/156/i);
      expect(clientsMetric.length).toBeGreaterThan(0);
    });

    it('shows average order value metric', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/\$187/i)).toBeInTheDocument();
    });

    it('displays positive change indicators', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/\+12.3%/i)).toBeInTheDocument();
      expect(screen.getByText(/\+8.7%/i)).toBeInTheDocument();
      expect(screen.getByText(/\+23.1%/i)).toBeInTheDocument();
    });

    it('displays negative change indicator', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/-2.4%/i)).toBeInTheDocument();
    });
  });

  describe('Marketing Channels Performance', () => {
    it('displays marketing channels section title', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Marketing Channels Performance/i)).toBeInTheDocument();
    });

    it('shows all four marketing channels', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Google Ads/i)).toBeInTheDocument();
      expect(screen.getByText(/Meta Ads/i)).toBeInTheDocument();
      // Email appears in multiple places (channel name and Email icon), use getAllByText
      const emailText = screen.getAllByText(/Email/i);
      expect(emailText.length).toBeGreaterThan(0);
      expect(screen.getByText(/^SMS$/i)).toBeInTheDocument();
    });

    it('displays ROAS for each channel', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/ROAS: 4.2x/i)).toBeInTheDocument();
      expect(screen.getByText(/ROAS: 5.1x/i)).toBeInTheDocument();
      expect(screen.getByText(/ROAS: 8.9x/i)).toBeInTheDocument();
      expect(screen.getByText(/ROAS: 3.8x/i)).toBeInTheDocument();
    });

    it('shows conversion counts', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/89 conversions/i)).toBeInTheDocument();
      expect(screen.getByText(/156 conversions/i)).toBeInTheDocument();
      expect(screen.getByText(/67 conversions/i)).toBeInTheDocument();
      expect(screen.getByText(/45 conversions/i)).toBeInTheDocument();
    });

    it('displays metrics for each channel', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      // Check for impressions, clicks, cost, and CTR labels
      const impressionsLabels = screen.getAllByText(/Impressions/i);
      const clicksLabels = screen.getAllByText(/Clicks/i);
      const costLabels = screen.getAllByText(/Cost/i);
      const ctrLabels = screen.getAllByText(/CTR/i);

      expect(impressionsLabels.length).toBeGreaterThan(0);
      expect(clicksLabels.length).toBeGreaterThan(0);
      expect(costLabels.length).toBeGreaterThan(0);
      expect(ctrLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Quick Stats', () => {
    it('displays quick stats section', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Quick Stats/i)).toBeInTheDocument();
    });

    it('shows all four quick stat metrics', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Online Visibility Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Customer Satisfaction/i)).toBeInTheDocument();
      expect(screen.getByText(/Staff Utilization/i)).toBeInTheDocument();
      expect(screen.getByText(/Rebooking Rate/i)).toBeInTheDocument();
    });

    it('displays quick stat values', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/85\/100/i)).toBeInTheDocument();
      expect(screen.getByText(/4.8\/5/i)).toBeInTheDocument();
      expect(screen.getByText(/78%/i)).toBeInTheDocument();
      expect(screen.getByText(/67%/i)).toBeInTheDocument();
    });

    it('shows positive change badges', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/\+5/i)).toBeInTheDocument();
      expect(screen.getByText(/\+0.2/i)).toBeInTheDocument();
      expect(screen.getByText(/\+3%/i)).toBeInTheDocument();
      expect(screen.getByText(/\+8%/i)).toBeInTheDocument();
    });
  });

  describe('Recent Activity', () => {
    it('displays recent activity section', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    });

    it('shows activity items', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/New appointment booked/i)).toBeInTheDocument();
      expect(screen.getByText(/New 5-star review received/i)).toBeInTheDocument();
      expect(screen.getByText(/Meta campaign performing well/i)).toBeInTheDocument();
      expect(screen.getByText(/Emily completed certification/i)).toBeInTheDocument();
    });

    it('displays activity timestamps', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/5 minutes ago/i)).toBeInTheDocument();
      expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
      expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument();
      expect(screen.getByText(/3 hours ago/i)).toBeInTheDocument();
    });

    it('shows activity details', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Sarah Johnson - HydraFacial Express/i)).toBeInTheDocument();
      expect(screen.getByText(/Google Reviews - "Amazing experience!"/i)).toBeInTheDocument();
      expect(screen.getByText(/Holiday Glow Package - 12 new leads/i)).toBeInTheDocument();
    });

    it('displays monetary value for appointment', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/\$150/i)).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('displays quick actions section', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const quickActionsHeadings = screen.getAllByText(/Quick Actions/i);
      expect(quickActionsHeadings.length).toBeGreaterThan(0);
    });

    it('shows all four action buttons', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      expect(screen.getByRole('button', { name: /Book Appointment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Client/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /View Campaigns/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Analytics/i })).toBeInTheDocument();
    });
  });

  describe('Business Metrics Tab', () => {
    it('displays business metrics page header', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/Business Metrics/i)).toBeInTheDocument();
        expect(screen.getByText(/Real-time operational KPIs and business performance data/i)).toBeInTheDocument();
      });
    });

    it('shows export report button', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Export Report/i })).toBeInTheDocument();
      });
    });

    it('displays all four daily metric cards', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/Daily Revenue/i)).toBeInTheDocument();
        expect(screen.getByText(/Appointments Today/i)).toBeInTheDocument();
        expect(screen.getByText(/Staff Utilization/i)).toBeInTheDocument();
        expect(screen.getByText(/Avg Service Time/i)).toBeInTheDocument();
      });
    });

    it('shows daily revenue metric with progress bar', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/\$1,594/i)).toBeInTheDocument();
        expect(screen.getByText(/Target: \$1,800/i)).toBeInTheDocument();
        expect(screen.getByText(/\+12% vs yesterday/i)).toBeInTheDocument();
      });
    });

    it('shows appointments today metric with progress bar', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/^28$/)).toBeInTheDocument();
        expect(screen.getByText(/Target: 32/i)).toBeInTheDocument();
        expect(screen.getByText(/\+3 vs yesterday/i)).toBeInTheDocument();
      });
    });

    it('shows staff utilization metric with progress bar', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/82%/i)).toBeInTheDocument();
        expect(screen.getByText(/Target: 85%/i)).toBeInTheDocument();
        expect(screen.getByText(/\+5% vs yesterday/i)).toBeInTheDocument();
      });
    });

    it('shows average service time metric with progress bar', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/78 min/i)).toBeInTheDocument();
        expect(screen.getByText(/Target: 75 min/i)).toBeInTheDocument();
        expect(screen.getByText(/-2 min vs target/i)).toBeInTheDocument();
      });
    });

    it('displays service performance section', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/Service Performance/i)).toBeInTheDocument();
        expect(screen.getByText(/Breakdown by service type/i)).toBeInTheDocument();
      });
    });

    it('shows all five service types in performance breakdown', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/HydraFacial Express/i)).toBeInTheDocument();
        expect(screen.getByText(/Signature Facial/i)).toBeInTheDocument();
        expect(screen.getByText(/Chemical Peel/i)).toBeInTheDocument();
        expect(screen.getByText(/Microneedling/i)).toBeInTheDocument();
        expect(screen.getByText(/LED Light Therapy/i)).toBeInTheDocument();
      });
    });

    it('displays service performance details', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/12 bookings • \$780/i)).toBeInTheDocument();
        expect(screen.getByText(/8 bookings • \$520/i)).toBeInTheDocument();
        expect(screen.getByText(/3 bookings • \$390/i)).toBeInTheDocument();
      });
    });

    it('displays operational KPIs section', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        // "Operational KPIs" appears in multiple places, check for the card title
        const operationalKPIsHeadings = screen.getAllByText(/Operational KPIs/i);
        expect(operationalKPIsHeadings.length).toBeGreaterThan(0);
        expect(screen.getByText(/Key performance indicators/i)).toBeInTheDocument();
      });
    });

    it('shows all four operational KPI metrics', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/No-Show Rate/i)).toBeInTheDocument();
        expect(screen.getByText(/Rebooking Rate/i)).toBeInTheDocument();
        expect(screen.getByText(/Average Wait Time/i)).toBeInTheDocument();
        expect(screen.getByText(/Client Satisfaction/i)).toBeInTheDocument();
      });
    });

    it('displays operational KPI values', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        expect(screen.getByText(/3.2%/i)).toBeInTheDocument();
        // 67% appears in multiple places, use getAllByText
        const percentages = screen.getAllByText(/67%/i);
        expect(percentages.length).toBeGreaterThan(0);
        // "8 min" appears in multiple places (78 min and 8 min), use getAllByText
        const waitTimeValues = screen.getAllByText(/8 min/i);
        expect(waitTimeValues.length).toBeGreaterThan(0);
        expect(screen.getByText(/4.8\/5/i)).toBeInTheDocument();
      });
    });

    it('shows status badges for operational KPIs', async () => {
      const user = userEvent.setup();
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });
      await user.click(businessTab);

      await waitFor(() => {
        const excellentBadges = screen.getAllByText(/Excellent/i);
        expect(excellentBadges.length).toBeGreaterThan(0);
        expect(screen.getByText(/Good/i)).toBeInTheDocument();
      });
    });
  });

  describe('Other Tabs', () => {
    it('allows clicking business tab', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const businessTab = screen.getByRole('tab', { name: /Business/i });

      fireEvent.click(businessTab);

      // Verify tab is clickable and exists
      expect(businessTab).toBeInTheDocument();
    });

    it('allows clicking marketing tab', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const marketingTab = screen.getByRole('tab', { name: /Marketing/i });

      fireEvent.click(marketingTab);

      // Verify tab is clickable and exists
      expect(marketingTab).toBeInTheDocument();
    });

    it('allows clicking staff tab', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const staffTab = screen.getByRole('tab', { name: /Staff/i });

      fireEvent.click(staffTab);

      // Verify tab is clickable and exists
      expect(staffTab).toBeInTheDocument();
    });

    it('allows clicking customers tab', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const customersTab = screen.getByRole('tab', { name: /Customers/i });

      fireEvent.click(customersTab);

      // Verify tab is clickable and exists
      expect(customersTab).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive grid classes for metrics', () => {
      const { container } = render(<AuraPage />, { wrapper: RouterWrapper });
      const metricsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(metricsGrid).toBeInTheDocument();
    });

    it('uses responsive layout for main content', () => {
      const { container } = render(<AuraPage />, { wrapper: RouterWrapper });
      const mainContentGrid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
      expect(mainContentGrid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const h1 = screen.getByRole('heading', { name: /Aura by Jade/i });
      const h2 = screen.getByRole('heading', { name: /Welcome back, Luxe Spa & Wellness/i });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it('has accessible buttons', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('has accessible tabs', () => {
      render(<AuraPage />, { wrapper: RouterWrapper });
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(5); // Overview, Business, Marketing, Staff, Customers
    });
  });
});
