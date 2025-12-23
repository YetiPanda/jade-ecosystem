/**
 * Governance Entities Unit Tests
 *
 * Sprint G1.8: Unit tests for AI governance entities
 *
 * Tests entity validation, relationships, and business logic
 * Target: 100% coverage
 */

import { describe, it, expect } from 'vitest';
import {
  AISystemRegistrySchema,
  AIComplianceStateSchema,
  AIIncidentSchema,
  HumanOversightActionSchema,
  TensorPositionSchema,
  validateInput,
  safeValidateInput,
  formatValidationError,
} from '../types/governance.validation';
import {
  AISystemType,
  RiskCategory,
  OversightLevel,
  ComplianceStatus,
  IncidentSeverity,
  IncidentStep,
  DetectionMethod,
  OversightActionType,
} from '../types/governance.enums';
import {
  initializeIncidentTensor,
  TENSOR_DIMENSIONS,
} from '../entities/ai-incident.entity';

describe('Governance Entity Validation', () => {
  describe('AISystemRegistry', () => {
    it('should validate a valid AI system registry', () => {
      const validSystem = {
        systemName: 'Product Recommendation Engine',
        systemType: AISystemType.RECOMMENDER,
        riskCategory: RiskCategory.HIGH,
        intendedPurpose: 'Recommend skincare products based on user profiles',
        operationalDomain: 'skincare_recommendations',
        humanOversightLevel: OversightLevel.ON_THE_LOOP,
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = validateInput(AISystemRegistrySchema, validSystem);
      expect(result).toEqual(validSystem);
    });

    it('should reject invalid system type', () => {
      const invalidSystem = {
        systemName: 'Test System',
        systemType: 'invalid_type',
        riskCategory: RiskCategory.MINIMAL,
        intendedPurpose: 'Test purpose',
        humanOversightLevel: OversightLevel.IN_COMMAND,
      };

      expect(() => validateInput(AISystemRegistrySchema, invalidSystem)).toThrow();
    });

    it('should reject system name over 255 characters', () => {
      const invalidSystem = {
        systemName: 'A'.repeat(256),
        systemType: AISystemType.ANALYZER,
        riskCategory: RiskCategory.LIMITED,
        intendedPurpose: 'Test',
        humanOversightLevel: OversightLevel.IN_THE_LOOP,
      };

      expect(() => validateInput(AISystemRegistrySchema, invalidSystem)).toThrow();
    });

    it('should accept optional fields as undefined', () => {
      const minimalSystem = {
        systemName: 'Minimal System',
        systemType: AISystemType.CLASSIFIER,
        riskCategory: RiskCategory.MINIMAL,
        intendedPurpose: 'Classification tasks',
        humanOversightLevel: OversightLevel.IN_COMMAND,
      };

      const result = validateInput(AISystemRegistrySchema, minimalSystem);
      expect(result.operationalDomain).toBeUndefined();
      expect(result.lastRiskAssessmentDate).toBeUndefined();
    });
  });

  describe('AIComplianceState', () => {
    it('should validate a valid compliance state', () => {
      const validState = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        requirementClause: 'iso42001_A.9',
        complianceStatus: ComplianceStatus.COMPLIANT,
        evidenceIds: [
          '223e4567-e89b-12d3-a456-426614174001',
          '323e4567-e89b-12d3-a456-426614174002',
        ],
        assessedById: '423e4567-e89b-12d3-a456-426614174003',
        assessedAt: new Date('2025-01-15'),
      };

      const result = validateInput(AIComplianceStateSchema, validState);
      expect(result.complianceStatus).toBe(ComplianceStatus.COMPLIANT);
    });

    it('should enforce requirement clause format', () => {
      const invalidState = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        requirementClause: 'invalid_clause',
        complianceStatus: ComplianceStatus.NOT_ASSESSED,
      };

      expect(() => validateInput(AIComplianceStateSchema, invalidState)).toThrow();
    });

    it('should accept ISO_42001_ prefix', () => {
      const validState = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        requirementClause: 'ISO_42001_8.2',
        complianceStatus: ComplianceStatus.SUBSTANTIALLY_COMPLIANT,
      };

      const result = validateInput(AIComplianceStateSchema, validState);
      expect(result.requirementClause).toBe('ISO_42001_8.2');
    });

    it('should handle gap analysis and remediation plan', () => {
      const stateWithGap = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        requirementClause: 'iso42001_9.1',
        complianceStatus: ComplianceStatus.PARTIALLY_COMPLIANT,
        gapAnalysis: 'Monitoring metrics are incomplete',
        remediationPlan: 'Implement additional performance metrics',
        targetDate: new Date('2025-03-01'),
      };

      const result = validateInput(AIComplianceStateSchema, stateWithGap);
      expect(result.gapAnalysis).toBe('Monitoring metrics are incomplete');
      expect(result.remediationPlan).toBeTruthy();
    });
  });

  describe('AIIncident', () => {
    it('should validate a valid AI incident', () => {
      const validIncident = {
        title: 'Product Recommendation Failure',
        description: 'System recommended product with known allergen',
        affectedSystemId: '123e4567-e89b-12d3-a456-426614174000',
        severity: IncidentSeverity.CRITICAL,
        currentStep: IncidentStep.ASSESS,
        detectionMethod: DetectionMethod.USER_REPORT,
        occurredAt: new Date('2025-01-15T10:00:00Z'),
        detectedAt: new Date('2025-01-15T10:30:00Z'),
      };

      const result = validateInput(AIIncidentSchema, validIncident);
      expect(result.severity).toBe(IncidentSeverity.CRITICAL);
      expect(result.currentStep).toBe(IncidentStep.ASSESS);
    });

    it('should validate 13-D tensor position', () => {
      const validTensor = [0.8, 0.6, 0.7, 0.5, 0.3, 0.9, 0.7, 0.6, 0.8, 0.4, 0.5, 0.6, 0.7];

      const result = validateInput(TensorPositionSchema, validTensor);
      expect(result).toHaveLength(13);
    });

    it('should reject tensor with wrong dimensions', () => {
      const invalidTensor = [0.8, 0.6, 0.7]; // Only 3 dimensions

      expect(() => validateInput(TensorPositionSchema, invalidTensor)).toThrow();
    });

    it('should reject tensor values outside [0,1] range', () => {
      const invalidTensor = [
        0.8, 0.6, 1.2, 0.5, 0.3, 0.9, 0.7, 0.6, 0.8, 0.4, 0.5, 0.6, 0.7,
      ];

      expect(() => validateInput(TensorPositionSchema, invalidTensor)).toThrow();
    });

    it('should handle incident with outcome event link', () => {
      const incidentWithOutcome = {
        title: 'Adverse Skin Reaction',
        description: 'User reported reaction after AI-recommended product',
        outcomeEventId: '523e4567-e89b-12d3-a456-426614174005',
        affectedSystemId: '123e4567-e89b-12d3-a456-426614174000',
        severity: IncidentSeverity.CATASTROPHIC,
        currentStep: IncidentStep.INVESTIGATE,
        occurredAt: new Date('2025-01-10'),
        detectedAt: new Date('2025-01-11'),
      };

      const result = validateInput(AIIncidentSchema, incidentWithOutcome);
      expect(result.outcomeEventId).toBe('523e4567-e89b-12d3-a456-426614174005');
    });

    it('should handle resolved incident', () => {
      const resolvedIncident = {
        title: 'False Positive Alert',
        description: 'System flagged safe ingredient as harmful',
        affectedSystemId: '123e4567-e89b-12d3-a456-426614174000',
        severity: IncidentSeverity.NEGLIGIBLE,
        currentStep: IncidentStep.VERIFY,
        occurredAt: new Date('2025-01-05'),
        detectedAt: new Date('2025-01-05'),
        resolvedAt: new Date('2025-01-06'),
        rootCause: 'Outdated ingredient database',
        correctiveAction: 'Updated ingredient safety profiles',
        lessonsLearned: 'Implement automated database update checks',
        notificationSent: true,
      };

      const result = validateInput(AIIncidentSchema, resolvedIncident);
      expect(result.resolvedAt).toBeDefined();
      expect(result.notificationSent).toBe(true);
    });
  });

  describe('HumanOversightAction', () => {
    it('should validate a valid oversight action', () => {
      const validAction = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        actionType: OversightActionType.OVERRIDE,
        triggeredById: '623e4567-e89b-12d3-a456-426614174006',
        recommendationId: '723e4567-e89b-12d3-a456-426614174007',
        originalOutput: {
          productId: 'prod_123',
          confidence: 0.85,
          reason: 'High match score',
        },
        modifiedOutput: {
          productId: 'prod_456',
          confidence: 0.92,
          reason: 'Expert override based on customer history',
        },
        justification: 'Customer has documented sensitivity to ingredients in prod_123',
      };

      const result = validateInput(HumanOversightActionSchema, validAction);
      expect(result.actionType).toBe(OversightActionType.OVERRIDE);
      expect(result.justification).toBeTruthy();
    });

    it('should require justification', () => {
      const actionWithoutJustification = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        actionType: OversightActionType.INTERVENTION,
        triggeredById: '623e4567-e89b-12d3-a456-426614174006',
        justification: '',
      };

      expect(() =>
        validateInput(HumanOversightActionSchema, actionWithoutJustification)
      ).toThrow();
    });

    it('should handle shutdown action', () => {
      const shutdownAction = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        actionType: OversightActionType.SHUTDOWN,
        triggeredById: '623e4567-e89b-12d3-a456-426614174006',
        justification: 'Detected pattern of repeated recommendation errors',
        riskAssessment: 'High risk of continued adverse outcomes',
      };

      const result = validateInput(HumanOversightActionSchema, shutdownAction);
      expect(result.actionType).toBe(OversightActionType.SHUTDOWN);
      expect(result.riskAssessment).toBeTruthy();
    });

    it('should handle approval action without modification', () => {
      const approvalAction = {
        systemId: '123e4567-e89b-12d3-a456-426614174000',
        actionType: OversightActionType.APPROVAL,
        triggeredById: '623e4567-e89b-12d3-a456-426614174006',
        recommendationId: '823e4567-e89b-12d3-a456-426614174008',
        justification: 'Verified recommendation matches customer profile',
      };

      const result = validateInput(HumanOversightActionSchema, approvalAction);
      expect(result.modifiedOutput).toBeUndefined();
      expect(result.originalOutput).toBeUndefined();
    });
  });

  describe('Validation Helpers', () => {
    it('should return success for valid input using safeValidateInput', () => {
      const validData = {
        systemName: 'Test System',
        systemType: AISystemType.ANALYZER,
        riskCategory: RiskCategory.LIMITED,
        intendedPurpose: 'Test',
        humanOversightLevel: OversightLevel.IN_COMMAND,
      };

      const result = safeValidateInput(AISystemRegistrySchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.systemName).toBe('Test System');
      }
    });

    it('should return error for invalid input using safeValidateInput', () => {
      const invalidData = {
        systemName: '',
        systemType: 'invalid',
      };

      const result = safeValidateInput(AISystemRegistrySchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should format validation errors correctly', () => {
      const invalidData = {
        systemName: '',
        systemType: 'invalid',
      };

      try {
        validateInput(AISystemRegistrySchema, invalidData);
      } catch (error: any) {
        const formatted = formatValidationError(error);
        expect(formatted).toContain('systemName');
        expect(formatted).toContain('systemType');
      }
    });
  });

  describe('Incident Tensor Helpers', () => {
    it('should initialize 13-D tensor with zeros', () => {
      const tensor = initializeIncidentTensor();
      expect(tensor).toHaveLength(13);
      expect(tensor.every((val) => val === 0)).toBe(true);
    });

    it('should provide correct tensor dimension indices', () => {
      expect(TENSOR_DIMENSIONS.SEVERITY_SCORE).toBe(0);
      expect(TENSOR_DIMENSIONS.IMPACT_BREADTH).toBe(1);
      expect(TENSOR_DIMENSIONS.IMPACT_DEPTH).toBe(2);
      expect(TENSOR_DIMENSIONS.DETECTION_LAG).toBe(3);
      expect(TENSOR_DIMENSIONS.RESOLUTION_TIME).toBe(4);
      expect(TENSOR_DIMENSIONS.REGULATORY_EXPOSURE).toBe(5);
      expect(TENSOR_DIMENSIONS.REPUTATIONAL_RISK).toBe(6);
      expect(TENSOR_DIMENSIONS.TECHNICAL_COMPLEXITY).toBe(7);
      expect(TENSOR_DIMENSIONS.DATA_SENSITIVITY).toBe(8);
      expect(TENSOR_DIMENSIONS.USER_AFFECTED_COUNT).toBe(9);
      expect(TENSOR_DIMENSIONS.FINANCIAL_IMPACT).toBe(10);
      expect(TENSOR_DIMENSIONS.RECURRENCE_LIKELIHOOD).toBe(11);
      expect(TENSOR_DIMENSIONS.SYSTEMIC_RISK).toBe(12);
    });

    it('should populate tensor using dimension indices', () => {
      const tensor = initializeIncidentTensor();
      tensor[TENSOR_DIMENSIONS.SEVERITY_SCORE] = 0.9;
      tensor[TENSOR_DIMENSIONS.REGULATORY_EXPOSURE] = 0.7;

      expect(tensor[0]).toBe(0.9);
      expect(tensor[5]).toBe(0.7);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid values', () => {
      const minimalIncident = {
        title: 'A',
        description: 'B',
        affectedSystemId: '123e4567-e89b-12d3-a456-426614174000',
        severity: IncidentSeverity.NEGLIGIBLE,
        currentStep: IncidentStep.DETECT,
        occurredAt: new Date(),
        detectedAt: new Date(),
      };

      const result = validateInput(AIIncidentSchema, minimalIncident);
      expect(result.title).toBe('A');
    });

    it('should handle maximum title length', () => {
      const longTitleIncident = {
        title: 'A'.repeat(255),
        description: 'Test',
        affectedSystemId: '123e4567-e89b-12d3-a456-426614174000',
        severity: IncidentSeverity.MARGINAL,
        currentStep: IncidentStep.DETECT,
        occurredAt: new Date(),
        detectedAt: new Date(),
      };

      const result = validateInput(AIIncidentSchema, longTitleIncident);
      expect(result.title).toHaveLength(255);
    });

    it('should reject title over 255 characters', () => {
      const tooLongTitle = {
        title: 'A'.repeat(256),
        description: 'Test',
        affectedSystemId: '123e4567-e89b-12d3-a456-426614174000',
        severity: IncidentSeverity.CRITICAL,
        currentStep: IncidentStep.DETECT,
        occurredAt: new Date(),
        detectedAt: new Date(),
      };

      expect(() => validateInput(AIIncidentSchema, tooLongTitle)).toThrow();
    });
  });
});
