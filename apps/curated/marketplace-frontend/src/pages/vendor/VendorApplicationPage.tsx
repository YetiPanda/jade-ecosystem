/**
 * Vendor Application Page
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.1)
 *
 * Multi-step wizard for vendors to apply to the JADE marketplace.
 * Supports the marketing claim: "~3 Day Application Review"
 *
 * Steps:
 * 1. Contact Information
 * 2. Company Information
 * 3. Product Information
 * 4. Values & Certifications
 * 5. Review & Submit
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ContactInfoStep } from '../../components/vendor/application/ContactInfoStep';
import { CompanyInfoStep } from '../../components/vendor/application/CompanyInfoStep';
import { ProductInfoStep } from '../../components/vendor/application/ProductInfoStep';
import { ValuesStep } from '../../components/vendor/application/ValuesStep';
import { ReviewStep } from '../../components/vendor/application/ReviewStep';
import { useSubmitVendorApplicationMutation } from '../../graphql/generated';

export interface ApplicationFormData {
  // Contact Info
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;

  // Company Info
  brandName: string;
  legalName: string;
  website: string;
  yearFounded: number | null;
  headquarters: string;
  employeeCount: string;
  annualRevenue: string;

  // Product Info
  productCategories: string[];
  skuCount: string;
  priceRange: string;
  targetMarket: string[];
  currentDistribution: string[];

  // Values & Certifications
  values: string[];
  certifications: string[];

  // Why Jade
  whyJade: string;

  // Documents (optional)
  productCatalogUrl: string;
  lineSheetUrl: string;
  insuranceCertificateUrl: string;
  businessLicenseUrl: string;
}

const INITIAL_FORM_DATA: ApplicationFormData = {
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  contactRole: '',
  brandName: '',
  legalName: '',
  website: '',
  yearFounded: null,
  headquarters: '',
  employeeCount: '',
  annualRevenue: '',
  productCategories: [],
  skuCount: '',
  priceRange: '',
  targetMarket: [],
  currentDistribution: [],
  values: [],
  certifications: [],
  whyJade: '',
  productCatalogUrl: '',
  lineSheetUrl: '',
  insuranceCertificateUrl: '',
  businessLicenseUrl: '',
};

const STEPS = [
  { id: 1, name: 'Contact', label: 'Contact Information' },
  { id: 2, name: 'Company', label: 'Company Information' },
  { id: 3, name: 'Products', label: 'Product Information' },
  { id: 4, name: 'Values', label: 'Values & Certifications' },
  { id: 5, name: 'Review', label: 'Review & Submit' },
];

export function VendorApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitApplication] = useSubmitVendorApplicationMutation();

  const updateFormData = (updates: Partial<ApplicationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert formData to match GraphQL input type
      const input = {
        contactFirstName: formData.contactFirstName,
        contactLastName: formData.contactLastName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || null,
        contactRole: formData.contactRole,
        brandName: formData.brandName,
        legalName: formData.legalName,
        website: formData.website,
        yearFounded: formData.yearFounded || new Date().getFullYear(),
        headquarters: formData.headquarters,
        employeeCount: formData.employeeCount,
        annualRevenue: formData.annualRevenue || null,
        productCategories: formData.productCategories,
        skuCount: formData.skuCount,
        priceRange: formData.priceRange,
        targetMarket: formData.targetMarket,
        currentDistribution: formData.currentDistribution,
        values: formData.values,
        certifications: formData.certifications,
        whyJade: formData.whyJade,
        productCatalogUrl: formData.productCatalogUrl || null,
        lineSheetUrl: formData.lineSheetUrl || null,
        insuranceCertificateUrl: formData.insuranceCertificateUrl || null,
        businessLicenseUrl: formData.businessLicenseUrl || null,
      };

      const result = await submitApplication({
        variables: { input },
      });

      if (result.data?.submitVendorApplication.success) {
        const applicationId = result.data.submitVendorApplication.application?.id;
        console.log('Application submitted successfully:', applicationId);

        // Navigate to application status page with the application ID
        navigate(`/app/vendor/application/status?id=${applicationId}`);
      } else {
        const errors = result.data?.submitVendorApplication.errors || [];
        const errorMessage = errors.map(e => e.message).join(', ') || 'Unknown error';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <CompanyInfoStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <ProductInfoStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ValuesStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewStep formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.contactFirstName && formData.contactLastName && formData.contactEmail && formData.contactRole;
      case 2:
        return formData.brandName && formData.legalName && formData.website && formData.yearFounded && formData.headquarters && formData.employeeCount;
      case 3:
        return formData.productCategories.length > 0 && formData.skuCount && formData.priceRange && formData.targetMarket.length > 0;
      case 4:
        return formData.values.length >= 3 && formData.whyJade.length >= 100;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌿 JADE</h1>
          <p className="text-xl text-gray-600">Curated Marketplace</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-6">Vendor Application</h2>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                      currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : currentStep === step.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-2 font-medium',
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={cn(
                        'h-1 rounded transition-colors',
                        currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Step {currentStep}: {STEPS[currentStep - 1].label}
          </h3>
          <div className="border-t border-gray-200 pt-6">
            {renderStep()}
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2',
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2',
                canProceed()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
