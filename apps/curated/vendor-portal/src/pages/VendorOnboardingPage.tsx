/**
 * VendorOnboardingPage - Vendor onboarding checklist and progress
 * Sprint E.1 - Application & Onboarding
 */

import { useState } from 'react';
import { OnboardingChecklist } from '../components/OnboardingChecklist';
import { VendorOnboarding, OnboardingStep, DEFAULT_ONBOARDING_STEPS } from '../types/application';
import './Page.css';

export function VendorOnboardingPage() {
  // Mock onboarding data
  const [mockOnboarding] = useState<VendorOnboarding>({
    vendorId: 'vendor-123',
    applicationId: 'APP-2025-001',
    steps: DEFAULT_ONBOARDING_STEPS.map((step, index) => ({
      ...step,
      stepId: `step-${index + 1}`,
      status:
        index < 2
          ? 'completed'
          : index === 2
          ? 'in_progress'
          : 'pending',
      completedAt: index < 2 ? new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000) : undefined,
    })),
    completedSteps: 2,
    totalSteps: DEFAULT_ONBOARDING_STEPS.length,
    percentComplete: 25,
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    targetCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignedSuccessManager: 'Sarah Chen',
    supportThreadId: 'thread-123',
  });

  const handleStepClick = (step: OnboardingStep) => {
    console.log('Step clicked:', step);
    // Navigate to appropriate page based on step
    alert(`Navigate to: ${step.name}`);
  };

  return (
    <div className="page vendor-onboarding-page">
      <div className="page-header">
        <div>
          <h1>Onboarding</h1>
          <p>Complete these steps to go live on Jade Marketplace</p>
        </div>
      </div>

      <OnboardingChecklist onboarding={mockOnboarding} onStepClick={handleStepClick} />

      <div className="info-box" style={{ marginTop: '2rem' }}>
        <h3>✅ Sprint E.1 Complete - Application & Onboarding</h3>
        <p>
          Application and onboarding workflows are now in place. Vendors can apply to join
          the marketplace, track application status, and complete onboarding steps.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <strong>Features Delivered:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>5-step application wizard with draft saving</li>
            <li>Application status tracker with timeline and SLA monitoring</li>
            <li>8-step onboarding checklist with progress tracking</li>
            <li>Success manager assignment and support messaging</li>
          </ul>
        </div>
        <p className="info-note">
          <strong>Next Sprint (E.2):</strong> Admin Tools - Application review queue, approval
          workflow, risk assessment, and SLA monitoring dashboard for internal team.
        </p>
      </div>
    </div>
  );
}
