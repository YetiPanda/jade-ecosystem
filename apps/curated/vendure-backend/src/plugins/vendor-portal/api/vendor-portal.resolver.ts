/**
 * Vendor Portal GraphQL Resolver
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.4: GraphQL Contracts & Sprint E.2: Admin Tools
 *
 * Implements vendor-facing and admin queries/mutations for:
 * - Application submission
 * - Application review (admin)
 * - Onboarding management
 * - Dashboard analytics
 */

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { VendorApplicationService, SubmitVendorApplicationInput, ApplicationReviewDecisionInput } from '../services/vendor-application.service';
import { VendorApplication } from '../entities/vendor-application.entity';
import { ApplicationStatus } from '../types/vendor.enums';

/**
 * GraphQL Result Types
 */
interface VendorPortalError {
  code: string;
  message: string;
  field?: string;
}

interface VendorApplicationResult {
  success: boolean;
  application?: VendorApplication;
  errors: VendorPortalError[];
}

/**
 * Authentication Guard (simplified - replace with actual Vendure auth guard)
 */
class AuthGuard {
  canActivate(context: any): boolean {
    // TODO: Implement actual Vendure authentication check
    return true;
  }
}

/**
 * Admin Guard (simplified - replace with actual Vendure admin guard)
 */
class AdminGuard {
  canActivate(context: any): boolean {
    // TODO: Implement actual Vendure admin check
    return true;
  }
}

@Resolver()
export class VendorPortalResolver {
  constructor(
    private readonly applicationService: VendorApplicationService,
  ) {}

  // ═══════════════════════════════════════════════════════════════════
  // VENDOR APPLICATION QUERIES
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Get vendor application by ID
   *
   * Access: Vendor (own application) or Admin
   * Sprint: A.2
   */
  @Query('vendorApplication')
  async vendorApplication(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<VendorApplication> {
    const application = await this.applicationService.getApplicationById(id);

    if (!application) {
      throw new BadRequestException(`Application ${id} not found`);
    }

    // TODO: Add permission check - vendor can only see own application
    // if (!context.user.isAdmin && application.contactEmail !== context.user.email) {
    //   throw new UnauthorizedException('You can only view your own application');
    // }

    return application;
  }

  /**
   * Get all vendor applications (admin only)
   *
   * Access: Admin only
   * Sprint: E.2
   */
  @Query('adminVendorApplications')
  @UseGuards(AdminGuard)
  async adminVendorApplications(
    @Args('statusFilter') statusFilter?: ApplicationStatus,
    @Args('assigneeFilter') assigneeFilter?: string,
    @Args('limit') limit?: number,
    @Args('offset') offset?: number,
  ): Promise<VendorApplication[]> {
    const { applications } = await this.applicationService.getApplications({
      statusFilter,
      assigneeFilter,
      limit,
      offset,
    });

    return applications;
  }

  // ═══════════════════════════════════════════════════════════════════
  // VENDOR APPLICATION MUTATIONS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Submit vendor application
   *
   * Access: Public (no authentication required)
   * Sprint: A.2, E.1
   */
  @Mutation('submitVendorApplication')
  async submitVendorApplication(
    @Args('input') input: SubmitVendorApplicationInput,
  ): Promise<VendorApplicationResult> {
    try {
      // Validate required fields
      const errors: VendorPortalError[] = [];

      if (!input.contactFirstName) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Contact first name is required',
          field: 'contactFirstName',
        });
      }

      if (!input.contactLastName) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Contact last name is required',
          field: 'contactLastName',
        });
      }

      if (!input.contactEmail) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Contact email is required',
          field: 'contactEmail',
        });
      } else if (!this.isValidEmail(input.contactEmail)) {
        errors.push({
          code: 'INVALID_EMAIL',
          message: 'Contact email is invalid',
          field: 'contactEmail',
        });
      }

      if (!input.contactRole) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Contact role is required',
          field: 'contactRole',
        });
      }

      if (!input.brandName) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Brand name is required',
          field: 'brandName',
        });
      }

      if (!input.legalName) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Legal name is required',
          field: 'legalName',
        });
      }

      if (!input.website) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Website is required',
          field: 'website',
        });
      } else if (!this.isValidURL(input.website)) {
        errors.push({
          code: 'INVALID_URL',
          message: 'Website URL is invalid',
          field: 'website',
        });
      }

      if (!input.productCategories || input.productCategories.length === 0) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: 'At least one product category is required',
          field: 'productCategories',
        });
      }

      if (!input.values || input.values.length < 3) {
        errors.push({
          code: 'VALIDATION_ERROR',
          message: 'At least 3 values are required',
          field: 'values',
        });
      }

      if (!input.whyJade || input.whyJade.length < 100) {
        errors.push({
          code: 'VALIDATION_ERROR',
          message: 'Why Jade response must be at least 100 characters',
          field: 'whyJade',
        });
      }

      if (errors.length > 0) {
        return {
          success: false,
          errors,
        };
      }

      // Submit application
      const application = await this.applicationService.submitApplication(input);

      return {
        success: true,
        application,
        errors: [],
      };
    } catch (error) {
      // Handle duplicate email or other errors
      if (error instanceof BadRequestException) {
        return {
          success: false,
          errors: [
            {
              code: 'DUPLICATE_APPLICATION',
              message: error.message,
              field: 'contactEmail',
            },
          ],
        };
      }

      // Generic error
      return {
        success: false,
        errors: [
          {
            code: 'INTERNAL_ERROR',
            message: 'Failed to submit application. Please try again.',
          },
        ],
      };
    }
  }

  /**
   * Review vendor application (admin only)
   *
   * Access: Admin only
   * Sprint: E.2
   */
  @Mutation('reviewVendorApplication')
  @UseGuards(AdminGuard)
  async reviewVendorApplication(
    @Args('input') input: ApplicationReviewDecisionInput,
  ): Promise<VendorApplicationResult> {
    try {
      const application = await this.applicationService.reviewApplication(input);

      return {
        success: true,
        application,
        errors: [],
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          success: false,
          errors: [
            {
              code: 'INVALID_APPLICATION_STATUS',
              message: error.message,
            },
          ],
        };
      }

      return {
        success: false,
        errors: [
          {
            code: 'INTERNAL_ERROR',
            message: 'Failed to review application. Please try again.',
          },
        ],
      };
    }
  }

  /**
   * Assign application to reviewer (admin only)
   *
   * Access: Admin only
   * Sprint: E.2
   */
  @Mutation('assignApplicationReviewer')
  @UseGuards(AdminGuard)
  async assignApplicationReviewer(
    @Args('applicationId') applicationId: string,
    @Args('reviewerId') reviewerId: string,
    @Context() context: any,
  ): Promise<VendorApplicationResult> {
    try {
      // TODO: Get reviewer name from user ID
      const reviewerName = 'Admin User'; // Replace with actual user lookup

      const application = await this.applicationService.assignReviewer(
        applicationId,
        reviewerId,
        reviewerName,
      );

      return {
        success: true,
        application,
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            code: 'INTERNAL_ERROR',
            message: 'Failed to assign reviewer. Please try again.',
          },
        ],
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
