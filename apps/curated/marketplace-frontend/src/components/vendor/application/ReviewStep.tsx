/**
 * Review & Submit Step
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.6)
 *
 * Final step of vendor application wizard.
 * Shows summary of all entered information and submit button.
 */

import { Check } from 'lucide-react';
import { ApplicationFormData } from '../../../pages/vendor/VendorApplicationPage';

interface ReviewStepProps {
  formData: ApplicationFormData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ formData, onSubmit, isSubmitting }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Almost done!</strong> Review your application below. You can go back to edit any section.
        </p>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          Contact Information
        </h4>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-600">Name</dt>
            <dd className="font-medium text-gray-900">
              {formData.contactFirstName} {formData.contactLastName}
            </dd>
          </div>
          <div>
            <dt className="text-gray-600">Email</dt>
            <dd className="font-medium text-gray-900">{formData.contactEmail}</dd>
          </div>
          {formData.contactPhone && (
            <div>
              <dt className="text-gray-600">Phone</dt>
              <dd className="font-medium text-gray-900">{formData.contactPhone}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-600">Role</dt>
            <dd className="font-medium text-gray-900">{formData.contactRole}</dd>
          </div>
        </dl>
      </div>

      {/* Company Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          Company Information
        </h4>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-600">Brand Name</dt>
            <dd className="font-medium text-gray-900">{formData.brandName}</dd>
          </div>
          <div>
            <dt className="text-gray-600">Legal Name</dt>
            <dd className="font-medium text-gray-900">{formData.legalName}</dd>
          </div>
          <div>
            <dt className="text-gray-600">Website</dt>
            <dd className="font-medium text-gray-900">
              <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {formData.website}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-gray-600">Founded</dt>
            <dd className="font-medium text-gray-900">{formData.yearFounded}</dd>
          </div>
          <div>
            <dt className="text-gray-600">Headquarters</dt>
            <dd className="font-medium text-gray-900">{formData.headquarters}</dd>
          </div>
          <div>
            <dt className="text-gray-600">Employee Count</dt>
            <dd className="font-medium text-gray-900">{formData.employeeCount}</dd>
          </div>
          {formData.annualRevenue && (
            <div>
              <dt className="text-gray-600">Annual Revenue</dt>
              <dd className="font-medium text-gray-900">{formData.annualRevenue}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Product Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          Product Information
        </h4>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-gray-600 mb-2">Product Categories</dt>
            <dd className="flex flex-wrap gap-2">
              {formData.productCategories.map((cat) => (
                <span key={cat} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                  {cat}
                </span>
              ))}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-gray-600">SKU Count</dt>
              <dd className="font-medium text-gray-900">{formData.skuCount}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Price Range</dt>
              <dd className="font-medium text-gray-900">{formData.priceRange}</dd>
            </div>
          </div>
          <div>
            <dt className="text-gray-600 mb-2">Target Market</dt>
            <dd className="flex flex-wrap gap-2">
              {formData.targetMarket.map((market) => (
                <span key={market} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                  {market}
                </span>
              ))}
            </dd>
          </div>
          {formData.currentDistribution.length > 0 && (
            <div>
              <dt className="text-gray-600 mb-2">Current Distribution</dt>
              <dd className="flex flex-wrap gap-2">
                {formData.currentDistribution.map((dist) => (
                  <span key={dist} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                    {dist}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Values & Certifications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          Values & Certifications
        </h4>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-gray-600 mb-2">Brand Values ({formData.values.length})</dt>
            <dd className="flex flex-wrap gap-2">
              {formData.values.map((value) => (
                <span key={value} className="px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium">
                  {value.replace(/_/g, ' ')}
                </span>
              ))}
            </dd>
          </div>
          {formData.certifications.length > 0 && (
            <div>
              <dt className="text-gray-600 mb-2">Certifications ({formData.certifications.length})</dt>
              <dd className="flex flex-wrap gap-2">
                {formData.certifications.map((cert) => (
                  <span key={cert} className="px-3 py-1 bg-green-100 rounded-full text-green-700 font-medium">
                    {cert.replace(/_/g, ' ')}
                  </span>
                ))}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-gray-600 mb-2">Why Jade</dt>
            <dd className="text-gray-900 whitespace-pre-wrap">{formData.whyJade}</dd>
          </div>
        </dl>
      </div>

      {/* Submit Button */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Ready to submit?</h4>
        <p className="text-sm text-gray-600 mb-6">
          By submitting this application, you confirm that all information provided is accurate and complete.
          Our curation team will review your application within 3 business days.
        </p>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Questions? Email <a href="mailto:vendors@jademarketplace.com" className="text-indigo-600 hover:underline">vendors@jademarketplace.com</a>
        </p>
      </div>
    </div>
  );
}
