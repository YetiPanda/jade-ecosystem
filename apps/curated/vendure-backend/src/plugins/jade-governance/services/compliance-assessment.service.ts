/**
 * Compliance Assessment Service
 *
 * Sprint G2.3: Compliance Assessment and Gap Analysis
 *
 * This service manages compliance assessments for AI systems against
 * ISO 42001 requirements. It supports:
 * - Recording compliance assessments
 * - Tracking evidence artifacts
 * - Gap analysis and remediation planning
 * - Compliance status reporting
 *
 * Implements ISO 42001 T3 (Operational Controls) and T4 (Performance Evaluation)
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Repository, In } from 'typeorm';
import { Logger } from '@vendure/core';
import { AIComplianceState } from '../entities/ai-compliance-state.entity';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import {
  AIComplianceStateSchema,
  AIComplianceStateUpdateSchema,
  AIComplianceStateInput,
  AIComplianceStateUpdate,
  validateInput,
  formatValidationError,
} from '../types/governance.validation';
import { ComplianceStatus, RiskCategory } from '../types/governance.enums';
import { ISO42001AtomsLoaderService } from './iso42001-atoms-loader.service';

/**
 * Compliance assessment result summary
 */
export interface ComplianceAssessmentSummary {
  systemId: string;
  systemName: string;
  riskCategory: RiskCategory;
  totalRequirements: number;
  assessed: number;
  compliant: number;
  substantiallyCompliant: number;
  partiallyCompliant: number;
  nonCompliant: number;
  notApplicable: number;
  notAssessed: number;
  compliancePercentage: number;
  gapCount: number;
}

/**
 * Gap analysis report for a requirement
 */
export interface GapAnalysisReport {
  requirementClause: string;
  requirementTitle: string;
  currentStatus: ComplianceStatus;
  gapDescription: string | null;
  remediationPlan: string | null;
  targetDate: Date | null;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Compliance Assessment Service
 *
 * Handles all compliance assessment operations for AI systems
 */
@Injectable()
export class ComplianceAssessmentService {
  private complianceStateRepository: Repository<AIComplianceState>;
  private systemRepository: Repository<AISystemRegistry>;

  constructor(
    @InjectConnection() private connection: Connection,
    private atomsLoader: ISO42001AtomsLoaderService
  ) {
    this.complianceStateRepository = connection.getRepository(AIComplianceState);
    this.systemRepository = connection.getRepository(AISystemRegistry);
  }

  /**
   * Record a compliance assessment for a specific requirement
   *
   * @param input - Compliance state data
   * @returns The created compliance state
   * @throws NotFoundException if system not found
   * @throws BadRequestException if validation fails
   */
  async recordAssessment(input: AIComplianceStateInput): Promise<AIComplianceState> {
    try {
      // Validate input
      const validatedInput = validateInput(AIComplianceStateSchema, input);

      Logger.info(
        `Recording compliance assessment for system ${validatedInput.systemId}, requirement ${validatedInput.requirementClause}`,
        'ComplianceAssessment'
      );

      // Verify system exists
      const system = await this.systemRepository.findOne({
        where: { id: validatedInput.systemId },
      });

      if (!system) {
        throw new NotFoundException(`AI system not found: ${validatedInput.systemId}`);
      }

      // Check if assessment already exists for this system + requirement
      const existingState = await this.complianceStateRepository.findOne({
        where: {
          systemId: validatedInput.systemId,
          requirementClause: validatedInput.requirementClause,
        },
      });

      let savedState: AIComplianceState;

      if (existingState) {
        // Update existing assessment
        Object.assign(existingState, {
          complianceStatus: validatedInput.complianceStatus,
          evidenceIds: validatedInput.evidenceIds || existingState.evidenceIds,
          assessedById: validatedInput.assessedById,
          assessedAt: validatedInput.assessedAt || new Date(),
          gapAnalysis: validatedInput.gapAnalysis,
          remediationPlan: validatedInput.remediationPlan,
          targetDate: validatedInput.targetDate,
        });

        savedState = await this.complianceStateRepository.save(existingState);
        Logger.info(
          `Updated existing compliance state: ${existingState.id}`,
          'ComplianceAssessment'
        );
      } else {
        // Create new assessment
        const newState = this.complianceStateRepository.create({
          systemId: validatedInput.systemId,
          requirementClause: validatedInput.requirementClause,
          complianceStatus: validatedInput.complianceStatus,
          evidenceIds: validatedInput.evidenceIds || [],
          assessedById: validatedInput.assessedById,
          assessedAt: validatedInput.assessedAt || new Date(),
          gapAnalysis: validatedInput.gapAnalysis,
          remediationPlan: validatedInput.remediationPlan,
          targetDate: validatedInput.targetDate,
        });

        savedState = await this.complianceStateRepository.save(newState);
        Logger.info(
          `Created new compliance state: ${savedState.id}`,
          'ComplianceAssessment'
        );
      }

      return savedState;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        Logger.error(`Validation failed: ${message}`, 'ComplianceAssessment');
        throw new BadRequestException(`Validation failed: ${message}`);
      }

      Logger.error(`Failed to record assessment: ${error.message}`, 'ComplianceAssessment');
      throw error;
    }
  }

  /**
   * Update an existing compliance state
   *
   * @param id - Compliance state ID
   * @param updates - Fields to update
   * @returns The updated compliance state
   * @throws NotFoundException if state not found
   */
  async updateComplianceState(
    id: string,
    updates: Partial<AIComplianceStateUpdate>
  ): Promise<AIComplianceState> {
    try {
      const validationInput = { ...updates, id };
      const validatedUpdates = validateInput(AIComplianceStateUpdateSchema, validationInput);

      Logger.info(`Updating compliance state: ${id}`, 'ComplianceAssessment');

      const existingState = await this.complianceStateRepository.findOne({ where: { id } });
      if (!existingState) {
        throw new NotFoundException(`Compliance state not found: ${id}`);
      }

      Object.assign(existingState, validatedUpdates);
      const updatedState = await this.complianceStateRepository.save(existingState);

      Logger.info(`Compliance state updated: ${id}`, 'ComplianceAssessment');
      return updatedState;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        throw new BadRequestException(`Validation failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get compliance state for a specific system and requirement
   *
   * @param systemId - AI system ID
   * @param requirementClause - ISO 42001 requirement clause
   * @returns The compliance state or null if not found
   */
  async getComplianceState(
    systemId: string,
    requirementClause: string
  ): Promise<AIComplianceState | null> {
    return this.complianceStateRepository.findOne({
      where: { systemId, requirementClause },
      relations: ['system', 'assessedBy'],
    });
  }

  /**
   * Get all compliance states for a system
   *
   * @param systemId - AI system ID
   * @param includeRelations - Whether to load related entities
   * @returns Array of compliance states
   */
  async getSystemComplianceStates(
    systemId: string,
    includeRelations = false
  ): Promise<AIComplianceState[]> {
    const options: any = { where: { systemId } };

    if (includeRelations) {
      options.relations = ['system', 'assessedBy'];
    }

    options.order = { requirementClause: 'ASC' };

    return this.complianceStateRepository.find(options);
  }

  /**
   * Get compliance assessment summary for a system
   *
   * Provides an overview of compliance status across all requirements
   *
   * @param systemId - AI system ID
   * @returns Compliance summary statistics
   * @throws NotFoundException if system not found
   */
  async getComplianceSummary(systemId: string): Promise<ComplianceAssessmentSummary> {
    try {
      // Verify system exists
      const system = await this.systemRepository.findOne({ where: { id: systemId } });
      if (!system) {
        throw new NotFoundException(`AI system not found: ${systemId}`);
      }

      // Get all compliance states for this system
      const states = await this.getSystemComplianceStates(systemId);

      // Count by status
      let compliant = 0;
      let substantiallyCompliant = 0;
      let partiallyCompliant = 0;
      let nonCompliant = 0;
      let notApplicable = 0;
      let notAssessed = 0;

      for (const state of states) {
        switch (state.complianceStatus) {
          case ComplianceStatus.COMPLIANT:
            compliant++;
            break;
          case ComplianceStatus.SUBSTANTIALLY_COMPLIANT:
            substantiallyCompliant++;
            break;
          case ComplianceStatus.PARTIALLY_COMPLIANT:
            partiallyCompliant++;
            break;
          case ComplianceStatus.NON_COMPLIANT:
            nonCompliant++;
            break;
          case ComplianceStatus.NOT_APPLICABLE:
            notApplicable++;
            break;
          case ComplianceStatus.NOT_ASSESSED:
            notAssessed++;
            break;
        }
      }

      // Calculate metrics
      const totalRequirements = states.length;
      const assessed = totalRequirements - notAssessed;
      const applicableRequirements = totalRequirements - notApplicable;

      // Gap count: non-compliant + partially compliant
      const gapCount = nonCompliant + partiallyCompliant;

      // Compliance percentage: (compliant + substantially compliant) / applicable requirements
      let compliancePercentage = 0;
      if (applicableRequirements > 0) {
        compliancePercentage = Math.round(
          ((compliant + substantiallyCompliant) / applicableRequirements) * 100
        );
      }

      return {
        systemId: system.id,
        systemName: system.systemName,
        riskCategory: system.riskCategory,
        totalRequirements,
        assessed,
        compliant,
        substantiallyCompliant,
        partiallyCompliant,
        nonCompliant,
        notApplicable,
        notAssessed,
        compliancePercentage,
        gapCount,
      };
    } catch (error) {
      Logger.error(
        `Failed to get compliance summary: ${error.message}`,
        'ComplianceAssessment'
      );
      throw error;
    }
  }

  /**
   * Get gap analysis report for a system
   *
   * Returns all non-compliant and partially compliant requirements
   * with gap details and remediation plans
   *
   * @param systemId - AI system ID
   * @returns Array of gap analysis reports
   */
  async getGapAnalysisReport(systemId: string): Promise<GapAnalysisReport[]> {
    try {
      // Ensure atoms are loaded
      if (!this.atomsLoader.isLoaded()) {
        await this.atomsLoader.loadAtoms();
      }

      // Get all compliance states with gaps
      const states = await this.complianceStateRepository.find({
        where: {
          systemId,
          complianceStatus: In([
            ComplianceStatus.NON_COMPLIANT,
            ComplianceStatus.PARTIALLY_COMPLIANT,
          ]),
        },
        order: { requirementClause: 'ASC' },
      });

      // Build gap report
      const gaps: GapAnalysisReport[] = [];

      for (const state of states) {
        // Get atom details
        const atom = this.atomsLoader.getAtomByClause(state.requirementClause);
        const requirementTitle = atom ? atom.title : state.requirementClause;

        // Determine risk level based on status and threshold
        let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';

        if (state.complianceStatus === ComplianceStatus.NON_COMPLIANT) {
          // Non-compliant is high/critical risk
          if (atom && atom.thresholdId.includes('T1_')) {
            riskLevel = 'critical'; // Foundation requirements are critical
          } else {
            riskLevel = 'high';
          }
        } else {
          // Partially compliant is medium/low risk
          riskLevel = atom && atom.thresholdId.includes('T1_') ? 'medium' : 'low';
        }

        gaps.push({
          requirementClause: state.requirementClause,
          requirementTitle,
          currentStatus: state.complianceStatus,
          gapDescription: state.gapAnalysis || null,
          remediationPlan: state.remediationPlan || null,
          targetDate: state.targetDate || null,
          riskLevel,
        });
      }

      Logger.info(
        `Generated gap analysis report with ${gaps.length} gaps for system ${systemId}`,
        'ComplianceAssessment'
      );

      return gaps;
    } catch (error) {
      Logger.error(
        `Failed to generate gap analysis report: ${error.message}`,
        'ComplianceAssessment'
      );
      throw error;
    }
  }

  /**
   * Add evidence artifact to a compliance state
   *
   * @param systemId - AI system ID
   * @param requirementClause - Requirement clause
   * @param evidenceId - Evidence artifact ID (UUID)
   * @returns Updated compliance state
   */
  async addEvidence(
    systemId: string,
    requirementClause: string,
    evidenceId: string
  ): Promise<AIComplianceState> {
    try {
      const state = await this.complianceStateRepository.findOne({
        where: { systemId, requirementClause },
      });

      if (!state) {
        throw new NotFoundException(
          `Compliance state not found for system ${systemId}, requirement ${requirementClause}`
        );
      }

      // Add evidence ID if not already present
      const evidenceIds = state.evidenceIds || [];
      if (!evidenceIds.includes(evidenceId)) {
        evidenceIds.push(evidenceId);
        state.evidenceIds = evidenceIds;

        const updatedState = await this.complianceStateRepository.save(state);
        Logger.info(
          `Added evidence ${evidenceId} to compliance state ${state.id}`,
          'ComplianceAssessment'
        );

        return updatedState;
      }

      return state;
    } catch (error) {
      Logger.error(`Failed to add evidence: ${error.message}`, 'ComplianceAssessment');
      throw error;
    }
  }

  /**
   * Remove evidence artifact from a compliance state
   *
   * @param systemId - AI system ID
   * @param requirementClause - Requirement clause
   * @param evidenceId - Evidence artifact ID to remove
   * @returns Updated compliance state
   */
  async removeEvidence(
    systemId: string,
    requirementClause: string,
    evidenceId: string
  ): Promise<AIComplianceState> {
    try {
      const state = await this.complianceStateRepository.findOne({
        where: { systemId, requirementClause },
      });

      if (!state) {
        throw new NotFoundException(
          `Compliance state not found for system ${systemId}, requirement ${requirementClause}`
        );
      }

      // Remove evidence ID
      const evidenceIds = state.evidenceIds || [];
      state.evidenceIds = evidenceIds.filter((id) => id !== evidenceId);

      const updatedState = await this.complianceStateRepository.save(state);
      Logger.info(
        `Removed evidence ${evidenceId} from compliance state ${state.id}`,
        'ComplianceAssessment'
      );

      return updatedState;
    } catch (error) {
      Logger.error(`Failed to remove evidence: ${error.message}`, 'ComplianceAssessment');
      throw error;
    }
  }

  /**
   * Get compliance states by status
   *
   * @param status - Compliance status to filter by
   * @param systemId - Optional system ID to filter by
   * @returns Array of matching compliance states
   */
  async getStatesByStatus(
    status: ComplianceStatus,
    systemId?: string
  ): Promise<AIComplianceState[]> {
    const where: any = { complianceStatus: status };
    if (systemId) {
      where.systemId = systemId;
    }

    return this.complianceStateRepository.find({
      where,
      relations: ['system'],
      order: { systemId: 'ASC', requirementClause: 'ASC' },
    });
  }

  /**
   * Get overdue remediation plans
   *
   * Returns compliance states with target dates in the past
   * that are not yet compliant
   *
   * @param systemId - Optional system ID to filter by
   * @returns Array of overdue compliance states
   */
  async getOverdueRemediations(systemId?: string): Promise<AIComplianceState[]> {
    const queryBuilder = this.complianceStateRepository
      .createQueryBuilder('state')
      .leftJoinAndSelect('state.system', 'system')
      .where('state.targetDate < :now', { now: new Date() })
      .andWhere('state.complianceStatus IN (:...statuses)', {
        statuses: [
          ComplianceStatus.NON_COMPLIANT,
          ComplianceStatus.PARTIALLY_COMPLIANT,
        ],
      });

    if (systemId) {
      queryBuilder.andWhere('state.systemId = :systemId', { systemId });
    }

    queryBuilder.orderBy('state.targetDate', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * ==========================================================================
   * REQUIREMENT-TO-SYSTEM MATCHING (Sprint G2.4)
   * ==========================================================================
   *
   * Advanced matching logic for mapping ISO 42001 requirements to AI systems
   * based on system characteristics, risk levels, and operational context.
   */

  /**
   * Get applicable requirements for a system
   *
   * Returns all ISO 42001 requirements that apply to this system
   * based on risk category and system type
   *
   * @param systemId - AI system ID
   * @returns Array of requirement atom IDs and clauses
   */
  async getApplicableRequirements(systemId: string): Promise<
    Array<{
      atomId: string;
      clause: string;
      title: string;
      thresholdId: string;
      contentType: string;
    }>
  > {
    try {
      // Get system details
      const system = await this.systemRepository.findOne({ where: { id: systemId } });
      if (!system) {
        throw new NotFoundException(`AI system not found: ${systemId}`);
      }

      // Ensure atoms are loaded
      if (!this.atomsLoader.isLoaded()) {
        await this.atomsLoader.loadAtoms();
      }

      // Get applicable atoms
      const atoms = this.atomsLoader.getApplicableAtoms(
        system.riskCategory,
        system.systemType
      );

      Logger.info(
        `Found ${atoms.length} applicable requirements for system ${system.systemName} (${system.riskCategory} risk)`,
        'ComplianceAssessment'
      );

      return atoms.map((atom) => ({
        atomId: atom.atomId,
        clause: atom.clause,
        title: atom.title,
        thresholdId: atom.thresholdId,
        contentType: atom.contentType,
      }));
    } catch (error) {
      Logger.error(
        `Failed to get applicable requirements: ${error.message}`,
        'ComplianceAssessment'
      );
      throw error;
    }
  }

  /**
   * Find requirements relevant to an incident description
   *
   * Uses keyword matching and atom content to identify which ISO 42001
   * requirements are most relevant to a specific incident.
   *
   * @param incidentDescription - Description of the incident
   * @param systemId - Optional system ID to filter requirements
   * @param limit - Maximum number of matches to return (default: 10)
   * @returns Array of relevant requirements with relevance scores
   */
  async findRelevantRequirements(
    incidentDescription: string,
    systemId?: string,
    limit = 10
  ): Promise<
    Array<{
      atomId: string;
      clause: string;
      title: string;
      relevanceScore: number;
      matchedKeywords: string[];
    }>
  > {
    try {
      // Ensure atoms are loaded
      if (!this.atomsLoader.isLoaded()) {
        await this.atomsLoader.loadAtoms();
      }

      // Get all atoms (or filtered by system)
      let atoms = this.atomsLoader.getAllAtoms();

      if (systemId) {
        const system = await this.systemRepository.findOne({ where: { id: systemId } });
        if (system) {
          atoms = this.atomsLoader.getApplicableAtoms(
            system.riskCategory,
            system.systemType
          );
        }
      }

      // Extract keywords from incident description
      const keywords = this.extractKeywords(incidentDescription);

      // Score each atom by relevance
      const scoredAtoms = atoms.map((atom) => {
        const matchedKeywords: string[] = [];
        let relevanceScore = 0;

        for (const keyword of keywords) {
          const keywordLower = keyword.toLowerCase();

          // Check title
          if (atom.title.toLowerCase().includes(keywordLower)) {
            matchedKeywords.push(keyword);
            relevanceScore += 3; // Title match is highly relevant
          }

          // Check glance (summary)
          if (atom.atomContent.glance.toLowerCase().includes(keywordLower)) {
            matchedKeywords.push(keyword);
            relevanceScore += 2;
          }

          // Check scan (details)
          if (atom.atomContent.scan.toLowerCase().includes(keywordLower)) {
            matchedKeywords.push(keyword);
            relevanceScore += 1;
          }
        }

        return {
          atomId: atom.atomId,
          clause: atom.clause,
          title: atom.title,
          relevanceScore,
          matchedKeywords: [...new Set(matchedKeywords)], // Remove duplicates
        };
      });

      // Filter atoms with non-zero scores and sort by relevance
      const relevantAtoms = scoredAtoms
        .filter((atom) => atom.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

      Logger.info(
        `Found ${relevantAtoms.length} relevant requirements for incident`,
        'ComplianceAssessment'
      );

      return relevantAtoms;
    } catch (error) {
      Logger.error(
        `Failed to find relevant requirements: ${error.message}`,
        'ComplianceAssessment'
      );
      throw error;
    }
  }

  /**
   * Map incident to requirements
   *
   * Automatically determines which ISO 42001 requirements were violated,
   * implicated, or tested by an incident based on incident details.
   *
   * @param incidentTitle - Incident title
   * @param incidentDescription - Incident description
   * @param systemId - System ID
   * @returns Array of requirement mappings with relevance type
   */
  async mapIncidentToRequirements(
    incidentTitle: string,
    incidentDescription: string,
    systemId: string
  ): Promise<
    Array<{
      clause: string;
      title: string;
      relevanceType: 'violated' | 'implicated' | 'tested';
      confidence: number;
    }>
  > {
    try {
      // Find relevant requirements
      const combinedText = `${incidentTitle} ${incidentDescription}`;
      const relevantRequirements = await this.findRelevantRequirements(
        combinedText,
        systemId,
        15 // Get top 15 for analysis
      );

      // Categorize by relevance type based on keywords and score
      const mappings = relevantRequirements.map((req) => {
        // Determine relevance type based on keywords and score
        let relevanceType: 'violated' | 'implicated' | 'tested' = 'tested';
        let confidence = 0;

        const combinedLower = combinedText.toLowerCase();
        const keywordsLower = req.matchedKeywords.map((k) => k.toLowerCase());

        // Check for violation keywords
        if (
          combinedLower.includes('violat') ||
          combinedLower.includes('breach') ||
          combinedLower.includes('fail') ||
          combinedLower.includes('non-compliant')
        ) {
          relevanceType = 'violated';
          confidence = Math.min(req.relevanceScore / 10, 1.0);
        }
        // Check for implication keywords
        else if (
          combinedLower.includes('relate') ||
          combinedLower.includes('concern') ||
          combinedLower.includes('involve') ||
          req.relevanceScore >= 5
        ) {
          relevanceType = 'implicated';
          confidence = Math.min(req.relevanceScore / 8, 1.0);
        }
        // Otherwise, requirement was tested
        else {
          relevanceType = 'tested';
          confidence = Math.min(req.relevanceScore / 6, 1.0);
        }

        return {
          clause: req.clause,
          title: req.title,
          relevanceType,
          confidence,
        };
      });

      Logger.info(
        `Mapped incident to ${mappings.length} requirements`,
        'ComplianceAssessment'
      );

      return mappings;
    } catch (error) {
      Logger.error(
        `Failed to map incident to requirements: ${error.message}`,
        'ComplianceAssessment'
      );
      throw error;
    }
  }

  /**
   * Get compliance gap requirements for a system
   *
   * Returns requirements where the system is non-compliant or partially compliant
   *
   * @param systemId - AI system ID
   * @returns Array of requirement clauses with gaps
   */
  async getGapRequirements(systemId: string): Promise<string[]> {
    const gapStates = await this.complianceStateRepository.find({
      where: {
        systemId,
        complianceStatus: In([
          ComplianceStatus.NON_COMPLIANT,
          ComplianceStatus.PARTIALLY_COMPLIANT,
        ]),
      },
    });

    return gapStates.map((state) => state.requirementClause);
  }

  /**
   * Get prerequisite requirements for a given requirement
   *
   * Returns all requirements that must be satisfied before the given
   * requirement can be assessed or implemented
   *
   * @param requirementClause - ISO 42001 requirement clause
   * @returns Array of prerequisite clauses
   */
  async getPrerequisiteRequirements(requirementClause: string): Promise<string[]> {
    try {
      // Ensure atoms are loaded
      if (!this.atomsLoader.isLoaded()) {
        await this.atomsLoader.loadAtoms();
      }

      const atom = this.atomsLoader.getAtomByClause(requirementClause);
      if (!atom) {
        throw new NotFoundException(`Requirement not found: ${requirementClause}`);
      }

      const prerequisiteChain = this.atomsLoader.getPrerequisiteChain(atom.atomId);

      // Extract clauses (excluding the atom itself)
      return prerequisiteChain
        .filter((a) => a.atomId !== atom.atomId)
        .map((a) => a.clause);
    } catch (error) {
      Logger.error(
        `Failed to get prerequisite requirements: ${error.message}`,
        'ComplianceAssessment'
      );
      throw error;
    }
  }

  /**
   * Extract keywords from text for matching
   *
   * @param text - Text to extract keywords from
   * @returns Array of keywords
   */
  private extractKeywords(text: string): string[] {
    // Remove common stop words
    const stopWords = new Set([
      'a',
      'an',
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'is',
      'was',
      'are',
      'were',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'should',
      'could',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
    ]);

    // Extract words (alphanumeric + hyphen)
    const words = text.toLowerCase().match(/[a-z0-9-]+/g) || [];

    // Filter stop words and short words, keep unique
    const keywords = [...new Set(words.filter((word) => word.length > 2 && !stopWords.has(word)))];

    return keywords;
  }
}
