/**
 * Product Information Step
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.4)
 *
 * Third step of vendor application wizard.
 * Collects information about products, SKUs, and distribution.
 */

import { ApplicationFormData } from '../../../pages/vendor/VendorApplicationPage';

interface ProductInfoStepProps {
  formData: ApplicationFormData;
  updateFormData: (updates: Partial<ApplicationFormData>) => void;
}

const PRODUCT_CATEGORIES = [
  'Cleansers',
  'Toners',
  'Serums',
  'Moisturizers',
  'Eye Creams',
  'Masks',
  'Exfoliants',
  'Sunscreens',
  'Body Care',
  'Hair Care',
];

const SKU_COUNT_OPTIONS = [
  '1-10 SKUs',
  '11-25 SKUs',
  '26-50 SKUs',
  '51-100 SKUs',
  '100+ SKUs',
];

const PRICE_RANGE_OPTIONS = [
  'Under $20',
  '$20-$50',
  '$50-$100',
  '$100-$200',
  '$200+',
];

const TARGET_MARKETS = [
  'Boutique Spas',
  'Day Spas',
  'Medical Spas',
  'Wellness Centers',
  'Hotels & Resorts',
  'Salons',
];

const DISTRIBUTION_CHANNELS = [
  'Direct to Consumer',
  'Independent Spas',
  'Retail Stores',
  'Online Marketplaces',
  'Distributors',
  'None (new to wholesale)',
];

export function ProductInfoStep({ formData, updateFormData }: ProductInfoStepProps) {
  const toggleCategory = (category: string) => {
    const current = formData.productCategories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    updateFormData({ productCategories: updated });
  };

  const toggleMarket = (market: string) => {
    const current = formData.targetMarket;
    const updated = current.includes(market)
      ? current.filter((m) => m !== market)
      : [...current, market];
    updateFormData({ targetMarket: updated });
  };

  const toggleDistribution = (channel: string) => {
    const current = formData.currentDistribution;
    const updated = current.includes(channel)
      ? current.filter((d) => d !== channel)
      : [...current, channel];
    updateFormData({ currentDistribution: updated });
  };

  return (
    <div className="space-y-6">
      {/* Product Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Product Categories <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                formData.productCategories.includes(category)
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Select all that apply</p>
      </div>

      {/* SKU Count & Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="skuCount" className="block text-sm font-medium text-gray-700 mb-2">
            Number of SKUs <span className="text-red-600">*</span>
          </label>
          <select
            id="skuCount"
            value={formData.skuCount}
            onChange={(e) => updateFormData({ skuCount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Select SKU count...</option>
            {SKU_COUNT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
            Price Range <span className="text-red-600">*</span>
          </label>
          <select
            id="priceRange"
            value={formData.priceRange}
            onChange={(e) => updateFormData({ priceRange: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Select price range...</option>
            {PRICE_RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Market */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Target Market <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TARGET_MARKETS.map((market) => (
            <button
              key={market}
              type="button"
              onClick={() => toggleMarket(market)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                formData.targetMarket.includes(market)
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {market}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Select all that apply</p>
      </div>

      {/* Current Distribution (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Current Distribution Channels (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DISTRIBUTION_CHANNELS.map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => toggleDistribution(channel)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                formData.currentDistribution.includes(channel)
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
