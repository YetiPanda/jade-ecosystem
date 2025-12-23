/**
 * VendorApplicationPage - Application wizard and status tracking
 * Sprint E.1 - Application & Onboarding
 */

import { useState } from 'react';
import { ApplicationForm } from '../components/ApplicationForm';
import { ApplicationStatusTracker } from '../components/ApplicationStatusTracker';
import {
  ApplicationFormData,
  VendorApplication,
  ApplicationStatus,
  ContactInfo,
  CompanyInfo,
  ProductInfo,
} from '../types/application';
import './Page.css';

export function VendorApplicationPage() {
  // Mock: Check if user has an existing application
  const [hasApplication] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock existing application (for demo)
  const mockApplication: VendorApplication = {
    applicationId: 'APP-2025-001',
    contactInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '555-0123',
      role: 'Founder',
    } as ContactInfo,
    companyInfo: {
      brandName: 'GlowNaturals',
      legalName: 'GlowNaturals Inc.',
      website: 'https://glownaturals.com',
      yearFounded: 2020,
      headquarters: 'San Francisco, CA',
      employeeCount: '11-50',
      annualRevenue: '$1M - $5M',
    } as CompanyInfo,
    productInfo: {
      productCategories: ['Facial Skincare', 'Body Care'],
      skuCount: '11-50',
      priceRange: '$$',
      minimumOrderValue: 250,
      leadTime: '3-5 business days',
      targetMarket: ['Day Spas', 'Med Spas'],
      currentDistribution: ['Direct to Consumer', 'Retail Stores'],
    } as ProductInfo,
    values: [],
    certifications: [],
    whyJade: 'We believe Jade is the perfect platform to reach wellness-focused spas.',
    documents: {},
    status: ApplicationStatus.UNDER_REVIEW,
    reviewNotes: [
      {
        reviewerId: 'rev-1',
        reviewerName: 'Sarah Chen',
        note: 'Product line looks promising. Would like to see more detail on the organic certification process.',
        category: 'quality',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
    riskScore: 25,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reviewStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  };

  const handleSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Application submitted:', data);
    setIsSubmitting(false);
    alert('Application submitted successfully! Our team will review it within 3 business days.');
  };

  const handleSaveDraft = async (data: ApplicationFormData) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Draft saved:', data);
    alert('Draft saved successfully!');
  };

  return (
    <div className="page vendor-application-page">
      <div className="page-header">
        <div>
          <h1>Vendor Application</h1>
          <p>
            {hasApplication
              ? 'Track your application status'
              : 'Apply to join the Jade Marketplace'}
          </p>
        </div>
      </div>

      {hasApplication ? (
        <ApplicationStatusTracker application={mockApplication} />
      ) : (
        <>
          <div className="info-box" style={{ marginBottom: '2rem' }}>
            <h3>Welcome to Jade! 👋</h3>
            <p>
              We're excited that you're interested in joining our curated marketplace for
              spa and wellness products. Our application process helps us ensure every
              vendor aligns with our quality standards and values.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <strong>What to expect:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>5-step application form (~15 minutes)</li>
                <li>Review within 3 business days</li>
                <li>Personalized onboarding if approved</li>
                <li>Go live and start receiving orders within 2 weeks</li>
              </ul>
            </div>
          </div>

          <ApplicationForm
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  );
}
