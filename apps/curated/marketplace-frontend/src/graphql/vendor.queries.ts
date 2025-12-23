/**
 * GraphQL Queries for Vendor Portal
 * Week 4 Day 3: Vendor Dashboard
 */

import { gql } from '@apollo/client';

// ========================================
// Fragments
// ========================================

export const VENDOR_PROFILE_FRAGMENT = gql`
  fragment VendorProfileFields on VendorProfile {
    id
    vendureSellerId
    companyName
    contactName
    contactEmail
    contactPhone
    websiteUrl
    logoUrl
    description
    taxonomyAccuracyScore
    productApprovalRate
    isActive
    isVerified
    onboardingCompleted
    createdAt
    updatedAt
  }
`;

export const VENDOR_STATISTICS_FRAGMENT = gql`
  fragment VendorStatisticsFields on VendorStatistics {
    id
    totalProducts
    activeProducts
    pendingApprovalProducts
    rejectedProducts
    totalSalesAmount
    monthlySalesAmount
    totalCustomers
    productsWithCompleteTaxonomy
    professionalProducts
    calculatedAt
  }
`;

// ========================================
// Queries
// ========================================

/**
 * Get current vendor's profile
 */
export const GET_MY_VENDOR_PROFILE = gql`
  ${VENDOR_PROFILE_FRAGMENT}

  query GetMyVendorProfile {
    myVendorProfile {
      ...VendorProfileFields
      specializations
      establishedYear
    }
  }
`;

/**
 * Get vendor dashboard summary (Glance level)
 *
 * DEPRECATED: This query is replaced by Feature 011 vendor-portal.graphql
 * The new vendorDashboard query requires a dateRange parameter and returns VendorDashboardMetrics
 * which has a different structure (no pendingActions, profile, statistics fields).
 *
 * See: apps/marketplace-frontend/src/hooks/useVendorPortalDashboard.ts for the new implementation
 * See: apps/marketplace-frontend/src/graphql/queries/vendor-dashboard.graphql for the new query
 */
/*
export const GET_VENDOR_DASHBOARD = gql`
  ${VENDOR_PROFILE_FRAGMENT}
  ${VENDOR_STATISTICS_FRAGMENT}

  query GetVendorDashboard {
    vendorDashboard {
      profile {
        ...VendorProfileFields
      }
      statistics {
        ...VendorStatisticsFields
      }
      recentSubmissions {
        id
        submissionStatus
        taxonomyCompletenessScore
        submittedAt
        createdAt
      }
      trainingProgress {
        moduleName
        status
        progressPercentage
      }
      qualityScore
      pendingActions {
        id
        type
        title
        description
        priority
        dueDate
        actionUrl
        createdAt
      }
    }
  }
`;
*/

/**
 * Get vendor statistics
 */
export const GET_VENDOR_STATISTICS = gql`
  ${VENDOR_STATISTICS_FRAGMENT}

  query GetVendorStatistics($vendorProfileId: ID, $periodStartDate: String, $periodEndDate: String) {
    vendorStatistics(
      vendorProfileId: $vendorProfileId
      periodStartDate: $periodStartDate
      periodEndDate: $periodEndDate
    ) {
      ...VendorStatisticsFields
      yearlySalesAmount
      averageOrderValue
      repeatCustomers
      customerRetentionRate
      productsWithProtocols
      periodStartDate
      periodEndDate
    }
  }
`;

/**
 * Get product submissions
 */
export const GET_PRODUCT_SUBMISSIONS = gql`
  query GetProductSubmissions(
    $vendorProfileId: ID
    $submissionStatus: SubmissionStatus
    $limit: Int
    $offset: Int
  ) {
    productSubmissions(
      vendorProfileId: $vendorProfileId
      submissionStatus: $submissionStatus
      limit: $limit
      offset: $offset
    ) {
      id
      productId
      submissionStatus
      taxonomyCompletenessScore
      validationErrors {
        field
        message
        severity
      }
      validationWarnings {
        field
        message
        suggestion
      }
      reviewNotes
      rejectionReason
      submittedAt
      createdAt
    }
  }
`;

/**
 * Get vendor training progress
 */
export const GET_VENDOR_TRAINING_PROGRESS = gql`
  query GetVendorTrainingProgress(
    $vendorProfileId: ID
    $moduleCategory: String
    $status: TrainingStatus
  ) {
    vendorTrainingProgress(
      vendorProfileId: $vendorProfileId
      moduleCategory: $moduleCategory
      status: $status
    ) {
      id
      moduleId
      moduleName
      moduleCategory
      status
      progressPercentage
      startedAt
      completedAt
      timeSpentMinutes
      quizScore
      certificationEarned
    }
  }
`;

/**
 * Get vendor quality metrics
 */
export const GET_VENDOR_QUALITY_METRICS = gql`
  query GetVendorQualityMetrics(
    $vendorProfileId: ID
    $periodStartDate: String
    $periodEndDate: String
  ) {
    vendorQualityMetrics(
      vendorProfileId: $vendorProfileId
      periodStartDate: $periodStartDate
      periodEndDate: $periodEndDate
    ) {
      id
      correctCategoryAssignments
      incorrectCategoryAssignments
      correctFunctionAssignments
      incorrectFunctionAssignments
      protocolsProvided
      protocolsMissing
      protocolQualityScore
      overallQualityScore
      calculatedAt
    }
  }
`;

// ========================================
// Mutations
// ========================================

/**
 * Create vendor profile
 */
export const CREATE_VENDOR_PROFILE = gql`
  ${VENDOR_PROFILE_FRAGMENT}

  mutation CreateVendorProfile($input: CreateVendorProfileInput!) {
    createVendorProfile(input: $input) {
      ...VendorProfileFields
    }
  }
`;

/**
 * Update vendor profile
 */
export const UPDATE_VENDOR_PROFILE = gql`
  ${VENDOR_PROFILE_FRAGMENT}

  mutation UpdateVendorProfile($id: ID!, $input: UpdateVendorProfileInput!) {
    updateVendorProfile(id: $id, input: $input) {
      ...VendorProfileFields
    }
  }
`;

/**
 * Complete vendor onboarding
 */
export const COMPLETE_VENDOR_ONBOARDING = gql`
  mutation CompleteVendorOnboarding($vendorProfileId: ID!) {
    completeVendorOnboarding(vendorProfileId: $vendorProfileId) {
      id
      onboardingCompleted
      onboardingCompletedAt
    }
  }
`;

/**
 * Submit product for review
 */
export const SUBMIT_PRODUCT = gql`
  mutation SubmitProduct($input: SubmitProductInput!) {
    submitProduct(input: $input) {
      id
      submissionStatus
      submittedAt
    }
  }
`;

/**
 * Start training module
 */
export const START_TRAINING_MODULE = gql`
  mutation StartTrainingModule($input: StartTrainingModuleInput!) {
    startTrainingModule(input: $input) {
      id
      moduleId
      moduleName
      status
      startedAt
    }
  }
`;

/**
 * Complete training module
 */
export const COMPLETE_TRAINING_MODULE = gql`
  mutation CompleteTrainingModule($input: CompleteTrainingModuleInput!) {
    completeTrainingModule(input: $input) {
      id
      moduleId
      status
      completedAt
      quizScore
    }
  }
`;

/**
 * Refresh vendor statistics
 */
export const REFRESH_VENDOR_STATISTICS = gql`
  ${VENDOR_STATISTICS_FRAGMENT}

  mutation RefreshVendorStatistics($vendorProfileId: ID!) {
    refreshVendorStatistics(vendorProfileId: $vendorProfileId) {
      ...VendorStatisticsFields
    }
  }
`;
