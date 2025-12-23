/**
 * Incident Response Service
 *
 * Sprint G2.5: AI Incident Management
 *
 * This service manages AI incidents through a 7-step ISO 42001-compliant
 * incident response workflow:
 *
 * 1. DETECT - Incident identified
 * 2. ASSESS - Severity and scope determined
 * 3. STABILIZE - Immediate containment
 * 4. REPORT - Stakeholder notification
 * 5. INVESTIGATE - Root cause analysis
 * 6. CORRECT - Implement fixes
 * 7. VERIFY - Confirm resolution
 *
 * Implements ISO 42001 T5 (Continual Improvement) and A.5.4 (Impact Assessment)
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Repository, In, FindManyOptions } from 'typeorm';
import { Logger } from '@vendure/core';
import { AIIncident, initializeIncidentTensor } from '../entities/ai-incident.entity';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import {
  AIIncidentSchema,
  AIIncidentUpdateSchema,
  AIIncidentInput,
  AIIncidentUpdate,
  IncidentFilters,
  validateInput,
  formatValidationError,
} from '../types/governance.validation';
import {
  IncidentSeverity,
  IncidentStep,
  DetectionMethod,
} from '../types/governance.enums';

/**
 * Incident summary statistics
 */
export interface IncidentStats {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  bySeverity: Record<IncidentSeverity, number>;
  byStep: Record<IncidentStep, number>;
  avgResolutionTimeHours: number | null;
}

/**
 * Tensor positioning parameters
 */
export interface TensorPositionParams {
  severity: IncidentSeverity;
  occurredAt: Date;
  detectedAt: Date;
  resolvedAt?: Date;
  userAffectedCount?: number;
  financialImpactUSD?: number;
  hasDataBreach?: boolean;
  hasRegulatoryViolation?: boolean;
  technicalComplexityScore?: number; // 0-1
  reputationalRiskScore?: number; // 0-1
  recurrenceLikelihood?: number; // 0-1
  systemicRiskScore?: number; // 0-1
}

/**
 * Incident Response Service
 *
 * Manages AI incident lifecycle from detection through resolution
 */
@Injectable()
export class IncidentResponseService {
  private incidentRepository: Repository<AIIncident>;
  private systemRepository: Repository<AISystemRegistry>;

  constructor(@InjectConnection() private connection: Connection) {
    this.incidentRepository = connection.getRepository(AIIncident);
    this.systemRepository = connection.getRepository(AISystemRegistry);
  }

  /**
   * Create a new AI incident
   *
   * @param input - Incident data
   * @returns The created incident
   * @throws NotFoundException if system not found
   * @throws BadRequestException if validation fails
   */
  async createIncident(input: AIIncidentInput): Promise<AIIncident> {
    try {
      // Validate input
      const validatedInput = validateInput(AIIncidentSchema, input);

      Logger.info(
        `Creating incident for system ${validatedInput.affectedSystemId}: ${validatedInput.title}`,
        'IncidentResponse'
      );

      // Verify system exists
      const system = await this.systemRepository.findOne({
        where: { id: validatedInput.affectedSystemId },
      });

      if (!system) {
        throw new NotFoundException(
          `AI system not found: ${validatedInput.affectedSystemId}`
        );
      }

      // Create incident entity
      const incident = this.incidentRepository.create({
        title: validatedInput.title,
        description: validatedInput.description,
        outcomeEventId: validatedInput.outcomeEventId,
        affectedSystemId: validatedInput.affectedSystemId,
        severity: validatedInput.severity,
        currentStep: validatedInput.currentStep || IncidentStep.DETECT,
        detectionMethod: validatedInput.detectionMethod,
        occurredAt: validatedInput.occurredAt,
        detectedAt: validatedInput.detectedAt,
        resolvedAt: validatedInput.resolvedAt,
        rootCause: validatedInput.rootCause,
        correctiveAction: validatedInput.correctiveAction,
        lessonsLearned: validatedInput.lessonsLearned,
        notificationSent: validatedInput.notificationSent || false,
        tensorPosition: validatedInput.tensorPosition || initializeIncidentTensor(),
      });

      // Save to database
      const savedIncident = await this.incidentRepository.save(incident);

      Logger.info(
        `Incident created successfully: ${savedIncident.id}`,
        'IncidentResponse'
      );

      return savedIncident;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        Logger.error(`Validation failed: ${message}`, 'IncidentResponse');
        throw new BadRequestException(`Validation failed: ${message}`);
      }

      Logger.error(`Failed to create incident: ${error.message}`, 'IncidentResponse');
      throw error;
    }
  }

  /**
   * Update an existing incident
   *
   * @param id - Incident ID
   * @param updates - Fields to update
   * @returns The updated incident
   * @throws NotFoundException if incident not found
   */
  async updateIncident(
    id: string,
    updates: Partial<AIIncidentUpdate>
  ): Promise<AIIncident> {
    try {
      const validationInput = { ...updates, id };
      const validatedUpdates = validateInput(AIIncidentUpdateSchema, validationInput);

      Logger.info(`Updating incident: ${id}`, 'IncidentResponse');

      const existingIncident = await this.incidentRepository.findOne({ where: { id } });
      if (!existingIncident) {
        throw new NotFoundException(`Incident not found: ${id}`);
      }

      Object.assign(existingIncident, validatedUpdates);
      const updatedIncident = await this.incidentRepository.save(existingIncident);

      Logger.info(`Incident updated: ${id}`, 'IncidentResponse');
      return updatedIncident;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        throw new BadRequestException(`Validation failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get incident by ID
   *
   * @param id - Incident ID
   * @param loadRelations - Whether to load related entities
   * @returns The incident
   * @throws NotFoundException if incident not found
   */
  async getIncidentById(
    id: string,
    loadRelations = false
  ): Promise<AIIncident> {
    const options: FindManyOptions<AIIncident> = { where: { id } };

    if (loadRelations) {
      options.relations = ['affectedSystem'];
    }

    const incident = await this.incidentRepository.findOne(options);

    if (!incident) {
      throw new NotFoundException(`Incident not found: ${id}`);
    }

    return incident;
  }

  /**
   * List incidents with optional filters
   *
   * @param filters - Filter criteria
   * @param loadRelations - Whether to load related entities
   * @returns Array of incidents
   */
  async listIncidents(
    filters?: IncidentFilters,
    loadRelations = false
  ): Promise<AIIncident[]> {
    try {
      const queryBuilder = this.incidentRepository.createQueryBuilder('incident');

      // Apply filters
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          queryBuilder.andWhere('incident.currentStep IN (:...status)', {
            status: filters.status,
          });
        }

        if (filters.severity && filters.severity.length > 0) {
          queryBuilder.andWhere('incident.severity IN (:...severity)', {
            severity: filters.severity,
          });
        }

        if (filters.systemId) {
          queryBuilder.andWhere('incident.affectedSystemId = :systemId', {
            systemId: filters.systemId,
          });
        }

        if (filters.startDate) {
          queryBuilder.andWhere('incident.occurredAt >= :startDate', {
            startDate: filters.startDate,
          });
        }

        if (filters.endDate) {
          queryBuilder.andWhere('incident.occurredAt <= :endDate', {
            endDate: filters.endDate,
          });
        }

        if (filters.resolved !== undefined) {
          if (filters.resolved) {
            queryBuilder.andWhere('incident.resolvedAt IS NOT NULL');
          } else {
            queryBuilder.andWhere('incident.resolvedAt IS NULL');
          }
        }
      }

      // Load relations if requested
      if (loadRelations) {
        queryBuilder.leftJoinAndSelect('incident.affectedSystem', 'system');
      }

      // Order by occurrence date (newest first)
      queryBuilder.orderBy('incident.occurredAt', 'DESC');

      const incidents = await queryBuilder.getMany();

      Logger.info(
        `Retrieved ${incidents.length} incidents with filters: ${JSON.stringify(filters)}`,
        'IncidentResponse'
      );

      return incidents;
    } catch (error) {
      Logger.error(`Failed to list incidents: ${error.message}`, 'IncidentResponse');
      throw error;
    }
  }

  /**
   * Get open (unresolved) incidents
   *
   * @param systemId - Optional system ID to filter by
   * @returns Array of open incidents
   */
  async getOpenIncidents(systemId?: string): Promise<AIIncident[]> {
    return this.listIncidents({ resolved: false, systemId });
  }

  /**
   * Get incidents by severity
   *
   * @param severity - Severity level(s)
   * @param systemId - Optional system ID to filter by
   * @returns Array of incidents
   */
  async getIncidentsBySeverity(
    severity: IncidentSeverity | IncidentSeverity[],
    systemId?: string
  ): Promise<AIIncident[]> {
    const severities = Array.isArray(severity) ? severity : [severity];
    return this.listIncidents({ severity: severities, systemId });
  }

  /**
   * Get incidents at a specific workflow step
   *
   * @param step - Workflow step
   * @param systemId - Optional system ID to filter by
   * @returns Array of incidents
   */
  async getIncidentsByStep(
    step: IncidentStep,
    systemId?: string
  ): Promise<AIIncident[]> {
    return this.listIncidents({ status: [step], systemId });
  }

  /**
   * Resolve an incident
   *
   * Marks the incident as resolved and advances to VERIFY step if not already there
   *
   * @param id - Incident ID
   * @param lessonsLearned - Optional lessons learned documentation
   * @returns The resolved incident
   */
  async resolveIncident(
    id: string,
    lessonsLearned?: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Resolving incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      incident.resolvedAt = new Date();
      incident.currentStep = IncidentStep.VERIFY;

      if (lessonsLearned) {
        incident.lessonsLearned = lessonsLearned;
      }

      const resolvedIncident = await this.incidentRepository.save(incident);

      Logger.info(`Incident resolved: ${id}`, 'IncidentResponse');
      return resolvedIncident;
    } catch (error) {
      Logger.error(`Failed to resolve incident: ${error.message}`, 'IncidentResponse');
      throw error;
    }
  }

  /**
   * Reopen a resolved incident
   *
   * @param id - Incident ID
   * @param reason - Reason for reopening
   * @returns The reopened incident
   */
  async reopenIncident(id: string, reason: string): Promise<AIIncident> {
    try {
      Logger.info(`Reopening incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      if (!incident.resolvedAt) {
        throw new BadRequestException('Incident is not resolved');
      }

      incident.resolvedAt = undefined;
      incident.currentStep = IncidentStep.INVESTIGATE;
      incident.description += `\n\n[REOPENED] ${reason}`;

      const reopenedIncident = await this.incidentRepository.save(incident);

      Logger.info(`Incident reopened: ${id}`, 'IncidentResponse');
      return reopenedIncident;
    } catch (error) {
      Logger.error(`Failed to reopen incident: ${error.message}`, 'IncidentResponse');
      throw error;
    }
  }

  /**
   * Delete an incident
   *
   * Note: Use with caution. Consider archiving instead.
   *
   * @param id - Incident ID
   */
  async deleteIncident(id: string): Promise<void> {
    try {
      Logger.warn(`Deleting incident: ${id}`, 'IncidentResponse');

      const result = await this.incidentRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(`Incident not found: ${id}`);
      }

      Logger.info(`Incident deleted: ${id}`, 'IncidentResponse');
    } catch (error) {
      Logger.error(`Failed to delete incident: ${error.message}`, 'IncidentResponse');
      throw error;
    }
  }

  /**
   * Get incident statistics
   *
   * Provides summary metrics for incidents
   *
   * @param systemId - Optional system ID to filter by
   * @returns Incident statistics
   */
  async getIncidentStats(systemId?: string): Promise<IncidentStats> {
    try {
      const filters: IncidentFilters = {};
      if (systemId) {
        filters.systemId = systemId;
      }

      const allIncidents = await this.listIncidents(filters);

      // Count by severity
      const bySeverity = {
        [IncidentSeverity.CATASTROPHIC]: 0,
        [IncidentSeverity.CRITICAL]: 0,
        [IncidentSeverity.MARGINAL]: 0,
        [IncidentSeverity.NEGLIGIBLE]: 0,
      };

      // Count by step
      const byStep = {
        [IncidentStep.DETECT]: 0,
        [IncidentStep.ASSESS]: 0,
        [IncidentStep.STABILIZE]: 0,
        [IncidentStep.REPORT]: 0,
        [IncidentStep.INVESTIGATE]: 0,
        [IncidentStep.CORRECT]: 0,
        [IncidentStep.VERIFY]: 0,
      };

      let resolvedIncidents = 0;
      let totalResolutionTimeHours = 0;

      for (const incident of allIncidents) {
        bySeverity[incident.severity]++;
        byStep[incident.currentStep]++;

        if (incident.resolvedAt) {
          resolvedIncidents++;
          const resolutionTimeMs =
            incident.resolvedAt.getTime() - incident.occurredAt.getTime();
          totalResolutionTimeHours += resolutionTimeMs / (1000 * 60 * 60);
        }
      }

      const avgResolutionTimeHours =
        resolvedIncidents > 0 ? totalResolutionTimeHours / resolvedIncidents : null;

      return {
        totalIncidents: allIncidents.length,
        openIncidents: allIncidents.length - resolvedIncidents,
        resolvedIncidents,
        bySeverity,
        byStep,
        avgResolutionTimeHours,
      };
    } catch (error) {
      Logger.error(
        `Failed to get incident stats: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Link incident to outcome event
   *
   * Associates an incident with a user-reported outcome event
   *
   * @param incidentId - Incident ID
   * @param outcomeEventId - Outcome event ID
   * @returns Updated incident
   */
  async linkToOutcomeEvent(
    incidentId: string,
    outcomeEventId: string
  ): Promise<AIIncident> {
    try {
      Logger.info(
        `Linking incident ${incidentId} to outcome event ${outcomeEventId}`,
        'IncidentResponse'
      );

      const incident = await this.getIncidentById(incidentId);
      incident.outcomeEventId = outcomeEventId;

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(`Incident linked to outcome event`, 'IncidentResponse');
      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to link incident to outcome event: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Get incidents linked to outcome events
   *
   * @param systemId - Optional system ID to filter by
   * @returns Array of incidents with outcome event links
   */
  async getIncidentsWithOutcomeEvents(systemId?: string): Promise<AIIncident[]> {
    const queryBuilder = this.incidentRepository
      .createQueryBuilder('incident')
      .where('incident.outcomeEventId IS NOT NULL');

    if (systemId) {
      queryBuilder.andWhere('incident.affectedSystemId = :systemId', { systemId });
    }

    queryBuilder.orderBy('incident.occurredAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * ==========================================================================
   * 7-STEP INCIDENT WORKFLOW (Sprint G2.6)
   * ==========================================================================
   *
   * ISO 42001-compliant incident response workflow implementation
   */

  /**
   * Get the next step in the incident workflow
   *
   * @param currentStep - Current incident step
   * @returns Next step in the workflow, or null if at end
   */
  private getNextWorkflowStep(currentStep: IncidentStep): IncidentStep | null {
    const workflowOrder = [
      IncidentStep.DETECT,
      IncidentStep.ASSESS,
      IncidentStep.STABILIZE,
      IncidentStep.REPORT,
      IncidentStep.INVESTIGATE,
      IncidentStep.CORRECT,
      IncidentStep.VERIFY,
    ];

    const currentIndex = workflowOrder.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === workflowOrder.length - 1) {
      return null; // Already at final step
    }

    return workflowOrder[currentIndex + 1];
  }

  /**
   * Validate if workflow step transition is allowed
   *
   * @param fromStep - Current step
   * @param toStep - Target step
   * @returns True if transition is valid
   */
  private isValidStepTransition(fromStep: IncidentStep, toStep: IncidentStep): boolean {
    const workflowOrder = [
      IncidentStep.DETECT,
      IncidentStep.ASSESS,
      IncidentStep.STABILIZE,
      IncidentStep.REPORT,
      IncidentStep.INVESTIGATE,
      IncidentStep.CORRECT,
      IncidentStep.VERIFY,
    ];

    const fromIndex = workflowOrder.indexOf(fromStep);
    const toIndex = workflowOrder.indexOf(toStep);

    // Allow forward progression or staying at same step
    return toIndex >= fromIndex;
  }

  /**
   * Advance incident to next workflow step
   *
   * Progresses the incident through the 7-step workflow with validation
   *
   * @param id - Incident ID
   * @param notes - Optional notes about the step completion
   * @returns Updated incident
   * @throws NotFoundException if incident not found
   * @throws BadRequestException if already at final step
   */
  async advanceWorkflowStep(
    id: string,
    notes?: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Advancing workflow for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      // Check if already at final step
      const nextStep = this.getNextWorkflowStep(incident.currentStep);
      if (!nextStep) {
        throw new BadRequestException(
          `Incident is already at final step (${incident.currentStep})`
        );
      }

      // Update step
      const previousStep = incident.currentStep;
      incident.currentStep = nextStep;

      // Append notes if provided
      if (notes) {
        incident.description += `\n\n[${previousStep} → ${nextStep}] ${notes}`;
      }

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(
        `Incident ${id} advanced from ${previousStep} to ${nextStep}`,
        'IncidentResponse'
      );

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to advance workflow: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Set incident to specific workflow step
   *
   * Allows jumping to a specific step (must be forward progression)
   *
   * @param id - Incident ID
   * @param step - Target workflow step
   * @param reason - Reason for step change
   * @returns Updated incident
   * @throws BadRequestException if invalid step transition
   */
  async setWorkflowStep(
    id: string,
    step: IncidentStep,
    reason: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Setting incident ${id} to step ${step}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      // Validate transition
      if (!this.isValidStepTransition(incident.currentStep, step)) {
        throw new BadRequestException(
          `Invalid step transition from ${incident.currentStep} to ${step}. Cannot move backwards in workflow.`
        );
      }

      const previousStep = incident.currentStep;
      incident.currentStep = step;
      incident.description += `\n\n[WORKFLOW STEP CHANGE: ${previousStep} → ${step}] ${reason}`;

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(
        `Incident ${id} step changed from ${previousStep} to ${step}`,
        'IncidentResponse'
      );

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to set workflow step: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Complete ASSESS step
   *
   * Records severity assessment and advances to STABILIZE
   *
   * @param id - Incident ID
   * @param severity - Assessed severity level
   * @param assessmentNotes - Notes from assessment
   * @returns Updated incident
   */
  async completeAssessmentStep(
    id: string,
    severity: IncidentSeverity,
    assessmentNotes: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Completing assessment for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      if (incident.currentStep !== IncidentStep.ASSESS) {
        throw new BadRequestException(
          `Incident is not in ASSESS step (current: ${incident.currentStep})`
        );
      }

      // Update severity if changed
      incident.severity = severity;

      // Advance to STABILIZE
      incident.currentStep = IncidentStep.STABILIZE;
      incident.description += `\n\n[ASSESSMENT COMPLETE] Severity: ${severity}\n${assessmentNotes}`;

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(
        `Incident ${id} assessment completed with severity ${severity}`,
        'IncidentResponse'
      );

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to complete assessment: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Complete REPORT step
   *
   * Marks notification as sent and advances to INVESTIGATE
   *
   * @param id - Incident ID
   * @param notificationDetails - Details about stakeholder notification
   * @returns Updated incident
   */
  async completeReportStep(
    id: string,
    notificationDetails: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Completing report for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      if (incident.currentStep !== IncidentStep.REPORT) {
        throw new BadRequestException(
          `Incident is not in REPORT step (current: ${incident.currentStep})`
        );
      }

      // Mark notification sent
      incident.notificationSent = true;

      // Advance to INVESTIGATE
      incident.currentStep = IncidentStep.INVESTIGATE;
      incident.description += `\n\n[STAKEHOLDER NOTIFICATION SENT]\n${notificationDetails}`;

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(`Incident ${id} notification sent`, 'IncidentResponse');

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to complete report: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Complete INVESTIGATE step
   *
   * Records root cause analysis and advances to CORRECT
   *
   * @param id - Incident ID
   * @param rootCause - Root cause analysis findings
   * @returns Updated incident
   */
  async completeInvestigationStep(
    id: string,
    rootCause: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Completing investigation for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      if (incident.currentStep !== IncidentStep.INVESTIGATE) {
        throw new BadRequestException(
          `Incident is not in INVESTIGATE step (current: ${incident.currentStep})`
        );
      }

      // Record root cause
      incident.rootCause = rootCause;

      // Advance to CORRECT
      incident.currentStep = IncidentStep.CORRECT;

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(`Incident ${id} root cause identified`, 'IncidentResponse');

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to complete investigation: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Complete CORRECT step
   *
   * Records corrective actions and advances to VERIFY
   *
   * @param id - Incident ID
   * @param correctiveAction - Description of corrective actions taken
   * @returns Updated incident
   */
  async completeCorrectiveActionStep(
    id: string,
    correctiveAction: string
  ): Promise<AIIncident> {
    try {
      Logger.info(`Completing corrective action for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      if (incident.currentStep !== IncidentStep.CORRECT) {
        throw new BadRequestException(
          `Incident is not in CORRECT step (current: ${incident.currentStep})`
        );
      }

      // Record corrective action
      incident.correctiveAction = correctiveAction;

      // Advance to VERIFY
      incident.currentStep = IncidentStep.VERIFY;

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(`Incident ${id} corrective action completed`, 'IncidentResponse');

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to complete corrective action: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Complete VERIFY step and close incident
   *
   * Records lessons learned and marks incident as resolved
   *
   * @param id - Incident ID
   * @param lessonsLearned - Lessons learned documentation
   * @param verified - Whether the fix was verified successful
   * @returns Updated incident
   */
  async completeVerificationStep(
    id: string,
    lessonsLearned: string,
    verified = true
  ): Promise<AIIncident> {
    try {
      Logger.info(`Completing verification for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      if (incident.currentStep !== IncidentStep.VERIFY) {
        throw new BadRequestException(
          `Incident is not in VERIFY step (current: ${incident.currentStep})`
        );
      }

      // Record lessons learned
      incident.lessonsLearned = lessonsLearned;

      // Mark as resolved if verified
      if (verified) {
        incident.resolvedAt = new Date();
      } else {
        // If verification failed, move back to CORRECT
        incident.currentStep = IncidentStep.CORRECT;
        incident.description += `\n\n[VERIFICATION FAILED] Moving back to CORRECT step.\n${lessonsLearned}`;
      }

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(
        `Incident ${id} verification ${verified ? 'completed' : 'failed'}`,
        'IncidentResponse'
      );

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to complete verification: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Get workflow step progress percentage
   *
   * @param currentStep - Current incident step
   * @returns Progress percentage (0-100)
   */
  getWorkflowProgress(currentStep: IncidentStep): number {
    const stepOrder = [
      IncidentStep.DETECT,
      IncidentStep.ASSESS,
      IncidentStep.STABILIZE,
      IncidentStep.REPORT,
      IncidentStep.INVESTIGATE,
      IncidentStep.CORRECT,
      IncidentStep.VERIFY,
    ];

    const stepIndex = stepOrder.indexOf(currentStep);
    if (stepIndex === -1) return 0;

    return Math.round(((stepIndex + 1) / stepOrder.length) * 100);
  }

  /**
   * ==========================================================================
   * INCIDENT TENSOR POSITIONING (Sprint G2.7)
   * ==========================================================================
   *
   * 13-D tensor calculation for incident similarity search and pattern detection
   */

  /**
   * Calculate 13-D tensor position for an incident
   *
   * @param params - Tensor positioning parameters
   * @returns 13-dimensional tensor array
   */
  private calculateTensorPosition(params: TensorPositionParams): number[] {
    const tensor = new Array(13).fill(0);

    // Dimension 0: severity_score (0-1)
    tensor[0] = this.normalizeSeverity(params.severity);

    // Dimension 1: impact_breadth (0-1) - based on user count
    tensor[1] = this.normalizeUserCount(params.userAffectedCount || 0);

    // Dimension 2: impact_depth (0-1) - based on severity and financial impact
    tensor[2] = this.calculateImpactDepth(
      params.severity,
      params.financialImpactUSD || 0
    );

    // Dimension 3: detection_lag (normalized hours)
    tensor[3] = this.normalizeDetectionLag(params.occurredAt, params.detectedAt);

    // Dimension 4: resolution_time (normalized hours)
    tensor[4] = this.normalizeResolutionTime(
      params.occurredAt,
      params.resolvedAt
    );

    // Dimension 5: regulatory_exposure (0-1)
    tensor[5] = params.hasRegulatoryViolation ? 1.0 : 0.0;

    // Dimension 6: reputational_risk (0-1)
    tensor[6] = params.reputationalRiskScore || this.calculateReputationalRisk(params.severity);

    // Dimension 7: technical_complexity (0-1)
    tensor[7] = params.technicalComplexityScore || 0.5; // Default to medium

    // Dimension 8: data_sensitivity (0-1)
    tensor[8] = params.hasDataBreach ? 1.0 : 0.2;

    // Dimension 9: user_affected_count (normalized)
    tensor[9] = this.normalizeUserCount(params.userAffectedCount || 0);

    // Dimension 10: financial_impact (normalized)
    tensor[10] = this.normalizeFinancialImpact(params.financialImpactUSD || 0);

    // Dimension 11: recurrence_likelihood (0-1)
    tensor[11] = params.recurrenceLikelihood || 0.3; // Default to low-medium

    // Dimension 12: systemic_risk (0-1)
    tensor[12] = params.systemicRiskScore || this.calculateSystemicRisk(params.severity);

    return tensor;
  }

  /**
   * Normalize severity to 0-1 scale
   */
  private normalizeSeverity(severity: IncidentSeverity): number {
    const severityMap = {
      [IncidentSeverity.NEGLIGIBLE]: 0.1,
      [IncidentSeverity.MARGINAL]: 0.4,
      [IncidentSeverity.CRITICAL]: 0.7,
      [IncidentSeverity.CATASTROPHIC]: 1.0,
    };
    return severityMap[severity] || 0.5;
  }

  /**
   * Normalize user count to 0-1 scale (logarithmic)
   */
  private normalizeUserCount(count: number): number {
    if (count === 0) return 0;
    // Use log scale: 1 user = 0.1, 10 = 0.3, 100 = 0.5, 1000 = 0.7, 10000+ = 1.0
    const logValue = Math.log10(count + 1);
    return Math.min(logValue / 4, 1.0); // Normalize to 0-1
  }

  /**
   * Calculate impact depth based on severity and financial impact
   */
  private calculateImpactDepth(severity: IncidentSeverity, financialImpact: number): number {
    const severityScore = this.normalizeSeverity(severity);
    const financialScore = this.normalizeFinancialImpact(financialImpact);

    // Weight: 60% severity, 40% financial
    return severityScore * 0.6 + financialScore * 0.4;
  }

  /**
   * Normalize detection lag (time from occurrence to detection)
   */
  private normalizeDetectionLag(occurredAt: Date, detectedAt: Date): number {
    const lagHours = (detectedAt.getTime() - occurredAt.getTime()) / (1000 * 60 * 60);

    // Normalize: < 1 hour = 0.1, 1-24 hours = 0.3-0.6, > 7 days = 1.0
    if (lagHours < 1) return 0.1;
    if (lagHours < 24) return 0.3 + (lagHours / 24) * 0.3;
    if (lagHours < 168) return 0.6 + ((lagHours - 24) / 144) * 0.3; // 7 days
    return 1.0;
  }

  /**
   * Normalize resolution time
   */
  private normalizeResolutionTime(occurredAt: Date, resolvedAt?: Date): number {
    if (!resolvedAt) return 0; // Not yet resolved

    const resolutionHours = (resolvedAt.getTime() - occurredAt.getTime()) / (1000 * 60 * 60);

    // Normalize: < 1 hour = 0.1, 1-24 hours = 0.2-0.4, 1-7 days = 0.4-0.7, > 30 days = 1.0
    if (resolutionHours < 1) return 0.1;
    if (resolutionHours < 24) return 0.2 + (resolutionHours / 24) * 0.2;
    if (resolutionHours < 168) return 0.4 + ((resolutionHours - 24) / 144) * 0.3;
    if (resolutionHours < 720) return 0.7 + ((resolutionHours - 168) / 552) * 0.3; // 30 days
    return 1.0;
  }

  /**
   * Calculate reputational risk based on severity
   */
  private calculateReputationalRisk(severity: IncidentSeverity): number {
    const riskMap = {
      [IncidentSeverity.NEGLIGIBLE]: 0.1,
      [IncidentSeverity.MARGINAL]: 0.3,
      [IncidentSeverity.CRITICAL]: 0.7,
      [IncidentSeverity.CATASTROPHIC]: 1.0,
    };
    return riskMap[severity] || 0.5;
  }

  /**
   * Normalize financial impact to 0-1 scale (logarithmic)
   */
  private normalizeFinancialImpact(amountUSD: number): number {
    if (amountUSD === 0) return 0;

    // Use log scale: $100 = 0.1, $1K = 0.3, $10K = 0.5, $100K = 0.7, $1M+ = 1.0
    const logValue = Math.log10(amountUSD + 1);
    return Math.min(logValue / 6, 1.0); // Normalize to 0-1
  }

  /**
   * Calculate systemic risk based on severity
   */
  private calculateSystemicRisk(severity: IncidentSeverity): number {
    const riskMap = {
      [IncidentSeverity.NEGLIGIBLE]: 0.0,
      [IncidentSeverity.MARGINAL]: 0.2,
      [IncidentSeverity.CRITICAL]: 0.6,
      [IncidentSeverity.CATASTROPHIC]: 1.0,
    };
    return riskMap[severity] || 0.3;
  }

  /**
   * Update incident tensor position
   *
   * @param id - Incident ID
   * @param params - Tensor positioning parameters (optional, will use incident data if not provided)
   * @returns Updated incident with tensor position
   */
  async updateTensorPosition(
    id: string,
    params?: Partial<TensorPositionParams>
  ): Promise<AIIncident> {
    try {
      Logger.info(`Updating tensor position for incident: ${id}`, 'IncidentResponse');

      const incident = await this.getIncidentById(id);

      // Build params from incident if not provided
      const tensorParams: TensorPositionParams = {
        severity: params?.severity || incident.severity,
        occurredAt: params?.occurredAt || incident.occurredAt,
        detectedAt: params?.detectedAt || incident.detectedAt,
        resolvedAt: params?.resolvedAt || incident.resolvedAt,
        userAffectedCount: params?.userAffectedCount,
        financialImpactUSD: params?.financialImpactUSD,
        hasDataBreach: params?.hasDataBreach,
        hasRegulatoryViolation: params?.hasRegulatoryViolation,
        technicalComplexityScore: params?.technicalComplexityScore,
        reputationalRiskScore: params?.reputationalRiskScore,
        recurrenceLikelihood: params?.recurrenceLikelihood,
        systemicRiskScore: params?.systemicRiskScore,
      };

      // Calculate tensor
      incident.tensorPosition = this.calculateTensorPosition(tensorParams);

      const updatedIncident = await this.incidentRepository.save(incident);

      Logger.info(
        `Tensor position updated for incident ${id}`,
        'IncidentResponse'
      );

      return updatedIncident;
    } catch (error) {
      Logger.error(
        `Failed to update tensor position: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Find similar incidents using tensor position
   *
   * Calculates Euclidean distance between incident tensors
   *
   * @param id - Incident ID to find similar incidents for
   * @param threshold - Similarity threshold (0-1, lower is more similar)
   * @param limit - Maximum number of similar incidents to return
   * @returns Array of similar incidents with similarity scores
   */
  async findSimilarIncidents(
    id: string,
    threshold = 0.5,
    limit = 10
  ): Promise<Array<{ incident: AIIncident; similarity: number }>> {
    try {
      Logger.info(`Finding similar incidents for: ${id}`, 'IncidentResponse');

      const targetIncident = await this.getIncidentById(id);

      if (!targetIncident.tensorPosition || targetIncident.tensorPosition.length !== 13) {
        throw new BadRequestException('Target incident does not have a valid tensor position');
      }

      // Get all incidents with tensor positions (excluding the target)
      const allIncidents = await this.incidentRepository
        .createQueryBuilder('incident')
        .where('incident.id != :id', { id })
        .andWhere('incident.tensorPosition IS NOT NULL')
        .getMany();

      // Calculate distances
      const similarities: Array<{ incident: AIIncident; similarity: number }> = [];

      for (const incident of allIncidents) {
        if (!incident.tensorPosition || incident.tensorPosition.length !== 13) {
          continue;
        }

        const distance = this.calculateEuclideanDistance(
          targetIncident.tensorPosition,
          incident.tensorPosition
        );

        // Convert distance to similarity (inverse, normalized)
        const similarity = 1 - Math.min(distance / Math.sqrt(13), 1);

        if (similarity >= threshold) {
          similarities.push({ incident, similarity });
        }
      }

      // Sort by similarity (highest first) and limit
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topSimilar = similarities.slice(0, limit);

      Logger.info(
        `Found ${topSimilar.length} similar incidents (threshold: ${threshold})`,
        'IncidentResponse'
      );

      return topSimilar;
    } catch (error) {
      Logger.error(
        `Failed to find similar incidents: ${error.message}`,
        'IncidentResponse'
      );
      throw error;
    }
  }

  /**
   * Calculate Euclidean distance between two tensors
   */
  private calculateEuclideanDistance(tensor1: number[], tensor2: number[]): number {
    if (tensor1.length !== tensor2.length) {
      throw new Error('Tensors must have the same dimensionality');
    }

    let sumSquares = 0;
    for (let i = 0; i < tensor1.length; i++) {
      const diff = tensor1[i] - tensor2[i];
      sumSquares += diff * diff;
    }

    return Math.sqrt(sumSquares);
  }
}
