/**
 * Admin-specific type definitions
 * Sprint E.2 - Admin Tools
 */

import { VendorApplication, ApplicationStatus } from './application';

/**
 * Risk Factor Categories
 */
export enum RiskFactorCategory {
  BUSINESS_LEGITIMACY = 'business_legitimacy',
  PRODUCT_QUALITY = 'product_quality',
  OPERATIONAL_CAPACITY = 'operational_capacity',
  COMPLIANCE = 'compliance',
  MARKET_FIT = 'market_fit',
}

/**
 * Risk Factor
 */
export interface RiskFactor {
  category: RiskFactorCategory;
  factor: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number; // 0-100, higher = more risky
  description: string;
}

/**
 * Risk Assessment Result
 */
export interface RiskAssessment {
  applicationId: string;
  overallScore: number; // 0-100, higher = more risky
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  factors: RiskFactor[];
  assessedAt: Date;
  recommendations: string[];
}

/**
 * Application Queue Filters
 */
export interface ApplicationQueueFilters {
  status?: ApplicationStatus[];
  assignedReviewer?: string;
  riskLevel?: ('critical' | 'high' | 'medium' | 'low')[];
  slaStatus?: ('breached' | 'at_risk' | 'on_track')[];
  sortBy?: 'submittedAt' | 'slaDeadline' | 'riskScore';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Application Queue Item
 */
export interface ApplicationQueueItem {
  applicationId: string;
  brandName: string;
  contactName: string;
  status: ApplicationStatus;
  submittedAt: Date;
  slaDeadline: Date;
  riskScore: number;
  assignedReviewer?: string;
  reviewerAvatar?: string;
}

/**
 * Approval Decision
 */
export interface ApprovalDecision {
  applicationId: string;
  decision: 'approve' | 'conditionally_approve' | 'reject' | 'request_info';
  reviewerNotes: string;
  conditions?: string[]; // For conditional approvals
  internalNotes?: string; // Not visible to applicant
}

/**
 * SLA Metrics
 */
export interface SLAMetrics {
  totalApplications: number;
  withinSLA: number;
  atRisk: number;
  breached: number;
  averageReviewTime: number; // Hours
  onTimePercentage: number;
}

/**
 * Calculate risk assessment for an application
 */
export function calculateRiskAssessment(application: VendorApplication): RiskAssessment {
  const factors: RiskFactor[] = [];

  // Business Legitimacy Factors
  if (!application.companyInfo.website) {
    factors.push({
      category: RiskFactorCategory.BUSINESS_LEGITIMACY,
      factor: 'No website provided',
      severity: 'high',
      score: 25,
      description: 'Legitimate businesses typically have an online presence',
    });
  }

  const yearsSinceFoundation = new Date().getFullYear() - application.companyInfo.yearFounded;
  if (yearsSinceFoundation < 1) {
    factors.push({
      category: RiskFactorCategory.BUSINESS_LEGITIMACY,
      factor: 'Recently founded (<1 year)',
      severity: 'medium',
      score: 15,
      description: 'New businesses may have limited track record',
    });
  }

  // Product Quality Factors
  if (application.values.length === 0) {
    factors.push({
      category: RiskFactorCategory.PRODUCT_QUALITY,
      factor: 'No brand values selected',
      severity: 'low',
      score: 5,
      description: 'Values help spas understand brand positioning',
    });
  }

  if (application.certifications.length === 0) {
    factors.push({
      category: RiskFactorCategory.PRODUCT_QUALITY,
      factor: 'No certifications provided',
      severity: 'low',
      score: 5,
      description: 'Certifications validate product claims',
    });
  }

  // Operational Capacity Factors
  const employeeCount = application.companyInfo.employeeCount;
  if (employeeCount === '1-10') {
    factors.push({
      category: RiskFactorCategory.OPERATIONAL_CAPACITY,
      factor: 'Small team size (1-10 employees)',
      severity: 'medium',
      score: 10,
      description: 'May have limited capacity to fulfill large orders',
    });
  }

  const minOrderValue = application.productInfo.minimumOrderValue;
  if (minOrderValue > 1000) {
    factors.push({
      category: RiskFactorCategory.OPERATIONAL_CAPACITY,
      factor: 'High minimum order value',
      severity: 'medium',
      score: 15,
      description: `$${minOrderValue} MOV may limit spa accessibility`,
    });
  }

  // Compliance Factors
  if (!application.documents.insuranceCertificate) {
    factors.push({
      category: RiskFactorCategory.COMPLIANCE,
      factor: 'No insurance certificate',
      severity: 'critical',
      score: 30,
      description: 'Product liability insurance is required',
    });
  }

  if (!application.documents.businessLicense) {
    factors.push({
      category: RiskFactorCategory.COMPLIANCE,
      factor: 'No business license',
      severity: 'high',
      score: 20,
      description: 'Business license validates legal operation',
    });
  }

  // Market Fit Factors
  if (application.productInfo.productCategories.length === 0) {
    factors.push({
      category: RiskFactorCategory.MARKET_FIT,
      factor: 'No product categories selected',
      severity: 'medium',
      score: 10,
      description: 'Product categorization helps with marketplace discovery',
    });
  }

  if (application.productInfo.targetMarket.length === 0) {
    factors.push({
      category: RiskFactorCategory.MARKET_FIT,
      factor: 'No target market specified',
      severity: 'low',
      score: 5,
      description: 'Target market alignment improves sales potential',
    });
  }

  const priceRange = application.productInfo.priceRange;
  if (priceRange === '$$$$') {
    factors.push({
      category: RiskFactorCategory.MARKET_FIT,
      factor: 'Luxury price point',
      severity: 'low',
      score: 5,
      description: 'Ultra-premium products may have limited market',
    });
  }

  // Calculate overall score (sum of all factor scores)
  const overallScore = Math.min(100, factors.reduce((sum, f) => sum + f.score, 0));

  // Determine risk level
  let riskLevel: 'critical' | 'high' | 'medium' | 'low';
  if (overallScore >= 50) riskLevel = 'critical';
  else if (overallScore >= 30) riskLevel = 'high';
  else if (overallScore >= 15) riskLevel = 'medium';
  else riskLevel = 'low';

  // Generate recommendations
  const recommendations: string[] = [];
  if (factors.some((f) => f.category === RiskFactorCategory.COMPLIANCE)) {
    recommendations.push('Request all required compliance documents before approval');
  }
  if (factors.some((f) => f.severity === 'critical')) {
    recommendations.push('Schedule call with applicant to verify business legitimacy');
  }
  if (overallScore >= 30) {
    recommendations.push('Consider conditional approval with specific requirements');
  }
  if (factors.length === 0 || overallScore < 10) {
    recommendations.push('Low risk - fast-track for approval');
  }

  return {
    applicationId: application.applicationId,
    overallScore,
    riskLevel,
    factors,
    assessedAt: new Date(),
    recommendations,
  };
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: 'critical' | 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'critical':
      return '#ef4444';
    case 'high':
      return '#f59e0b';
    case 'medium':
      return '#eab308';
    case 'low':
      return '#22c55e';
  }
}

/**
 * Get risk category label
 */
export function getRiskCategoryLabel(category: RiskFactorCategory): string {
  switch (category) {
    case RiskFactorCategory.BUSINESS_LEGITIMACY:
      return 'Business Legitimacy';
    case RiskFactorCategory.PRODUCT_QUALITY:
      return 'Product Quality';
    case RiskFactorCategory.OPERATIONAL_CAPACITY:
      return 'Operational Capacity';
    case RiskFactorCategory.COMPLIANCE:
      return 'Compliance';
    case RiskFactorCategory.MARKET_FIT:
      return 'Market Fit';
  }
}

/**
 * Calculate SLA metrics for a list of applications
 */
export function calculateSLAMetrics(applications: VendorApplication[]): SLAMetrics {
  const now = new Date();

  const reviewedApps = applications.filter((app) => app.reviewStartedAt && app.decidedAt);
  const avgReviewTime =
    reviewedApps.length > 0
      ? reviewedApps.reduce((sum, app) => {
          const reviewTime =
            (app.decidedAt!.getTime() - app.reviewStartedAt!.getTime()) / (1000 * 60 * 60);
          return sum + reviewTime;
        }, 0) / reviewedApps.length
      : 0;

  const pendingApps = applications.filter((app) => !app.decidedAt && app.slaDeadline);
  const withinSLA = pendingApps.filter((app) => now < app.slaDeadline!).length;
  const atRisk = pendingApps.filter((app) => {
    if (!app.slaDeadline) return false;
    const hoursRemaining = (app.slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursRemaining < 24 && hoursRemaining > 0;
  }).length;
  const breached = pendingApps.filter((app) => app.slaDeadline && now > app.slaDeadline).length;

  const onTimePercentage =
    applications.length > 0
      ? ((applications.length - breached) / applications.length) * 100
      : 100;

  return {
    totalApplications: applications.length,
    withinSLA,
    atRisk,
    breached,
    averageReviewTime: avgReviewTime,
    onTimePercentage,
  };
}

/**
 * Get SLA status for an application
 */
export function getSLAStatus(
  slaDeadline: Date | undefined
): 'breached' | 'at_risk' | 'on_track' | 'completed' {
  if (!slaDeadline) return 'completed';

  const now = new Date();
  const hoursRemaining = (slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursRemaining < 0) return 'breached';
  if (hoursRemaining < 24) return 'at_risk';
  return 'on_track';
}
