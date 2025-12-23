/**
 * Governance GraphQL Resolver
 *
 * Sprint G3: Governance GraphQL API
 *
 * Implements all governance queries and mutations for ISO 42001 compliance
 */

import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Allow, Ctx, RequestContext, Permission } from '@vendure/core';
import {
  AISystemInventoryService,
  ComplianceAssessmentService,
  IncidentResponseService,
  HumanOversightService,
} from '../services';

/**
 * Governance Resolver
 *
 * Provides GraphQL API for AI governance operations
 */
@Resolver()
export class GovernanceResolver {
  constructor(
    private systemInventoryService: AISystemInventoryService,
    private complianceService: ComplianceAssessmentService,
    private incidentService: IncidentResponseService,
    private oversightService: HumanOversightService
  ) {}

  // =========================================================================
  // AI SYSTEM QUERIES (G3.3)
  // =========================================================================

  /**
   * Get all AI systems with optional filters
   */
  @Query()
  @Allow(Permission.ReadCatalog) // Adjust permission as needed
  async aiSystems(
    @Ctx() ctx: RequestContext,
    @Args() args: { filters?: any }
  ) {
    const { filters } = args;
    return this.systemInventoryService.listSystems(filters, true);
  }

  /**
   * Get a specific AI system by ID
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async aiSystem(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    return this.systemInventoryService.getSystemById(args.id, true);
  }

  // =========================================================================
  // COMPLIANCE QUERIES (G3.4)
  // =========================================================================

  /**
   * Get compliance summary for a system
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async complianceSummary(
    @Ctx() ctx: RequestContext,
    @Args() args: { systemId: string }
  ) {
    return this.complianceService.getComplianceSummary(args.systemId);
  }

  /**
   * Get gap analysis report for a system
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async gapAnalysisReport(
    @Ctx() ctx: RequestContext,
    @Args() args: { systemId: string }
  ) {
    return this.complianceService.getGapAnalysisReport(args.systemId);
  }

  /**
   * Get compliance dashboard data
   * If systemId is provided, returns summary for that system
   * Otherwise, returns summaries for all systems
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async complianceDashboard(
    @Ctx() ctx: RequestContext,
    @Args() args: { systemId?: string }
  ) {
    if (args.systemId) {
      const summary = await this.complianceService.getComplianceSummary(args.systemId);
      return [summary];
    }

    // Get all systems
    const systems = await this.systemInventoryService.listSystems();

    // Get summary for each system
    const summaries = await Promise.all(
      systems.map(system => this.complianceService.getComplianceSummary(system.id))
    );

    return summaries;
  }

  // =========================================================================
  // INCIDENT QUERIES (G3.5, G3.6)
  // =========================================================================

  /**
   * Get all AI incidents with optional filters
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async aiIncidents(
    @Ctx() ctx: RequestContext,
    @Args() args: { filters?: any }
  ) {
    const { filters } = args;
    return this.incidentService.listIncidents(filters, true);
  }

  /**
   * Get a specific incident by ID
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async aiIncident(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    return this.incidentService.getIncidentById(args.id, true);
  }

  /**
   * Find similar incidents using tensor similarity search
   * Sprint G3.6
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async similarIncidents(
    @Ctx() ctx: RequestContext,
    @Args() args: { incidentId: string; threshold?: number; limit?: number }
  ) {
    const threshold = args.threshold ?? 0.5;
    const limit = args.limit ?? 10;

    return this.incidentService.findSimilarIncidents(
      args.incidentId,
      threshold,
      limit
    );
  }

  /**
   * Get incident statistics
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async incidentStats(
    @Ctx() ctx: RequestContext,
    @Args() args: { systemId?: string }
  ) {
    return this.incidentService.getIncidentStats(args.systemId);
  }

  // =========================================================================
  // OVERSIGHT QUERIES
  // =========================================================================

  /**
   * Get human oversight actions
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async oversightActions(
    @Ctx() ctx: RequestContext,
    @Args() args: { systemId?: string; userId?: string; actionType?: string }
  ) {
    if (args.actionType) {
      return this.oversightService.listActionsByType(args.actionType as any, args.systemId);
    }

    if (args.userId) {
      return this.oversightService.listActionsByUser(args.userId, true);
    }

    if (args.systemId) {
      return this.oversightService.listActionsBySystem(args.systemId, true);
    }

    // Return empty array if no filters provided
    return [];
  }

  /**
   * Get oversight statistics
   */
  @Query()
  @Allow(Permission.ReadCatalog)
  async oversightStats(
    @Ctx() ctx: RequestContext,
    @Args() args: { systemId?: string; startDate?: Date; endDate?: Date }
  ) {
    return this.oversightService.getOversightStats(
      args.systemId,
      args.startDate,
      args.endDate
    );
  }

  // =========================================================================
  // AI SYSTEM MUTATIONS (G3.7)
  // =========================================================================

  /**
   * Register a new AI system with automatic compliance baseline
   * Sprint G3.7
   */
  @Mutation()
  @Allow(Permission.CreateCatalog) // Adjust permission as needed
  async registerAISystem(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    const result = await this.systemInventoryService.registerSystemWithWorkflow(
      args.input,
      true // Initialize compliance baseline
    );

    return {
      system: result.system,
      complianceStatesCreated: result.complianceStatesCreated,
    };
  }

  /**
   * Update an existing AI system
   */
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateAISystem(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    const { id, ...updates } = args.input;
    return this.systemInventoryService.updateSystem(id, updates);
  }

  // =========================================================================
  // COMPLIANCE MUTATIONS
  // =========================================================================

  /**
   * Record a compliance assessment
   */
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async recordComplianceAssessment(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    return this.complianceService.recordAssessment(args.input);
  }

  // =========================================================================
  // INCIDENT MUTATIONS (G3.8)
  // =========================================================================

  /**
   * Create a new AI incident
   * Sprint G3.8
   */
  @Mutation()
  @Allow(Permission.CreateCatalog)
  async createAIIncident(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    return this.incidentService.createIncident(args.input);
  }

  /**
   * Advance incident to next workflow step
   */
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async advanceIncidentWorkflow(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    const { id, notes } = args.input;
    return this.incidentService.advanceWorkflowStep(id, notes);
  }

  /**
   * Complete incident assessment step
   */
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async completeIncidentAssessment(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    const { id, severity, assessmentNotes } = args.input;
    return this.incidentService.completeAssessmentStep(id, severity, assessmentNotes);
  }

  /**
   * Resolve an incident
   */
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async resolveIncident(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string; lessonsLearned?: string }
  ) {
    return this.incidentService.resolveIncident(args.id, args.lessonsLearned);
  }

  // =========================================================================
  // OVERSIGHT MUTATIONS (G3.9)
  // =========================================================================

  /**
   * Record a human oversight action
   * Sprint G3.9
   */
  @Mutation()
  @Allow(Permission.CreateCatalog)
  async recordOversightAction(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ) {
    return this.oversightService.recordAction(args.input);
  }

  // =========================================================================
  // FIELD RESOLVERS
  // =========================================================================

  /**
   * Resolve workflowProgress field for AIIncident
   */
  @ResolveField()
  async workflowProgress(@Parent() incident: any) {
    return this.incidentService.getWorkflowProgress(incident.currentStep);
  }
}
