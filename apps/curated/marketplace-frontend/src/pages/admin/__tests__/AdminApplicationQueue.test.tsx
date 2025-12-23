/**
 * AdminApplicationQueue Tests
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools (Task E.2.12)
 *
 * Tests for admin application queue with filters, SLA indicators, and navigation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdminApplicationQueue, ApplicationStatus } from '../AdminApplicationQueue';

const mockApplications = [
  {
    id: 'app-1',
    brandName: 'Luminara Skincare',
    contactFirstName: 'Sarah',
    contactLastName: 'Chen',
    contactEmail: 'sarah@luminaraskincare.com',
    status: ApplicationStatus.UNDER_REVIEW,
    submittedAt: new Date('2024-12-18T10:00:00Z'),
    slaDeadline: new Date('2024-12-21T10:00:00Z'), // 3 days from submission
    assignee: { id: 'admin-1', name: 'Taylor' },
    productCategories: ['Serums', 'Moisturizers'],
    values: ['Clean Beauty', 'Vegan'],
  },
  {
    id: 'app-2',
    brandName: 'Glow Organics',
    contactFirstName: 'Mike',
    contactLastName: 'Johnson',
    contactEmail: 'mike@gloworganics.com',
    status: ApplicationStatus.SUBMITTED,
    submittedAt: new Date('2024-12-17T10:00:00Z'),
    slaDeadline: new Date('2024-12-20T10:00:00Z'),
    assignee: { id: 'admin-2', name: 'Morgan' },
    productCategories: ['Cleansers'],
    values: ['Organic'],
  },
  {
    id: 'app-3',
    brandName: 'Pure Botanicals',
    contactFirstName: 'Emma',
    contactLastName: 'Wilson',
    contactEmail: 'emma@purebotanicals.com',
    status: ApplicationStatus.ADDITIONAL_INFO_REQUESTED,
    submittedAt: new Date('2024-12-17T10:00:00Z'),
    slaDeadline: new Date('2024-12-20T10:00:00Z'),
    assignee: null, // Unassigned
    productCategories: ['Masks'],
    values: ['Natural'],
  },
  {
    id: 'app-4',
    brandName: 'Zen Skincare',
    contactFirstName: 'Lisa',
    contactLastName: 'Davis',
    contactEmail: 'lisa@zenskincare.com',
    status: ApplicationStatus.APPROVED,
    submittedAt: new Date('2024-12-15T10:00:00Z'),
    slaDeadline: new Date('2024-12-18T10:00:00Z'),
    assignee: { id: 'admin-1', name: 'Taylor' },
    productCategories: ['Toners'],
    values: ['Sustainable'],
  },
  {
    id: 'app-5',
    brandName: 'Urban Glow',
    contactFirstName: 'John',
    contactLastName: 'Smith',
    contactEmail: 'john@urbanglow.com',
    status: ApplicationStatus.REJECTED,
    submittedAt: new Date('2024-12-14T10:00:00Z'),
    slaDeadline: new Date('2024-12-17T10:00:00Z'),
    assignee: { id: 'admin-2', name: 'Morgan' },
    productCategories: ['Sunscreens'],
    values: ['Reef Safe'],
  },
];

describe('AdminApplicationQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the page header', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByText('Application Queue')).toBeInTheDocument();
      expect(screen.getByText(/Review and manage vendor applications/i)).toBeInTheDocument();
    });

    it('should render all applications in table', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByText('Luminara Skincare')).toBeInTheDocument();
      expect(screen.getByText('Glow Organics')).toBeInTheDocument();
      expect(screen.getByText('Pure Botanicals')).toBeInTheDocument();
      expect(screen.getByText('Zen Skincare')).toBeInTheDocument();
      expect(screen.getByText('Urban Glow')).toBeInTheDocument();
    });

    it('should show export and settings buttons', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
    });
  });

  describe('SLA Summary Stats', () => {
    it('should display pending review count', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      // 2 applications are pending (SUBMITTED + UNDER_REVIEW)
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Pending Review')).toBeInTheDocument();
    });

    it('should display on-time percentage', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByText(/On-Time Rate/i)).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should filter by status', async () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const statusFilter = screen.getByLabelText('Status');
      fireEvent.change(statusFilter, { target: { value: ApplicationStatus.APPROVED } });

      // Should only show approved application
      expect(screen.getByText('Zen Skincare')).toBeInTheDocument();
      expect(screen.queryByText('Luminara Skincare')).not.toBeInTheDocument();
    });

    it('should filter by assignee', async () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const assigneeFilter = screen.getByLabelText('Assignee');
      fireEvent.change(assigneeFilter, { target: { value: 'admin-1' } });

      // Should show applications assigned to Taylor (admin-1)
      expect(screen.getByText('Luminara Skincare')).toBeInTheDocument();
      expect(screen.getByText('Zen Skincare')).toBeInTheDocument();
      expect(screen.queryByText('Glow Organics')).not.toBeInTheDocument();
    });

    it('should filter unassigned applications', async () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const assigneeFilter = screen.getByLabelText('Assignee');
      fireEvent.change(assigneeFilter, { target: { value: 'unassigned' } });

      // Should only show Pure Botanicals (unassigned)
      expect(screen.getByText('Pure Botanicals')).toBeInTheDocument();
      expect(screen.queryByText('Luminara Skincare')).not.toBeInTheDocument();
    });

    it('should search by brand name', async () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Brand name, contact.../i);
      await userEvent.type(searchInput, 'Luminara');

      expect(screen.getByText('Luminara Skincare')).toBeInTheDocument();
      expect(screen.queryByText('Glow Organics')).not.toBeInTheDocument();
    });

    it('should search by contact email', async () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Brand name, contact.../i);
      await userEvent.type(searchInput, 'sarah@');

      expect(screen.getByText('Luminara Skincare')).toBeInTheDocument();
      expect(screen.queryByText('Glow Organics')).not.toBeInTheDocument();
    });
  });

  describe('SLA Indicators', () => {
    it('should show SLA status for each application', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      // Each row should have SLA information
      const rows = screen.getAllByRole('row');
      // Header row + 5 application rows
      expect(rows.length).toBeGreaterThanOrEqual(6);
    });

    it('should display SLA time remaining', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      // Should show days remaining for pending applications
      expect(screen.getByText(/day/i)).toBeInTheDocument();
    });
  });

  describe('Application Status Display', () => {
    it('should show correct status badges', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByText('Under Review')).toBeInTheDocument();
      expect(screen.getByText('Submitted')).toBeInTheDocument();
      expect(screen.getByText('Info Requested')).toBeInTheDocument();
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have review links for each application', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const reviewLinks = screen.getAllByText('Review');
      expect(reviewLinks.length).toBe(mockApplications.length);
    });

    it('should link to application detail page', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const reviewLinks = screen.getAllByText('Review');
      const firstLink = reviewLinks[0].closest('a');

      expect(firstLink).toHaveAttribute('href', '/admin/applications/app-1');
    });
  });

  describe('Empty States', () => {
    it('should show empty message when no applications', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={[]} />
        </BrowserRouter>
      );

      expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
    });

    it('should show empty message when filters match nothing', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Brand name, contact.../i);
      fireEvent.change(searchInput, { target: { value: 'NonexistentBrand' } });

      expect(screen.getByText(/No applications found matching your filters/i)).toBeInTheDocument();
    });
  });

  describe('Results Count', () => {
    it('should show total application count', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByText(/Showing 5 of 5 applications/i)).toBeInTheDocument();
    });

    it('should update count when filtering', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      const statusFilter = screen.getByLabelText('Status');
      fireEvent.change(statusFilter, { target: { value: ApplicationStatus.APPROVED } });

      expect(screen.getByText(/Showing 1 of 5 applications/i)).toBeInTheDocument();
    });
  });

  describe('Assignee Display', () => {
    it('should show assignee names', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getAllByText('Taylor').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Morgan').length).toBeGreaterThan(0);
    });

    it('should show Unassigned for applications without assignee', () => {
      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} />
        </BrowserRouter>
      );

      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should call onExport when export button clicked', () => {
      const mockExport = vi.fn();

      render(
        <BrowserRouter>
          <AdminApplicationQueue applications={mockApplications} onExport={mockExport} />
        </BrowserRouter>
      );

      const exportButton = screen.getByRole('button', { name: /Export/i });
      fireEvent.click(exportButton);

      expect(mockExport).toHaveBeenCalledTimes(1);
    });
  });
});
