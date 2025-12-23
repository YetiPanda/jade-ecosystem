/**
 * ApplicationStatusTracker Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding - Task E.1.13
 *
 * Tests for application status display with timeline and status messages.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ApplicationStatusTracker, ApplicationStatus } from '../ApplicationStatusTracker';

describe('ApplicationStatusTracker', () => {
  const baseProps = {
    submittedAt: new Date('2024-12-15T10:00:00Z'),
    slaDeadline: new Date('2024-12-18T10:00:00Z'),
    brandName: 'Luminara Skincare',
    productCount: '50-100 SKUs',
    categories: ['Cleansers', 'Serums', 'Moisturizers'],
    values: ['Clean Beauty', 'Vegan', 'Woman Founded'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Timeline Display', () => {
    it('should show submitted step as complete', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('should show all three timeline steps', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="UNDER_REVIEW"
        />
      );

      expect(screen.getByText('Submitted')).toBeInTheDocument();
      expect(screen.getByText('Under Review')).toBeInTheDocument();
      expect(screen.getByText('Decision')).toBeInTheDocument();
    });

    it('should highlight current step', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="UNDER_REVIEW"
        />
      );

      // "Currently here" indicator should be present for under review
      expect(screen.getByText('Currently here')).toBeInTheDocument();
    });
  });

  describe('Status Messages', () => {
    it('should show submitted status message', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText(/Application Submitted/i)).toBeInTheDocument();
      expect(screen.getByText(/Your application has been received/i)).toBeInTheDocument();
    });

    it('should show under review status message', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="UNDER_REVIEW"
        />
      );

      expect(screen.getByText(/Application Under Review/i)).toBeInTheDocument();
      expect(screen.getByText(/currently being reviewed by our curation team/i)).toBeInTheDocument();
    });

    it('should show approved status message', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="APPROVED"
        />
      );

      expect(screen.getByText(/Application Approved!/i)).toBeInTheDocument();
      expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
    });

    it('should show rejected status message', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="REJECTED"
          rejectionReason="Brand does not meet our clean beauty standards."
        />
      );

      expect(screen.getByText(/Application Not Approved/i)).toBeInTheDocument();
      expect(screen.getByText(/unable to approve your application/i)).toBeInTheDocument();
    });

    it('should show additional info requested message', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="ADDITIONAL_INFO_REQUESTED"
        />
      );

      expect(screen.getByText(/Additional Information Requested/i)).toBeInTheDocument();
      expect(screen.getByText(/need some additional information/i)).toBeInTheDocument();
    });
  });

  describe('SLA Deadline', () => {
    it('should show SLA deadline for pending applications', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText(/Expected decision by:/i)).toBeInTheDocument();
    });

    it('should not show SLA deadline for decided applications', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="APPROVED"
        />
      );

      expect(screen.queryByText(/Expected decision by:/i)).not.toBeInTheDocument();
    });

    it('should format deadline date correctly', () => {
      const deadline = new Date('2024-12-20T15:30:00Z');

      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="UNDER_REVIEW"
          slaDeadline={deadline}
        />
      );

      // Check for formatted date (e.g., "Dec 20, 2024")
      // Actual format depends on locale
      expect(screen.getByText(/Dec/i)).toBeInTheDocument();
    });
  });

  describe('Rejection Reason', () => {
    it('should display rejection reason when status is REJECTED', () => {
      const rejectionReason = 'Brand does not align with our marketplace values.';

      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="REJECTED"
          rejectionReason={rejectionReason}
        />
      );

      expect(screen.getByText('Reason for Decision')).toBeInTheDocument();
      expect(screen.getByText(rejectionReason)).toBeInTheDocument();
    });

    it('should not display rejection reason section when status is not REJECTED', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="APPROVED"
        />
      );

      expect(screen.queryByText('Reason for Decision')).not.toBeInTheDocument();
    });
  });

  describe('Approval Conditions', () => {
    it('should display approval conditions when conditionally approved', () => {
      const conditions = [
        'Provide updated product liability insurance',
        'Submit ingredient lists for all products',
      ];

      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="CONDITIONALLY_APPROVED"
          approvalConditions={conditions}
        />
      );

      expect(screen.getByText('Approval Conditions')).toBeInTheDocument();
      conditions.forEach((condition) => {
        expect(screen.getByText(condition)).toBeInTheDocument();
      });
    });

    it('should not display conditions section when fully approved', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="APPROVED"
        />
      );

      expect(screen.queryByText('Approval Conditions')).not.toBeInTheDocument();
    });
  });

  describe('Application Summary', () => {
    it('should display brand name', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText('Luminara Skincare')).toBeInTheDocument();
    });

    it('should display product count when provided', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
          productCount="50-100 SKUs"
        />
      );

      expect(screen.getByText('50-100 SKUs')).toBeInTheDocument();
    });

    it('should display categories', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText('Cleansers')).toBeInTheDocument();
      expect(screen.getByText('Serums')).toBeInTheDocument();
      expect(screen.getByText('Moisturizers')).toBeInTheDocument();
    });

    it('should display values', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText('Clean Beauty')).toBeInTheDocument();
      expect(screen.getByText('Vegan')).toBeInTheDocument();
      expect(screen.getByText('Woman Founded')).toBeInTheDocument();
    });
  });

  describe('Next Steps Section', () => {
    it('should show appropriate next steps for submitted status', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      expect(screen.getByText('What happens next?')).toBeInTheDocument();
      expect(screen.getByText(/Our team reviews your brand fit and product quality/i)).toBeInTheDocument();
    });

    it('should show appropriate next steps for approved status', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="APPROVED"
        />
      );

      expect(screen.getByText(/Check your email for onboarding instructions/i)).toBeInTheDocument();
      expect(screen.getByText(/Complete your vendor profile/i)).toBeInTheDocument();
    });

    it('should show appropriate next steps for rejected status', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="REJECTED"
          rejectionReason="Sample reason"
        />
      );

      expect(screen.getByText(/Review the rejection reason below/i)).toBeInTheDocument();
      expect(screen.getByText(/You may reapply after addressing the issues/i)).toBeInTheDocument();
    });

    it('should show appropriate next steps for additional info requested', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="ADDITIONAL_INFO_REQUESTED"
        />
      );

      expect(screen.getByText(/Check your email for specific requests/i)).toBeInTheDocument();
      expect(screen.getByText(/Provide the requested information/i)).toBeInTheDocument();
    });
  });

  describe('Contact Information', () => {
    it('should display vendor support email', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          status="SUBMITTED"
        />
      );

      const emailLink = screen.getByRole('link', { name: /vendors@jademarketplace\.com/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:vendors@jademarketplace.com');
    });
  });

  describe('Status Colors', () => {
    it('should use green styling for approved status', () => {
      const { container } = render(
        <ApplicationStatusTracker
          {...baseProps}
          status="APPROVED"
        />
      );

      // Check for green background classes (implementation specific)
      const statusBox = container.querySelector('.bg-green-50');
      expect(statusBox).toBeInTheDocument();
    });

    it('should use red styling for rejected status', () => {
      const { container } = render(
        <ApplicationStatusTracker
          {...baseProps}
          status="REJECTED"
          rejectionReason="Sample reason"
        />
      );

      // Check for red background classes (implementation specific)
      const statusBox = container.querySelector('.bg-red-50');
      expect(statusBox).toBeInTheDocument();
    });

    it('should use amber styling for additional info requested', () => {
      const { container } = render(
        <ApplicationStatusTracker
          {...baseProps}
          status="ADDITIONAL_INFO_REQUESTED"
        />
      );

      // Check for amber background classes (implementation specific)
      const statusBox = container.querySelector('.bg-amber-50');
      expect(statusBox).toBeInTheDocument();
    });

    it('should use blue styling for pending/under review status', () => {
      const { container } = render(
        <ApplicationStatusTracker
          {...baseProps}
          status="UNDER_REVIEW"
        />
      );

      // Check for blue background classes (implementation specific)
      const statusBox = container.querySelector('.bg-blue-50');
      expect(statusBox).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields gracefully', () => {
      render(
        <ApplicationStatusTracker
          status="SUBMITTED"
          submittedAt={new Date()}
          slaDeadline={new Date()}
          brandName="Test Brand"
        />
      );

      // Should render without crashing
      expect(screen.getByText('Test Brand')).toBeInTheDocument();
    });

    it('should handle empty categories array', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          categories={[]}
          status="SUBMITTED"
        />
      );

      // Should render without crashing
      expect(screen.getByText(baseProps.brandName)).toBeInTheDocument();
    });

    it('should handle empty values array', () => {
      render(
        <ApplicationStatusTracker
          {...baseProps}
          values={[]}
          status="SUBMITTED"
        />
      );

      // Should render without crashing
      expect(screen.getByText(baseProps.brandName)).toBeInTheDocument();
    });
  });
});
