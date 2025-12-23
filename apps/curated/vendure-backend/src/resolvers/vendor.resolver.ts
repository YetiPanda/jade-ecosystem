/**
 * Vendor Portal Resolvers
 * Week 4 Day 2: Vendor Management & Dashboard
 *
 * Implements Progressive Disclosure pattern:
 * - Glance: Quick dashboard summary, key metrics
 * - Scan: Detailed statistics, product lists
 * - Study: Quality metrics, training progress, historical data
 */

import { AppDataSource } from '../config/database';

/**
 * Query Resolvers
 */
export const vendorQueryResolvers = {
  /**
   * Get current vendor's profile (authenticated)
   */
  async myVendorProfile(_parent: any, _args: any, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const vendureSellerId = context.user.sellerId || context.user.id;

    const result = await AppDataSource.query(
      `
      SELECT
        id, vendure_seller_id as "vendureSellerId", company_name as "companyName",
        contact_name as "contactName", contact_email as "contactEmail",
        contact_phone as "contactPhone", business_license_number as "businessLicenseNumber",
        tax_id as "taxId", website_url as "websiteUrl", logo_url as "logoUrl",
        description, established_year as "establishedYear", specializations,
        certifications, taxonomy_accuracy_score as "taxonomyAccuracyScore",
        product_approval_rate as "productApprovalRate",
        average_response_time_hours as "averageResponseTimeHours",
        is_active as "isActive", is_verified as "isVerified",
        verification_date as "verificationDate",
        onboarding_completed as "onboardingCompleted",
        onboarding_completed_at as "onboardingCompletedAt",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.vendor_profile
      WHERE vendure_seller_id = $1
      `,
      [vendureSellerId]
    );

    return result[0] || null;
  },

  /**
   * Get vendor profile by ID (admin only)
   */
  async vendorProfile(_parent: any, args: { id: string }, context: any) {
    if (!context.user?.isAdmin) {
      throw new Error('Admin access required');
    }

    const result = await AppDataSource.query(
      `
      SELECT
        id, vendure_seller_id as "vendureSellerId", company_name as "companyName",
        contact_name as "contactName", contact_email as "contactEmail",
        contact_phone as "contactPhone", business_license_number as "businessLicenseNumber",
        tax_id as "taxId", website_url as "websiteUrl", logo_url as "logoUrl",
        description, established_year as "establishedYear", specializations,
        certifications, taxonomy_accuracy_score as "taxonomyAccuracyScore",
        product_approval_rate as "productApprovalRate",
        average_response_time_hours as "averageResponseTimeHours",
        is_active as "isActive", is_verified as "isVerified",
        verification_date as "verificationDate",
        onboarding_completed as "onboardingCompleted",
        onboarding_completed_at as "onboardingCompletedAt",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.vendor_profile
      WHERE id = $1
      `,
      [args.id]
    );

    return result[0] || null;
  },

  /**
   * Get all vendor profiles (admin only)
   */
  async vendorProfiles(
    _parent: any,
    args: { isActive?: boolean; isVerified?: boolean; limit?: number; offset?: number },
    context: any
  ) {
    if (!context.user?.isAdmin) {
      throw new Error('Admin access required');
    }

    let query = `
      SELECT
        id, vendure_seller_id as "vendureSellerId", company_name as "companyName",
        contact_name as "contactName", contact_email as "contactEmail",
        taxonomy_accuracy_score as "taxonomyAccuracyScore",
        is_active as "isActive", is_verified as "isVerified",
        onboarding_completed as "onboardingCompleted",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.vendor_profile
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (args.isActive !== undefined) {
      query += ` AND is_active = $${paramIndex}`;
      params.push(args.isActive);
      paramIndex++;
    }

    if (args.isVerified !== undefined) {
      query += ` AND is_verified = $${paramIndex}`;
      params.push(args.isVerified);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    if (args.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(args.limit);
      paramIndex++;
    }

    if (args.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(args.offset);
    }

    return await AppDataSource.query(query, params);
  },

  /**
   * Get vendor dashboard summary (Glance level)
   */
  async vendorDashboard(_parent: any, _args: any, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const vendureSellerId = context.user.sellerId || context.user.id;

    // Get vendor profile
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
      [vendureSellerId]
    );

    if (!profileResult[0]) {
      throw new Error('Vendor profile not found');
    }

    const vendorProfileId = profileResult[0].id;

    // Get profile, statistics, and recent submissions in parallel
    const [profile, statistics, submissions, training, qualityMetrics] = await Promise.all([
      vendorQueryResolvers.myVendorProfile(_parent, _args, context),
      vendorQueryResolvers.vendorStatistics(_parent, { vendorProfileId }, context),
      AppDataSource.query(
        `
        SELECT
          id, submission_status as "submissionStatus",
          taxonomy_completeness_score as "taxonomyCompletenessScore",
          submitted_at as "submittedAt", created_at as "createdAt"
        FROM jade.product_submission
        WHERE vendor_profile_id = $1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [vendorProfileId]
      ),
      AppDataSource.query(
        `
        SELECT
          module_name as "moduleName", status,
          progress_percentage as "progressPercentage"
        FROM jade.vendor_training_progress
        WHERE vendor_profile_id = $1 AND status != 'COMPLETED'
        ORDER BY created_at DESC
        `,
        [vendorProfileId]
      ),
      AppDataSource.query(
        `
        SELECT overall_quality_score as "overallQualityScore"
        FROM jade.vendor_quality_metrics
        WHERE vendor_profile_id = $1
        ORDER BY calculated_at DESC
        LIMIT 1
        `,
        [vendorProfileId]
      ),
    ]);

    // Generate pending actions
    const pendingActions = [];

    if (submissions.some((s: any) => s.submissionStatus === 'CHANGES_REQUESTED')) {
      pendingActions.push({
        id: 'pending-changes',
        type: 'PRODUCT_CHANGES',
        title: 'Products Need Updates',
        description: 'Some products require changes based on review feedback',
        priority: 'HIGH',
        actionUrl: '/vendor/products/pending',
        createdAt: new Date().toISOString(),
      });
    }

    if (training.length > 0) {
      pendingActions.push({
        id: 'pending-training',
        type: 'TRAINING',
        title: 'Complete Training Modules',
        description: `${training.length} training module(s) in progress`,
        priority: 'MEDIUM',
        actionUrl: '/vendor/training',
        createdAt: new Date().toISOString(),
      });
    }

    const qualityScore = qualityMetrics[0]?.overallQualityScore || 0;
    if (qualityScore < 70) {
      pendingActions.push({
        id: 'quality-improvement',
        type: 'QUALITY',
        title: 'Improve Product Quality',
        description: 'Your quality score is below the recommended threshold',
        priority: 'MEDIUM',
        actionUrl: '/vendor/quality',
        createdAt: new Date().toISOString(),
      });
    }

    return {
      profile,
      statistics,
      recentSubmissions: submissions,
      trainingProgress: training,
      qualityScore,
      pendingActions,
    };
  },

  /**
   * Get vendor statistics
   */
  async vendorStatistics(
    _parent: any,
    args: { vendorProfileId?: string; periodStartDate?: string; periodEndDate?: string },
    context: any
  ) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    let vendorProfileId = args.vendorProfileId;

    // If not provided, get current user's vendor profile
    if (!vendorProfileId) {
      const vendureSellerId = context.user.sellerId || context.user.id;
      const profileResult = await AppDataSource.query(
        `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
        [vendureSellerId]
      );
      vendorProfileId = profileResult[0]?.id;
    }

    if (!vendorProfileId) {
      return null;
    }

    let query = `
      SELECT
        id, vendor_profile_id as "vendorProfileId",
        total_products as "totalProducts", active_products as "activeProducts",
        pending_approval_products as "pendingApprovalProducts",
        rejected_products as "rejectedProducts",
        total_sales_amount as "totalSalesAmount",
        monthly_sales_amount as "monthlySalesAmount",
        yearly_sales_amount as "yearlySalesAmount",
        total_orders as "totalOrders", average_order_value as "averageOrderValue",
        total_customers as "totalCustomers", repeat_customers as "repeatCustomers",
        customer_retention_rate as "customerRetentionRate",
        products_with_complete_taxonomy as "productsWithCompleteTaxonomy",
        products_with_protocols as "productsWithProtocols",
        professional_products as "professionalProducts",
        calculated_at as "calculatedAt", period_start_date as "periodStartDate",
        period_end_date as "periodEndDate",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.vendor_statistics
      WHERE vendor_profile_id = $1
    `;

    const params: any[] = [vendorProfileId];

    if (args.periodStartDate && args.periodEndDate) {
      query += ` AND period_start_date >= $2 AND period_end_date <= $3`;
      params.push(args.periodStartDate, args.periodEndDate);
    }

    query += ` ORDER BY calculated_at DESC LIMIT 1`;

    const result = await AppDataSource.query(query, params);
    return result[0] || null;
  },

  /**
   * Get product submissions
   */
  async productSubmissions(
    _parent: any,
    args: {
      vendorProfileId?: string;
      submissionStatus?: string;
      limit?: number;
      offset?: number;
    },
    context: any
  ) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    let vendorProfileId = args.vendorProfileId;

    if (!vendorProfileId && !context.user.isAdmin) {
      const vendureSellerId = context.user.sellerId || context.user.id;
      const profileResult = await AppDataSource.query(
        `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
        [vendureSellerId]
      );
      vendorProfileId = profileResult[0]?.id;
    }

    let query = `
      SELECT
        id, vendor_profile_id as "vendorProfileId", product_id as "productId",
        submission_status as "submissionStatus",
        taxonomy_completeness_score as "taxonomyCompletenessScore",
        validation_errors as "validationErrors",
        validation_warnings as "validationWarnings",
        reviewed_by as "reviewedBy", reviewed_at as "reviewedAt",
        review_notes as "reviewNotes", rejection_reason as "rejectionReason",
        training_completed as "trainingCompleted",
        training_completed_at as "trainingCompletedAt",
        guidance_steps_completed as "guidanceStepsCompleted",
        submitted_at as "submittedAt",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.product_submission
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (vendorProfileId) {
      query += ` AND vendor_profile_id = $${paramIndex}`;
      params.push(vendorProfileId);
      paramIndex++;
    }

    if (args.submissionStatus) {
      query += ` AND submission_status = $${paramIndex}`;
      params.push(args.submissionStatus);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    if (args.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(args.limit);
      paramIndex++;
    }

    if (args.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(args.offset);
    }

    return await AppDataSource.query(query, params);
  },

  /**
   * Get single product submission
   */
  async productSubmission(_parent: any, args: { id: string }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const result = await AppDataSource.query(
      `
      SELECT
        id, vendor_profile_id as "vendorProfileId", product_id as "productId",
        submission_status as "submissionStatus",
        taxonomy_completeness_score as "taxonomyCompletenessScore",
        validation_errors as "validationErrors",
        validation_warnings as "validationWarnings",
        reviewed_by as "reviewedBy", reviewed_at as "reviewedAt",
        review_notes as "reviewNotes", rejection_reason as "rejectionReason",
        training_completed as "trainingCompleted",
        training_completed_at as "trainingCompletedAt",
        guidance_steps_completed as "guidanceStepsCompleted",
        submitted_at as "submittedAt",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.product_submission
      WHERE id = $1
      `,
      [args.id]
    );

    return result[0] || null;
  },

  /**
   * Get vendor training progress
   */
  async vendorTrainingProgress(
    _parent: any,
    args: { vendorProfileId?: string; moduleCategory?: string; status?: string },
    context: any
  ) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    let vendorProfileId = args.vendorProfileId;

    if (!vendorProfileId) {
      const vendureSellerId = context.user.sellerId || context.user.id;
      const profileResult = await AppDataSource.query(
        `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
        [vendureSellerId]
      );
      vendorProfileId = profileResult[0]?.id;
    }

    let query = `
      SELECT
        id, vendor_profile_id as "vendorProfileId",
        module_id as "moduleId", module_name as "moduleName",
        module_category as "moduleCategory", status,
        progress_percentage as "progressPercentage",
        started_at as "startedAt", completed_at as "completedAt",
        time_spent_minutes as "timeSpentMinutes",
        quiz_score as "quizScore", quiz_attempts as "quizAttempts",
        certification_earned as "certificationEarned",
        certification_expires_at as "certificationExpiresAt",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.vendor_training_progress
      WHERE vendor_profile_id = $1
    `;

    const params: any[] = [vendorProfileId];
    let paramIndex = 2;

    if (args.moduleCategory) {
      query += ` AND module_category = $${paramIndex}`;
      params.push(args.moduleCategory);
      paramIndex++;
    }

    if (args.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(args.status);
    }

    query += ` ORDER BY created_at DESC`;

    return await AppDataSource.query(query, params);
  },

  /**
   * Get vendor quality metrics
   */
  async vendorQualityMetrics(
    _parent: any,
    args: { vendorProfileId?: string; periodStartDate?: string; periodEndDate?: string },
    context: any
  ) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    let vendorProfileId = args.vendorProfileId;

    if (!vendorProfileId) {
      const vendureSellerId = context.user.sellerId || context.user.id;
      const profileResult = await AppDataSource.query(
        `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
        [vendureSellerId]
      );
      vendorProfileId = profileResult[0]?.id;
    }

    let query = `
      SELECT
        id, vendor_profile_id as "vendorProfileId",
        correct_category_assignments as "correctCategoryAssignments",
        incorrect_category_assignments as "incorrectCategoryAssignments",
        correct_function_assignments as "correctFunctionAssignments",
        incorrect_function_assignments as "incorrectFunctionAssignments",
        protocols_provided as "protocolsProvided",
        protocols_missing as "protocolsMissing",
        protocol_quality_score as "protocolQualityScore",
        high_quality_images as "highQualityImages",
        low_quality_images as "lowQualityImages",
        missing_images as "missingImages",
        complete_descriptions as "completeDescriptions",
        incomplete_descriptions as "incompleteDescriptions",
        description_quality_score as "descriptionQualityScore",
        compliant_products as "compliantProducts",
        non_compliant_products as "nonCompliantProducts",
        compliance_issues as "complianceIssues",
        overall_quality_score as "overallQualityScore",
        period_start_date as "periodStartDate",
        period_end_date as "periodEndDate",
        calculated_at as "calculatedAt",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM jade.vendor_quality_metrics
      WHERE vendor_profile_id = $1
    `;

    const params: any[] = [vendorProfileId];

    if (args.periodStartDate && args.periodEndDate) {
      query += ` AND period_start_date >= $2 AND period_end_date <= $3`;
      params.push(args.periodStartDate, args.periodEndDate);
    }

    query += ` ORDER BY calculated_at DESC LIMIT 1`;

    const result = await AppDataSource.query(query, params);
    return result[0] || null;
  },

  /**
   * Get pending actions
   */
  async pendingActions(_parent: any, args: { vendorProfileId?: string }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    // This is generated dynamically based on current state
    // See vendorDashboard for implementation
    return [];
  },
};

/**
 * Mutation Resolvers
 */
export const vendorMutationResolvers = {
  /**
   * Create vendor profile
   */
  async createVendorProfile(_parent: any, args: { input: any }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const { input } = args;

    const result = await AppDataSource.query(
      `
      INSERT INTO jade.vendor_profile (
        vendure_seller_id, company_name, contact_name, contact_email,
        contact_phone, business_license_number, tax_id, website_url,
        logo_url, description, established_year, specializations, certifications
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING
        id, vendure_seller_id as "vendureSellerId", company_name as "companyName",
        contact_name as "contactName", contact_email as "contactEmail",
        created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        input.vendureSellerId,
        input.companyName,
        input.contactName || null,
        input.contactEmail,
        input.contactPhone || null,
        input.businessLicenseNumber || null,
        input.taxId || null,
        input.websiteUrl || null,
        input.logoUrl || null,
        input.description || null,
        input.establishedYear || null,
        input.specializations ? JSON.stringify(input.specializations) : null,
        input.certifications ? JSON.stringify(input.certifications) : null,
      ]
    );

    return result[0];
  },

  /**
   * Update vendor profile
   */
  async updateVendorProfile(_parent: any, args: { id: string; input: any }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const { id, input } = args;

    // Build dynamic update query
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (input.companyName !== undefined) {
      updateFields.push(`company_name = $${paramIndex}`);
      params.push(input.companyName);
      paramIndex++;
    }

    if (input.contactName !== undefined) {
      updateFields.push(`contact_name = $${paramIndex}`);
      params.push(input.contactName);
      paramIndex++;
    }

    if (input.contactEmail !== undefined) {
      updateFields.push(`contact_email = $${paramIndex}`);
      params.push(input.contactEmail);
      paramIndex++;
    }

    if (input.contactPhone !== undefined) {
      updateFields.push(`contact_phone = $${paramIndex}`);
      params.push(input.contactPhone);
      paramIndex++;
    }

    if (input.websiteUrl !== undefined) {
      updateFields.push(`website_url = $${paramIndex}`);
      params.push(input.websiteUrl);
      paramIndex++;
    }

    if (input.logoUrl !== undefined) {
      updateFields.push(`logo_url = $${paramIndex}`);
      params.push(input.logoUrl);
      paramIndex++;
    }

    if (input.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      params.push(input.description);
      paramIndex++;
    }

    if (input.specializations !== undefined) {
      updateFields.push(`specializations = $${paramIndex}`);
      params.push(JSON.stringify(input.specializations));
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);

    params.push(id);

    const result = await AppDataSource.query(
      `
      UPDATE jade.vendor_profile
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING
        id, vendure_seller_id as "vendureSellerId", company_name as "companyName",
        contact_name as "contactName", contact_email as "contactEmail",
        updated_at as "updatedAt"
      `,
      params
    );

    return result[0];
  },

  /**
   * Complete vendor onboarding
   */
  async completeVendorOnboarding(_parent: any, args: { vendorProfileId: string }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const result = await AppDataSource.query(
      `
      UPDATE jade.vendor_profile
      SET onboarding_completed = true, onboarding_completed_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING
        id, onboarding_completed as "onboardingCompleted",
        onboarding_completed_at as "onboardingCompletedAt"
      `,
      [args.vendorProfileId]
    );

    return result[0];
  },

  /**
   * Submit product for review
   */
  async submitProduct(_parent: any, args: { input: any }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const vendureSellerId = context.user.sellerId || context.user.id;
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
      [vendureSellerId]
    );

    const vendorProfileId = profileResult[0]?.id;
    if (!vendorProfileId) {
      throw new Error('Vendor profile not found');
    }

    const { input } = args;

    const result = await AppDataSource.query(
      `
      INSERT INTO jade.product_submission (
        vendor_profile_id, product_id, submission_status,
        training_completed, guidance_steps_completed, submitted_at
      )
      VALUES ($1, $2, 'PENDING_REVIEW', $3, $4, NOW())
      RETURNING
        id, vendor_profile_id as "vendorProfileId", product_id as "productId",
        submission_status as "submissionStatus", submitted_at as "submittedAt"
      `,
      [
        vendorProfileId,
        input.productId,
        input.trainingCompleted,
        input.guidanceStepsCompleted ? JSON.stringify(input.guidanceStepsCompleted) : null,
      ]
    );

    return result[0];
  },

  /**
   * Approve product submission (admin only)
   */
  async approveProductSubmission(
    _parent: any,
    args: { id: string; reviewNotes?: string },
    context: any
  ) {
    if (!context.user?.isAdmin) {
      throw new Error('Admin access required');
    }

    const result = await AppDataSource.query(
      `
      UPDATE jade.product_submission
      SET
        submission_status = 'APPROVED',
        reviewed_by = $1,
        reviewed_at = NOW(),
        review_notes = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING
        id, submission_status as "submissionStatus",
        reviewed_at as "reviewedAt"
      `,
      [context.user.id, args.reviewNotes || null, args.id]
    );

    return result[0];
  },

  /**
   * Reject product submission (admin only)
   */
  async rejectProductSubmission(
    _parent: any,
    args: { id: string; rejectionReason: string; reviewNotes?: string },
    context: any
  ) {
    if (!context.user?.isAdmin) {
      throw new Error('Admin access required');
    }

    const result = await AppDataSource.query(
      `
      UPDATE jade.product_submission
      SET
        submission_status = 'REJECTED',
        reviewed_by = $1,
        reviewed_at = NOW(),
        review_notes = $2,
        rejection_reason = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING
        id, submission_status as "submissionStatus",
        rejection_reason as "rejectionReason"
      `,
      [context.user.id, args.reviewNotes || null, args.rejectionReason, args.id]
    );

    return result[0];
  },

  /**
   * Start training module
   */
  async startTrainingModule(_parent: any, args: { input: any }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const vendureSellerId = context.user.sellerId || context.user.id;
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
      [vendureSellerId]
    );

    const vendorProfileId = profileResult[0]?.id;
    if (!vendorProfileId) {
      throw new Error('Vendor profile not found');
    }

    const { input } = args;

    const result = await AppDataSource.query(
      `
      INSERT INTO jade.vendor_training_progress (
        vendor_profile_id, module_id, module_name, module_category,
        status, started_at
      )
      VALUES ($1, $2, $3, $4, 'IN_PROGRESS', NOW())
      ON CONFLICT (vendor_profile_id, module_id)
      DO UPDATE SET
        status = 'IN_PROGRESS',
        started_at = COALESCE(jade.vendor_training_progress.started_at, NOW()),
        updated_at = NOW()
      RETURNING
        id, module_id as "moduleId", module_name as "moduleName",
        status, started_at as "startedAt"
      `,
      [vendorProfileId, input.moduleId, input.moduleName, input.moduleCategory || null]
    );

    return result[0];
  },

  /**
   * Complete training module
   */
  async completeTrainingModule(_parent: any, args: { input: any }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const vendureSellerId = context.user.sellerId || context.user.id;
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
      [vendureSellerId]
    );

    const vendorProfileId = profileResult[0]?.id;
    if (!vendorProfileId) {
      throw new Error('Vendor profile not found');
    }

    const { input } = args;

    const result = await AppDataSource.query(
      `
      UPDATE jade.vendor_training_progress
      SET
        status = 'COMPLETED',
        progress_percentage = 100,
        completed_at = NOW(),
        time_spent_minutes = time_spent_minutes + $1,
        quiz_score = $2,
        quiz_attempts = quiz_attempts + 1,
        updated_at = NOW()
      WHERE vendor_profile_id = $3 AND module_id = $4
      RETURNING
        id, module_id as "moduleId", status,
        completed_at as "completedAt", quiz_score as "quizScore"
      `,
      [input.timeSpentMinutes, input.quizScore || null, vendorProfileId, input.moduleId]
    );

    return result[0];
  },

  /**
   * Refresh vendor statistics
   */
  async refreshVendorStatistics(_parent: any, args: { vendorProfileId: string }, context: any) {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    // Call the database function to update statistics
    await AppDataSource.query(`SELECT jade.update_vendor_statistics($1)`, [args.vendorProfileId]);

    // Return the updated statistics
    return await vendorQueryResolvers.vendorStatistics(
      _parent,
      { vendorProfileId: args.vendorProfileId },
      context
    );
  },
};

/**
 * Field Resolvers
 */
export const vendorFieldResolvers = {
  VendorProfile: {
    async statistics(parent: any) {
      const result = await AppDataSource.query(
        `
        SELECT
          id, total_products as "totalProducts",
          active_products as "activeProducts",
          taxonomy_accuracy_score as "taxonomyAccuracyScore"
        FROM jade.vendor_statistics
        WHERE vendor_profile_id = $1
        ORDER BY calculated_at DESC
        LIMIT 1
        `,
        [parent.id]
      );

      return result[0] || null;
    },

    async products(parent: any) {
      return await AppDataSource.query(
        `
        SELECT id, brand_name as "brandName", enabled
        FROM jade.product_extension
        WHERE vendor_profile_id = $1
        ORDER BY created_at DESC
        `,
        [parent.id]
      );
    },

    async qualityMetrics(parent: any) {
      const result = await AppDataSource.query(
        `
        SELECT
          id, overall_quality_score as "overallQualityScore",
          calculated_at as "calculatedAt"
        FROM jade.vendor_quality_metrics
        WHERE vendor_profile_id = $1
        ORDER BY calculated_at DESC
        LIMIT 1
        `,
        [parent.id]
      );

      return result[0] || null;
    },
  },
};
