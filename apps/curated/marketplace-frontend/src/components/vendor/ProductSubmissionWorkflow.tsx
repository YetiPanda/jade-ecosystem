/**
 * Product Submission Workflow Component
 * Week 4 Day 4: Multi-step product submission with guided taxonomy selection
 */

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TaxonomyWizard } from './TaxonomyWizard';
import { ValidationPanel } from './ValidationPanel';
import { SubmissionConfirmation } from './SubmissionConfirmation';
import {
  validateProductSubmission,
  type ValidationResult,
} from '../../utils/productValidation';
import { CREATE_PRODUCT_SUBMISSION } from '../../graphql/vendor.mutations';

// Submission steps
enum SubmissionStep {
  PRODUCT_INFO = 'product_info',
  TAXONOMY = 'taxonomy',
  INGREDIENTS = 'ingredients',
  USAGE = 'usage',
  REVIEW = 'review',
}

interface ProductSubmissionData {
  // Product Info
  productName: string;
  brandName: string;
  description: string;
  price: number;

  // Taxonomy
  categoryId?: string;
  functionIds: string[];
  concernIds: string[];
  targetAreaIds: string[];

  // Ingredients
  ingredients: string[];
  keyActives: Array<{ name: string; concentration: number }>;

  // Usage
  usageInstructions: string;
  frequency: string;
  timeOfDay: string;
  warnings: string[];

  // Training
  trainingCompleted: boolean;
}

const STEPS = [
  { id: SubmissionStep.PRODUCT_INFO, label: 'Product Info', icon: '📦' },
  { id: SubmissionStep.TAXONOMY, label: 'Taxonomy', icon: '🏷️' },
  { id: SubmissionStep.INGREDIENTS, label: 'Ingredients', icon: '🧪' },
  { id: SubmissionStep.USAGE, label: 'Usage', icon: '📋' },
  { id: SubmissionStep.REVIEW, label: 'Review', icon: '✅' },
];

export function ProductSubmissionWorkflow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SubmissionStep>(
    SubmissionStep.PRODUCT_INFO
  );
  const [formData, setFormData] = useState<ProductSubmissionData>({
    productName: '',
    brandName: '',
    description: '',
    price: 0,
    functionIds: [],
    concernIds: [],
    targetAreaIds: [],
    ingredients: [],
    keyActives: [],
    usageInstructions: '',
    frequency: '',
    timeOfDay: '',
    warnings: [],
    trainingCompleted: false,
  });
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [createProductSubmission, { loading: submitting }] = useMutation(
    CREATE_PRODUCT_SUBMISSION,
    {
      onCompleted: (data) => {
        console.log('Product submitted successfully:', data);
        setSubmissionData(data.createProductSubmission);
        setShowConfirmation(true);
      },
      onError: (error) => {
        console.error('Submission error:', error);
        setSubmitError(error.message);
      },
    }
  );

  // Run validation whenever form data changes
  useEffect(() => {
    const result = validateProductSubmission(formData);
    setValidation(result);
  }, [formData]);

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    if (!validation?.isValid) {
      setSubmitError('Please fix all validation errors before submitting.');
      return;
    }

    try {
      setSubmitError(null);
      await createProductSubmission({
        variables: {
          input: {
            productName: formData.productName,
            brandName: formData.brandName,
            description: formData.description,
            price: formData.price,
            categoryId: formData.categoryId,
            functionIds: formData.functionIds,
            concernIds: formData.concernIds,
            targetAreaIds: formData.targetAreaIds,
            ingredients: formData.ingredients,
            keyActives: formData.keyActives,
            usageInstructions: formData.usageInstructions,
            frequency: formData.frequency,
            timeOfDay: formData.timeOfDay,
            warnings: formData.warnings,
            trainingCompleted: formData.trainingCompleted,
          },
        },
      });
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const updateFormData = (updates: Partial<ProductSubmissionData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleViewSubmission = () => {
    navigate('/app/vendor/dashboard');
  };

  const handleReturnToDashboard = () => {
    navigate('/app/vendor/dashboard');
  };

  const handleSubmitAnother = () => {
    // Reset form and show first step
    setShowConfirmation(false);
    setSubmissionData(null);
    setFormData({
      productName: '',
      brandName: '',
      description: '',
      price: 0,
      functionIds: [],
      concernIds: [],
      targetAreaIds: [],
      ingredients: [],
      keyActives: [],
      usageInstructions: '',
      frequency: '',
      timeOfDay: '',
      warnings: [],
      trainingCompleted: false,
    });
    setCurrentStep(SubmissionStep.PRODUCT_INFO);
  };

  // Show confirmation UI after successful submission
  if (showConfirmation && submissionData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SubmissionConfirmation
          submissionId={submissionData.id}
          productName={formData.productName}
          submissionStatus={submissionData.submissionStatus}
          taxonomyScore={submissionData.taxonomyCompletenessScore}
          onViewSubmission={handleViewSubmission}
          onReturnToDashboard={handleReturnToDashboard}
          onSubmitAnother={handleSubmitAnother}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-2xl
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
                      mt-2 text-sm font-medium
                      ${isActive ? 'text-blue-600' : 'text-gray-600'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
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
        {currentStep === SubmissionStep.PRODUCT_INFO && (
          <ProductInfoStep formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === SubmissionStep.TAXONOMY && (
          <TaxonomyStep formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === SubmissionStep.INGREDIENTS && (
          <IngredientsStep formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === SubmissionStep.USAGE && (
          <UsageStep formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === SubmissionStep.REVIEW && (
          <ReviewStep formData={formData} validation={validation} />
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{submitError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep || submitting}
          >
            Previous
          </Button>
          {!isLastStep ? (
            <Button onClick={handleNext} disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!validation?.isValid || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

// Step Components
function ProductInfoStep({
  formData,
  updateFormData,
}: {
  formData: ProductSubmissionData;
  updateFormData: (updates: Partial<ProductSubmissionData>) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Product Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <Input
          value={formData.productName}
          onChange={(e) => updateFormData({ productName: e.target.value })}
          placeholder="e.g., Advanced Retinol Serum"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Brand Name</label>
        <Input
          value={formData.brandName}
          onChange={(e) => updateFormData({ brandName: e.target.value })}
          placeholder="e.g., Premium Skincare Co"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Detailed product description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Wholesale Price ($)</label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => updateFormData({ price: parseFloat(e.target.value) })}
          placeholder="0.00"
        />
      </div>
    </div>
  );
}

function TaxonomyStep({
  formData,
  updateFormData,
}: {
  formData: ProductSubmissionData;
  updateFormData: (updates: Partial<ProductSubmissionData>) => void;
}) {
  const [showWizard, setShowWizard] = useState(false);
  const hasTaxonomy =
    formData.categoryId ||
    formData.functionIds.length > 0 ||
    formData.concernIds.length > 0;

  const handleComplete = (selection: any) => {
    updateFormData({
      categoryId: selection.categoryId,
      functionIds: selection.functionIds,
      concernIds: selection.concernIds,
      targetAreaIds: selection.targetAreaIds,
    });
    setShowWizard(false);
  };

  if (showWizard) {
    return (
      <div className="space-y-6">
        <TaxonomyWizard
          onComplete={handleComplete}
          onCancel={() => setShowWizard(false)}
          initialSelection={{
            categoryId: formData.categoryId,
            functionIds: formData.functionIds,
            concernIds: formData.concernIds,
            targetAreaIds: formData.targetAreaIds,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Product Taxonomy</h2>
      <p className="text-gray-600 mb-6">
        Accurate taxonomy helps customers find your products. We'll guide you through
        selecting the right categories, functions, and concerns.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> The guided taxonomy wizard will help you make the
          right selections based on your product type and ingredients.
        </p>
      </div>

      {hasTaxonomy ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-2">
              ✓ Taxonomy selections complete
            </p>
            <div className="text-sm text-green-700">
              <p>
                {formData.functionIds.length} functions, {formData.concernIds.length}{' '}
                concerns, {formData.targetAreaIds.length} target areas
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowWizard(true)} variant="outline">
              Edit Taxonomy
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            Use the guided wizard to select your product's taxonomy
          </p>
          <Button onClick={() => setShowWizard(true)}>Launch Taxonomy Wizard</Button>
        </div>
      )}
    </div>
  );
}

function IngredientsStep({
  formData,
  updateFormData,
}: {
  formData: ProductSubmissionData;
  updateFormData: (updates: Partial<ProductSubmissionData>) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          INCI Ingredient List
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={6}
          placeholder="Enter ingredients in INCI order (one per line)"
        />
        <p className="text-sm text-gray-500 mt-1">
          List all ingredients in order of concentration
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Key Active Ingredients
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Ingredient name" className="flex-1" />
            <Input
              type="number"
              placeholder="% Concentration"
              className="w-32"
            />
            <Button variant="outline">Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageStep({
  formData,
  updateFormData,
}: {
  formData: ProductSubmissionData;
  updateFormData: (updates: Partial<ProductSubmissionData>) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Usage Instructions</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Application Instructions
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
          value={formData.usageInstructions}
          onChange={(e) =>
            updateFormData({ usageInstructions: e.target.value })
          }
          placeholder="Describe how to apply the product..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Frequency</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={formData.frequency}
          onChange={(e) => updateFormData({ frequency: e.target.value })}
        >
          <option value="">Select frequency</option>
          <option value="once_daily">Once Daily</option>
          <option value="twice_daily">Twice Daily</option>
          <option value="as_needed">As Needed</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Time of Day</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={formData.timeOfDay}
          onChange={(e) => updateFormData({ timeOfDay: e.target.value })}
        >
          <option value="">Select time</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="both">Both AM/PM</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Warnings & Precautions
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          placeholder="Enter any warnings or precautions..."
        />
      </div>
    </div>
  );
}

function ReviewStep({
  formData,
  validation,
}: {
  formData: ProductSubmissionData;
  validation: ValidationResult | null;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>

      {/* Validation Panel */}
      {validation && (
        <div className="mb-6">
          <ValidationPanel validation={validation} showDetails={true} />
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Product Information</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex">
              <dt className="w-32 text-gray-600">Product Name:</dt>
              <dd className="font-medium">{formData.productName || '—'}</dd>
            </div>
            <div className="flex">
              <dt className="w-32 text-gray-600">Brand:</dt>
              <dd className="font-medium">{formData.brandName || '—'}</dd>
            </div>
            <div className="flex">
              <dt className="w-32 text-gray-600">Price:</dt>
              <dd className="font-medium">${formData.price.toFixed(2)}</dd>
            </div>
            <div className="flex">
              <dt className="w-32 text-gray-600">Functions:</dt>
              <dd className="font-medium">{formData.functionIds.length} selected</dd>
            </div>
            <div className="flex">
              <dt className="w-32 text-gray-600">Concerns:</dt>
              <dd className="font-medium">{formData.concernIds.length} selected</dd>
            </div>
            <div className="flex">
              <dt className="w-32 text-gray-600">Target Areas:</dt>
              <dd className="font-medium">{formData.targetAreaIds.length} selected</dd>
            </div>
          </dl>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Before Submitting</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>All required fields are complete</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Product images meet quality standards</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Ingredient list is accurate and complete</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Usage instructions are clear</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 After submission, your product will be reviewed by our team. You'll
            receive an email notification once the review is complete.
          </p>
        </div>
      </div>
    </div>
  );
}
