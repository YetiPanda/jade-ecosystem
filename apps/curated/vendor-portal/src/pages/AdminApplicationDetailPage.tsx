/**
 * AdminApplicationDetailPage - Detailed application review interface
 * Sprint E.2 - Admin Tools
 */

import { useState } from 'react';
import { ApplicationStatusTracker } from '../components/ApplicationStatusTracker';
import { RiskAssessmentCard } from '../components/RiskAssessmentCard';
import { ApprovalActionsPanel } from '../components/ApprovalActionsPanel';
import {
  VendorApplication,
  ApplicationStatus,
  ContactInfo,
  CompanyInfo,
  ProductInfo,
} from '../types/application';
import { calculateRiskAssessment, ApprovalDecision } from '../types/admin';
import './Page.css';

export function AdminApplicationDetailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock application data
  const mockApplication: VendorApplication = {
    applicationId: 'APP-2025-001',
    contactInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@glownaturals.com',
      phone: '555-0123',
      role: 'Founder & CEO',
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
    whyJade: 'We believe Jade is the perfect platform to reach wellness-focused spas who value natural, sustainable skincare products.',
    documents: {
      productCatalog: 'https://example.com/catalog.pdf',
      lineSheet: 'https://example.com/linesheet.pdf',
    },
    status: ApplicationStatus.UNDER_REVIEW,
    reviewNotes: [],
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reviewStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  };

  const riskAssessment = calculateRiskAssessment(mockApplication);

  const handleApprovalSubmit = async (decision: ApprovalDecision) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Approval decision:', decision);
    setIsSubmitting(false);
    alert(`Application ${decision.decision.replace(/_/g, ' ')}!`);
  };

  return (
    <div className="page admin-application-detail-page">
      <div className="page-header">
        <div>
          <h1>Application Review</h1>
          <p>Review application details and make approval decision</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ApplicationStatusTracker application={mockApplication} />
          <ApprovalActionsPanel
            applicationId={mockApplication.applicationId}
            onSubmit={handleApprovalSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Sidebar */}
        <div>
          <RiskAssessmentCard assessment={riskAssessment} />
        </div>
      </div>

      <div className="info-box" style={{ marginTop: '2rem' }}>
        <h3>✅ Sprint E.2 In Progress - Admin Tools</h3>
        <p>
          Admin application review interface with risk assessment and approval workflow.
        </p>
      </div>
    </div>
  );
}
