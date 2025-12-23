/**
 * Submit Product Page
 * Week 4 Day 4: Product submission workflow page
 */

import { ProductSubmissionWorkflow } from '../../components/vendor/ProductSubmissionWorkflow';
import { VendorNavigation } from '../../components/vendor/VendorNavigation';

export function SubmitProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8">
          <VendorNavigation />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit New Product</h1>
          <p className="mt-2 text-gray-600">
            Follow the guided workflow to submit your product for review
          </p>
        </div>

        <ProductSubmissionWorkflow />
      </div>
    </div>
  );
}
