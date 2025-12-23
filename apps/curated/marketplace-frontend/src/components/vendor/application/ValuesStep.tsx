/**
 * Values & Certifications Step
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.5)
 *
 * Fourth step of vendor application wizard.
 * Collects brand values, certifications, and "Why Jade" statement.
 */

import { ApplicationFormData } from '../../../pages/vendor/VendorApplicationPage';

interface ValuesStepProps {
  formData: ApplicationFormData;
  updateFormData: (updates: Partial<ApplicationFormData>) => void;
}

const VENDOR_VALUES = [
  // Ingredient Philosophy
  { value: 'CLEAN_BEAUTY', label: 'Clean Beauty', category: 'ingredient' },
  { value: 'ORGANIC', label: 'Organic', category: 'ingredient' },
  { value: 'NATURAL', label: 'Natural', category: 'ingredient' },
  { value: 'VEGAN', label: 'Vegan', category: 'ingredient' },
  { value: 'CRUELTY_FREE', label: 'Cruelty-Free', category: 'ingredient' },
  { value: 'FRAGRANCE_FREE', label: 'Fragrance-Free', category: 'ingredient' },
  { value: 'PARABEN_FREE', label: 'Paraben-Free', category: 'ingredient' },
  { value: 'SULFATE_FREE', label: 'Sulfate-Free', category: 'ingredient' },
  // Sustainability
  { value: 'SUSTAINABLE', label: 'Sustainable', category: 'sustainability' },
  { value: 'ECO_PACKAGING', label: 'Eco Packaging', category: 'sustainability' },
  { value: 'REFILLABLE', label: 'Refillable', category: 'sustainability' },
  { value: 'ZERO_WASTE', label: 'Zero Waste', category: 'sustainability' },
  { value: 'CARBON_NEUTRAL', label: 'Carbon Neutral', category: 'sustainability' },
  { value: 'REEF_SAFE', label: 'Reef Safe', category: 'sustainability' },
  // Founder Identity
  { value: 'WOMAN_FOUNDED', label: 'Woman Founded', category: 'founder' },
  { value: 'BIPOC_OWNED', label: 'BIPOC Owned', category: 'founder' },
  { value: 'LGBTQ_OWNED', label: 'LGBTQ+ Owned', category: 'founder' },
  { value: 'VETERAN_OWNED', label: 'Veteran Owned', category: 'founder' },
  { value: 'FAMILY_OWNED', label: 'Family Owned', category: 'founder' },
  { value: 'SMALL_BATCH', label: 'Small Batch', category: 'founder' },
  // Specialization
  { value: 'MEDICAL_GRADE', label: 'Medical Grade', category: 'specialization' },
  { value: 'ESTHETICIAN_DEVELOPED', label: 'Esthetician Developed', category: 'specialization' },
  { value: 'DERMATOLOGIST_TESTED', label: 'Dermatologist Tested', category: 'specialization' },
  { value: 'CLINICAL_RESULTS', label: 'Clinical Results', category: 'specialization' },
  { value: 'PROFESSIONAL_ONLY', label: 'Professional Only', category: 'specialization' },
];

const CERTIFICATION_TYPES = [
  { value: 'USDA_ORGANIC', label: 'USDA Organic' },
  { value: 'ECOCERT', label: 'Ecocert' },
  { value: 'LEAPING_BUNNY', label: 'Leaping Bunny' },
  { value: 'PETA_CERTIFIED', label: 'PETA Certified Cruelty-Free' },
  { value: 'B_CORP', label: 'B Corporation' },
  { value: 'MADE_SAFE', label: 'Made Safe' },
  { value: 'EWG_VERIFIED', label: 'EWG Verified' },
  { value: 'FSC_CERTIFIED', label: 'FSC Certified' },
  { value: 'COSMOS_ORGANIC', label: 'COSMOS Organic' },
  { value: 'COSMOS_NATURAL', label: 'COSMOS Natural' },
  { value: 'FAIR_TRADE', label: 'Fair Trade' },
  { value: 'WOMEN_OWNED_WBENC', label: 'Women Owned (WBENC)' },
  { value: 'MINORITY_OWNED_NMSDC', label: 'Minority Owned (NMSDC)' },
];

export function ValuesStep({ formData, updateFormData }: ValuesStepProps) {
  const toggleValue = (value: string) => {
    const current = formData.values;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFormData({ values: updated });
  };

  const toggleCertification = (cert: string) => {
    const current = formData.certifications;
    const updated = current.includes(cert)
      ? current.filter((c) => c !== cert)
      : [...current, cert];
    updateFormData({ certifications: updated });
  };

  const categorizedValues = {
    ingredient: VENDOR_VALUES.filter((v) => v.category === 'ingredient'),
    sustainability: VENDOR_VALUES.filter((v) => v.category === 'sustainability'),
    founder: VENDOR_VALUES.filter((v) => v.category === 'founder'),
    specialization: VENDOR_VALUES.filter((v) => v.category === 'specialization'),
  };

  return (
    <div className="space-y-8">
      {/* Brand Values */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Brand Values <span className="text-red-600">*</span>
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Select at least 3 values that describe your brand. These help spas find you.
        </p>

        {/* Ingredient Philosophy */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Ingredient Philosophy</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categorizedValues.ingredient.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleValue(item.value)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.values.includes(item.value)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sustainability */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Sustainability</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categorizedValues.sustainability.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleValue(item.value)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.values.includes(item.value)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Founder Identity */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Founder Identity</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categorizedValues.founder.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleValue(item.value)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.values.includes(item.value)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specialization */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Specialization</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categorizedValues.specialization.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleValue(item.value)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.values.includes(item.value)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Selected: <strong>{formData.values.length}</strong> value{formData.values.length !== 1 ? 's' : ''}
            {formData.values.length < 3 && (
              <span className="text-red-600 ml-2">(minimum 3 required)</span>
            )}
          </p>
        </div>
      </div>

      {/* Certifications (Optional) */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Certifications (Optional)
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Select any official certifications you hold. You'll be asked to provide proof during onboarding.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CERTIFICATION_TYPES.map((cert) => (
            <button
              key={cert.value}
              type="button"
              onClick={() => toggleCertification(cert.value)}
              className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                formData.certifications.includes(cert.value)
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {cert.label}
            </button>
          ))}
        </div>
      </div>

      {/* Why Jade */}
      <div>
        <label htmlFor="whyJade" className="block text-lg font-semibold text-gray-900 mb-2">
          Why Jade? <span className="text-red-600">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Tell us why you want to join the JADE marketplace and what makes your brand a great fit.
          (Minimum 100 characters)
        </p>
        <textarea
          id="whyJade"
          value={formData.whyJade}
          onChange={(e) => updateFormData({ whyJade: e.target.value })}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Share your brand's story and why JADE is the right marketplace for you..."
          required
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {formData.whyJade.length} / 2000 characters
            {formData.whyJade.length < 100 && (
              <span className="text-red-600 ml-2">(minimum 100 required)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
