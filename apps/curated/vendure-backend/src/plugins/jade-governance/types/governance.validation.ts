/**
 * Governance Validation Schemas
 *
 * Sprint G1.7: Zod validation schemas for AI governance entities
 *
 * Provides runtime validation for governance data to ensure
 * data integrity and compliance with ISO 42001 requirements.
 */

import { z } from 'zod';
import {
  AISystemType,
  RiskCategory,
  OversightLevel,
  ComplianceStatus,
  IncidentSeverity,
  IncidentStep,
  DetectionMethod,
  OversightActionType,
} from './governance.enums';

/**
 * AI System Registry Validation
 */
export const AISystemRegistrySchema = z.object({
  id: z.string().uuid().optional(),
  systemName: z.string().min(1).max(255),
  systemType: z.nativeEnum(AISystemType),
  riskCategory: z.nativeEnum(RiskCategory),
  intendedPurpose: z.string().min(1),
  operationalDomain: z.string().max(100).optional(),
  humanOversightLevel: z.nativeEnum(OversightLevel),
  lastRiskAssessmentDate: z.date().optional(),
  nextReviewDate: z.date().optional(),
  ownerId: z.string().uuid().optional(),
});

export type AISystemRegistryInput = z.infer<typeof AISystemRegistrySchema>;

/**
 * AI System Registry Update Validation
 */
export const AISystemRegistryUpdateSchema = AISystemRegistrySchema.partial().extend({
  id: z.string().uuid(),
});

export type AISystemRegistryUpdate = z.infer<typeof AISystemRegistryUpdateSchema>;

/**
 * AI Compliance State Validation
 */
export const AIComplianceStateSchema = z.object({
  id: z.string().uuid().optional(),
  systemId: z.string().uuid(),
  requirementClause: z
    .string()
    .min(1)
    .max(50)
    .regex(/^(iso42001_|ISO_42001_)/, {
      message: 'Requirement clause must start with iso42001_ or ISO_42001_',
    }),
  complianceStatus: z.nativeEnum(ComplianceStatus),
  evidenceIds: z.array(z.string().uuid()).optional(),
  assessedById: z.string().uuid().optional(),
  assessedAt: z.date().optional(),
  gapAnalysis: z.string().optional(),
  remediationPlan: z.string().optional(),
  targetDate: z.date().optional(),
});

export type AIComplianceStateInput = z.infer<typeof AIComplianceStateSchema>;

/**
 * AI Compliance State Update Validation
 */
export const AIComplianceStateUpdateSchema = AIComplianceStateSchema.partial().extend({
  id: z.string().uuid(),
});

export type AIComplianceStateUpdate = z.infer<typeof AIComplianceStateUpdateSchema>;

/**
 * 13-D Tensor Position Validation
 */
export const TensorPositionSchema = z
  .array(z.number().min(0).max(1))
  .length(13, { message: 'Tensor position must have exactly 13 dimensions' });

export type TensorPosition = z.infer<typeof TensorPositionSchema>;

/**
 * AI Incident Validation
 */
export const AIIncidentSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  outcomeEventId: z.string().uuid().optional(),
  affectedSystemId: z.string().uuid(),
  severity: z.nativeEnum(IncidentSeverity),
  currentStep: z.nativeEnum(IncidentStep),
  detectionMethod: z.nativeEnum(DetectionMethod).optional(),
  occurredAt: z.date(),
  detectedAt: z.date(),
  resolvedAt: z.date().optional(),
  rootCause: z.string().optional(),
  correctiveAction: z.string().optional(),
  lessonsLearned: z.string().optional(),
  notificationSent: z.boolean().default(false),
  tensorPosition: TensorPositionSchema.optional(),
});

export type AIIncidentInput = z.infer<typeof AIIncidentSchema>;

/**
 * AI Incident Update Validation
 */
export const AIIncidentUpdateSchema = AIIncidentSchema.partial().extend({
  id: z.string().uuid(),
});

export type AIIncidentUpdate = z.infer<typeof AIIncidentUpdateSchema>;

/**
 * Advance Incident Step Validation
 */
export const AdvanceIncidentSchema = z.object({
  id: z.string().uuid(),
  step: z.nativeEnum(IncidentStep),
  notes: z.string().optional(),
});

export type AdvanceIncidentInput = z.infer<typeof AdvanceIncidentSchema>;

/**
 * Human Oversight Action Validation
 */
export const HumanOversightActionSchema = z.object({
  id: z.string().uuid().optional(),
  systemId: z.string().uuid(),
  actionType: z.nativeEnum(OversightActionType),
  triggeredById: z.string().uuid(),
  recommendationId: z.string().uuid().optional(),
  originalOutput: z.record(z.any()).optional(),
  modifiedOutput: z.record(z.any()).optional(),
  justification: z.string().min(1),
  riskAssessment: z.string().optional(),
});

export type HumanOversightActionInput = z.infer<typeof HumanOversightActionSchema>;

/**
 * Human Oversight Action Update Validation
 */
export const HumanOversightActionUpdateSchema = HumanOversightActionSchema.partial().extend({
  id: z.string().uuid(),
});

export type HumanOversightActionUpdate = z.infer<typeof HumanOversightActionUpdateSchema>;

/**
 * Compliance Dashboard Query Filters
 */
export const ComplianceDashboardFiltersSchema = z.object({
  systemId: z.string().uuid().optional(),
  riskCategory: z.nativeEnum(RiskCategory).optional(),
  complianceStatus: z.nativeEnum(ComplianceStatus).optional(),
  frameworkName: z.string().optional(),
});

export type ComplianceDashboardFilters = z.infer<typeof ComplianceDashboardFiltersSchema>;

/**
 * Incident Query Filters
 */
export const IncidentFiltersSchema = z.object({
  status: z.array(z.nativeEnum(IncidentStep)).optional(),
  severity: z.array(z.nativeEnum(IncidentSeverity)).optional(),
  systemId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  resolved: z.boolean().optional(),
});

export type IncidentFilters = z.infer<typeof IncidentFiltersSchema>;

/**
 * Similar Incidents Query
 */
export const SimilarIncidentsQuerySchema = z.object({
  tensorPosition: TensorPositionSchema,
  limit: z.number().int().min(1).max(100).default(10),
  threshold: z.number().min(0).max(1).default(0.7),
});

export type SimilarIncidentsQuery = z.infer<typeof SimilarIncidentsQuerySchema>;

/**
 * ISO 42001 Requirement Atom Validation
 */
export const RequirementAtomSchema = z.object({
  atomId: z.string(),
  thresholdId: z.string(),
  clause: z.string(),
  title: z.string(),
  atomContent: z.object({
    glance: z.string(),
    scan: z.string(),
    study: z.string(),
  }),
  contentType: z.enum(['requirement', 'control', 'guidance']),
  prerequisiteAtoms: z.array(z.string()),
  enabledAtoms: z.array(z.string()),
  tensorCoordinates: z.record(z.number().min(0).max(1)),
  crossFrameworkMappings: z
    .array(
      z.object({
        framework: z.string(),
        article: z.string().optional(),
        clause: z.string().optional(),
        function: z.string().optional(),
        category: z.string().optional(),
        criterion: z.string().optional(),
        principle: z.string().optional(),
      })
    )
    .optional(),
  evidenceArtifacts: z.array(z.string()),
});

export type RequirementAtom = z.infer<typeof RequirementAtomSchema>;

/**
 * Bulk ISO 42001 Atoms Validation
 */
export const ISO42001AtomsSchema = z.object({
  metadata: z.object({
    framework: z.string(),
    version: z.string(),
    created: z.string(),
    author: z.string(),
    description: z.string(),
    atomCount: z.number(),
    tensorDimensions: z.array(z.string()),
  }),
  thresholds: z.record(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      clauseRange: z.string().optional(),
      annexRange: z.string().optional(),
      emergenceMetaphor: z.string(),
    })
  ),
  atoms: z.array(RequirementAtomSchema),
});

export type ISO42001Atoms = z.infer<typeof ISO42001AtomsSchema>;

/**
 * Validation helpers
 */

/**
 * Validates and parses input with Zod schema
 * Throws ZodError if validation fails
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Validates input and returns result object
 * Does not throw, returns { success: boolean, data?, error? }
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Formats Zod validation errors for GraphQL responses
 */
export function formatValidationError(error: z.ZodError): string {
  return error.errors
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join('; ');
}
