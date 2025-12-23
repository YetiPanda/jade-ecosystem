/**
 * Application Detail View (Admin)
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools (Tasks E.2.4 & E.2.5)
 *
 * Detailed view of a single vendor application for admin review.
 * Displays all application sections and approval actions.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ApplicationStatus } from '../../graphql/generated';

export interface ApplicationDetail {
  id: string;
  // Contact Info
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string | null;
  contactRole: string;

  // Company Info
  brandName: string;
  legalName: string;
  website: string;
  yearFounded: number;
  headquarters: string;
  employeeCount: string;
  annualRevenue: string | null;

  // Product Info
  productCategories: string[];
  skuCount: string;
  priceRange: string;
  targetMarket: string[];
  currentDistribution: string[] | null;

  // Values & Certifications
  values: string[];
  certifications: string[] | null;
  whyJade: string;

  // Documents
  productCatalogUrl: string | null;
  lineSheetUrl: string | null;
  insuranceCertificateUrl: string | null;
  businessLicenseUrl: string | null;

  // Status & Tracking
  status: ApplicationStatus;
  submittedAt: Date;
  slaDeadline: Date;
  assignee: {
    id: string;
    name: string;
  } | null;

  // Review Notes
  reviewNotes: Array<{
    id: string;
    note: string;
    createdBy: string;
    createdAt: Date;
  }>;
}

interface ApplicationDetailViewProps {
  application: ApplicationDetail;
  onApprove?: (notes?: string) => void;
  onConditionallyApprove?: (conditions: string[], notes?: string) => void;
  onReject?: (reason: string) => void;
  onRequestInfo?: (details: string) => void;
  onReassign?: (adminId: string) => void;
}

export function ApplicationDetailView({
  application,
  onApprove,
  onConditionallyApprove,
  onReject,
  onRequestInfo,
  onReassign,
}: ApplicationDetailViewProps) {
  const getSlaTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const msRemaining = deadline.getTime() - now.getTime();
    const hoursRemaining = msRemaining / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      const hoursOverdue = Math.abs(hoursRemaining);
      if (hoursOverdue < 24) {
        return `${Math.floor(hoursOverdue)} hrs overdue`;
      }
      const daysOverdue = Math.ceil(hoursOverdue / 24);
      return `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`;
    }

    if (hoursRemaining < 24) {
      return `${Math.floor(hoursRemaining)} hrs remaining`;
    }

    const daysRemaining = Math.floor(hoursRemaining / 24);
    const remainingHours = Math.floor(hoursRemaining % 24);
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} ${remainingHours} hrs`;
  };

  const getSlaStatus = (deadline: Date): 'overdue' | 'at-risk' | 'on-time' => {
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) return 'overdue';
    if (hoursRemaining < 24) return 'at-risk';
    return 'on-time';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const slaStatus = getSlaStatus(application.slaDeadline);
  const isPending = application.status === ApplicationStatus.Submitted || application.status === ApplicationStatus.UnderReview;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/applications"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Queue
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application: {application.brandName}</h1>
                <p className="text-sm text-gray-600 mt-1">Submitted {formatDate(application.submittedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status & Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {application.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-base text-gray-900 mt-1">{formatFullDate(application.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SLA Deadline</p>
                  <p className="text-base text-gray-900 mt-1">{formatFullDate(application.slaDeadline)}</p>
                </div>
                {isPending && (
                  <div
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg',
                      slaStatus === 'overdue'
                        ? 'bg-red-50 border border-red-200'
                        : slaStatus === 'at-risk'
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-green-50 border border-green-200'
                    )}
                  >
                    {slaStatus === 'overdue' || slaStatus === 'at-risk' ? (
                      <AlertCircle
                        className={cn(
                          'h-5 w-5',
                          slaStatus === 'overdue' ? 'text-red-600' : 'text-amber-600'
                        )}
                      />
                    ) : (
                      <Clock className="h-5 w-5 text-green-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Time Remaining</p>
                      <p
                        className={cn(
                          'text-sm',
                          slaStatus === 'overdue'
                            ? 'text-red-600'
                            : slaStatus === 'at-risk'
                            ? 'text-amber-600'
                            : 'text-green-600'
                        )}
                      >
                        {getSlaTimeRemaining(application.slaDeadline)}
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Assignee</p>
                  <div className="flex items-center justify-between">
                    <p className="text-base text-gray-900">
                      {application.assignee ? application.assignee.name : 'Unassigned'}
                    </p>
                    {onReassign && (
                      <button
                        onClick={() => onReassign('new-admin-id')}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Reassign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-base text-gray-900 mt-1">
                    {application.contactFirstName} {application.contactLastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-base text-gray-900 mt-1">{application.contactRole}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base text-gray-900 mt-1">
                    <a href={`mailto:${application.contactEmail}`} className="text-indigo-600 hover:underline">
                      {application.contactEmail}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base text-gray-900 mt-1">{application.contactPhone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Brand Name</p>
                  <p className="text-base font-medium text-gray-900 mt-1">{application.brandName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Legal Name</p>
                  <p className="text-base text-gray-900 mt-1">{application.legalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="text-base text-gray-900 mt-1">
                    <a
                      href={application.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      {application.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Founded</p>
                  <p className="text-base text-gray-900 mt-1">{application.yearFounded}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Headquarters</p>
                  <p className="text-base text-gray-900 mt-1">{application.headquarters}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employee Count</p>
                  <p className="text-base text-gray-900 mt-1">{application.employeeCount}</p>
                </div>
                {application.annualRevenue && (
                  <div>
                    <p className="text-sm text-gray-600">Annual Revenue</p>
                    <p className="text-base text-gray-900 mt-1">{application.annualRevenue}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {application.productCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">SKU Count</p>
                    <p className="text-base text-gray-900 mt-1">{application.skuCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="text-base text-gray-900 mt-1">{application.priceRange}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Target Markets</p>
                  <div className="flex flex-wrap gap-2">
                    {application.targetMarket.map((market) => (
                      <span key={market} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
                {application.currentDistribution && application.currentDistribution.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Current Distribution</p>
                    <div className="flex flex-wrap gap-2">
                      {application.currentDistribution.map((channel) => (
                        <span key={channel} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Values & Certifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Values & Certifications</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Brand Values</p>
                  <div className="flex flex-wrap gap-2">
                    {application.values.map((value) => (
                      <span key={value} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                {application.certifications && application.certifications.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {application.certifications.map((cert) => (
                        <span key={cert} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Why Jade */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Jade</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{application.whyJade}</p>
            </div>

            {/* Documents */}
            {(application.productCatalogUrl ||
              application.lineSheetUrl ||
              application.insuranceCertificateUrl ||
              application.businessLicenseUrl) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <div className="space-y-3">
                  {application.productCatalogUrl && (
                    <a
                      href={application.productCatalogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-900">Product Catalog</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {application.lineSheetUrl && (
                    <a
                      href={application.lineSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-900">Line Sheet</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {application.insuranceCertificateUrl && (
                    <a
                      href={application.insuranceCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-900">Insurance Certificate</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {application.businessLicenseUrl && (
                    <a
                      href={application.businessLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-900">Business License</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Review Notes */}
            {application.reviewNotes.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Notes</h3>
                <div className="space-y-4">
                  {application.reviewNotes.map((note) => (
                    <div key={note.id} className="border-l-4 border-indigo-500 pl-4">
                      <p className="text-sm text-gray-700">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {note.createdBy} • {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
