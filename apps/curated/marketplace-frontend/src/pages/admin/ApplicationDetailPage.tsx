/**
 * Application Detail Page (Route Wrapper)
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools
 *
 * Wrapper component for ApplicationDetailView that fetches data based on URL params
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ApplicationDetailView, ApplicationDetail } from './ApplicationDetailView';
import { ApplicationStatus } from '../../graphql/generated';

// Mock application data - in production this would come from GraphQL
const mockApplications: Record<string, ApplicationDetail> = {
  'app-1': {
    id: 'app-1',
    contactFirstName: 'Sarah',
    contactLastName: 'Chen',
    contactEmail: 'sarah@luminaraskincare.com',
    contactPhone: '(415) 555-0123',
    contactRole: 'Founder & CEO',
    brandName: 'Luminara Skincare',
    legalName: 'Luminara Beauty Inc.',
    website: 'https://luminaraskincare.com',
    yearFounded: 2020,
    headquarters: 'San Francisco, CA',
    employeeCount: '11-50',
    annualRevenue: '$1M - $5M',
    productCategories: ['Serums', 'Moisturizers', 'Eye Creams'],
    skuCount: '25-50',
    priceRange: '$$',
    targetMarket: ['Day Spas', 'Medical Spas'],
    currentDistribution: ['Direct to Consumer', 'Amazon'],
    values: ['Clean Beauty', 'Vegan', 'Cruelty-Free', 'Sustainable Packaging'],
    certifications: ['Leaping Bunny', 'USDA Organic'],
    whyJade: 'We believe Jade represents the perfect partnership for Luminara. Your focus on spa professionals aligns perfectly with our mission to provide clinical-grade skincare that delivers real results. Our products have been featured in leading wellness publications and we\'re excited to bring our science-backed formulations to your network of spa partners.',
    productCatalogUrl: 'https://example.com/catalog.pdf',
    lineSheetUrl: 'https://example.com/linesheet.pdf',
    insuranceCertificateUrl: 'https://example.com/insurance.pdf',
    businessLicenseUrl: 'https://example.com/license.pdf',
    status: ApplicationStatus.UnderReview,
    submittedAt: new Date('2024-12-18T10:00:00Z'),
    slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    assignee: { id: 'admin-1', name: 'Taylor Martinez' },
    reviewNotes: [
      {
        id: 'note-1',
        adminName: 'Taylor Martinez',
        note: 'Strong application. Website looks professional and products have good reviews.',
        createdAt: new Date('2024-12-19T14:30:00Z'),
      },
    ],
  },
};

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const application = id ? mockApplications[id] : null;

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/app/admin/applications')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = async (notes?: string) => {
    console.log('Approving application:', application.id, notes);
    // TODO: GraphQL mutation
    alert('Application approved!');
    navigate('/app/admin/applications');
  };

  const handleConditionallyApprove = async (conditions: string[], notes?: string) => {
    console.log('Conditionally approving:', application.id, conditions, notes);
    // TODO: GraphQL mutation
    alert('Application conditionally approved!');
    navigate('/app/admin/applications');
  };

  const handleReject = async (reason: string) => {
    console.log('Rejecting application:', application.id, reason);
    // TODO: GraphQL mutation
    alert('Application rejected.');
    navigate('/app/admin/applications');
  };

  const handleRequestInfo = async (details: string) => {
    console.log('Requesting info:', application.id, details);
    // TODO: GraphQL mutation
    alert('Information request sent!');
    navigate('/app/admin/applications');
  };

  const handleReassign = async (adminId: string) => {
    console.log('Reassigning to:', adminId);
    // TODO: GraphQL mutation
    alert(`Application reassigned!`);
  };

  return (
    <ApplicationDetailView
      application={application}
      onApprove={handleApprove}
      onConditionallyApprove={handleConditionallyApprove}
      onReject={handleReject}
      onRequestInfo={handleRequestInfo}
      onReassign={handleReassign}
    />
  );
}
