/**
 * Wholesale Application Service
 * Week 8: Practitioner Verification System
 *
 * Business logic for wholesale account applications:
 * - Application creation and updates
 * - Submission workflow
 * - Curator review and approval
 * - License verification integration
 * - Email notifications
 */

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {
  RequestContext,
  TransactionalConnection,
  ID,
  User,
  EntityNotFoundError,
  ForbiddenError,
} from '@vendure/core';
import {
  WholesaleApplication,
  ApplicationStatus,
  BusinessType,
  BusinessAddress,
  UploadedDocument,
  LicenseVerificationResult,
} from '../entities/wholesale-application.entity';

/**
 * Input for creating wholesale application
 */
export interface CreateWholesaleApplicationInput {
  businessName: string;
  businessType: BusinessType;
  taxId?: string;
  businessAddress: BusinessAddress;
  yearsInOperation?: number;
  websiteUrl?: string;
  phoneNumber: string;
  licenseDocuments: UploadedDocument[];
  locationPhotos: UploadedDocument[];
  wholesalePaperworkSigned: boolean;
  applicantNotes?: string;
}

/**
 * Input for updating wholesale application
 */
export interface UpdateWholesaleApplicationInput {
  businessName?: string;
  businessType?: BusinessType;
  taxId?: string;
  businessAddress?: BusinessAddress;
  yearsInOperation?: number;
  websiteUrl?: string;
  phoneNumber?: string;
  licenseDocuments?: UploadedDocument[];
  locationPhotos?: UploadedDocument[];
  wholesalePaperworkSigned?: boolean;
  applicantNotes?: string;
}

/**
 * Input for reviewing wholesale application
 */
export interface ReviewWholesaleApplicationInput {
  status: ApplicationStatus;
  reviewNotes?: string;
  rejectionReason?: string;
}

/**
 * Application filters
 */
export interface ApplicationFilters {
  status?: ApplicationStatus;
  businessType?: BusinessType;
  businessName?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  skip?: number;
  take?: number;
}

@Injectable()
export class WholesaleApplicationService {
  constructor(
    @InjectConnection() private connection: Connection,
    private transactionalConnection: TransactionalConnection
  ) {}

  /**
   * Create a new wholesale application
   */
  async create(
    ctx: RequestContext,
    userId: ID,
    input: CreateWholesaleApplicationInput
  ): Promise<WholesaleApplication> {
    // Check if user already has an application
    const existing = await this.connection
      .getRepository(WholesaleApplication)
      .findOne({
        where: { userId },
      });

    if (existing && existing.status !== ApplicationStatus.REJECTED) {
      throw new Error(
        'You already have a pending or approved wholesale application'
      );
    }

    const application = new WholesaleApplication({
      userId,
      ...input,
      status: ApplicationStatus.PENDING,
    });

    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .save(application);
  }

  /**
   * Update wholesale application (before submission)
   */
  async update(
    ctx: RequestContext,
    applicationId: ID,
    userId: ID,
    input: UpdateWholesaleApplicationInput
  ): Promise<WholesaleApplication> {
    const application = await this.findOneOrFail(ctx, applicationId);

    // Only the owner can update
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    // Can only update if not yet submitted or approved
    if (
      application.status !== ApplicationStatus.PENDING &&
      application.status !== ApplicationStatus.INFO_REQUESTED
    ) {
      throw new Error('Cannot update application in current status');
    }

    Object.assign(application, input);

    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .save(application);
  }

  /**
   * Submit application for review
   */
  async submit(
    ctx: RequestContext,
    applicationId: ID,
    userId: ID
  ): Promise<WholesaleApplication> {
    const application = await this.findOneOrFail(ctx, applicationId);

    // Only the owner can submit
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    // Validate minimum requirements
    if (!application.hasMinimumDocuments()) {
      throw new Error(
        'Application must have at least 1 license document and 3 location photos'
      );
    }

    if (!application.wholesalePaperworkSigned) {
      throw new Error('Wholesale paperwork must be signed');
    }

    application.status = ApplicationStatus.UNDER_REVIEW;
    application.submittedAt = new Date();

    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .save(application);
  }

  /**
   * Review application (curator only)
   */
  async review(
    ctx: RequestContext,
    applicationId: ID,
    curatorId: ID,
    input: ReviewWholesaleApplicationInput
  ): Promise<WholesaleApplication> {
    const application = await this.findOneOrFail(ctx, applicationId);

    // Validate status transition
    if (!application.canBeReviewed()) {
      throw new Error('Application cannot be reviewed in current status');
    }

    // Validate rejection reason
    if (
      input.status === ApplicationStatus.REJECTED &&
      !input.rejectionReason
    ) {
      throw new Error('Rejection reason is required when rejecting');
    }

    application.status = input.status;
    application.reviewedById = curatorId;
    application.reviewNotes = input.reviewNotes;
    application.rejectionReason = input.rejectionReason;
    application.reviewedAt = new Date();

    if (input.status === ApplicationStatus.APPROVED) {
      application.approvedAt = new Date();
      // TODO: Activate wholesale account for user
      await this.activateWholesaleAccount(ctx, application.userId);
    }

    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .save(application);
  }

  /**
   * Withdraw application
   */
  async withdraw(
    ctx: RequestContext,
    applicationId: ID,
    userId: ID
  ): Promise<WholesaleApplication> {
    const application = await this.findOneOrFail(ctx, applicationId);

    // Only the owner can withdraw
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    // Can't withdraw if already approved or rejected
    if (
      application.status === ApplicationStatus.APPROVED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      throw new Error('Cannot withdraw application in current status');
    }

    application.status = ApplicationStatus.WITHDRAWN;

    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .save(application);
  }

  /**
   * Request license verification from third-party service
   */
  async requestLicenseVerification(
    ctx: RequestContext,
    applicationId: ID
  ): Promise<WholesaleApplication> {
    const application = await this.findOneOrFail(ctx, applicationId);

    // TODO: Integrate with third-party license verification service
    // For now, create a mock verification result
    const verificationResult: LicenseVerificationResult = {
      verified: false,
      provider: 'Manual',
      verifiedAt: new Date().toISOString(),
      details: {
        message: 'Third-party verification not yet implemented',
      },
    };

    application.verificationResult = verificationResult;

    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .save(application);
  }

  /**
   * Get application by ID
   */
  async findOne(
    ctx: RequestContext,
    applicationId: ID
  ): Promise<WholesaleApplication | undefined> {
    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .findOne({
        where: { id: applicationId },
        relations: ['user', 'reviewedBy'],
      });
  }

  /**
   * Get application by ID or fail
   */
  async findOneOrFail(
    ctx: RequestContext,
    applicationId: ID
  ): Promise<WholesaleApplication> {
    const application = await this.findOne(ctx, applicationId);
    if (!application) {
      throw new EntityNotFoundError('WholesaleApplication', applicationId);
    }
    return application;
  }

  /**
   * Get user's application
   */
  async findByUserId(
    ctx: RequestContext,
    userId: ID
  ): Promise<WholesaleApplication | undefined> {
    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .findOne({
        where: { userId },
        relations: ['user', 'reviewedBy'],
      });
  }

  /**
   * Get all applications with filters and pagination
   */
  async findAll(
    ctx: RequestContext,
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<{ items: WholesaleApplication[]; total: number }> {
    const qb = this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.reviewedBy', 'reviewedBy');

    // Apply filters
    if (filters?.status) {
      qb.andWhere('application.status = :status', { status: filters.status });
    }

    if (filters?.businessType) {
      qb.andWhere('application.businessType = :businessType', {
        businessType: filters.businessType,
      });
    }

    if (filters?.businessName) {
      qb.andWhere('application.businessName ILIKE :businessName', {
        businessName: `%${filters.businessName}%`,
      });
    }

    // Apply pagination
    if (pagination?.skip) {
      qb.skip(pagination.skip);
    }

    if (pagination?.take) {
      qb.take(pagination.take);
    } else {
      qb.take(50); // Default limit
    }

    // Order by newest first
    qb.orderBy('application.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  /**
   * Get count of pending applications
   */
  async getPendingCount(ctx: RequestContext): Promise<number> {
    return this.transactionalConnection
      .getRepository(ctx, WholesaleApplication)
      .count({
        where: [
          { status: ApplicationStatus.PENDING },
          { status: ApplicationStatus.UNDER_REVIEW },
          { status: ApplicationStatus.INFO_REQUESTED },
        ],
      });
  }

  /**
   * Activate wholesale account for user
   * TODO: Integrate with user service to update user's wholesale status
   */
  private async activateWholesaleAccount(
    ctx: RequestContext,
    userId: ID
  ): Promise<void> {
    // This would update the user's customFields.wholesaleApproved flag
    // and potentially assign wholesale pricing tiers
    // Implementation depends on your user service structure
    console.log(`Activating wholesale account for user ${userId}`);
  }
}
