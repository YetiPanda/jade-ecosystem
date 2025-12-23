/**
 * ApplicationForm - Multi-step vendor application wizard
 * Sprint E.1 - Application & Onboarding
 */

import { useState } from 'react';
import {
  ApplicationFormData,
  ContactInfo,
  CompanyInfo,
  ProductInfo,
} from '../types/application';
import { VendorValue, CertificationType } from '../types/profile';
import './ApplicationForm.css';

interface ApplicationFormProps {
  initialData?: Partial<ApplicationFormData>;
  onSubmit: (data: ApplicationFormData) => void;
  onSaveDraft: (data: ApplicationFormData) => void;
  isSubmitting?: boolean;
}

export function ApplicationForm({
  initialData,
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
}: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    contactInfo: initialData?.contactInfo || {},
    companyInfo: initialData?.companyInfo || {},
    productInfo: initialData?.productInfo || {
      productCategories: [],
      targetMarket: [],
      currentDistribution: [],
    },
    values: initialData?.values || [],
    certifications: initialData?.certifications || [],
    whyJade: initialData?.whyJade || '',
    documents: initialData?.documents || {},
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const updateContactInfo = (updates: Partial<ContactInfo>) => {
    setFormData({
      ...formData,
      contactInfo: { ...formData.contactInfo, ...updates },
    });
  };

  const updateCompanyInfo = (updates: Partial<CompanyInfo>) => {
    setFormData({
      ...formData,
      companyInfo: { ...formData.companyInfo, ...updates },
    });
  };

  const updateProductInfo = (updates: Partial<ProductInfo>) => {
    setFormData({
      ...formData,
      productInfo: { ...formData.productInfo, ...updates },
    });
  };

  return (
    <div className="application-form">
      {/* Progress Bar */}
      <div className="form-progress">
        <div className="progress-steps">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`progress-step ${step === currentStep ? 'active' : ''} ${
                step < currentStep ? 'completed' : ''
              }`}
            >
              <div className="step-circle">
                {step < currentStep ? '✓' : step}
              </div>
              <div className="step-label">
                {step === 1 && 'Contact'}
                {step === 2 && 'Company'}
                {step === 3 && 'Products'}
                {step === 4 && 'Values'}
                {step === 5 && 'Review'}
              </div>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Contact Information</h2>
            <p className="step-description">
              Who should we contact about this application?
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.contactInfo.firstName || ''}
                  onChange={(e) => updateContactInfo({ firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.contactInfo.lastName || ''}
                  onChange={(e) => updateContactInfo({ lastName: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.contactInfo.email || ''}
                  onChange={(e) => updateContactInfo({ email: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.contactInfo.phone || ''}
                  onChange={(e) => updateContactInfo({ phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="role">
                  Your Role <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  placeholder="e.g., Founder, Sales Director, Brand Manager"
                  value={formData.contactInfo.role || ''}
                  onChange={(e) => updateContactInfo({ role: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Company Information</h2>
            <p className="step-description">Tell us about your company</p>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="brandName">
                  Brand Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={formData.companyInfo.brandName || ''}
                  onChange={(e) => updateCompanyInfo({ brandName: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="legalName">
                  Legal Company Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="legalName"
                  value={formData.companyInfo.legalName || ''}
                  onChange={(e) => updateCompanyInfo({ legalName: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="website">
                  Website <span className="required">*</span>
                </label>
                <input
                  type="url"
                  id="website"
                  placeholder="https://"
                  value={formData.companyInfo.website || ''}
                  onChange={(e) => updateCompanyInfo({ website: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="yearFounded">
                  Year Founded <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="yearFounded"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.companyInfo.yearFounded || ''}
                  onChange={(e) =>
                    updateCompanyInfo({ yearFounded: parseInt(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="headquarters">
                  Headquarters Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="headquarters"
                  placeholder="City, State/Country"
                  value={formData.companyInfo.headquarters || ''}
                  onChange={(e) => updateCompanyInfo({ headquarters: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="employeeCount">
                  Employee Count <span className="required">*</span>
                </label>
                <select
                  id="employeeCount"
                  value={formData.companyInfo.employeeCount || ''}
                  onChange={(e) => updateCompanyInfo({ employeeCount: e.target.value })}
                  required
                >
                  <option value="">Select range</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="annualRevenue">Annual Revenue (Optional)</label>
                <select
                  id="annualRevenue"
                  value={formData.companyInfo.annualRevenue || ''}
                  onChange={(e) => updateCompanyInfo({ annualRevenue: e.target.value })}
                >
                  <option value="">Prefer not to say</option>
                  <option value="< $1M">Less than $1M</option>
                  <option value="$1M - $5M">$1M - $5M</option>
                  <option value="$5M - $10M">$5M - $10M</option>
                  <option value="$10M - $50M">$10M - $50M</option>
                  <option value="$50M+">$50M+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Product Information */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Product Information</h2>
            <p className="step-description">Tell us about your product line</p>

            <div className="form-grid">
              <div className="form-field full-width">
                <label>
                  Product Categories <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {[
                    'Facial Skincare',
                    'Body Care',
                    'Hair Care',
                    'Spa Treatment Products',
                    'Aromatherapy',
                    'Makeup',
                    'Tools & Accessories',
                  ].map((category) => (
                    <label key={category} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.productInfo.productCategories?.includes(category)}
                        onChange={(e) => {
                          const categories = formData.productInfo.productCategories || [];
                          if (e.target.checked) {
                            updateProductInfo({
                              productCategories: [...categories, category],
                            });
                          } else {
                            updateProductInfo({
                              productCategories: categories.filter((c) => c !== category),
                            });
                          }
                        }}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="skuCount">
                  SKU Count <span className="required">*</span>
                </label>
                <select
                  id="skuCount"
                  value={formData.productInfo.skuCount || ''}
                  onChange={(e) => updateProductInfo({ skuCount: e.target.value })}
                  required
                >
                  <option value="">Select range</option>
                  <option value="1-10">1-10 SKUs</option>
                  <option value="11-50">11-50 SKUs</option>
                  <option value="51-100">51-100 SKUs</option>
                  <option value="100+">100+ SKUs</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="priceRange">
                  Price Range <span className="required">*</span>
                </label>
                <select
                  id="priceRange"
                  value={formData.productInfo.priceRange || ''}
                  onChange={(e) => updateProductInfo({ priceRange: e.target.value })}
                  required
                >
                  <option value="">Select range</option>
                  <option value="$">$ (Budget-friendly)</option>
                  <option value="$$">$$ (Mid-range)</option>
                  <option value="$$$">$$$ (Premium)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="minimumOrderValue">
                  Minimum Order Value <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="minimumOrderValue"
                  placeholder="$"
                  value={formData.productInfo.minimumOrderValue || ''}
                  onChange={(e) =>
                    updateProductInfo({ minimumOrderValue: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="leadTime">
                  Lead Time (Days) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="leadTime"
                  placeholder="e.g., 3-5 business days"
                  value={formData.productInfo.leadTime || ''}
                  onChange={(e) => updateProductInfo({ leadTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-field full-width">
                <label>
                  Target Market <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {[
                    'Day Spas',
                    'Med Spas',
                    'Wellness Centers',
                    'Hotel Spas',
                    'Resort Spas',
                  ].map((market) => (
                    <label key={market} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.productInfo.targetMarket?.includes(market)}
                        onChange={(e) => {
                          const markets = formData.productInfo.targetMarket || [];
                          if (e.target.checked) {
                            updateProductInfo({ targetMarket: [...markets, market] });
                          } else {
                            updateProductInfo({
                              targetMarket: markets.filter((m) => m !== market),
                            });
                          }
                        }}
                      />
                      {market}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field full-width">
                <label>Current Distribution Channels</label>
                <div className="checkbox-group">
                  {[
                    'Direct to Consumer',
                    'Retail Stores',
                    'Online Marketplaces',
                    'Spa Distributors',
                    'None (New Business)',
                  ].map((channel) => (
                    <label key={channel} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.productInfo.currentDistribution?.includes(
                          channel
                        )}
                        onChange={(e) => {
                          const channels = formData.productInfo.currentDistribution || [];
                          if (e.target.checked) {
                            updateProductInfo({
                              currentDistribution: [...channels, channel],
                            });
                          } else {
                            updateProductInfo({
                              currentDistribution: channels.filter((c) => c !== channel),
                            });
                          }
                        }}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Values & Certifications */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Values & Certifications</h2>
            <p className="step-description">
              Select the values and certifications that apply to your brand
            </p>

            <div className="form-section">
              <h3>Brand Values</h3>
              <div className="checkbox-group">
                {Object.values(VendorValue).map((value) => (
                  <label key={value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.values.includes(value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            values: [...formData.values, value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            values: formData.values.filter((v) => v !== value),
                          });
                        }
                      }}
                    />
                    {value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Certifications</h3>
              <div className="checkbox-group">
                {Object.values(CertificationType).map((cert) => (
                  <label key={cert} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            certifications: [...formData.certifications, cert],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            certifications: formData.certifications.filter(
                              (c) => c !== cert
                            ),
                          });
                        }
                      }}
                    />
                    {cert.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-field full-width">
              <label htmlFor="whyJade">
                Why do you want to join Jade Marketplace? <span className="required">*</span>
              </label>
              <textarea
                id="whyJade"
                rows={5}
                placeholder="Tell us about your brand's mission and why Jade is the right fit..."
                value={formData.whyJade}
                onChange={(e) => setFormData({ ...formData, whyJade: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="form-step">
            <h2>Review & Submit</h2>
            <p className="step-description">
              Please review your application before submitting
            </p>

            <div className="review-section">
              <h3>Contact Information</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Name:</span>
                  <span className="review-value">
                    {formData.contactInfo.firstName} {formData.contactInfo.lastName}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span className="review-value">{formData.contactInfo.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Phone:</span>
                  <span className="review-value">{formData.contactInfo.phone}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Role:</span>
                  <span className="review-value">{formData.contactInfo.role}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Company Information</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Brand Name:</span>
                  <span className="review-value">{formData.companyInfo.brandName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Legal Name:</span>
                  <span className="review-value">{formData.companyInfo.legalName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Website:</span>
                  <span className="review-value">{formData.companyInfo.website}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Year Founded:</span>
                  <span className="review-value">{formData.companyInfo.yearFounded}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Product Information</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Categories:</span>
                  <span className="review-value">
                    {formData.productInfo.productCategories?.join(', ')}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">SKU Count:</span>
                  <span className="review-value">{formData.productInfo.skuCount}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Price Range:</span>
                  <span className="review-value">{formData.productInfo.priceRange}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Values & Certifications</h3>
              <div className="review-item">
                <span className="review-label">Values Selected:</span>
                <span className="review-value">{formData.values.length} values</span>
              </div>
              <div className="review-item">
                <span className="review-label">Certifications:</span>
                <span className="review-value">
                  {formData.certifications.length} certifications
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="form-navigation">
        <div className="nav-left">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              ← Previous
            </button>
          )}
        </div>

        <div className="nav-center">
          <button
            type="button"
            className="btn-ghost"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            💾 Save Draft
          </button>
        </div>

        <div className="nav-right">
          {currentStep < totalSteps ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : '✓ Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
