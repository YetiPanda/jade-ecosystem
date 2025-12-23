/**
 * Vendor Application Service
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.2 & E.2: Application Management
 *
 * Handles vendor application submission, review, and approval workflows.
 * Integrates with risk scoring and email notification services.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorApplication } from '../entities/vendor-application.entity';
import { VendorOnboarding } from '../entities/vendor-onboarding.entity';
import { OnboardingStep } from '../entities/onboarding-step.entity';
import { ApplicationStatus, RiskLevel, OnboardingStepStatus } from '../types/vendor.enums';
import { applicationRiskScoringService } from '../../../services/application-risk-scoring.service';

/**
 * Input for submitting a vendor application
 */
export interface SubmitVendorApplicationInput {
  // Contact Information
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone?: string;
  contactRole: string;

  // Company Information
  brandName: string;
  legalName: string;
  website: string;
  yearFounded: number;
  headquarters: string;
  employeeCount: string;
  annualRevenue?: string;

  // Product Information
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
  productCatalogUrl?: string;
  lineSheetUrl?: string;
  insuranceCertificateUrl?: string;
  businessLicenseUrl?: string;
}

/**
 * Input for reviewing an application (admin)
 */
export interface ApplicationReviewDecisionInput {
  applicationId: string;
  decision: 'APPROVE' | 'CONDITIONALLY_APPROVE' | 'REJECT' | 'REQUEST_INFO';
  decisionNote?: string;
  rejectionReason?: string;
  approvalConditions?: string[];
}

@Injectable()
export class VendorApplicationService {
  constructor(
    @InjectRepository(VendorApplication)
    private readonly applicationRepository: Repository<VendorApplication>,
    @InjectRepository(VendorOnboarding)
    private readonly onboardingRepository: Repository<VendorOnboarding>,
    @InjectRepository(OnboardingStep)
    private readonly onboardingStepRepository: Repository<OnboardingStep>,
  ) {}

  /**
   * Submit a new vendor application
   *
   * Workflow:
   * 1. Create application record
   * 2. Calculate SLA deadline (3 business days)
   * 3. Run automated risk assessment
   * 4. Send confirmation email
   *
   * @param input Application data
   * @returns Created application
   */
  async submitApplication(input: SubmitVendorApplicationInput): Promise<VendorApplication> {
    // Check for duplicate email
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        contactEmail: input.contactEmail,
        status: ApplicationStatus.SUBMITTED,
      },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'An application with this email is already pending review. Please wait for a decision or contact support.'
      );
    }

    // Calculate SLA deadline (3 business days from now)
    const slaDeadline = this.calculateSLADeadline(new Date(), 3);

    // Create application
    const application = this.applicationRepository.create({
      ...input,
      documents: {
        productCatalogUrl: input.productCatalogUrl,
        lineSheetUrl: input.lineSheetUrl,
        insuranceCertificateUrl: input.insuranceCertificateUrl,
        businessLicenseUrl: input.businessLicenseUrl,
      },
      status: ApplicationStatus.SUBMITTED,
      slaDeadline,
      // Note: createdAt is automatically set by @CreateDateColumn
    });

    const savedApplication = await this.applicationRepository.save(application);

    // Run automated risk assessment
    try {
      const riskAssessment = await applicationRiskScoringService.calculateRiskAssessment(savedApplication as any);
      savedApplication.riskLevel = riskAssessment.overallRisk;
      savedApplication.riskAssessment = riskAssessment as any;
      await this.applicationRepository.save(savedApplication);
    } catch (error) {
      console.error('Risk assessment failed:', error);
      // Continue even if risk assessment fails
    }

    // Send confirmation email
    // TODO: Implement email sending
    // try {
    //   await sendApplicationReceivedEmail(savedApplication);
    // } catch (error) {
    //   console.error('Failed to send confirmation email:', error);
    // }

    return savedApplication;
  }

  /**
   * Get application by ID
   *
   * @param id Application ID
   * @returns Application or null
   */
  async getApplicationById(id: string): Promise<VendorApplication | null> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['onboarding', 'onboarding.steps'],
    });

    return application;
  }

  /**
   * Get all applications with optional filters
   *
   * @param filters Filter criteria
   * @returns List of applications
   */
  async getApplications(filters?: {
    statusFilter?: ApplicationStatus;
    assigneeFilter?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ applications: VendorApplication[]; total: number }> {
    const queryBuilder = this.applicationRepository.createQueryBuilder('app');

    // Apply status filter
    if (filters?.statusFilter) {
      queryBuilder.andWhere('app.status = :status', { status: filters.statusFilter });
    }

    // Apply assignee filter
    if (filters?.assigneeFilter) {
      if (filters.assigneeFilter === 'unassigned') {
        queryBuilder.andWhere('app.assignedReviewerId IS NULL');
      } else {
        queryBuilder.andWhere('app.assignedReviewerId = :assigneeId', {
          assigneeId: filters.assigneeFilter,
        });
      }
    }

    // Order by SLA deadline (most urgent first)
    queryBuilder.orderBy('app.slaDeadline', 'ASC');

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    if (filters?.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters?.offset) {
      queryBuilder.offset(filters.offset);
    }

    const applications = await queryBuilder.getMany();

    return { applications, total };
  }

  /**
   * Review and decide on an application (admin only)
   *
   * Workflow:
   * 1. Update application status
   * 2. Record decision details
   * 3. Send appropriate email
   * 4. If approved, create onboarding record
   *
   * @param input Review decision
   * @returns Updated application
   */
  async reviewApplication(input: ApplicationReviewDecisionInput): Promise<VendorApplication> {
    const application = await this.getApplicationById(input.applicationId);

    if (!application) {
      throw new NotFoundException(`Application ${input.applicationId} not found`);
    }

    // Validate current status
    if (
      application.status !== ApplicationStatus.SUBMITTED &&
      application.status !== ApplicationStatus.UNDER_REVIEW &&
      application.status !== ApplicationStatus.ADDITIONAL_INFO_REQUESTED
    ) {
      throw new BadRequestException(
        `Cannot review application in ${application.status} status`
      );
    }

    // Update application based on decision
    switch (input.decision) {
      case 'APPROVE':
        application.status = ApplicationStatus.APPROVED;
        application.decidedAt = new Date();
        break;

      case 'CONDITIONALLY_APPROVE':
        application.status = ApplicationStatus.CONDITIONALLY_APPROVED;
        application.decidedAt = new Date();
        application.approvalConditions = input.approvalConditions || [];
        break;

      case 'REJECT':
        application.status = ApplicationStatus.REJECTED;
        application.decidedAt = new Date();
        application.rejectionReason = input.rejectionReason || 'Application rejected';
        break;

      case 'REQUEST_INFO':
        application.status = ApplicationStatus.ADDITIONAL_INFO_REQUESTED;
        // Extend SLA by 2 business days
        application.slaDeadline = this.calculateSLADeadline(new Date(), 2);
        break;
    }

    const savedApplication = await this.applicationRepository.save(application);

    // Create onboarding record if approved
    if (
      input.decision === 'APPROVE' ||
      input.decision === 'CONDITIONALLY_APPROVE'
    ) {
      await this.createOnboardingRecord(savedApplication);
    }

    // Send appropriate email
    // TODO: Implement email sending
    // try {
    //   switch (input.decision) {
    //     case 'APPROVE':
    //     case 'CONDITIONALLY_APPROVE':
    //       await sendApplicationApprovedEmail(savedApplication, input.approvalConditions);
    //       break;
    //     case 'REJECT':
    //       await sendApplicationRejectedEmail(savedApplication, input.rejectionReason);
    //       break;
    //     case 'REQUEST_INFO':
    //       await sendInfoRequestedEmail(savedApplication, input.decisionNote);
    //       break;
    //   }
    // } catch (error) {
    //   console.error('Failed to send decision email:', error);
    // }

    return savedApplication;
  }

  /**
   * Assign application to a reviewer
   *
   * @param applicationId Application ID
   * @param reviewerId Reviewer user ID
   * @param reviewerName Reviewer name
   * @returns Updated application
   */
  async assignReviewer(
    applicationId: string,
    reviewerId: string,
    reviewerName: string
  ): Promise<VendorApplication> {
    const application = await this.getApplicationById(applicationId);

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    application.assignedReviewerId = reviewerId;
    application.assignedReviewerName = reviewerName;

    // Update status to UNDER_REVIEW if currently SUBMITTED
    if (application.status === ApplicationStatus.SUBMITTED) {
      application.status = ApplicationStatus.UNDER_REVIEW;
    }

    return await this.applicationRepository.save(application);
  }

  /**
   * Create onboarding record for approved application
   *
   * @param application Approved application
   * @returns Created onboarding record
   */
  private async createOnboardingRecord(
    application: VendorApplication
  ): Promise<VendorOnboarding> {
    // Create onboarding record
    const onboarding = this.onboardingRepository.create({
      applicationId: application.id,
      startedAt: new Date(),
      targetCompletionDate: this.addBusinessDays(new Date(), 14), // 2 weeks
      successManagerName: 'JADE Support Team',
      successManagerEmail: 'support@jade-marketplace.com',
    });

    const savedOnboarding = await this.onboardingRepository.save(onboarding);

    // Create default onboarding steps
    const defaultSteps = [
      {
        name: 'Complete Vendor Profile',
        description: 'Set up your brand identity, story, and visual assets',
        order: 1,
        required: true,
        helpArticleUrl: '/help/vendor-profile',
      },
      {
        name: 'Upload Product Catalog',
        description: 'Add your first products to the marketplace',
        order: 2,
        required: true,
        helpArticleUrl: '/help/product-upload',
      },
      {
        name: 'Set Up Payment Information',
        description: 'Configure bank account for payouts',
        order: 3,
        required: true,
        helpArticleUrl: '/help/payment-setup',
      },
      {
        name: 'Configure Shipping',
        description: 'Set shipping rates and fulfillment options',
        order: 4,
        required: true,
        helpArticleUrl: '/help/shipping',
      },
      {
        name: 'Review Policies',
        description: 'Read and accept marketplace policies',
        order: 5,
        required: true,
        helpArticleUrl: '/help/policies',
      },
      {
        name: 'Complete Training Modules',
        description: 'Learn best practices for the JADE marketplace',
        order: 6,
        required: false,
        helpArticleUrl: '/help/training',
      },
      {
        name: 'Set Up Messaging',
        description: 'Configure notifications and spa communication',
        order: 7,
        required: false,
        helpArticleUrl: '/help/messaging',
      },
      {
        name: 'Launch Checklist',
        description: 'Final review before going live',
        order: 8,
        required: true,
        helpArticleUrl: '/help/launch',
      },
    ];

    for (const stepData of defaultSteps) {
      const step = this.onboardingStepRepository.create({
        ...stepData,
        onboardingId: savedOnboarding.id,
        status: OnboardingStepStatus.PENDING,
      });
      await this.onboardingStepRepository.save(step);
    }

    // Send onboarding welcome email
    // TODO: Implement email sending
    // try {
    //   await sendOnboardingWelcomeEmail(application, savedOnboarding);
    // } catch (error) {
    //   console.error('Failed to send onboarding email:', error);
    // }

    return savedOnboarding;
  }

  /**
   * Calculate SLA deadline (business days only)
   *
   * @param startDate Start date
   * @param businessDays Number of business days to add
   * @returns Deadline date
   */
  private calculateSLADeadline(startDate: Date, businessDays: number): Date {
    return this.addBusinessDays(startDate, businessDays);
  }

  /**
   * Add business days to a date (excludes weekends)
   *
   * @param date Start date
   * @param days Number of business days
   * @returns Result date
   */
  private addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let addedDays = 0;

    while (addedDays < days) {
      result.setDate(result.getDate() + 1);

      // Skip weekends (Saturday = 6, Sunday = 0)
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }

    return result;
  }
}
