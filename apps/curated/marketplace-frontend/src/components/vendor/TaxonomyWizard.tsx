/**
 * Taxonomy Selection Wizard
 * Week 4 Day 4: Guided taxonomy selection with intelligent suggestions
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TAXONOMY_FILTER_OPTIONS } from '../../graphql/taxonomy.queries';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TaxonomySelection {
  categoryId?: string;
  functionIds: string[];
  concernIds: string[];
  targetAreaIds: string[];
  professionalLevel?: string;
  usageTime?: string;
}

interface TaxonomyWizardProps {
  onComplete: (selection: TaxonomySelection) => void;
  onCancel: () => void;
  initialSelection?: Partial<TaxonomySelection>;
}

enum WizardStep {
  CATEGORY = 'category',
  FUNCTIONS = 'functions',
  CONCERNS = 'concerns',
  TARGET_AREAS = 'target_areas',
  PROFESSIONAL_LEVEL = 'professional_level',
  REVIEW = 'review',
}

const WIZARD_STEPS = [
  { id: WizardStep.CATEGORY, label: 'Category', icon: '📁' },
  { id: WizardStep.FUNCTIONS, label: 'Functions', icon: '⚡' },
  { id: WizardStep.CONCERNS, label: 'Concerns', icon: '🎯' },
  { id: WizardStep.TARGET_AREAS, label: 'Target Areas', icon: '📍' },
  { id: WizardStep.PROFESSIONAL_LEVEL, label: 'Professional Level', icon: '🏆' },
  { id: WizardStep.REVIEW, label: 'Review', icon: '✓' },
];

const PROFESSIONAL_LEVELS = [
  {
    id: 'OTC',
    name: 'Over-the-Counter (OTC)',
    description: 'Available for direct consumer purchase without professional guidance',
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    description: 'Requires professional consultation and guidance for use',
  },
  {
    id: 'MEDICAL_GRADE',
    name: 'Medical Grade',
    description: 'Clinical-strength products for medical professionals',
  },
  {
    id: 'IN_OFFICE_ONLY',
    name: 'In-Office Only',
    description: 'Must be administered by licensed professionals in clinical setting',
  },
];

const USAGE_TIMES = [
  { id: 'MORNING', name: 'Morning Only', icon: '🌅' },
  { id: 'EVENING', name: 'Evening Only', icon: '🌙' },
  { id: 'ANYTIME', name: 'Anytime', icon: '🕐' },
  { id: 'NIGHT_ONLY', name: 'Night Only', icon: '🌃' },
  { id: 'POST_TREATMENT', name: 'Post-Treatment', icon: '💉' },
];

export function TaxonomyWizard({
  onComplete,
  onCancel,
  initialSelection = {},
}: TaxonomyWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.CATEGORY);
  const [selection, setSelection] = useState<TaxonomySelection>({
    functionIds: initialSelection.functionIds || [],
    concernIds: initialSelection.concernIds || [],
    targetAreaIds: initialSelection.targetAreaIds || [],
    categoryId: initialSelection.categoryId,
    professionalLevel: initialSelection.professionalLevel,
    usageTime: initialSelection.usageTime,
  });

  const { data, loading, error } = useQuery(GET_TAXONOMY_FILTER_OPTIONS);

  const currentStepIndex = WIZARD_STEPS.findIndex((step) => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex + 1].id);
    } else {
      onComplete(selection);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex - 1].id);
    }
  };

  const toggleSelection = (key: keyof TaxonomySelection, value: string) => {
    if (key === 'categoryId' || key === 'professionalLevel' || key === 'usageTime') {
      setSelection((prev) => ({ ...prev, [key]: value }));
    } else {
      setSelection((prev) => {
        const currentList = prev[key] as string[];
        const newList = currentList.includes(value)
          ? currentList.filter((id) => id !== value)
          : [...currentList, value];
        return { ...prev, [key]: newList };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading taxonomy options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading taxonomy options</p>
        <Button onClick={onCancel} variant="outline" className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {WIZARD_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  <span
                    className={`
                      mt-2 text-xs font-medium
                      ${isActive ? 'text-blue-600' : 'text-gray-600'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {currentStep === WizardStep.CATEGORY && (
          <CategoryStep
            categories={data?.taxonomyFilterOptions?.categories || []}
            selectedId={selection.categoryId}
            onSelect={(id) => toggleSelection('categoryId', id)}
          />
        )}

        {currentStep === WizardStep.FUNCTIONS && (
          <FunctionsStep
            functions={data?.taxonomyFilterOptions?.functions || []}
            selectedIds={selection.functionIds}
            onToggle={(id) => toggleSelection('functionIds', id)}
          />
        )}

        {currentStep === WizardStep.CONCERNS && (
          <ConcernsStep
            concerns={data?.taxonomyFilterOptions?.concerns || []}
            selectedIds={selection.concernIds}
            onToggle={(id) => toggleSelection('concernIds', id)}
          />
        )}

        {currentStep === WizardStep.TARGET_AREAS && (
          <TargetAreasStep
            targetAreas={data?.taxonomyFilterOptions?.targetAreas || []}
            selectedIds={selection.targetAreaIds}
            onToggle={(id) => toggleSelection('targetAreaIds', id)}
          />
        )}

        {currentStep === WizardStep.PROFESSIONAL_LEVEL && (
          <ProfessionalLevelStep
            selectedLevel={selection.professionalLevel}
            selectedTime={selection.usageTime}
            onSelectLevel={(level) => toggleSelection('professionalLevel', level)}
            onSelectTime={(time) => toggleSelection('usageTime', time)}
          />
        )}

        {currentStep === WizardStep.REVIEW && (
          <ReviewStep
            selection={selection}
            data={data?.taxonomyFilterOptions}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="outline" onClick={isFirstStep ? onCancel : handlePrevious}>
            {isFirstStep ? 'Cancel' : 'Previous'}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed(currentStep, selection)}>
            {isLastStep ? 'Complete' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Helper function to determine if user can proceed
function canProceed(step: WizardStep, selection: TaxonomySelection): boolean {
  switch (step) {
    case WizardStep.CATEGORY:
      return !!selection.categoryId;
    case WizardStep.FUNCTIONS:
      return selection.functionIds.length > 0;
    case WizardStep.CONCERNS:
      return selection.concernIds.length > 0;
    case WizardStep.TARGET_AREAS:
      return selection.targetAreaIds.length > 0;
    case WizardStep.PROFESSIONAL_LEVEL:
      return !!selection.professionalLevel && !!selection.usageTime;
    case WizardStep.REVIEW:
      return true;
    default:
      return false;
  }
}

// Step Components
function CategoryStep({
  categories,
  selectedId,
  onSelect,
}: {
  categories: any[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Select Product Category</h3>
        <p className="text-gray-600 mb-6">
          Choose the category that best describes your product
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category: any) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              p-4 border-2 rounded-lg text-left transition-all
              ${
                selectedId === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="font-medium text-gray-900">{category.name}</div>
            {category.description && (
              <div className="text-sm text-gray-500 mt-1">{category.description}</div>
            )}
            {category.productCount > 0 && (
              <div className="text-xs text-gray-400 mt-2">
                {category.productCount} products
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function FunctionsStep({
  functions,
  selectedIds,
  onToggle,
}: {
  functions: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Select Product Functions</h3>
        <p className="text-gray-600 mb-6">
          Choose all functions that apply to your product (select multiple)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {functions.map((func: any) => {
          const isSelected = selectedIds.includes(func.id);
          return (
            <button
              key={func.id}
              onClick={() => onToggle(func.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{func.name}</div>
                  {func.description && (
                    <div className="text-sm text-gray-500 mt-1">{func.description}</div>
                  )}
                </div>
                {isSelected && (
                  <div className="ml-3 text-blue-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Select all functions that apply. This helps customers
          find your product when searching for specific benefits.
        </p>
      </div>
    </div>
  );
}

function ConcernsStep({
  concerns,
  selectedIds,
  onToggle,
}: {
  concerns: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Select Skin Concerns</h3>
        <p className="text-gray-600 mb-6">
          Choose which skin concerns your product addresses (select multiple)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {concerns.map((concern: any) => {
          const isSelected = selectedIds.includes(concern.id);
          return (
            <button
              key={concern.id}
              onClick={() => onToggle(concern.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{concern.name}</div>
                  {concern.description && (
                    <div className="text-sm text-gray-500 mt-1">{concern.description}</div>
                  )}
                </div>
                {isSelected && (
                  <div className="ml-3 text-blue-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TargetAreasStep({
  targetAreas,
  selectedIds,
  onToggle,
}: {
  targetAreas: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Select Target Areas</h3>
        <p className="text-gray-600 mb-6">
          Choose which body areas this product is designed for (select multiple)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {targetAreas.map((area: any) => {
          const isSelected = selectedIds.includes(area.id);
          return (
            <button
              key={area.id}
              onClick={() => onToggle(area.id)}
              className={`
                p-4 border-2 rounded-lg text-center transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="font-medium text-gray-900">{area.name}</div>
              {isSelected && (
                <div className="mt-2 text-blue-500">
                  <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProfessionalLevelStep({
  selectedLevel,
  selectedTime,
  onSelectLevel,
  onSelectTime,
}: {
  selectedLevel?: string;
  selectedTime?: string;
  onSelectLevel: (level: string) => void;
  onSelectTime: (time: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Professional Level & Usage</h3>
        <p className="text-gray-600 mb-6">
          Specify the professional level and recommended usage time
        </p>
      </div>

      {/* Professional Level */}
      <div>
        <h4 className="font-medium mb-3">Professional Level</h4>
        <div className="space-y-3">
          {PROFESSIONAL_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`
                w-full p-4 border-2 rounded-lg text-left transition-all
                ${
                  selectedLevel === level.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="font-medium text-gray-900">{level.name}</div>
              <div className="text-sm text-gray-500 mt-1">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Usage Time */}
      <div>
        <h4 className="font-medium mb-3">Recommended Usage Time</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {USAGE_TIMES.map((time) => (
            <button
              key={time.id}
              onClick={() => onSelectTime(time.id)}
              className={`
                p-4 border-2 rounded-lg text-center transition-all
                ${
                  selectedTime === time.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-2">{time.icon}</div>
              <div className="font-medium text-sm text-gray-900">{time.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  selection,
  data,
}: {
  selection: TaxonomySelection;
  data: any;
}) {
  const category = data?.categories?.find((c: any) => c.id === selection.categoryId);
  const functions = data?.functions?.filter((f: any) =>
    selection.functionIds.includes(f.id)
  );
  const concerns = data?.concerns?.filter((c: any) =>
    selection.concernIds.includes(c.id)
  );
  const targetAreas = data?.targetAreas?.filter((a: any) =>
    selection.targetAreaIds.includes(a.id)
  );
  const professionalLevel = PROFESSIONAL_LEVELS.find(
    (l) => l.id === selection.professionalLevel
  );
  const usageTime = USAGE_TIMES.find((t) => t.id === selection.usageTime);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Review Your Selections</h3>
        <p className="text-gray-600 mb-6">
          Please review your taxonomy selections before completing
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Category</h4>
          <p className="text-gray-900">{category?.name || 'Not selected'}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Functions ({functions?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            {functions?.map((func: any) => (
              <span
                key={func.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {func.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Skin Concerns ({concerns?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            {concerns?.map((concern: any) => (
              <span
                key={concern.id}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {concern.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Target Areas ({targetAreas?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            {targetAreas?.map((area: any) => (
              <span
                key={area.id}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                {area.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Professional Level</h4>
          <p className="text-gray-900">{professionalLevel?.name || 'Not selected'}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Usage Time</h4>
          <p className="text-gray-900">{usageTime?.name || 'Not selected'}</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          ✓ Your product taxonomy is complete! Click "Complete" to apply these selections.
        </p>
      </div>
    </div>
  );
}
