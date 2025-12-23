/**
 * Type definitions for Vendor Application & Onboarding
 * Sprint E.1 - Application & Onboarding (Week 13)
 */

import { VendorValue, CertificationType } from './profile';

/**
 * Application Status Enum
 */
export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ADDITIONAL_INFO_REQUESTED = 'additional_info_requested',
  APPROVED = 'approved',
  CONDITIONALLY_APPROVED = 'conditionally_approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

/**
 * Onboarding Step Status
 */
export type OnboardingStepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

/**
 * Contact Information (Step 1)
 */
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string; // "Founder", "Sales Director", etc.
}

/**
 * Company Information (Step 2)
 */
export interface CompanyInfo {
  brandName: string;
  legalName: string;
  website: string;
  yearFounded: number;
  headquarters: string;
  employeeCount: string; // Range: "1-10", "11-50", etc.
  annualRevenue?: string; // Optional range
}

/**
 * Product Information (Step 3)
 */
export interface ProductInfo {
  productCategories: string[];
  skuCount: string; // Range: "1-10", "11-50", etc.
  priceRange: string; // "$", "$$", "$$$", "$$$$"
  minimumOrderValue: number;
  leadTime: string; // Days
  targetMarket: string[]; // "Day Spas", "Med Spas", etc.
  currentDistribution: string[]; // Existing channels
}

/**
 * Documents Upload
 */
export interface ApplicationDocuments {
  productCatalog?: string; // URL
  lineSheet?: string; // URL
  insuranceCertificate?: string; // URL
  businessLicense?: string; // URL
}

/**
 * Review Note
 */
export interface ReviewNote {
  reviewerId: string;
  reviewerName: string;
  note: string;
  category: 'general' | 'risk' | 'quality' | 'fit';
  createdAt: Date;
}

/**
 * Full Vendor Application
 */
export interface VendorApplication {
  applicationId: string;

  // Application Data
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  productInfo: ProductInfo;
  values: VendorValue[];
  certifications: CertificationType[];
  whyJade: string; // Free text, why they want to join
  documents: ApplicationDocuments;

  // Internal Processing
  status: ApplicationStatus;
  assignedReviewer?: string;
  reviewNotes: ReviewNote[];
  riskScore?: number; // 0-100, automated risk assessment

  // Timestamps
  submittedAt?: Date;
  reviewStartedAt?: Date;
  decidedAt?: Date;
  slaDeadline?: Date; // submittedAt + 3 business days
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Application Form Data (for form state)
 */
export interface ApplicationFormData {
  contactInfo: Partial<ContactInfo>;
  companyInfo: Partial<CompanyInfo>;
  productInfo: Partial<ProductInfo>;
  values: VendorValue[];
  certifications: CertificationType[];
  whyJade: string;
  documents: ApplicationDocuments;
}

/**
 * Onboarding Step Definition
 */
export interface OnboardingStep {
  stepId: string;
  name: string;
  description: string;
  order: number;
  status: OnboardingStepStatus;
  completedAt?: Date;
  isRequired: boolean;
  estimatedMinutes?: number;
  resources?: OnboardingResource[];
}

/**
 * Onboarding Resource (help docs, videos, etc.)
 */
export interface OnboardingResource {
  title: string;
  type: 'guide' | 'video' | 'template' | 'link';
  url: string;
}

/**
 * Vendor Onboarding Progress
 */
export interface VendorOnboarding {
  vendorId: string;
  applicationId: string;

  // Checklist Steps
  steps: OnboardingStep[];

  // Overall Progress
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;

  // Timeline
  startedAt: Date;
  targetCompletionDate: Date; // 2 weeks from approval
  completedAt?: Date;

  // Support
  assignedSuccessManager?: string;
  supportThreadId?: string;
}

/**
 * Default Onboarding Steps (8 steps, 2-week timeline)
 */
export const DEFAULT_ONBOARDING_STEPS: Omit<
  OnboardingStep,
  'stepId' | 'status' | 'completedAt'
>[] = [
  {
    name: 'Complete Brand Profile',
    description: 'Add your brand story, values, and imagery to help spas discover you',
    order: 1,
    isRequired: true,
    estimatedMinutes: 30,
    resources: [
      {
        title: 'Brand Profile Best Practices',
        type: 'guide',
        url: '/help/brand-profile',
      },
    ],
  },
  {
    name: 'Upload Product Catalog',
    description: 'Add your first 5-10 products with descriptions, images, and pricing',
    order: 2,
    isRequired: true,
    estimatedMinutes: 120,
    resources: [
      {
        title: 'Product Upload Template',
        type: 'template',
        url: '/templates/product-upload.csv',
      },
      {
        title: 'Product Photography Guide',
        type: 'guide',
        url: '/help/product-photos',
      },
    ],
  },
  {
    name: 'Set Up Payment & Shipping',
    description: 'Configure payment methods and shipping zones',
    order: 3,
    isRequired: true,
    estimatedMinutes: 20,
    resources: [
      {
        title: 'Payment Setup Guide',
        type: 'guide',
        url: '/help/payments',
      },
    ],
  },
  {
    name: 'Review Terms & Conditions',
    description: 'Read and accept the Jade Marketplace Vendor Agreement',
    order: 4,
    isRequired: true,
    estimatedMinutes: 15,
  },
  {
    name: 'Set Inventory Levels',
    description: 'Add current stock levels for all products',
    order: 5,
    isRequired: true,
    estimatedMinutes: 30,
  },
  {
    name: 'Configure Notifications',
    description: 'Set up email and SMS alerts for orders and messages',
    order: 6,
    isRequired: false,
    estimatedMinutes: 10,
  },
  {
    name: 'Watch Platform Tour',
    description: 'Learn how to navigate the vendor portal and fulfill orders',
    order: 7,
    isRequired: false,
    estimatedMinutes: 15,
    resources: [
      {
        title: 'Vendor Portal Tour',
        type: 'video',
        url: 'https://videos.jade.com/vendor-tour',
      },
    ],
  },
  {
    name: 'Go Live!',
    description: 'Your profile is ready to be discovered by spas',
    order: 8,
    isRequired: true,
    estimatedMinutes: 5,
  },
];

/**
 * Helper Functions
 */

/**
 * Get status color for application status
 */
export function getApplicationStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.DRAFT:
      return '#888';
    case ApplicationStatus.SUBMITTED:
      return '#646cff';
    case ApplicationStatus.UNDER_REVIEW:
      return '#f59e0b';
    case ApplicationStatus.ADDITIONAL_INFO_REQUESTED:
      return '#ef4444';
    case ApplicationStatus.APPROVED:
    case ApplicationStatus.CONDITIONALLY_APPROVED:
      return '#22c55e';
    case ApplicationStatus.REJECTED:
    case ApplicationStatus.WITHDRAWN:
      return '#ef4444';
    default:
      return '#888';
  }
}

/**
 * Get human-readable status label
 */
export function getApplicationStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.DRAFT:
      return 'Draft';
    case ApplicationStatus.SUBMITTED:
      return 'Submitted';
    case ApplicationStatus.UNDER_REVIEW:
      return 'Under Review';
    case ApplicationStatus.ADDITIONAL_INFO_REQUESTED:
      return 'Additional Info Requested';
    case ApplicationStatus.APPROVED:
      return 'Approved';
    case ApplicationStatus.CONDITIONALLY_APPROVED:
      return 'Conditionally Approved';
    case ApplicationStatus.REJECTED:
      return 'Rejected';
    case ApplicationStatus.WITHDRAWN:
      return 'Withdrawn';
    default:
      return status;
  }
}

/**
 * Calculate onboarding progress percentage
 */
export function calculateOnboardingProgress(steps: OnboardingStep[]): number {
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  return Math.round((completedCount / steps.length) * 100);
}

/**
 * Get next pending step
 */
export function getNextPendingStep(steps: OnboardingStep[]): OnboardingStep | null {
  return (
    steps.find(
      (s) => (s.status === 'pending' || s.status === 'in_progress') && s.isRequired
    ) || null
  );
}

/**
 * Estimate time remaining in minutes
 */
export function estimateTimeRemaining(steps: OnboardingStep[]): number {
  return steps
    .filter((s) => s.status === 'pending' || s.status === 'in_progress')
    .reduce((total, step) => total + (step.estimatedMinutes || 0), 0);
}

/**
 * Check if SLA is at risk
 */
export function isSLAAtRisk(slaDeadline: Date | undefined): boolean {
  if (!slaDeadline) return false;
  const now = new Date();
  const hoursRemaining = (slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursRemaining < 24 && hoursRemaining > 0;
}

/**
 * Check if SLA is breached
 */
export function isSLABreached(slaDeadline: Date | undefined): boolean {
  if (!slaDeadline) return false;
  return new Date() > slaDeadline;
}

/**
 * Format SLA deadline
 */
export function formatSLADeadline(slaDeadline: Date | undefined): string {
  if (!slaDeadline) return 'No deadline';

  const now = new Date();
  const diff = slaDeadline.getTime() - now.getTime();
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));

  if (diff < 0) {
    const hoursOverdue = Math.abs(hoursRemaining);
    return `${hoursOverdue}h overdue`;
  }

  if (hoursRemaining < 24) {
    return `${hoursRemaining}h remaining`;
  }

  const daysRemaining = Math.floor(hoursRemaining / 24);
  return `${daysRemaining}d remaining`;
}
