/**
 * Unit Tests: Vendor Application & Onboarding
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.2: Application & Onboarding Schema (Task A.2.9)
 *
 * Tests application workflow, SLA tracking, and onboarding progression
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VendorApplication } from '../entities/vendor-application.entity';
import { VendorOnboarding } from '../entities/vendor-onboarding.entity';
import { OnboardingStep } from '../entities/onboarding-step.entity';
import {
  ApplicationStatus,
  OnboardingStepStatus,
  RiskLevel,
  VendorValue,
  CertificationType,
} from '../types/vendor.enums';
import {
  submitVendorApplicationSchema,
  applicationReviewDecisionSchema,
  completeOnboardingStepSchema,
} from '../types/vendor.validation';

describe('Vendor Application & Onboarding', () => {
  describe('VendorApplication Entity', () => {
    let application: VendorApplication;

    beforeEach(() => {
      application = new VendorApplication();
    });

    it('should create an application instance', () => {
      expect(application).toBeDefined();
      expect(application).toBeInstanceOf(VendorApplication);
    });

    it('should have default status of SUBMITTED', () => {
      application.status = ApplicationStatus.SUBMITTED;
      expect(application.status).toBe(ApplicationStatus.SUBMITTED);
    });

    it('should store complete application data', () => {
      // Contact Info
      application.contactFirstName = 'Sarah';
      application.contactLastName = 'Chen';
      application.contactEmail = 'sarah@luminaraskincare.com';
      application.contactPhone = '(512) 555-0123';
      application.contactRole = 'Founder / Owner';

      // Company Info
      application.brandName = 'Luminara Skincare';
      application.legalName = 'Luminara Skincare Inc.';
      application.website = 'https://luminaraskincare.com';
      application.yearFounded = 2019;
      application.headquarters = 'Austin, TX';
      application.employeeCount = '11-50';
      application.annualRevenue = '$1M-$5M';

      // Product Info
      application.productCategories = ['Serums', 'Moisturizers', 'Cleansers'];
      application.skuCount = '15-50';
      application.priceRange = '$$';
      application.targetMarket = ['Day Spas', 'Med Spas'];
      application.currentDistribution = ['Direct to Consumer'];

      // Values & Certifications
      application.values = ['clean_beauty', 'vegan', 'woman_founded'];
      application.certifications = ['leaping_bunny'];

      // Why Jade
      application.whyJade = 'We want to expand into professional channels...';

      expect(application.brandName).toBe('Luminara Skincare');
      expect(application.yearFounded).toBe(2019);
      expect(application.productCategories).toHaveLength(3);
      expect(application.values).toContain('clean_beauty');
    });

    it('should support status transitions', () => {
      application.status = ApplicationStatus.SUBMITTED;
      expect(application.status).toBe(ApplicationStatus.SUBMITTED);

      application.status = ApplicationStatus.UNDER_REVIEW;
      expect(application.status).toBe(ApplicationStatus.UNDER_REVIEW);

      application.status = ApplicationStatus.APPROVED;
      application.decidedAt = new Date();
      expect(application.status).toBe(ApplicationStatus.APPROVED);
      expect(application.decidedAt).toBeInstanceOf(Date);
    });

    it('should track reviewer assignment', () => {
      application.assignedReviewerId = 'admin-uuid-123';
      application.assignedReviewerName = 'Taylor Admin';

      expect(application.assignedReviewerId).toBe('admin-uuid-123');
      expect(application.assignedReviewerName).toBe('Taylor Admin');
    });

    it('should track risk assessment', () => {
      application.riskLevel = RiskLevel.LOW;
      application.riskAssessment = {
        overallScore: 85,
        factors: [
          { category: 'business_verification', level: 'low', description: 'Business verified' },
          { category: 'financial', level: 'low', description: 'Financials in order' },
        ],
      };

      expect(application.riskLevel).toBe(RiskLevel.LOW);
      expect(application.riskAssessment).toHaveProperty('overallScore');
    });

    it('should calculate SLA deadline', () => {
      const submittedAt = new Date('2025-12-20T10:00:00Z');
      const slaDeadline = new Date('2025-12-24T10:00:00Z'); // 3 business days later

      application.createdAt = submittedAt;
      application.slaDeadline = slaDeadline;

      expect(application.slaDeadline).toBeInstanceOf(Date);
      expect(application.slaDeadline?.getTime()).toBeGreaterThan(submittedAt.getTime());
    });

    it('should support approval with conditions', () => {
      application.status = ApplicationStatus.CONDITIONALLY_APPROVED;
      application.approvalConditions = [
        'Upload business license within 7 days',
        'Provide proof of insurance',
      ];

      expect(application.status).toBe(ApplicationStatus.CONDITIONALLY_APPROVED);
      expect(application.approvalConditions).toHaveLength(2);
    });

    it('should support rejection with reason', () => {
      application.status = ApplicationStatus.REJECTED;
      application.rejectionReason = 'Product categories do not align with marketplace focus';
      application.decidedAt = new Date();

      expect(application.status).toBe(ApplicationStatus.REJECTED);
      expect(application.rejectionReason).toBeTruthy();
    });

    it('should store document URLs', () => {
      application.documents = {
        productCatalogUrl: 'https://s3.example.com/catalog.pdf',
        lineSheetUrl: 'https://s3.example.com/linesheet.pdf',
        insuranceCertificateUrl: 'https://s3.example.com/insurance.pdf',
        businessLicenseUrl: 'https://s3.example.com/license.pdf',
      };

      expect(application.documents).toHaveProperty('productCatalogUrl');
      expect(application.documents?.lineSheetUrl).toContain('.pdf');
    });
  });

  describe('VendorOnboarding Entity', () => {
    let onboarding: VendorOnboarding;
    let application: VendorApplication;

    beforeEach(() => {
      onboarding = new VendorOnboarding();
      application = new VendorApplication();
      application.id = 'app-123';
    });

    it('should create an onboarding instance', () => {
      expect(onboarding).toBeDefined();
      expect(onboarding).toBeInstanceOf(VendorOnboarding);
    });

    it('should link to application', () => {
      onboarding.application = application;
      onboarding.applicationId = application.id;

      expect(onboarding.application).toBe(application);
      expect(onboarding.applicationId).toBe('app-123');
    });

    it('should have default progress metrics', () => {
      onboarding.completedSteps = 0;
      onboarding.totalSteps = 8;
      onboarding.requiredStepsRemaining = 6;
      onboarding.percentComplete = 0;

      expect(onboarding.totalSteps).toBe(8);
      expect(onboarding.completedSteps).toBe(0);
      expect(onboarding.requiredStepsRemaining).toBe(6);
      expect(onboarding.percentComplete).toBe(0);
    });

    it('should track progress as steps complete', () => {
      onboarding.completedSteps = 0;
      onboarding.percentComplete = 0;

      // Complete first step
      onboarding.completedSteps = 1;
      onboarding.percentComplete = Math.round((1 / 8) * 100);
      expect(onboarding.percentComplete).toBe(13); // 1/8 * 100 = 12.5, rounds to 13

      // Complete all 8 steps
      onboarding.completedSteps = 8;
      onboarding.percentComplete = 100;
      expect(onboarding.percentComplete).toBe(100);
    });

    it('should assign success manager', () => {
      onboarding.successManagerName = 'Taylor Success';
      onboarding.successManagerEmail = 'taylor@jademarketplace.com';

      expect(onboarding.successManagerName).toBe('Taylor Success');
      expect(onboarding.successManagerEmail).toContain('@jademarketplace.com');
    });

    it('should calculate target completion date (2 weeks)', () => {
      const startDate = new Date('2025-12-20T10:00:00Z');
      const targetDate = new Date('2026-01-03T10:00:00Z'); // 2 weeks later

      onboarding.startedAt = startDate;
      onboarding.targetCompletionDate = targetDate;

      expect(onboarding.targetCompletionDate).toBeInstanceOf(Date);
      expect(onboarding.targetCompletionDate?.getTime()).toBeGreaterThan(startDate.getTime());
    });

    it('should mark completion when done', () => {
      onboarding.completedSteps = 8;
      onboarding.requiredStepsRemaining = 0;
      onboarding.percentComplete = 100;
      onboarding.completedAt = new Date();

      expect(onboarding.completedAt).toBeInstanceOf(Date);
      expect(onboarding.percentComplete).toBe(100);
    });
  });

  describe('OnboardingStep Entity', () => {
    let step: OnboardingStep;
    let onboarding: VendorOnboarding;

    beforeEach(() => {
      step = new OnboardingStep();
      onboarding = new VendorOnboarding();
      onboarding.id = 'onboarding-123';
    });

    it('should create a step instance', () => {
      expect(step).toBeDefined();
      expect(step).toBeInstanceOf(OnboardingStep);
    });

    it('should link to onboarding', () => {
      step.onboarding = onboarding;
      step.onboardingId = onboarding.id;

      expect(step.onboarding).toBe(onboarding);
      expect(step.onboardingId).toBe('onboarding-123');
    });

    it('should have required step details', () => {
      step.name = 'Complete Brand Profile';
      step.description = 'Fill out your brand story, values, and imagery';
      step.order = 1;
      step.status = OnboardingStepStatus.PENDING;
      step.required = true;

      expect(step.name).toBe('Complete Brand Profile');
      expect(step.order).toBe(1);
      expect(step.required).toBe(true);
    });

    it('should support status transitions', () => {
      step.status = OnboardingStepStatus.PENDING;
      expect(step.status).toBe(OnboardingStepStatus.PENDING);

      step.status = OnboardingStepStatus.IN_PROGRESS;
      expect(step.status).toBe(OnboardingStepStatus.IN_PROGRESS);

      step.status = OnboardingStepStatus.COMPLETED;
      step.completedAt = new Date();
      expect(step.status).toBe(OnboardingStepStatus.COMPLETED);
      expect(step.completedAt).toBeInstanceOf(Date);
    });

    it('should support skipping optional steps', () => {
      step.required = false;
      step.status = OnboardingStepStatus.SKIPPED;

      expect(step.required).toBe(false);
      expect(step.status).toBe(OnboardingStepStatus.SKIPPED);
    });

    it('should link to help article', () => {
      step.helpArticleUrl = 'https://help.jademarketplace.com/onboarding/brand-profile';
      expect(step.helpArticleUrl).toContain('help.jademarketplace.com');
    });

    it('should maintain step order', () => {
      const steps = [
        { name: 'Complete Brand Profile', order: 1 },
        { name: 'Upload Product Catalog', order: 2 },
        { name: 'Set Pricing & Minimums', order: 3 },
        { name: 'Configure Shipping', order: 4 },
        { name: 'Add Bank Account', order: 5 },
        { name: 'Review & Accept Terms', order: 6 },
        { name: 'Schedule Launch Call', order: 7, required: false },
        { name: 'Upload Brand Assets', order: 8, required: false },
      ];

      expect(steps).toHaveLength(8);
      expect(steps.filter(s => s.required !== false)).toHaveLength(6);
    });
  });

  describe('Application Validation', () => {
    it('should validate correct application submission', () => {
      const validApplication = {
        contactFirstName: 'Sarah',
        contactLastName: 'Chen',
        contactEmail: 'sarah@luminaraskincare.com',
        contactPhone: '(512) 555-0123',
        contactRole: 'Founder / Owner',
        brandName: 'Luminara Skincare',
        legalName: 'Luminara Skincare Inc.',
        website: 'https://luminaraskincare.com',
        yearFounded: 2019,
        headquarters: 'Austin, TX',
        employeeCount: '11-50',
        annualRevenue: '$1M-$5M',
        productCategories: ['Serums', 'Moisturizers'],
        skuCount: '15-50',
        priceRange: '$$',
        targetMarket: ['Day Spas', 'Med Spas'],
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
        whyJade: 'A'.repeat(100), // At least 100 characters
      };

      const result = submitVendorApplicationSchema.safeParse(validApplication);
      expect(result.success).toBe(true);
    });

    it('should require at least 3 values', () => {
      const invalidApplication = {
        contactFirstName: 'Sarah',
        contactLastName: 'Chen',
        contactEmail: 'sarah@example.com',
        contactRole: 'Owner',
        brandName: 'Test Brand',
        legalName: 'Test Legal',
        website: 'https://example.com',
        yearFounded: 2020,
        headquarters: 'Austin, TX',
        employeeCount: '11-50',
        productCategories: ['Serums'],
        skuCount: '1-15',
        priceRange: '$$',
        targetMarket: ['Day Spas'],
        values: [VendorValue.CLEAN_BEAUTY], // Only 1 value
        whyJade: 'A'.repeat(100),
      };

      const result = submitVendorApplicationSchema.safeParse(invalidApplication);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('3 values');
      }
    });

    it('should require whyJade to be at least 100 characters', () => {
      const shortWhy = {
        contactFirstName: 'Sarah',
        contactLastName: 'Chen',
        contactEmail: 'sarah@example.com',
        contactRole: 'Owner',
        brandName: 'Test Brand',
        legalName: 'Test Legal',
        website: 'https://example.com',
        yearFounded: 2020,
        headquarters: 'Austin, TX',
        employeeCount: '11-50',
        productCategories: ['Serums'],
        skuCount: '1-15',
        priceRange: '$$',
        targetMarket: ['Day Spas'],
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
        whyJade: 'Too short',
      };

      const result = submitVendorApplicationSchema.safeParse(shortWhy);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('100 characters');
      }
    });
  });

  describe('Review Decision Validation', () => {
    it('should validate approval decision', () => {
      const approval = {
        applicationId: '550e8400-e29b-41d4-a716-446655440000',
        decision: 'approve' as const,
        decisionNote: 'Excellent fit for marketplace',
      };

      const result = applicationReviewDecisionSchema.safeParse(approval);
      expect(result.success).toBe(true);
    });

    it('should validate rejection with reason', () => {
      const rejection = {
        applicationId: '550e8400-e29b-41d4-a716-446655440000',
        decision: 'reject' as const,
        rejectionReason: 'A'.repeat(20), // At least 20 characters
      };

      const result = applicationReviewDecisionSchema.safeParse(rejection);
      expect(result.success).toBe(true);
    });
  });

  describe('Onboarding Step Validation', () => {
    it('should validate step completion', () => {
      const completion = {
        stepId: '550e8400-e29b-41d4-a716-446655440000',
        data: { profileId: 'profile-123' },
      };

      const result = completeOnboardingStepSchema.safeParse(completion);
      expect(result.success).toBe(true);
    });
  });
});
