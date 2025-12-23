/**
 * Company Information Step
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.3)
 *
 * Second step of vendor application wizard.
 * Collects company and business information.
 */

import { ApplicationFormData } from '../../../pages/vendor/VendorApplicationPage';

interface CompanyInfoStepProps {
  formData: ApplicationFormData;
  updateFormData: (updates: Partial<ApplicationFormData>) => void;
}

const EMPLOYEE_COUNT_OPTIONS = [
  '1 (Solo)',
  '2-10',
  '11-50',
  '51-200',
  '200+',
];

const REVENUE_OPTIONS = [
  'Pre-revenue',
  'Under $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M+',
  'Prefer not to say',
];

export function CompanyInfoStep({ formData, updateFormData }: CompanyInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Brand Name & Legal Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="brandName"
            value={formData.brandName}
            onChange={(e) => updateFormData({ brandName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Luminara Skincare"
            required
          />
          <p className="text-xs text-gray-500 mt-1">This is how spas will find you</p>
        </div>

        <div>
          <label htmlFor="legalName" className="block text-sm font-medium text-gray-700 mb-2">
            Legal Business Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="legalName"
            value={formData.legalName}
            onChange={(e) => updateFormData({ legalName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Luminara LLC"
            required
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Website <span className="text-red-600">*</span>
        </label>
        <input
          type="url"
          id="website"
          value={formData.website}
          onChange={(e) => updateFormData({ website: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="https://www.yourbrand.com"
          required
        />
      </div>

      {/* Year Founded & Headquarters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="yearFounded" className="block text-sm font-medium text-gray-700 mb-2">
            Year Founded <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            id="yearFounded"
            value={formData.yearFounded || ''}
            onChange={(e) => updateFormData({ yearFounded: parseInt(e.target.value) || null })}
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="2019"
            required
          />
        </div>

        <div>
          <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 mb-2">
            Headquarters <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="headquarters"
            value={formData.headquarters}
            onChange={(e) => updateFormData({ headquarters: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Austin, TX"
            required
          />
        </div>
      </div>

      {/* Employee Count & Annual Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees <span className="text-red-600">*</span>
          </label>
          <select
            id="employeeCount"
            value={formData.employeeCount}
            onChange={(e) => updateFormData({ employeeCount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Select employee count...</option>
            {EMPLOYEE_COUNT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue (Optional)
          </label>
          <select
            id="annualRevenue"
            value={formData.annualRevenue}
            onChange={(e) => updateFormData({ annualRevenue: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select revenue range...</option>
            {REVENUE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
