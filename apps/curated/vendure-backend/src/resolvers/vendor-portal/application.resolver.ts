/**
 * Vendor Application Resolvers
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools
 *
 * Handles vendor application submission, review, and approval workflows
 */

import { VendorApplicationService } from '../../plugins/vendor-portal/services/vendor-application.service';
import { GraphQLContext } from '../../graphql/apollo-server';
import { AppDataSource } from '../../config/database';
import { VendorApplication } from '../../plugins/vendor-portal/entities/vendor-application.entity';
import { VendorOnboarding } from '../../plugins/vendor-portal/entities/vendor-onboarding.entity';
import { OnboardingStep } from '../../plugins/vendor-portal/entities/onboarding-step.entity';

/**
 * Get vendor application service instance
 */
function getApplicationService(): VendorApplicationService {
  const applicationRepository = AppDataSource.getRepository(VendorApplication);
  const onboardingRepository = AppDataSource.getRepository(VendorOnboarding);
  const onboardingStepRepository = AppDataSource.getRepository(OnboardingStep);

  return new VendorApplicationService(
    applicationRepository,
    onboardingRepository,
    onboardingStepRepository
  );
}

/**
 * Query: Get vendor application by ID
 */
export async function vendorApplication(
  _parent: any,
  args: { id: string },
  _context: GraphQLContext
): Promise<any> {
  const service = getApplicationService();
  const application = await service.getApplicationById(args.id);

  if (!application) {
    throw new Error(`Application ${args.id} not found`);
  }

  return application;
}

/**
 * Query: Get all vendor applications (Admin only)
 */
export async function adminVendorApplications(
  _parent: any,
  args: {
    statusFilter?: string;
    assigneeFilter?: string;
    limit?: number;
    offset?: number;
  },
  _context: GraphQLContext
): Promise<any[]> {
  // TODO: Add admin permission check
  // requireRole(context, 'admin', 'vendor_manager');

  const service = getApplicationService();
  const { applications } = await service.getApplications({
    statusFilter: args.statusFilter as any,
    assigneeFilter: args.assigneeFilter,
    limit: args.limit,
    offset: args.offset,
  });

  return applications;
}

/**
 * Mutation: Submit vendor application
 */
export async function submitVendorApplication(
  _parent: any,
  args: { input: any },
  _context: GraphQLContext
): Promise<any> {
  try {
    // Validate required fields
    const errors: any[] = [];

    if (!args.input.contactEmail) {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: 'Contact email is required',
        field: 'contactEmail',
      });
    }

    if (!args.input.values || args.input.values.length < 3) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: 'At least 3 values are required',
        field: 'values',
      });
    }

    if (!args.input.whyJade || args.input.whyJade.length < 100) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: 'Why Jade response must be at least 100 characters',
        field: 'whyJade',
      });
    }

    if (errors.length > 0) {
      return { success: false, application: null, errors };
    }

    // Submit application
    const service = getApplicationService();
    const application = await service.submitApplication(args.input);

    return {
      success: true,
      application,
      errors: [],
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('already pending')) {
      return {
        success: false,
        application: null,
        errors: [
          {
            code: 'DUPLICATE_APPLICATION',
            message: error.message,
            field: 'contactEmail',
          },
        ],
      };
    }

    throw error;
  }
}

/**
 * Mutation: Review vendor application (Admin only)
 */
export async function reviewVendorApplication(
  _parent: any,
  args: { input: any },
  _context: GraphQLContext
): Promise<any> {
  try {
    // TODO: Add admin permission check
    // requireRole(context, 'admin', 'vendor_manager');

    const service = getApplicationService();
    const application = await service.reviewApplication(args.input);

    return {
      success: true,
      application,
      errors: [],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        application: null,
        errors: [
          {
            code: 'INVALID_APPLICATION_STATUS',
            message: error.message,
          },
        ],
      };
    }

    throw error;
  }
}

/**
 * Mutation: Assign reviewer to application (Admin only)
 */
export async function assignApplicationReviewer(
  _parent: any,
  args: { applicationId: string; reviewerId: string },
  _context: GraphQLContext
): Promise<any> {
  try {
    // TODO: Add admin permission check
    // requireRole(context, 'admin', 'vendor_manager');

    // TODO: Fetch reviewer name from user service
    const reviewerName = 'Admin User';

    const service = getApplicationService();
    const application = await service.assignReviewer(
      args.applicationId,
      args.reviewerId,
      reviewerName
    );

    return {
      success: true,
      application,
      errors: [],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        application: null,
        errors: [
          {
            code: 'APPLICATION_NOT_FOUND',
            message: error.message,
          },
        ],
      };
    }

    throw error;
  }
}
