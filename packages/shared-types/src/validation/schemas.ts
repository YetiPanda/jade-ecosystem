/**
 * Zod Validation Schemas
 *
 * Runtime validation schemas for all entity types
 */

import { z } from 'zod';
import {
  UserRole,
  LicenseType,
  ApprovalStatus,
  AppointmentStatus,
  SubscriptionTier,
  SubscriptionStatus,
  TreatmentPlanStatus,
  SkinType,
  TimeOfDay,
} from '../graphql/generated';

/**
 * Common Schemas
 */
export const UUIDSchema = z.string().uuid();

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
});

export const AddressSchema = z.object({
  street1: z.string().min(1),
  street2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  postalCode: z.string().min(5),
  country: z.string().length(2).default('US'),
});

export const DateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const PaginationInputSchema = z.object({
  first: z.number().int().positive().max(100).optional().nullable(),
  after: z.string().optional().nullable(),
  last: z.number().int().positive().max(100).optional().nullable(),
  before: z.string().optional().nullable(),
});

/**
 * User Schemas
 */
export const UserRoleSchema = z.nativeEnum(UserRole);
export const LicenseTypeSchema = z.nativeEnum(LicenseType);
export const ApprovalStatusSchema = z.nativeEnum(ApprovalStatus);

export const LicenseInfoSchema = z.object({
  type: LicenseTypeSchema,
  number: z.string().min(1),
  state: z.string().length(2),
  expirationDate: z.string().datetime(),
  verified: z.boolean(),
  verifiedAt: z.date().optional(),
  verifiedBy: UUIDSchema.optional(),
});

/**
 * Organization Schemas
 */
export const SubscriptionTierSchema = z.nativeEnum(SubscriptionTier);
export const SubscriptionStatusSchema = z.nativeEnum(SubscriptionStatus);

export const SpaOrganizationSchema = z.object({
  id: UUIDSchema,
  name: z.string().min(1).max(255),
  displayName: z.string().min(1).max(255),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: AddressSchema,
  logoUrl: z.string().url().optional(),
  subscriptionTier: SubscriptionTierSchema,
  subscriptionStatus: SubscriptionStatusSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BusinessLicenseSchema = z.object({
  number: z.string().min(1),
  state: z.string().length(2),
  expirationDate: z.string().datetime(),
  documentUrl: z.string().url(),
});

export const CertificationSchema = z.object({
  name: z.string().min(1),
  issuingOrg: z.string().min(1),
  issueDate: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
  certificateUrl: z.string().url().optional(),
});

export const InsuranceInfoSchema = z.object({
  provider: z.string().min(1),
  policyNumber: z.string().min(1),
  coverage: MoneySchema,
  expirationDate: z.string().datetime(),
  documentUrl: z.string().url(),
});

export const FulfillmentSettingsSchema = z.object({
  handlingTime: z.number().int().nonnegative(),
  shippingMethods: z.array(z.string()),
  freeShippingThreshold: z.number().nonnegative().optional(),
  returnPolicy: z.string(),
});

export const VendorOrganizationSchema = z.object({
  id: UUIDSchema,
  companyName: z.string().min(1).max(255),
  displayName: z.string().min(1).max(255),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: AddressSchema,
  businessLicense: BusinessLicenseSchema,
  certifications: z.array(CertificationSchema),
  insurance: InsuranceInfoSchema,
  approvalStatus: ApprovalStatusSchema,
  qualityScore: z.number().min(0).max(5),
  fulfillmentSettings: FulfillmentSettingsSchema,
  isActive: z.boolean(),
  approvedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Location Schemas
 */
export const TimeSlotSchema = z.object({
  open: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  close: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  breaks: z
    .array(
      z.object({
        start: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        end: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      })
    )
    .optional(),
});

export const OperatingHoursSchema = z.object({
  monday: TimeSlotSchema.optional(),
  tuesday: TimeSlotSchema.optional(),
  wednesday: TimeSlotSchema.optional(),
  thursday: TimeSlotSchema.optional(),
  friday: TimeSlotSchema.optional(),
  saturday: TimeSlotSchema.optional(),
  sunday: TimeSlotSchema.optional(),
});

export const LocationSchema = z.object({
  id: UUIDSchema,
  spaOrganizationId: UUIDSchema,
  name: z.string().min(1).max(255),
  address: AddressSchema,
  phone: z.string().optional(),
  timezone: z.string(),
  operatingHours: OperatingHoursSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Service Provider Schemas
 */
export const AvailabilityWindowSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  recurrence: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional(),
});

export const ServiceProviderSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  spaOrganizationId: UUIDSchema,
  locationId: UUIDSchema.optional(),
  licenseInfo: LicenseInfoSchema,
  specialties: z.array(z.string()),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  availabilityWindows: z.array(AvailabilityWindowSchema),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Client Schemas
 */
export const SkinProfileSchema = z.object({
  skinType: z.string(),
  concerns: z.array(z.string()),
  goals: z.array(z.string()),
  sensitivities: z.array(z.string()),
  currentRoutine: z.string().optional(),
});

export const ClientPreferencesSchema = z.object({
  preferredProviders: z.array(UUIDSchema).optional(),
  communicationChannel: z.enum(['email', 'sms', 'both']),
  reminderPreference: z.object({
    enabled: z.boolean(),
    hoursBeforeAppointment: z.number().int().positive(),
  }),
  marketingOptIn: z.boolean(),
});

export const ClientSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema.optional(),
  spaOrganizationId: UUIDSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  skinProfile: SkinProfileSchema,
  allergies: z.array(z.string()),
  preferences: ClientPreferencesSchema,
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Appointment Schemas
 */
export const AppointmentStatusSchema = z.nativeEnum(AppointmentStatus);

export const ProductUsageSchema = z.object({
  productId: UUIDSchema,
  quantity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const ClientFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comments: z.string().optional(),
  wouldRecommend: z.boolean(),
  submittedAt: z.date(),
});

export const AppointmentSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  serviceProviderId: UUIDSchema,
  locationId: UUIDSchema,
  serviceType: z.string().min(1),
  scheduledStart: z.date(),
  scheduledEnd: z.date(),
  actualStart: z.date().optional(),
  actualEnd: z.date().optional(),
  status: AppointmentStatusSchema,
  productsUsed: z.array(ProductUsageSchema),
  notes: z.string().optional(),
  clientFeedback: ClientFeedbackSchema.optional(),
  cancellationReason: z.string().optional(),
  cancelledAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Treatment Plan Schemas
 */
export const TreatmentPlanStatusSchema = z.nativeEnum(TreatmentPlanStatus);

export const PlannedSessionSchema = z.object({
  sessionNumber: z.number().int().positive(),
  serviceType: z.string().min(1),
  notes: z.string().optional(),
  completedAt: z.date().optional(),
  appointmentId: UUIDSchema.optional(),
});

export const TreatmentPlanSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  serviceProviderId: UUIDSchema,
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  totalSessions: z.number().int().positive(),
  completedSessions: z.number().int().nonnegative(),
  status: TreatmentPlanStatusSchema,
  sessions: z.array(PlannedSessionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Product Schemas
 */
export const SkinTypeSchema = z.nativeEnum(SkinType);
export const TimeOfDaySchema = z.nativeEnum(TimeOfDay);

export const ProductGlanceSchema = z.object({
  heroBenefit: z.string().min(1),
  skinTypes: z.array(SkinTypeSchema),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
});

export const ActiveIngredientSchema = z.object({
  name: z.string().min(1),
  concentration: z.number().nonnegative(),
  type: z.string(),
});

export const IngredientSchema = z.object({
  name: z.string().min(1),
  concentration: z.number().nonnegative().optional(),
  function: z.string(),
  warnings: z.array(z.string()).optional(),
});

export const UsageInstructionsSchema = z.object({
  application: z.string().min(1),
  frequency: z.string().min(1),
  timeOfDay: TimeOfDaySchema,
  patchTestRequired: z.boolean(),
});

export const IngredientListSchema = z.object({
  inci: z.array(IngredientSchema),
  actives: z.array(ActiveIngredientSchema),
  allergens: z.array(z.string()),
  vegan: z.boolean(),
  crueltyFree: z.boolean(),
});

export const ProductScanSchema = z.object({
  ingredients: IngredientListSchema,
  usageInstructions: UsageInstructionsSchema,
  keyActives: z.array(ActiveIngredientSchema),
  warnings: z.array(z.string()),
});

export const ClinicalTrialSchema = z.object({
  studyName: z.string().min(1),
  participants: z.number().int().positive(),
  duration: z.string(),
  results: z.string(),
  publicationUrl: z.string().url().optional(),
});

export const TestReportSchema = z.object({
  testType: z.string().min(1),
  reportUrl: z.string().url(),
  testedAt: z.string().datetime(),
});

export const ClinicalDataSchema = z.object({
  trials: z.array(ClinicalTrialSchema),
  certifications: z.array(z.string()),
  testReports: z.array(TestReportSchema),
});

export const ProductStudySchema = z.object({
  clinicalData: ClinicalDataSchema.optional(),
  formulationScience: z.string().optional(),
  contraindications: z.array(z.string()),
  professionalNotes: z.string().optional(),
  detailedSteps: z.array(z.string()),
  expectedResults: z.string(),
  timeToResults: z.string(),
});

export const ProductExtensionSchema = z.object({
  id: UUIDSchema,
  vendureProductId: UUIDSchema,
  vendorOrganizationId: UUIDSchema,
  glanceData: ProductGlanceSchema,
  scanData: ProductScanSchema,
  studyData: ProductStudySchema.optional(),
  tensorVector: z.array(z.number()).length(13),
  tensorGeneratedAt: z.date().optional(),
  semanticEmbedding: z.array(z.number()).length(792),
  embeddingGeneratedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Fulfillment Schemas
 */
export const FulfillmentStatusSchema = z.string();

export const FulfillmentItemSchema = z.object({
  orderLineId: UUIDSchema,
  productId: UUIDSchema,
  quantity: z.number().int().positive(),
  fulfilled: z.number().int().nonnegative(),
});

export const OrderFulfillmentSchema = z.object({
  id: UUIDSchema,
  orderId: UUIDSchema,
  vendorOrganizationId: UUIDSchema,
  status: FulfillmentStatusSchema,
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  estimatedDelivery: z.date().optional(),
  items: z.array(FulfillmentItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});
