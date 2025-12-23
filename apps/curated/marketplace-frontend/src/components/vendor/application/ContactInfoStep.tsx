/**
 * Contact Information Step
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.2)
 *
 * First step of vendor application wizard.
 * Collects primary contact information for the applicant.
 */

import { ApplicationFormData } from '../../../pages/vendor/VendorApplicationPage';

interface ContactInfoStepProps {
  formData: ApplicationFormData;
  updateFormData: (updates: Partial<ApplicationFormData>) => void;
}

const ROLE_OPTIONS = [
  'Founder / Owner',
  'Sales Director',
  'Marketing Manager',
  'Operations Manager',
  'Other',
];

export function ContactInfoStep({ formData, updateFormData }: ContactInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactFirstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="contactFirstName"
            value={formData.contactFirstName}
            onChange={(e) => updateFormData({ contactFirstName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div>
          <label htmlFor="contactLastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="contactLastName"
            value={formData.contactLastName}
            onChange={(e) => updateFormData({ contactLastName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={(e) => updateFormData({ contactEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => updateFormData({ contactPhone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700 mb-2">
          Your Role <span className="text-red-600">*</span>
        </label>
        <select
          id="contactRole"
          value={formData.contactRole}
          onChange={(e) => updateFormData({ contactRole: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        >
          <option value="">Select your role...</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This will be your primary point of contact for the application review process.
        </p>
      </div>
    </div>
  );
}
