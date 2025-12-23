/**
 * SkinProfileForm Component
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Multi-step form for creating/editing skin health profiles:
 * - Step 1: Basic Info (skin type, age, Fitzpatrick)
 * - Step 2: Concerns (skin concerns with severity)
 * - Step 3: Lifestyle (lifestyle factors)
 * - Step 4: Preferences (allergies, avoided ingredients)
 */

import React, { useState, useCallback } from 'react';

/**
 * Enums matching backend
 */
export type SkinType = 'NORMAL' | 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'MATURE';

export type SkinConcern =
  | 'ACNE'
  | 'AGING'
  | 'DARK_SPOTS'
  | 'DRYNESS'
  | 'DULLNESS'
  | 'ENLARGED_PORES'
  | 'FINE_LINES'
  | 'HYPERPIGMENTATION'
  | 'OILINESS'
  | 'REDNESS'
  | 'SENSITIVITY'
  | 'TEXTURE'
  | 'WRINKLES'
  | 'DEHYDRATION'
  | 'DARK_CIRCLES'
  | 'SAGGING';

export type LifestyleFactor =
  | 'HIGH_STRESS'
  | 'POOR_SLEEP'
  | 'HIGH_SUN_EXPOSURE'
  | 'SMOKER'
  | 'HIGH_POLLUTION'
  | 'ACTIVE_LIFESTYLE'
  | 'DIET_BALANCED'
  | 'DIET_HIGH_SUGAR'
  | 'HORMONAL_CHANGES'
  | 'MEDICATIONS';

/**
 * Skin concern with severity
 */
export interface SkinConcernEntry {
  concern: SkinConcern;
  severity: number;
  duration: string;
  notes?: string;
}

/**
 * Form data structure
 */
export interface SkinProfileFormData {
  skinType: SkinType;
  sensitivityLevel: number;
  concerns: SkinConcernEntry[];
  lifestyleFactors: LifestyleFactor[];
  age?: number;
  gender?: string;
  fitzpatrickType?: number;
  allergies: string[];
  avoidedIngredients: string[];
}

export interface SkinProfileFormProps {
  /** Initial form data for editing */
  initialData?: Partial<SkinProfileFormData>;
  /** Callback when form is submitted */
  onSubmit: (data: SkinProfileFormData) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether form is in loading state */
  isLoading?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Metadata for skin types
 */
const SKIN_TYPES: { value: SkinType; label: string; description: string }[] = [
  { value: 'NORMAL', label: 'Normal', description: 'Balanced, not too oily or dry' },
  { value: 'DRY', label: 'Dry', description: 'Feels tight, may have flaky patches' },
  { value: 'OILY', label: 'Oily', description: 'Shiny, enlarged pores, prone to breakouts' },
  { value: 'COMBINATION', label: 'Combination', description: 'Oily T-zone, dry cheeks' },
  { value: 'SENSITIVE', label: 'Sensitive', description: 'Easily irritated, reactive to products' },
  { value: 'MATURE', label: 'Mature', description: 'Loss of firmness, fine lines, age spots' },
];

/**
 * Metadata for skin concerns
 */
const SKIN_CONCERNS: { value: SkinConcern; label: string; icon: string }[] = [
  { value: 'ACNE', label: 'Acne', icon: '' },
  { value: 'AGING', label: 'Aging', icon: '' },
  { value: 'DARK_SPOTS', label: 'Dark Spots', icon: '' },
  { value: 'DRYNESS', label: 'Dryness', icon: '' },
  { value: 'DULLNESS', label: 'Dullness', icon: '' },
  { value: 'ENLARGED_PORES', label: 'Enlarged Pores', icon: '' },
  { value: 'FINE_LINES', label: 'Fine Lines', icon: '' },
  { value: 'HYPERPIGMENTATION', label: 'Hyperpigmentation', icon: '' },
  { value: 'OILINESS', label: 'Oiliness', icon: '' },
  { value: 'REDNESS', label: 'Redness', icon: '' },
  { value: 'SENSITIVITY', label: 'Sensitivity', icon: '' },
  { value: 'TEXTURE', label: 'Texture', icon: '' },
  { value: 'WRINKLES', label: 'Wrinkles', icon: '' },
  { value: 'DEHYDRATION', label: 'Dehydration', icon: '' },
  { value: 'DARK_CIRCLES', label: 'Dark Circles', icon: '' },
  { value: 'SAGGING', label: 'Sagging', icon: '' },
];

/**
 * Metadata for lifestyle factors
 */
const LIFESTYLE_FACTORS: { value: LifestyleFactor; label: string; description: string }[] = [
  { value: 'HIGH_STRESS', label: 'High Stress', description: 'Frequent stress at work or life' },
  { value: 'POOR_SLEEP', label: 'Poor Sleep', description: 'Less than 7 hours or irregular sleep' },
  { value: 'HIGH_SUN_EXPOSURE', label: 'High Sun Exposure', description: 'Outdoor activities, sunny climate' },
  { value: 'SMOKER', label: 'Smoker', description: 'Current or recent smoker' },
  { value: 'HIGH_POLLUTION', label: 'High Pollution', description: 'Urban environment, air quality issues' },
  { value: 'ACTIVE_LIFESTYLE', label: 'Active Lifestyle', description: 'Regular exercise and physical activity' },
  { value: 'DIET_BALANCED', label: 'Balanced Diet', description: 'Healthy eating habits' },
  { value: 'DIET_HIGH_SUGAR', label: 'High Sugar Diet', description: 'Frequent sugary foods and drinks' },
  { value: 'HORMONAL_CHANGES', label: 'Hormonal Changes', description: 'Menstrual, pregnancy, or menopause' },
  { value: 'MEDICATIONS', label: 'Medications', description: 'Taking medications that affect skin' },
];

/**
 * Fitzpatrick scale descriptions
 */
const FITZPATRICK_TYPES = [
  { value: 1, label: 'Type I', description: 'Always burns, never tans' },
  { value: 2, label: 'Type II', description: 'Usually burns, tans minimally' },
  { value: 3, label: 'Type III', description: 'Sometimes burns, tans uniformly' },
  { value: 4, label: 'Type IV', description: 'Burns minimally, tans well' },
  { value: 5, label: 'Type V', description: 'Rarely burns, tans profusely' },
  { value: 6, label: 'Type VI', description: 'Never burns, deeply pigmented' },
];

/**
 * Duration options for concerns
 */
const DURATION_OPTIONS = [
  { value: 'weeks', label: 'A few weeks' },
  { value: 'months', label: 'Several months' },
  { value: '1year', label: 'About a year' },
  { value: 'years', label: 'Multiple years' },
  { value: 'always', label: 'As long as I remember' },
];

/**
 * Common allergens
 */
const COMMON_ALLERGENS = [
  'Fragrance',
  'Essential Oils',
  'Lanolin',
  'Parabens',
  'Sulfates',
  'Formaldehyde',
  'Nickel',
  'Latex',
  'Propylene Glycol',
  'Coconut derivatives',
];

/**
 * Common avoided ingredients
 */
const COMMON_AVOIDED = [
  'Alcohol (denatured)',
  'Artificial colors',
  'Mineral oil',
  'Silicones',
  'Retinol',
  'AHA/BHA',
  'Vitamin C',
  'Niacinamide',
  'Peptides',
  'Benzoyl Peroxide',
];

/**
 * SkinProfileForm - Multi-step form for skin profile setup
 */
export function SkinProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: SkinProfileFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [formData, setFormData] = useState<SkinProfileFormData>({
    skinType: initialData?.skinType || 'NORMAL',
    sensitivityLevel: initialData?.sensitivityLevel || 5,
    concerns: initialData?.concerns || [],
    lifestyleFactors: initialData?.lifestyleFactors || [],
    age: initialData?.age,
    gender: initialData?.gender,
    fitzpatrickType: initialData?.fitzpatrickType,
    allergies: initialData?.allergies || [],
    avoidedIngredients: initialData?.avoidedIngredients || [],
  });

  /**
   * Update form field
   */
  const updateField = useCallback(<K extends keyof SkinProfileFormData>(
    field: K,
    value: SkinProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Toggle concern selection
   */
  const toggleConcern = useCallback((concern: SkinConcern) => {
    setFormData((prev) => {
      const exists = prev.concerns.find((c) => c.concern === concern);
      if (exists) {
        return {
          ...prev,
          concerns: prev.concerns.filter((c) => c.concern !== concern),
        };
      }
      return {
        ...prev,
        concerns: [
          ...prev.concerns,
          { concern, severity: 5, duration: 'months' },
        ],
      };
    });
  }, []);

  /**
   * Update concern severity
   */
  const updateConcernSeverity = useCallback((concern: SkinConcern, severity: number) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.map((c) =>
        c.concern === concern ? { ...c, severity } : c
      ),
    }));
  }, []);

  /**
   * Toggle lifestyle factor
   */
  const toggleLifestyleFactor = useCallback((factor: LifestyleFactor) => {
    setFormData((prev) => ({
      ...prev,
      lifestyleFactors: prev.lifestyleFactors.includes(factor)
        ? prev.lifestyleFactors.filter((f) => f !== factor)
        : [...prev.lifestyleFactors, factor],
    }));
  }, []);

  /**
   * Toggle allergy/avoided ingredient
   */
  const toggleArrayItem = useCallback((
    field: 'allergies' | 'avoidedIngredients',
    item: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  }, []);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }, [step]);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(() => {
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      {/* Progress Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Skin Concerns'}
            {step === 3 && 'Lifestyle Factors'}
            {step === 4 && 'Allergies & Preferences'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i + 1 <= step
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Skin Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What is your skin type?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SKIN_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateField('skinType', type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      formData.skinType === type.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="block font-medium text-gray-900 dark:text-gray-100">
                      {type.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Sensitivity Level: {formData.sensitivityLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.sensitivityLevel}
                onChange={(e) => updateField('sensitivityLevel', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Age (optional)
              </label>
              <input
                type="number"
                min="13"
                max="120"
                value={formData.age || ''}
                onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter your age"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fitzpatrick Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Fitzpatrick Skin Type (optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FITZPATRICK_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateField('fitzpatrickType', type.value)}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      formData.fitzpatrickType === type.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="block font-medium text-gray-900 dark:text-gray-100">
                      {type.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {type.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Concerns */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select your skin concerns and adjust their severity.
            </p>

            {/* Concern Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SKIN_CONCERNS.map((concern) => {
                const isSelected = formData.concerns.some((c) => c.concern === concern.value);
                return (
                  <button
                    key={concern.value}
                    type="button"
                    onClick={() => toggleConcern(concern.value)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {concern.label}
                  </button>
                );
              })}
            </div>

            {/* Severity Adjustment */}
            {formData.concerns.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adjust severity for each concern:
                </h3>
                {formData.concerns.map((entry) => {
                  const concernMeta = SKIN_CONCERNS.find((c) => c.value === entry.concern);
                  return (
                    <div key={entry.concern} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {concernMeta?.label}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.severity}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={entry.severity}
                        onChange={(e) => updateConcernSeverity(entry.concern, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select lifestyle factors that apply to you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LIFESTYLE_FACTORS.map((factor) => {
                const isSelected = formData.lifestyleFactors.includes(factor.value);
                return (
                  <button
                    key={factor.value}
                    type="button"
                    onClick={() => toggleLifestyleFactor(factor.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      isSelected
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="block font-medium text-gray-900 dark:text-gray-100">
                      {factor.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {factor.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Allergies & Preferences */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Known Allergies (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGENS.map((allergen) => {
                  const isSelected = formData.allergies.includes(allergen);
                  return (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleArrayItem('allergies', allergen)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {allergen}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avoided Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Ingredients to Avoid (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_AVOIDED.map((ingredient) => {
                  const isSelected = formData.avoidedIngredients.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      type="button"
                      onClick={() => toggleArrayItem('avoidedIngredients', ingredient)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {ingredient}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkinProfileForm;
