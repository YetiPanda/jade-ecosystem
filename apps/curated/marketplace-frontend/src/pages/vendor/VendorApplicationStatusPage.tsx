/**
 * Vendor Application Status Page
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding
 *
 * Displays the current status of vendor's application
 */

import { ApplicationStatusTracker } from '../../components/vendor/application/ApplicationStatusTracker';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Mock application data - in production this would come from GraphQL
const mockApplication = {
  id: 'app-123',
  status: 'UNDER_REVIEW' as const,
  submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  slaDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  reviewNotes: [
    {
      id: 'note-1',
      adminName: 'Sarah Johnson',
      note: 'Application received. Initial review in progress.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ],
  conditionalApprovalConditions: undefined,
};

export function VendorApplicationStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/app/vendor/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
          <p className="mt-2 text-gray-600">
            Track the progress of your vendor application
          </p>
        </div>

        {/* Status Tracker */}
        <ApplicationStatusTracker
          applicationId={mockApplication.id}
          status={mockApplication.status}
          submittedAt={mockApplication.submittedAt}
          slaDeadline={mockApplication.slaDeadline}
          reviewNotes={mockApplication.reviewNotes}
          conditionalApprovalConditions={mockApplication.conditionalApprovalConditions}
        />

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Questions about your application?
          </h3>
          <p className="text-blue-800 mb-4">
            Our team reviews all applications within 3 business days. You'll receive email
            notifications as your application progresses.
          </p>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Need to update your application?</strong> Contact us at{' '}
              <a href="mailto:vendors@jade.com" className="underline">
                vendors@jade.com
              </a>
            </p>
            <p>
              <strong>Questions?</strong> Check our{' '}
              <Link to="/help/vendor-faq" className="underline">
                Vendor FAQ
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 flex gap-4">
          <Link
            to="/app/vendor/application"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Application
          </Link>
          <a
            href="mailto:vendors@jade.com?subject=Application Question - App ID: app-123"
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
