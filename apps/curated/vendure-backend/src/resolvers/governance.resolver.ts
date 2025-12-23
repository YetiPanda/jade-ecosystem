/**
 * Governance GraphQL Resolvers
 *
 * Sprint G3: Governance GraphQL API
 * Implements ISO 42001 AI governance queries and mutations
 */

import { AppDataSource } from '../config/database';
import { AISystemRegistry } from '../plugins/jade-governance/entities/ai-system-registry.entity';
import { AIIncident } from '../plugins/jade-governance/entities/ai-incident.entity';
import { AIComplianceState } from '../plugins/jade-governance/entities/ai-compliance-state.entity';
import { HumanOversightAction } from '../plugins/jade-governance/entities/human-oversight-action.entity';
import {
  AISystemType,
  RiskCategory,
  OversightLevel,
  IncidentSeverity,
  IncidentStep,
  DetectionMethod,
  OversightActionType,
  ComplianceStatus,
} from '../plugins/jade-governance/types/governance.enums';
import { initializeIncidentTensor } from '../plugins/jade-governance/entities/ai-incident.entity';
import { GraphQLContext } from '../graphql/apollo-server';
import { GovernanceMetricsService } from '../plugins/jade-governance/services/governance-metrics.service';
import { AlertRule, AlertSeverity as EntityAlertSeverity } from '../plugins/jade-governance/entities/alert-rule.entity';
import { GovernanceAlert, AlertStatus } from '../plugins/jade-governance/entities/governance-alert.entity';
import { AlertRuleEvaluationService } from '../plugins/jade-governance/services/alert-rule-evaluation.service';
import { AlertNotificationService } from '../plugins/jade-governance/services/alert-notification.service';
import { GovernanceAuditService } from '../plugins/jade-governance/services/governance-audit.service';
import { GovernanceAuditLog, ActorType } from '../plugins/jade-governance/entities/governance-audit-log.entity';

// =========================================================================
// QUERY RESOLVERS
// =========================================================================

export const governanceQueryResolvers = {
  /**
   * G3.3: Get all AI systems with optional filters
   */
  aiSystems: async (_parent: any, args: { filters?: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AISystemRegistry);
    const queryBuilder = repository.createQueryBuilder('system');

    // Apply filters if provided
    if (args.filters) {
      if (args.filters.riskCategory) {
        queryBuilder.andWhere('system.riskCategory = :riskCategory', {
          riskCategory: args.filters.riskCategory,
        });
      }
      if (args.filters.systemType) {
        queryBuilder.andWhere('system.systemType = :systemType', {
          systemType: args.filters.systemType,
        });
      }
    }

    return queryBuilder.getMany();
  },

  /**
   * Get a specific AI system by ID
   */
  aiSystem: async (_parent: any, args: { id: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AISystemRegistry);
    return repository.findOne({ where: { id: args.id } });
  },

  /**
   * G3.4: Get compliance summary for a system
   */
  complianceSummary: async (_parent: any, args: { systemId: string }, _context: GraphQLContext) => {
    const stateRepository = AppDataSource.getRepository(AIComplianceState);

    const states = await stateRepository.find({
      where: { systemId: args.systemId },
    });

    const total = states.length;
    const compliant = states.filter(s => s.complianceStatus === ComplianceStatus.COMPLIANT).length;
    const partial = states.filter(s => s.complianceStatus === ComplianceStatus.PARTIALLY_COMPLIANT).length;
    const nonCompliant = states.filter(s => s.complianceStatus === ComplianceStatus.NON_COMPLIANT).length;
    const notAssessed = states.filter(s => s.complianceStatus === ComplianceStatus.NOT_ASSESSED).length;

    return {
      systemId: args.systemId,
      totalRequirements: total,
      compliantCount: compliant,
      partiallyCompliantCount: partial,
      nonCompliantCount: nonCompliant,
      notAssessedCount: notAssessed,
      compliancePercentage: total > 0 ? (compliant / total) * 100 : 0,
      lastAssessmentDate: new Date().toISOString(),
    };
  },

  /**
   * G3.4: Get gap analysis report for a system
   */
  gapAnalysisReport: async (_parent: any, args: { systemId: string }, _context: GraphQLContext) => {
    const stateRepository = AppDataSource.getRepository(AIComplianceState);

    const nonCompliantStates = await stateRepository.find({
      where: [
        { systemId: args.systemId, complianceStatus: ComplianceStatus.NON_COMPLIANT },
        { systemId: args.systemId, complianceStatus: ComplianceStatus.PARTIALLY_COMPLIANT },
      ],
    });

    return nonCompliantStates.map(state => ({
      requirementClause: state.requirementClause,
      requirementTitle: state.requirementTitle || '',
      currentStatus: state.complianceStatus,
      gap: state.evidenceNotes || 'No evidence provided',
      remediationPriority: state.complianceStatus === ComplianceStatus.NON_COMPLIANT ? 'HIGH' : 'MEDIUM',
      estimatedEffort: 'TBD',
      assignedTo: null,
      targetDate: null,
    }));
  },

  /**
   * G3.4: Get compliance dashboard (all systems or specific system)
   */
  complianceDashboard: async (_parent: any, args: { systemId?: string }, context: GraphQLContext) => {
    if (args.systemId) {
      const summary = await governanceQueryResolvers.complianceSummary(_parent, { systemId: args.systemId }, context);
      return [summary];
    }

    const systemRepository = AppDataSource.getRepository(AISystemRegistry);
    const systems = await systemRepository.find();

    const summaries = await Promise.all(
      systems.map(system => governanceQueryResolvers.complianceSummary(_parent, { systemId: system.id }, context))
    );

    return summaries;
  },

  /**
   * G3.5: Get all AI incidents with optional filters
   */
  aiIncidents: async (_parent: any, args: { filters?: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);
    const queryBuilder = repository.createQueryBuilder('incident');

    // Apply filters if provided
    if (args.filters) {
      if (args.filters.severity) {
        queryBuilder.andWhere('incident.severity = :severity', {
          severity: args.filters.severity,
        });
      }
      if (args.filters.currentStep) {
        queryBuilder.andWhere('incident.currentStep = :currentStep', {
          currentStep: args.filters.currentStep,
        });
      }
    }

    return queryBuilder.orderBy('incident.occurredAt', 'DESC').getMany();
  },

  /**
   * Get a specific incident by ID
   */
  aiIncident: async (_parent: any, args: { id: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);
    return repository.findOne({ where: { id: args.id } });
  },

  /**
   * G3.6: Find similar incidents using tensor similarity search
   */
  similarIncidents: async (
    _parent: any,
    args: { incidentId: string; threshold?: number; limit?: number },
    _context: GraphQLContext
  ) => {
    const repository = AppDataSource.getRepository(AIIncident);

    // Get the reference incident
    const referenceIncident = await repository.findOne({ where: { id: args.incidentId } });
    if (!referenceIncident || !referenceIncident.tensorPosition) {
      return [];
    }

    const threshold = args.threshold ?? 0.5;
    const limit = args.limit ?? 10;

    // Get all incidents with tensor positions
    const allIncidents = await repository.find({
      where: { id: args.incidentId /* NOT EQUAL - using raw SQL later */ },
    });

    // Calculate Euclidean distance for each incident
    const similarities = allIncidents
      .filter(inc => inc.id !== args.incidentId && inc.tensorPosition)
      .map(incident => {
        const distance = calculateEuclideanDistance(
          referenceIncident.tensorPosition!,
          incident.tensorPosition!
        );
        const similarity = 1 / (1 + distance); // Convert distance to similarity score
        return {
          incident,
          similarity,
        };
      })
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities;
  },

  /**
   * Get incident statistics
   */
  incidentStats: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);

    const allIncidents = await repository.find();
    const totalIncidents = allIncidents.length;
    const openIncidents = allIncidents.filter(i => !i.resolvedAt).length;
    const criticalIncidents = allIncidents.filter(i => i.severity === IncidentSeverity.CRITICAL).length;

    // Calculate average resolution time
    const resolvedIncidents = allIncidents.filter(i => i.resolvedAt);
    const avgResolutionTime = resolvedIncidents.length > 0
      ? resolvedIncidents.reduce((sum, inc) => {
          const duration = inc.resolvedAt!.getTime() - inc.detectedAt.getTime();
          return sum + duration;
        }, 0) / resolvedIncidents.length
      : 0;

    const avgResolutionHours = avgResolutionTime / (1000 * 60 * 60);

    return {
      totalIncidents,
      openIncidents,
      resolvedIncidents: resolvedIncidents.length,
      criticalIncidents,
      averageResolutionTime: avgResolutionHours,
      incidentsByStep: calculateIncidentsByStep(allIncidents),
    };
  },

  /**
   * Get human oversight actions with optional filters
   */
  oversightActions: async (_parent: any, args: { systemId?: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(HumanOversightAction);

    if (args.systemId) {
      return repository.find({ where: { systemId: args.systemId } });
    }

    return repository.find();
  },

  /**
   * Get oversight statistics
   */
  oversightStats: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(HumanOversightAction);

    const allActions = await repository.find();
    const totalActions = allActions.length;
    const overrideCount = allActions.filter(a => a.actionType === OversightActionType.OVERRIDE).length;
    const interventionCount = allActions.filter(a => a.actionType === OversightActionType.INTERVENTION).length;

    return {
      totalActions,
      overrideCount,
      interventionCount,
      shutdownCount: allActions.filter(a => a.actionType === OversightActionType.SHUTDOWN).length,
      approvalCount: allActions.filter(a => a.actionType === OversightActionType.APPROVAL).length,
      averageResponseTime: 0, // TODO: Calculate from timestamps
      recentActions: allActions.slice(-10),
    };
  },

  // =========================================================================
  // G4.5: GOVERNANCE DASHBOARD QUERIES
  // =========================================================================

  /**
   * Get comprehensive governance metrics snapshot
   * Sprint G4.5: Dashboard & Observability
   */
  governanceMetrics: async (_parent: any, args: { forceRefresh?: boolean }, _context: GraphQLContext) => {
    const metricsService = new GovernanceMetricsService(
      AppDataSource.getRepository(AISystemRegistry),
      AppDataSource.getRepository(AIIncident),
      AppDataSource.getRepository(AIComplianceState),
      AppDataSource.getRepository(HumanOversightAction)
    );

    return metricsService.getMetricsSnapshot(args.forceRefresh);
  },

  /**
   * Get executive summary dashboard
   * Sprint G4.5: High-level governance overview
   */
  executiveSummary: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const metricsService = new GovernanceMetricsService(
      AppDataSource.getRepository(AISystemRegistry),
      AppDataSource.getRepository(AIIncident),
      AppDataSource.getRepository(AIComplianceState),
      AppDataSource.getRepository(HumanOversightAction)
    );

    return metricsService.getExecutiveSummary();
  },

  /**
   * Get metric trend over time
   * Sprint G4.5: Time-series analytics
   */
  metricTrend: async (
    _parent: any,
    args: { metric: string; startDate: Date; endDate: Date; intervalHours?: number },
    _context: GraphQLContext
  ) => {
    const metricsService = new GovernanceMetricsService(
      AppDataSource.getRepository(AISystemRegistry),
      AppDataSource.getRepository(AIIncident),
      AppDataSource.getRepository(AIComplianceState),
      AppDataSource.getRepository(HumanOversightAction)
    );

    return metricsService.getMetricTrend(
      args.metric,
      args.startDate,
      args.endDate,
      args.intervalHours
    );
  },

  /**
   * Get SKA agentic metrics (appreciating asset paradigm)
   * Sprint G4.5: SKA integration metrics
   */
  skaAgenticMetrics: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const metricsService = new GovernanceMetricsService(
      AppDataSource.getRepository(AISystemRegistry),
      AppDataSource.getRepository(AIIncident),
      AppDataSource.getRepository(AIComplianceState),
      AppDataSource.getRepository(HumanOversightAction)
    );

    return metricsService.getSKAAgenticMetrics();
  },

  /**
   * Get performance metrics
   * Sprint G4.5: System performance monitoring
   */
  performanceMetrics: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const metricsService = new GovernanceMetricsService(
      AppDataSource.getRepository(AISystemRegistry),
      AppDataSource.getRepository(AIIncident),
      AppDataSource.getRepository(AIComplianceState),
      AppDataSource.getRepository(HumanOversightAction)
    );

    return metricsService.getPerformanceMetrics();
  },

  // G4.6: ALERT QUERIES

  /**
   * Get all alert rules
   */
  alertRules: async (_parent: any, args: { isActive?: boolean }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AlertRule);
    const where: any = {};

    if (args.isActive !== undefined) {
      where.isActive = args.isActive;
    }

    return repository.find({ where, order: { createdAt: 'DESC' } });
  },

  /**
   * Get a specific alert rule by ID
   */
  alertRule: async (_parent: any, args: { id: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AlertRule);
    return repository.findOne({ where: { id: args.id } });
  },

  /**
   * Get active alerts
   */
  activeAlerts: async (_parent: any, args: { severity?: string }, _context: GraphQLContext) => {
    const evaluationService = new AlertRuleEvaluationService(
      AppDataSource.getRepository(AlertRule),
      AppDataSource.getRepository(GovernanceAlert),
      new GovernanceMetricsService(
        AppDataSource.getRepository(AISystemRegistry),
        AppDataSource.getRepository(AIIncident),
        AppDataSource.getRepository(AIComplianceState),
        AppDataSource.getRepository(HumanOversightAction)
      ),
      new GovernanceAuditService(
        AppDataSource.getRepository(GovernanceAuditLog)
      )
    );

    return evaluationService.getActiveAlerts(args.severity);
  },

  /**
   * Get a specific alert by ID
   */
  alert: async (_parent: any, args: { id: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(GovernanceAlert);
    return repository.findOne({
      where: { id: args.id },
      relations: ['rule']
    });
  },

  /**
   * Get alert history
   */
  alertHistory: async (_parent: any, args: { limit?: number }, _context: GraphQLContext) => {
    const evaluationService = new AlertRuleEvaluationService(
      AppDataSource.getRepository(AlertRule),
      AppDataSource.getRepository(GovernanceAlert),
      new GovernanceMetricsService(
        AppDataSource.getRepository(AISystemRegistry),
        AppDataSource.getRepository(AIIncident),
        AppDataSource.getRepository(AIComplianceState),
        AppDataSource.getRepository(HumanOversightAction)
      ),
      new GovernanceAuditService(
        AppDataSource.getRepository(GovernanceAuditLog)
      )
    );

    return evaluationService.getAlertHistory(args.limit || 100);
  },

  // G4.7: AUDIT TRAIL QUERIES

  /**
   * Query audit logs with filters
   */
  auditLogs: async (_parent: any, args: { filters?: any }, _context: GraphQLContext) => {
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    return auditService.queryLogs(args.filters || {});
  },

  /**
   * Get entity audit trail
   */
  entityAuditTrail: async (
    _parent: any,
    args: { entityType: string; entityId: string; limit?: number },
    _context: GraphQLContext
  ) => {
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    return auditService.getEntityAuditTrail(
      args.entityType as any,
      args.entityId,
      args.limit
    );
  },

  /**
   * Get entity audit summary
   */
  entityAuditSummary: async (
    _parent: any,
    args: { entityType: string; entityId: string },
    _context: GraphQLContext
  ) => {
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    return auditService.getEntityAuditSummary(
      args.entityType as any,
      args.entityId
    );
  },

  /**
   * Get actor activity timeline
   */
  actorActivity: async (
    _parent: any,
    args: { actorId: string; limit?: number },
    _context: GraphQLContext
  ) => {
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    return auditService.getActorActivity(args.actorId, args.limit);
  },

  /**
   * Get recent audit events
   */
  recentAuditEvents: async (
    _parent: any,
    args: { limit?: number; categories?: string[] },
    _context: GraphQLContext
  ) => {
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    return auditService.getRecentEvents(args.limit, args.categories as any);
  },

  /**
   * Verify audit log integrity
   */
  verifyAuditLogIntegrity: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const result = await auditService.verifyLogIntegrity();

    return {
      ...result,
      gaps: result.gaps.map(gap => ({
        from: gap.from,
        to: gap.to,
        count: gap.to - gap.from + 1,
      })),
      verifiedAt: new Date(),
    };
  },
};

// =========================================================================
// MUTATION RESOLVERS
// =========================================================================

export const governanceMutationResolvers = {
  /**
   * G3.7: Register a new AI system with compliance baseline
   * G4.8: Added audit logging
   */
  registerAISystem: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const systemRepository = AppDataSource.getRepository(AISystemRegistry);
    const stateRepository = AppDataSource.getRepository(AIComplianceState);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    // Create the system
    const system = systemRepository.create({
      systemName: args.input.systemName,
      systemType: args.input.systemType,
      riskCategory: args.input.riskCategory,
      intendedPurpose: args.input.intendedPurpose,
      humanOversightLevel: args.input.humanOversightLevel,
      deploymentDate: args.input.deploymentDate || new Date(),
      isActive: true,
    });

    const savedSystem = await systemRepository.save(system);

    // G4.8: Log system registration
    await auditService.logEvent({
      eventType: 'SYSTEM_REGISTERED' as any,
      entityType: 'AI_SYSTEM' as any,
      entityId: savedSystem.id,
      action: 'CREATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Registered AI system: ${savedSystem.systemName}`,
        systemType: savedSystem.systemType,
        riskCategory: savedSystem.riskCategory,
      },
      after: savedSystem,
    });

    // Initialize compliance baseline (simplified - full implementation would load ISO 42001 atoms)
    const baselineRequirements = [
      'iso42001_5.1', 'iso42001_5.2', 'iso42001_6.1', 'iso42001_7.1', 'iso42001_8.1'
    ];

    const complianceStates = baselineRequirements.map(clause =>
      stateRepository.create({
        systemId: savedSystem.id,
        requirementClause: clause,
        complianceStatus: ComplianceStatus.NOT_ASSESSED,
      })
    );

    await stateRepository.save(complianceStates);

    return {
      system: savedSystem,
      complianceStatesCreated: complianceStates.length,
    };
  },

  /**
   * Update an existing AI system
   * G4.8: Added audit logging
   */
  updateAISystem: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AISystemRegistry);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const system = await repository.findOne({ where: { id: args.input.id } });
    if (!system) {
      throw new Error(`AI System not found: ${args.input.id}`);
    }

    const previousState = { ...system };

    // Update fields
    if (args.input.systemName) system.systemName = args.input.systemName;
    if (args.input.riskCategory) system.riskCategory = args.input.riskCategory;
    if (args.input.humanOversightLevel) system.humanOversightLevel = args.input.humanOversightLevel;

    const updatedSystem = await repository.save(system);

    // G4.8: Log system update
    await auditService.logEvent({
      eventType: 'SYSTEM_UPDATED' as any,
      entityType: 'AI_SYSTEM' as any,
      entityId: updatedSystem.id,
      action: 'UPDATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: { description: `Updated AI system: ${updatedSystem.systemName}` },
      before: previousState,
      after: updatedSystem,
    });

    return updatedSystem;
  },

  /**
   * Record a compliance assessment
   * G4.8: Added audit logging
   */
  recordComplianceAssessment: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIComplianceState);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const state = await repository.findOne({
      where: {
        systemId: args.input.systemId,
        requirementClause: args.input.requirementClause,
      },
    });

    if (!state) {
      throw new Error(`Compliance state not found for ${args.input.requirementClause}`);
    }

    const previousState = { ...state };

    state.complianceStatus = args.input.complianceStatus;
    state.evidenceNotes = args.input.evidenceNotes;
    state.assessedAt = new Date();

    const updatedState = await repository.save(state);

    // G4.8: Log compliance assessment
    await auditService.logEvent({
      eventType: 'COMPLIANCE_ASSESSED' as any,
      entityType: 'COMPLIANCE_STATE' as any,
      entityId: updatedState.id,
      action: 'UPDATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Assessed compliance for ${updatedState.requirementClause}: ${updatedState.complianceStatus}`,
        systemId: args.input.systemId,
        requirementClause: args.input.requirementClause,
        complianceStatus: updatedState.complianceStatus,
      },
      before: previousState,
      after: updatedState,
    });

    return updatedState;
  },

  /**
   * G3.8: Create a new AI incident
   * G4.8: Added audit logging
   */
  createAIIncident: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const incident = repository.create({
      title: args.input.title,
      description: args.input.description,
      affectedSystemId: args.input.affectedSystemId,
      severity: args.input.severity,
      currentStep: IncidentStep.DETECT,
      detectionMethod: args.input.detectionMethod,
      occurredAt: args.input.occurredAt || new Date(),
      detectedAt: args.input.detectedAt || new Date(),
      tensorPosition: initializeIncidentTensor(),
      notificationSent: false,
    });

    const savedIncident = await repository.save(incident);

    // G4.8: Log incident creation
    await auditService.logEvent({
      eventType: 'INCIDENT_CREATED' as any,
      entityType: 'INCIDENT' as any,
      entityId: savedIncident.id,
      action: 'CREATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Created incident: ${savedIncident.title}`,
        severity: savedIncident.severity,
        affectedSystemId: savedIncident.affectedSystemId,
      },
      after: savedIncident,
    });

    return savedIncident;
  },

  /**
   * Advance incident workflow to next step
   */
  advanceIncidentWorkflow: async (_parent: any, args: { id: string; notes?: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const incident = await repository.findOne({ where: { id: args.id } });
    if (!incident) {
      throw new Error(`Incident not found: ${args.id}`);
    }

    const previousState = { ...incident };

    // Advance to next step
    const steps = [
      IncidentStep.DETECT,
      IncidentStep.ASSESS,
      IncidentStep.STABILIZE,
      IncidentStep.REPORT,
      IncidentStep.INVESTIGATE,
      IncidentStep.CORRECT,
      IncidentStep.VERIFY,
    ];

    const currentIndex = steps.indexOf(incident.currentStep);
    if (currentIndex < steps.length - 1) {
      incident.currentStep = steps[currentIndex + 1];
    }

    const updatedIncident = await repository.save(incident);

    // G4.8: Log workflow advancement
    await auditService.logEvent({
      eventType: 'INCIDENT_WORKFLOW_ADVANCED' as any,
      entityType: 'INCIDENT' as any,
      entityId: updatedIncident.id,
      action: 'UPDATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Advanced incident workflow from ${previousState.currentStep} to ${updatedIncident.currentStep}`,
        previousStep: previousState.currentStep,
        newStep: updatedIncident.currentStep,
        notes: args.notes,
      },
      before: previousState,
      after: updatedIncident,
    });

    return updatedIncident;
  },

  /**
   * Complete incident assessment
   */
  completeIncidentAssessment: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const incident = await repository.findOne({ where: { id: args.input.id } });
    if (!incident) {
      throw new Error(`Incident not found: ${args.input.id}`);
    }

    const previousState = { ...incident };

    incident.severity = args.input.severity;
    incident.currentStep = IncidentStep.STABILIZE;

    const updatedIncident = await repository.save(incident);

    // G4.8: Log incident assessment completion
    await auditService.logEvent({
      eventType: 'INCIDENT_ASSESSED' as any,
      entityType: 'INCIDENT' as any,
      entityId: updatedIncident.id,
      action: 'UPDATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Completed assessment for incident: ${updatedIncident.title} (severity: ${updatedIncident.severity})`,
        previousSeverity: previousState.severity,
        newSeverity: updatedIncident.severity,
      },
      before: previousState,
      after: updatedIncident,
    });

    return updatedIncident;
  },

  /**
   * Resolve an incident
   */
  resolveIncident: async (_parent: any, args: { id: string; lessonsLearned?: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AIIncident);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const incident = await repository.findOne({ where: { id: args.id } });
    if (!incident) {
      throw new Error(`Incident not found: ${args.id}`);
    }

    const previousState = { ...incident };

    incident.resolvedAt = new Date();
    incident.lessonsLearned = args.lessonsLearned;

    const resolvedIncident = await repository.save(incident);

    // G4.8: Log incident resolution
    await auditService.logEvent({
      eventType: 'INCIDENT_RESOLVED' as any,
      entityType: 'INCIDENT' as any,
      entityId: resolvedIncident.id,
      action: 'UPDATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Resolved incident: ${resolvedIncident.title}`,
        severity: resolvedIncident.severity,
        affectedSystemId: resolvedIncident.affectedSystemId,
        lessonsLearned: args.lessonsLearned,
      },
      before: previousState,
      after: resolvedIncident,
    });

    return resolvedIncident;
  },

  /**
   * G3.9: Record a human oversight action
   */
  recordOversightAction: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(HumanOversightAction);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const action = repository.create({
      systemId: args.input.systemId,
      actionType: args.input.actionType,
      triggeredById: args.input.triggeredById,
      justification: args.input.justification,
      originalOutput: args.input.originalOutput,
      modifiedOutput: args.input.modifiedOutput,
    });

    const savedAction = await repository.save(action);

    // G4.8: Log oversight action
    const eventType = args.input.actionType === 'OVERRIDE'
      ? 'OVERSIGHT_OVERRIDE_PERFORMED'
      : 'OVERSIGHT_REVIEW_PERFORMED';

    await auditService.logEvent({
      eventType: eventType as any,
      entityType: 'OVERSIGHT_ACTION' as any,
      entityId: savedAction.id,
      action: 'CREATE' as any,
      actorId: args.input.triggeredById || _context.user?.userId,
      actorType: ActorType.HUMAN,
      metadata: {
        description: `Recorded oversight ${args.input.actionType} for system ${args.input.systemId}`,
        systemId: args.input.systemId,
        actionType: args.input.actionType,
        hasModification: !!args.input.modifiedOutput,
      },
      after: savedAction,
    });

    return savedAction;
  },

  // G4.6: ALERT MUTATIONS

  /**
   * Create a new alert rule
   */
  createAlertRule: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AlertRule);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const rule = repository.create({
      name: args.input.name,
      description: args.input.description,
      ruleType: args.input.ruleType,
      severity: args.input.severity,
      condition: args.input.condition,
      notificationChannels: args.input.notificationChannels,
      cooldownMinutes: args.input.cooldownMinutes || 60,
      isActive: args.input.isActive !== undefined ? args.input.isActive : true,
      triggerCount: 0,
    });

    const savedRule = await repository.save(rule);

    // G4.8: Log alert rule creation
    await auditService.logEvent({
      eventType: 'ALERT_RULE_CREATED' as any,
      entityType: 'ALERT_RULE' as any,
      entityId: savedRule.id,
      action: 'CREATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Created alert rule: ${savedRule.name}`,
        ruleType: savedRule.ruleType,
        severity: savedRule.severity,
        isActive: savedRule.isActive,
      },
      after: savedRule,
    });

    return savedRule;
  },

  /**
   * Update an existing alert rule
   */
  updateAlertRule: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AlertRule);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    const rule = await repository.findOne({ where: { id: args.input.id } });
    if (!rule) {
      throw new Error(`Alert rule not found: ${args.input.id}`);
    }

    const previousState = { ...rule };

    if (args.input.name !== undefined) rule.name = args.input.name;
    if (args.input.description !== undefined) rule.description = args.input.description;
    if (args.input.severity !== undefined) rule.severity = args.input.severity;
    if (args.input.condition !== undefined) rule.condition = args.input.condition;
    if (args.input.notificationChannels !== undefined) rule.notificationChannels = args.input.notificationChannels;
    if (args.input.cooldownMinutes !== undefined) rule.cooldownMinutes = args.input.cooldownMinutes;
    if (args.input.isActive !== undefined) rule.isActive = args.input.isActive;

    const updatedRule = await repository.save(rule);

    // G4.8: Log alert rule update
    await auditService.logEvent({
      eventType: 'ALERT_RULE_UPDATED' as any,
      entityType: 'ALERT_RULE' as any,
      entityId: updatedRule.id,
      action: 'UPDATE' as any,
      actorId: _context.user?.userId,
      actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
      metadata: {
        description: `Updated alert rule: ${updatedRule.name}`,
        changedFields: Object.keys(args.input).filter(k => k !== 'id'),
      },
      before: previousState,
      after: updatedRule,
    });

    return updatedRule;
  },

  /**
   * Delete an alert rule
   */
  deleteAlertRule: async (_parent: any, args: { id: string }, _context: GraphQLContext) => {
    const repository = AppDataSource.getRepository(AlertRule);
    const auditService = new GovernanceAuditService(
      AppDataSource.getRepository(GovernanceAuditLog)
    );

    // Get rule before deletion for audit log
    const rule = await repository.findOne({ where: { id: args.id } });
    if (!rule) {
      throw new Error(`Alert rule not found: ${args.id}`);
    }

    const result = await repository.delete(args.id);
    const success = result.affected ? result.affected > 0 : false;

    if (success) {
      // G4.8: Log alert rule deletion
      await auditService.logEvent({
        eventType: 'ALERT_RULE_DELETED' as any,
        entityType: 'ALERT_RULE' as any,
        entityId: args.id,
        action: 'DELETE' as any,
        actorId: _context.user?.userId,
        actorType: _context.user ? ActorType.HUMAN : 'SYSTEM' as any,
        metadata: {
        description: `Deleted alert rule: ${rule.name}`,
        ruleName: rule.name,
        ruleType: rule.ruleType,
      },
        before: rule,
      });
    }

    return success;
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const evaluationService = new AlertRuleEvaluationService(
      AppDataSource.getRepository(AlertRule),
      AppDataSource.getRepository(GovernanceAlert),
      new GovernanceMetricsService(
        AppDataSource.getRepository(AISystemRegistry),
        AppDataSource.getRepository(AIIncident),
        AppDataSource.getRepository(AIComplianceState),
        AppDataSource.getRepository(HumanOversightAction)
      ),
      new GovernanceAuditService(
        AppDataSource.getRepository(GovernanceAuditLog)
      )
    );

    // TODO: Get actual user ID from context
    const userId = 'system';
    return evaluationService.acknowledgeAlert(args.input.alertId, userId, args.input.notes);
  },

  /**
   * Resolve an alert
   */
  resolveAlert: async (_parent: any, args: { input: any }, _context: GraphQLContext) => {
    const evaluationService = new AlertRuleEvaluationService(
      AppDataSource.getRepository(AlertRule),
      AppDataSource.getRepository(GovernanceAlert),
      new GovernanceMetricsService(
        AppDataSource.getRepository(AISystemRegistry),
        AppDataSource.getRepository(AIIncident),
        AppDataSource.getRepository(AIComplianceState),
        AppDataSource.getRepository(HumanOversightAction)
      ),
      new GovernanceAuditService(
        AppDataSource.getRepository(GovernanceAuditLog)
      )
    );

    // TODO: Get actual user ID from context
    const userId = 'system';
    return evaluationService.resolveAlert(args.input.alertId, userId, args.input.notes);
  },

  /**
   * Mark an alert as false positive
   */
  markAlertFalsePositive: async (_parent: any, args: { alertId: string; notes?: string }, _context: GraphQLContext) => {
    const evaluationService = new AlertRuleEvaluationService(
      AppDataSource.getRepository(AlertRule),
      AppDataSource.getRepository(GovernanceAlert),
      new GovernanceMetricsService(
        AppDataSource.getRepository(AISystemRegistry),
        AppDataSource.getRepository(AIIncident),
        AppDataSource.getRepository(AIComplianceState),
        AppDataSource.getRepository(HumanOversightAction)
      ),
      new GovernanceAuditService(
        AppDataSource.getRepository(GovernanceAuditLog)
      )
    );

    // TODO: Get actual user ID from context
    const userId = 'system';
    return evaluationService.markFalsePositive(args.alertId, userId, args.notes);
  },

  /**
   * Test a notification channel
   */
  testNotificationChannel: async (_parent: any, args: { channel: string; testMessage: string }, _context: GraphQLContext) => {
    const notificationService = new AlertNotificationService(
      AppDataSource.getRepository(GovernanceAlert)
    );

    return notificationService.testChannel(args.channel as any, args.testMessage);
  },

  /**
   * Manually evaluate all alert rules
   */
  evaluateAlertRules: async (_parent: any, _args: {}, _context: GraphQLContext) => {
    const evaluationService = new AlertRuleEvaluationService(
      AppDataSource.getRepository(AlertRule),
      AppDataSource.getRepository(GovernanceAlert),
      new GovernanceMetricsService(
        AppDataSource.getRepository(AISystemRegistry),
        AppDataSource.getRepository(AIIncident),
        AppDataSource.getRepository(AIComplianceState),
        AppDataSource.getRepository(HumanOversightAction)
      ),
      new GovernanceAuditService(
        AppDataSource.getRepository(GovernanceAuditLog)
      )
    );

    const triggeredAlerts = await evaluationService.evaluateAllRules();

    // Send notifications for triggered alerts
    const notificationService = new AlertNotificationService(
      AppDataSource.getRepository(GovernanceAlert)
    );

    for (const alert of triggeredAlerts) {
      await notificationService.sendNotifications(alert);
    }

    return triggeredAlerts;
  },
};

// =========================================================================
// FIELD RESOLVERS
// =========================================================================

export const governanceFieldResolvers = {
  AIIncident: {
    /**
     * Calculate workflow progress percentage
     */
    workflowProgress: (parent: AIIncident) => {
      const steps = [
        IncidentStep.DETECT,
        IncidentStep.ASSESS,
        IncidentStep.STABILIZE,
        IncidentStep.REPORT,
        IncidentStep.INVESTIGATE,
        IncidentStep.CORRECT,
        IncidentStep.VERIFY,
      ];

      const currentIndex = steps.indexOf(parent.currentStep);
      return ((currentIndex + 1) / steps.length) * 100;
    },
  },

  /**
   * G4.6: Alert Rule Field Resolvers
   */
  AlertRule: {
    createdBy: async (parent: AlertRule, _args: {}, _context: GraphQLContext) => {
      // TODO: Implement User relation when User entity is available
      return null;
    },
    recentAlerts: async (parent: AlertRule, _args: {}, _context: GraphQLContext) => {
      const repository = AppDataSource.getRepository(GovernanceAlert);
      return repository.find({
        where: { ruleId: parent.id },
        order: { triggeredAt: 'DESC' },
        take: 10,
      });
    },
  },

  /**
   * G4.6: Governance Alert Field Resolvers
   */
  GovernanceAlert: {
    rule: async (parent: GovernanceAlert, _args: {}, _context: GraphQLContext) => {
      const repository = AppDataSource.getRepository(AlertRule);
      return repository.findOne({ where: { id: parent.ruleId } });
    },
    acknowledgedBy: async (parent: GovernanceAlert, _args: {}, _context: GraphQLContext) => {
      // TODO: Implement User relation when User entity is available
      return null;
    },
    resolvedBy: async (parent: GovernanceAlert, _args: {}, _context: GraphQLContext) => {
      // TODO: Implement User relation when User entity is available
      return null;
    },
  },
};

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Calculate Euclidean distance between two tensors
 */
function calculateEuclideanDistance(tensor1: number[], tensor2: number[]): number {
  if (tensor1.length !== tensor2.length) {
    throw new Error('Tensors must have the same dimension');
  }

  const sumOfSquares = tensor1.reduce((sum, val, i) => {
    const diff = val - tensor2[i];
    return sum + diff * diff;
  }, 0);

  return Math.sqrt(sumOfSquares);
}

/**
 * Calculate incident counts by workflow step
 */
function calculateIncidentsByStep(incidents: AIIncident[]): Record<string, number> {
  const steps = [
    IncidentStep.DETECT,
    IncidentStep.ASSESS,
    IncidentStep.STABILIZE,
    IncidentStep.REPORT,
    IncidentStep.INVESTIGATE,
    IncidentStep.CORRECT,
    IncidentStep.VERIFY,
  ];

  return steps.reduce((acc, step) => {
    acc[step] = incidents.filter(i => i.currentStep === step).length;
    return acc;
  }, {} as Record<string, number>);
}
