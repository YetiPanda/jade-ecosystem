/**
 * Application Status Tracker Component
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.7)
 *
 * Displays current status of vendor application with timeline and information.
 * Shows progress through: Submitted → Under Review → Decision
 */

import { Check, Clock, Mail } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFO_REQUESTED'
  | 'APPROVED'
  | 'CONDITIONALLY_APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

interface ApplicationStatusTrackerProps {
  status: ApplicationStatus;
  submittedAt: Date;
  slaDeadline: Date;
  brandName: string;
  productCount?: string;
  categories?: string[];
  values?: string[];
  rejectionReason?: string;
  approvalConditions?: string[];
}

export function ApplicationStatusTracker({
  status,
  submittedAt,
  slaDeadline,
  brandName,
  productCount,
  categories = [],
  values = [],
  rejectionReason,
  approvalConditions,
}: ApplicationStatusTrackerProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const isSubmitted = true;
  const isUnderReview = ['UNDER_REVIEW', 'ADDITIONAL_INFO_REQUESTED', 'APPROVED', 'CONDITIONALLY_APPROVED', 'REJECTED'].includes(status);
  const isDecided = ['APPROVED', 'CONDITIONALLY_APPROVED', 'REJECTED'].includes(status);

  const getStatusMessage = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          title: '📋 Application Submitted',
          message: 'Your application has been received and is queued for review.',
          info: 'Our curation team will begin reviewing your application soon.',
        };
      case 'UNDER_REVIEW':
        return {
          title: '🔍 Application Under Review',
          message: 'Your application is currently being reviewed by our curation team.',
          info: 'We review every application within 3 business days.',
        };
      case 'ADDITIONAL_INFO_REQUESTED':
        return {
          title: '📧 Additional Information Requested',
          message: 'We need some additional information to complete your application review.',
          info: 'Please check your email for details and respond as soon as possible.',
        };
      case 'APPROVED':
        return {
          title: '🎉 Application Approved!',
          message: 'Congratulations! Your application has been approved.',
          info: 'Check your email for next steps to complete your onboarding.',
        };
      case 'CONDITIONALLY_APPROVED':
        return {
          title: '✅ Conditionally Approved',
          message: 'Your application has been approved with conditions.',
          info: 'Please review the conditions below and complete them during onboarding.',
        };
      case 'REJECTED':
        return {
          title: '❌ Application Not Approved',
          message: 'Unfortunately, we are unable to approve your application at this time.',
          info: 'See the reason below for more details.',
        };
      default:
        return {
          title: 'Application Status',
          message: '',
          info: '',
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Status</h3>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />

          <div className="space-y-8">
            {/* Step 1: Submitted */}
            <div className="relative flex items-start">
              <div className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full border-2 bg-white z-10',
                isSubmitted ? 'border-green-600' : 'border-gray-300'
              )}>
                {isSubmitted ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
              </div>
              <div className="ml-6 flex-1">
                <h4 className={cn(
                  'text-base font-medium',
                  isSubmitted ? 'text-gray-900' : 'text-gray-500'
                )}>
                  Submitted
                </h4>
                {isSubmitted && (
                  <p className="text-sm text-gray-600">{formatDate(submittedAt)}</p>
                )}
              </div>
            </div>

            {/* Step 2: Under Review */}
            <div className="relative flex items-start">
              <div className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full border-2 bg-white z-10',
                isUnderReview ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              )}>
                {isUnderReview ? (
                  isDecided ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : (
                    <Clock className="h-6 w-6 text-white" />
                  )
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
              </div>
              <div className="ml-6 flex-1">
                <h4 className={cn(
                  'text-base font-medium',
                  isUnderReview ? 'text-gray-900' : 'text-gray-500'
                )}>
                  Under Review
                </h4>
                {isUnderReview && !isDecided && (
                  <p className="text-sm text-indigo-600 font-medium">Currently here</p>
                )}
              </div>
            </div>

            {/* Step 3: Decision */}
            <div className="relative flex items-start">
              <div className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full border-2 bg-white z-10',
                isDecided ? 'border-green-600' : 'border-gray-300'
              )}>
                {isDecided ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
              </div>
              <div className="ml-6 flex-1">
                <h4 className={cn(
                  'text-base font-medium',
                  isDecided ? 'text-gray-900' : 'text-gray-500'
                )}>
                  Decision
                </h4>
                {isDecided && (
                  <p className="text-sm text-gray-600">{status.replace(/_/g, ' ')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className={cn(
        'rounded-lg border p-6',
        status === 'APPROVED' || status === 'CONDITIONALLY_APPROVED'
          ? 'bg-green-50 border-green-200'
          : status === 'REJECTED'
          ? 'bg-red-50 border-red-200'
          : status === 'ADDITIONAL_INFO_REQUESTED'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-blue-50 border-blue-200'
      )}>
        <h3 className={cn(
          'text-lg font-semibold mb-2',
          status === 'APPROVED' || status === 'CONDITIONALLY_APPROVED'
            ? 'text-green-900'
            : status === 'REJECTED'
            ? 'text-red-900'
            : status === 'ADDITIONAL_INFO_REQUESTED'
            ? 'text-amber-900'
            : 'text-blue-900'
        )}>
          {statusInfo.title}
        </h3>
        <p className={cn(
          'mb-4',
          status === 'APPROVED' || status === 'CONDITIONALLY_APPROVED'
            ? 'text-green-800'
            : status === 'REJECTED'
            ? 'text-red-800'
            : status === 'ADDITIONAL_INFO_REQUESTED'
            ? 'text-amber-800'
            : 'text-blue-800'
        )}>
          {statusInfo.message}
        </p>
        {!isDecided && (
          <p className={cn(
            'mb-4 text-sm',
            status === 'ADDITIONAL_INFO_REQUESTED' ? 'text-amber-700' : 'text-blue-700'
          )}>
            Expected decision by: <strong>{formatDate(slaDeadline)}</strong>
          </p>
        )}
        <div className="border-t border-current/20 pt-4 mt-4">
          <p className="font-medium mb-2">What happens next?</p>
          <ul className="space-y-1 text-sm">
            {status === 'APPROVED' || status === 'CONDITIONALLY_APPROVED' ? (
              <>
                <li>• Check your email for onboarding instructions</li>
                <li>• Complete your vendor profile</li>
                <li>• Upload your product catalog</li>
                <li>• Launch your storefront within 2 weeks</li>
              </>
            ) : status === 'REJECTED' ? (
              <>
                <li>• Review the rejection reason below</li>
                <li>• You may reapply after addressing the issues</li>
                <li>• Contact us if you have questions</li>
              </>
            ) : status === 'ADDITIONAL_INFO_REQUESTED' ? (
              <>
                <li>• Check your email for specific requests</li>
                <li>• Provide the requested information</li>
                <li>• Your application will continue review</li>
              </>
            ) : (
              <>
                <li>• Our team reviews your brand fit and product quality</li>
                <li>• We may reach out with questions (check your email)</li>
                <li>• You'll receive an email with our decision</li>
              </>
            )}
          </ul>
        </div>
        <div className="mt-4 pt-4 border-t border-current/20">
          <p className="text-sm">
            Questions? Email <a href="mailto:vendors@jademarketplace.com" className="font-medium underline">vendors@jademarketplace.com</a>
          </p>
        </div>
      </div>

      {/* Rejection Reason */}
      {status === 'REJECTED' && rejectionReason && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Reason for Decision</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{rejectionReason}</p>
        </div>
      )}

      {/* Approval Conditions */}
      {status === 'CONDITIONALLY_APPROVED' && approvalConditions && approvalConditions.length > 0 && (
        <div className="bg-white rounded-lg border border-amber-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Approval Conditions</h4>
          <ul className="space-y-2">
            {approvalConditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span className="text-gray-700">{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Application Summary</h3>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-600">Brand</dt>
            <dd className="font-medium text-gray-900">{brandName}</dd>
          </div>
          {productCount && (
            <div>
              <dt className="text-gray-600">Products</dt>
              <dd className="font-medium text-gray-900">{productCount}</dd>
            </div>
          )}
          {categories.length > 0 && (
            <div>
              <dt className="text-gray-600 mb-2">Categories</dt>
              <dd className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span key={cat} className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {cat}
                  </span>
                ))}
              </dd>
            </div>
          )}
          {values.length > 0 && (
            <div>
              <dt className="text-gray-600 mb-2">Values</dt>
              <dd className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <span key={value} className="px-2 py-1 bg-indigo-100 rounded text-indigo-700">
                    {value}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
