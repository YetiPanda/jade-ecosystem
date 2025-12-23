/**
 * Custom Hooks for Vendor Portal
 * Week 4 Day 3: Vendor Dashboard
 */

import { useQuery, useMutation } from '@apollo/client';
import {
  GET_MY_VENDOR_PROFILE,
  // GET_VENDOR_DASHBOARD, // DEPRECATED - replaced by Feature 011 useVendorPortalDashboard
  GET_VENDOR_STATISTICS,
  GET_PRODUCT_SUBMISSIONS,
  GET_VENDOR_TRAINING_PROGRESS,
  GET_VENDOR_QUALITY_METRICS,
  CREATE_VENDOR_PROFILE,
  UPDATE_VENDOR_PROFILE,
  COMPLETE_VENDOR_ONBOARDING,
  SUBMIT_PRODUCT,
  START_TRAINING_MODULE,
  COMPLETE_TRAINING_MODULE,
  REFRESH_VENDOR_STATISTICS,
} from '../graphql/vendor.queries';

// ========================================
// TypeScript Interfaces
// ========================================

export interface VendorProfile {
  id: string;
  vendureSellerId: string;
  companyName: string;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
  specializations?: string[];
  establishedYear?: number;
  taxonomyAccuracyScore: number;
  productApprovalRate: number;
  isActive: boolean;
  isVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorStatistics {
  id: string;
  totalProducts: number;
  activeProducts: number;
  pendingApprovalProducts: number;
  rejectedProducts: number;
  totalSalesAmount: number;
  monthlySalesAmount: number;
  yearlySalesAmount?: number;
  totalCustomers: number;
  repeatCustomers?: number;
  customerRetentionRate?: number;
  productsWithCompleteTaxonomy: number;
  productsWithProtocols?: number;
  professionalProducts: number;
  calculatedAt: string;
  periodStartDate?: string;
  periodEndDate?: string;
}

export interface ProductSubmission {
  id: string;
  productId?: string;
  submissionStatus: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  taxonomyCompletenessScore: number;
  validationErrors?: ValidationError[];
  validationWarnings?: ValidationWarning[];
  reviewNotes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  createdAt: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface TrainingProgress {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleCategory?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CERTIFIED';
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  timeSpentMinutes: number;
  quizScore?: number;
  certificationEarned: boolean;
}

export interface QualityMetrics {
  id: string;
  correctCategoryAssignments: number;
  incorrectCategoryAssignments: number;
  correctFunctionAssignments: number;
  incorrectFunctionAssignments: number;
  protocolsProvided: number;
  protocolsMissing: number;
  protocolQualityScore: number;
  overallQualityScore: number;
  calculatedAt: string;
}

export interface PendingAction {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface VendorDashboard {
  profile: VendorProfile;
  statistics: VendorStatistics;
  recentSubmissions: ProductSubmission[];
  trainingProgress: TrainingProgress[];
  qualityScore: number;
  pendingActions: PendingAction[];
}

// ========================================
// Query Hooks
// ========================================

/**
 * Get current vendor's profile
 */
export function useMyVendorProfile() {
  return useQuery<{ myVendorProfile: VendorProfile }>(GET_MY_VENDOR_PROFILE);
}

/**
 * Get vendor dashboard summary (Glance level)
 *
 * DEPRECATED: Replaced by useVendorPortalDashboard from Feature 011
 * See: apps/marketplace-frontend/src/hooks/useVendorPortalDashboard.ts
 */
/*
export function useVendorDashboard() {
  return useQuery<{ vendorDashboard: VendorDashboard }>(GET_VENDOR_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
  });
}
*/

/**
 * Get vendor statistics
 */
export function useVendorStatistics(variables?: {
  vendorProfileId?: string;
  periodStartDate?: string;
  periodEndDate?: string;
}) {
  return useQuery<{ vendorStatistics: VendorStatistics }>(GET_VENDOR_STATISTICS, {
    variables,
    skip: !variables,
  });
}

/**
 * Get product submissions
 */
export function useProductSubmissions(variables?: {
  vendorProfileId?: string;
  submissionStatus?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery<{ productSubmissions: ProductSubmission[] }>(GET_PRODUCT_SUBMISSIONS, {
    variables,
  });
}

/**
 * Get vendor training progress
 */
export function useVendorTrainingProgress(variables?: {
  vendorProfileId?: string;
  moduleCategory?: string;
  status?: string;
}) {
  return useQuery<{ vendorTrainingProgress: TrainingProgress[] }>(GET_VENDOR_TRAINING_PROGRESS, {
    variables,
  });
}

/**
 * Get vendor quality metrics
 */
export function useVendorQualityMetrics(variables?: {
  vendorProfileId?: string;
  periodStartDate?: string;
  periodEndDate?: string;
}) {
  return useQuery<{ vendorQualityMetrics: QualityMetrics }>(GET_VENDOR_QUALITY_METRICS, {
    variables,
  });
}

// ========================================
// Mutation Hooks
// ========================================

/**
 * Create vendor profile
 */
export function useCreateVendorProfile() {
  return useMutation(CREATE_VENDOR_PROFILE);
}

/**
 * Update vendor profile
 */
export function useUpdateVendorProfile() {
  return useMutation(UPDATE_VENDOR_PROFILE);
}

/**
 * Complete vendor onboarding
 */
export function useCompleteVendorOnboarding() {
  return useMutation(COMPLETE_VENDOR_ONBOARDING);
}

/**
 * Submit product for review
 */
export function useSubmitProduct() {
  return useMutation(SUBMIT_PRODUCT, {
    refetchQueries: [
      // { query: GET_VENDOR_DASHBOARD }, // DEPRECATED - removed query
      { query: GET_PRODUCT_SUBMISSIONS, variables: {} },
    ],
  });
}

/**
 * Start training module
 */
export function useStartTrainingModule() {
  return useMutation(START_TRAINING_MODULE, {
    refetchQueries: [{ query: GET_VENDOR_TRAINING_PROGRESS, variables: {} }],
  });
}

/**
 * Complete training module
 */
export function useCompleteTrainingModule() {
  return useMutation(COMPLETE_TRAINING_MODULE, {
    refetchQueries: [
      // { query: GET_VENDOR_DASHBOARD }, // DEPRECATED - removed query
      { query: GET_VENDOR_TRAINING_PROGRESS, variables: {} },
    ],
  });
}

/**
 * Refresh vendor statistics
 */
export function useRefreshVendorStatistics() {
  return useMutation(REFRESH_VENDOR_STATISTICS, {
    refetchQueries: [
      // { query: GET_VENDOR_DASHBOARD }, // DEPRECATED - removed query
    ],
  });
}
