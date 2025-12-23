/**
 * Submission Confirmation Component
 * Week 5 Day 2: Success confirmation UI after product submission
 */

import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface SubmissionConfirmationProps {
  submissionId: string;
  productName: string;
  submissionStatus: string;
  taxonomyScore: number;
  onViewSubmission: () => void;
  onReturnToDashboard: () => void;
  onSubmitAnother: () => void;
}

export function SubmissionConfirmation({
  submissionId,
  productName,
  submissionStatus,
  taxonomyScore,
  onViewSubmission,
  onReturnToDashboard,
  onSubmitAnother,
}: SubmissionConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Icon and Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Product Submitted Successfully!
        </h2>
        <p className="text-gray-600">
          Your product has been submitted for review and will be processed shortly.
        </p>
      </div>

      {/* Submission Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Product Name:</span>
            <span className="text-gray-900 font-semibold">{productName}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Submission ID:</span>
            <span className="text-gray-900 font-mono text-sm">{submissionId}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Status:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {submissionStatus}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-600 font-medium">Taxonomy Completeness:</span>
            <span className={`font-semibold ${
              taxonomyScore >= 80 ? 'text-green-600' :
              taxonomyScore >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {taxonomyScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What Happens Next?</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-blue-200 text-blue-900 text-sm font-bold flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</span>
            <span>Our team will review your product submission within 24-48 hours.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-blue-200 text-blue-900 text-sm font-bold flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</span>
            <span>You'll receive an email notification once the review is complete.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-blue-200 text-blue-900 text-sm font-bold flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</span>
            <span>If approved, your product will be published to the marketplace.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-blue-200 text-blue-900 text-sm font-bold flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">4</span>
            <span>If changes are requested, you'll receive detailed feedback to improve your submission.</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onViewSubmission}
          variant="primary"
          className="flex-1"
        >
          View Submission Status
        </Button>
        <Button
          onClick={onSubmitAnother}
          variant="outline"
          className="flex-1"
        >
          Submit Another Product
        </Button>
        <Button
          onClick={onReturnToDashboard}
          variant="outline"
          className="flex-1"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
