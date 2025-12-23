/**
 * AI System Inventory Service
 *
 * Sprint G2.1: AI System Registration and Management
 *
 * This service provides CRUD operations for the AI System Registry,
 * enabling system registration, updates, retrieval, and filtering.
 *
 * Supports ISO 42001 T1 (AIMS Foundation) by maintaining a complete
 * inventory of all AI systems in scope for governance.
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Repository, FindManyOptions, In } from 'typeorm';
import { Logger } from '@vendure/core';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import { AIComplianceState } from '../entities/ai-compliance-state.entity';
import {
  AISystemRegistrySchema,
  AISystemRegistryUpdateSchema,
  AISystemRegistryInput,
  AISystemRegistryUpdate,
  validateInput,
  safeValidateInput,
  formatValidationError,
} from '../types/governance.validation';
import { RiskCategory, AISystemType, ComplianceStatus } from '../types/governance.enums';
import { ISO42001AtomsLoaderService } from './iso42001-atoms-loader.service';

/**
 * Filter options for listing AI systems
 */
export interface AISystemFilters {
  riskCategory?: RiskCategory | RiskCategory[];
  systemType?: AISystemType | AISystemType[];
  operationalDomain?: string;
  ownerId?: string;
  requiresReview?: boolean; // Systems past nextReviewDate
}

/**
 * AI System Inventory Service
 *
 * Manages the complete lifecycle of AI system registration:
 * - Register new AI systems
 * - Update system details and risk assessments
 * - Retrieve systems by ID or filters
 * - Track review schedules
 */
@Injectable()
export class AISystemInventoryService {
  private systemRepository: Repository<AISystemRegistry>;
  private complianceStateRepository: Repository<AIComplianceState>;

  constructor(
    @InjectConnection() private connection: Connection,
    private atomsLoader: ISO42001AtomsLoaderService
  ) {
    this.systemRepository = connection.getRepository(AISystemRegistry);
    this.complianceStateRepository = connection.getRepository(AIComplianceState);
  }

  /**
   * Calculate next review date based on risk category
   *
   * ISO 42001 requires more frequent reviews for higher-risk systems:
   * - HIGH/UNACCEPTABLE: 3 months
   * - LIMITED: 6 months
   * - MINIMAL: 12 months
   *
   * @param riskCategory - System risk category
   * @param fromDate - Start date (defaults to now)
   * @returns Next review date
   */
  private calculateNextReviewDate(
    riskCategory: RiskCategory,
    fromDate: Date = new Date()
  ): Date {
    const reviewDate = new Date(fromDate);

    switch (riskCategory) {
      case RiskCategory.HIGH:
      case RiskCategory.UNACCEPTABLE:
        // High risk: 3 months
        reviewDate.setMonth(reviewDate.getMonth() + 3);
        break;
      case RiskCategory.LIMITED:
        // Limited risk: 6 months
        reviewDate.setMonth(reviewDate.getMonth() + 6);
        break;
      case RiskCategory.MINIMAL:
        // Minimal risk: 12 months
        reviewDate.setMonth(reviewDate.getMonth() + 12);
        break;
    }

    return reviewDate;
  }

  /**
   * Check for duplicate system name
   *
   * @param systemName - Name to check
   * @param excludeId - Optional system ID to exclude (for updates)
   * @returns True if duplicate exists
   */
  private async checkDuplicateSystemName(
    systemName: string,
    excludeId?: string
  ): Promise<boolean> {
    const queryBuilder = this.systemRepository
      .createQueryBuilder('system')
      .where('LOWER(system.systemName) = LOWER(:systemName)', { systemName });

    if (excludeId) {
      queryBuilder.andWhere('system.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  /**
   * Initialize compliance baseline for a newly registered system
   *
   * Creates compliance state records for all applicable ISO 42001 requirements
   * based on the system's risk category and type.
   *
   * @param system - The registered system
   * @returns Number of compliance states created
   */
  private async initializeComplianceBaseline(
    system: AISystemRegistry
  ): Promise<number> {
    try {
      Logger.info(
        `Initializing compliance baseline for system: ${system.id}`,
        'AISystemInventory'
      );

      // Ensure atoms are loaded
      if (!this.atomsLoader.isLoaded()) {
        await this.atomsLoader.loadAtoms();
      }

      // Get applicable atoms for this system
      const applicableAtoms = this.atomsLoader.getApplicableAtoms(
        system.riskCategory,
        system.systemType
      );

      Logger.info(
        `Creating ${applicableAtoms.length} compliance states for ${system.systemName}`,
        'AISystemInventory'
      );

      // Create compliance state for each applicable requirement
      const complianceStates: AIComplianceState[] = [];

      for (const atom of applicableAtoms) {
        const state = this.complianceStateRepository.create({
          systemId: system.id,
          requirementClause: atom.clause,
          complianceStatus: ComplianceStatus.NOT_ASSESSED,
          // No evidence yet
          evidenceIds: [],
          // No assessment yet
          assessedById: undefined,
          assessedAt: undefined,
        });

        complianceStates.push(state);
      }

      // Batch save all compliance states
      await this.complianceStateRepository.save(complianceStates);

      Logger.info(
        `Successfully initialized ${complianceStates.length} compliance states`,
        'AISystemInventory'
      );

      return complianceStates.length;
    } catch (error) {
      Logger.error(
        `Failed to initialize compliance baseline: ${error.message}`,
        'AISystemInventory'
      );
      // Don't throw - baseline initialization is best-effort
      // The system can still be registered even if baseline creation fails
      return 0;
    }
  }

  /**
   * Register a new AI system with full workflow
   *
   * This is the primary registration workflow that:
   * 1. Validates input
   * 2. Checks for duplicate names
   * 3. Sets default review dates based on risk
   * 4. Creates the system
   * 5. Initializes compliance baseline
   *
   * @param input - System registration data
   * @param initializeCompliance - Whether to create compliance baseline (default: true)
   * @returns The created system with compliance state count
   */
  async registerSystemWithWorkflow(
    input: AISystemRegistryInput,
    initializeCompliance = true
  ): Promise<{ system: AISystemRegistry; complianceStatesCreated: number }> {
    try {
      // Validate input
      const validatedInput = validateInput(AISystemRegistrySchema, input);

      Logger.info(
        `Starting registration workflow for: ${validatedInput.systemName}`,
        'AISystemInventory'
      );

      // Check for duplicate system name
      const isDuplicate = await this.checkDuplicateSystemName(validatedInput.systemName);
      if (isDuplicate) {
        throw new ConflictException(
          `AI system with name '${validatedInput.systemName}' already exists`
        );
      }

      // Calculate next review date if not provided
      let nextReviewDate = validatedInput.nextReviewDate;
      if (!nextReviewDate) {
        nextReviewDate = this.calculateNextReviewDate(
          validatedInput.riskCategory,
          validatedInput.lastRiskAssessmentDate || new Date()
        );
        Logger.info(
          `Auto-calculated next review date: ${nextReviewDate.toISOString()} for risk category ${validatedInput.riskCategory}`,
          'AISystemInventory'
        );
      }

      // Create system entity
      const system = this.systemRepository.create({
        systemName: validatedInput.systemName,
        systemType: validatedInput.systemType,
        riskCategory: validatedInput.riskCategory,
        intendedPurpose: validatedInput.intendedPurpose,
        operationalDomain: validatedInput.operationalDomain,
        humanOversightLevel: validatedInput.humanOversightLevel,
        lastRiskAssessmentDate: validatedInput.lastRiskAssessmentDate,
        nextReviewDate,
        ownerId: validatedInput.ownerId,
      });

      // Save to database
      const savedSystem = await this.systemRepository.save(system);

      Logger.info(
        `AI system registered successfully: ${savedSystem.id}`,
        'AISystemInventory'
      );

      // Initialize compliance baseline
      let complianceStatesCreated = 0;
      if (initializeCompliance) {
        complianceStatesCreated = await this.initializeComplianceBaseline(savedSystem);
      }

      return {
        system: savedSystem,
        complianceStatesCreated,
      };
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        Logger.error(`Validation failed for system registration: ${message}`, 'AISystemInventory');
        throw new BadRequestException(`Validation failed: ${message}`);
      }

      Logger.error(`Failed to register AI system: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * Register a new AI system
   *
   * @param input - System registration data
   * @returns The created system
   * @throws BadRequestException if validation fails
   */
  async registerSystem(input: AISystemRegistryInput): Promise<AISystemRegistry> {
    try {
      // Validate input
      const validatedInput = validateInput(AISystemRegistrySchema, input);

      Logger.info(
        `Registering new AI system: ${validatedInput.systemName}`,
        'AISystemInventory'
      );

      // Create system entity
      const system = this.systemRepository.create({
        systemName: validatedInput.systemName,
        systemType: validatedInput.systemType,
        riskCategory: validatedInput.riskCategory,
        intendedPurpose: validatedInput.intendedPurpose,
        operationalDomain: validatedInput.operationalDomain,
        humanOversightLevel: validatedInput.humanOversightLevel,
        lastRiskAssessmentDate: validatedInput.lastRiskAssessmentDate,
        nextReviewDate: validatedInput.nextReviewDate,
        ownerId: validatedInput.ownerId,
      });

      // Save to database
      const savedSystem = await this.systemRepository.save(system);

      Logger.info(
        `AI system registered successfully: ${savedSystem.id}`,
        'AISystemInventory'
      );

      return savedSystem;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        Logger.error(`Validation failed for system registration: ${message}`, 'AISystemInventory');
        throw new BadRequestException(`Validation failed: ${message}`);
      }

      Logger.error(`Failed to register AI system: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * Update an existing AI system
   *
   * @param id - System ID
   * @param updates - Fields to update
   * @returns The updated system
   * @throws NotFoundException if system not found
   * @throws BadRequestException if validation fails
   */
  async updateSystem(id: string, updates: Partial<AISystemRegistryUpdate>): Promise<AISystemRegistry> {
    try {
      // Validate update input
      const validationInput = { ...updates, id };
      const validatedUpdates = validateInput(AISystemRegistryUpdateSchema, validationInput);

      Logger.info(`Updating AI system: ${id}`, 'AISystemInventory');

      // Check if system exists
      const existingSystem = await this.systemRepository.findOne({ where: { id } });
      if (!existingSystem) {
        throw new NotFoundException(`AI system not found: ${id}`);
      }

      // Update fields
      Object.assign(existingSystem, validatedUpdates);

      // Save updates
      const updatedSystem = await this.systemRepository.save(existingSystem);

      Logger.info(`AI system updated successfully: ${id}`, 'AISystemInventory');

      return updatedSystem;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        Logger.error(`Validation failed for system update: ${message}`, 'AISystemInventory');
        throw new BadRequestException(`Validation failed: ${message}`);
      }

      Logger.error(`Failed to update AI system: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * Get a system by ID
   *
   * @param id - System ID
   * @param loadRelations - Whether to load related entities
   * @returns The system
   * @throws NotFoundException if system not found
   */
  async getSystemById(
    id: string,
    loadRelations = false
  ): Promise<AISystemRegistry> {
    try {
      const options: FindManyOptions<AISystemRegistry> = { where: { id } };

      if (loadRelations) {
        options.relations = ['owner', 'complianceStates', 'incidents', 'oversightActions'];
      }

      const system = await this.systemRepository.findOne(options);

      if (!system) {
        throw new NotFoundException(`AI system not found: ${id}`);
      }

      return system;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      Logger.error(`Failed to retrieve AI system: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * List all systems with optional filters
   *
   * @param filters - Filter criteria
   * @param loadRelations - Whether to load related entities
   * @returns Array of matching systems
   */
  async listSystems(
    filters?: AISystemFilters,
    loadRelations = false
  ): Promise<AISystemRegistry[]> {
    try {
      const queryBuilder = this.systemRepository.createQueryBuilder('system');

      // Apply filters
      if (filters) {
        if (filters.riskCategory) {
          const categories = Array.isArray(filters.riskCategory)
            ? filters.riskCategory
            : [filters.riskCategory];
          queryBuilder.andWhere('system.riskCategory IN (:...categories)', { categories });
        }

        if (filters.systemType) {
          const types = Array.isArray(filters.systemType)
            ? filters.systemType
            : [filters.systemType];
          queryBuilder.andWhere('system.systemType IN (:...types)', { types });
        }

        if (filters.operationalDomain) {
          queryBuilder.andWhere('system.operationalDomain = :domain', {
            domain: filters.operationalDomain,
          });
        }

        if (filters.ownerId) {
          queryBuilder.andWhere('system.ownerId = :ownerId', {
            ownerId: filters.ownerId,
          });
        }

        if (filters.requiresReview) {
          // Systems where nextReviewDate is in the past or null
          queryBuilder.andWhere(
            '(system.nextReviewDate IS NULL OR system.nextReviewDate < :now)',
            { now: new Date() }
          );
        }
      }

      // Load relations if requested
      if (loadRelations) {
        queryBuilder.leftJoinAndSelect('system.owner', 'owner');
        queryBuilder.leftJoinAndSelect('system.complianceStates', 'complianceStates');
        queryBuilder.leftJoinAndSelect('system.incidents', 'incidents');
        queryBuilder.leftJoinAndSelect('system.oversightActions', 'oversightActions');
      }

      // Order by creation date (newest first)
      queryBuilder.orderBy('system.createdAt', 'DESC');

      const systems = await queryBuilder.getMany();

      Logger.info(
        `Retrieved ${systems.length} AI systems with filters: ${JSON.stringify(filters)}`,
        'AISystemInventory'
      );

      return systems;
    } catch (error) {
      Logger.error(`Failed to list AI systems: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * Get systems by risk category
   *
   * Convenience method for filtering by risk category only
   *
   * @param riskCategory - Single or multiple risk categories
   * @returns Array of matching systems
   */
  async getSystemsByRiskCategory(
    riskCategory: RiskCategory | RiskCategory[]
  ): Promise<AISystemRegistry[]> {
    return this.listSystems({ riskCategory });
  }

  /**
   * Get systems requiring review
   *
   * Returns systems where nextReviewDate has passed or is not set
   *
   * @returns Array of systems requiring review
   */
  async getSystemsRequiringReview(): Promise<AISystemRegistry[]> {
    return this.listSystems({ requiresReview: true });
  }

  /**
   * Delete a system
   *
   * Note: This is a hard delete. Use with caution in production.
   * Consider soft deletes or archiving instead.
   *
   * @param id - System ID
   * @throws NotFoundException if system not found
   */
  async deleteSystem(id: string): Promise<void> {
    try {
      Logger.warn(`Deleting AI system: ${id}`, 'AISystemInventory');

      const result = await this.systemRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(`AI system not found: ${id}`);
      }

      Logger.info(`AI system deleted: ${id}`, 'AISystemInventory');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      Logger.error(`Failed to delete AI system: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * Get inventory statistics
   *
   * Provides a summary of the AI system inventory
   *
   * @returns Statistics object
   */
  async getInventoryStats(): Promise<{
    totalSystems: number;
    byRiskCategory: Record<RiskCategory, number>;
    bySystemType: Record<AISystemType, number>;
    requiresReview: number;
  }> {
    try {
      const allSystems = await this.systemRepository.find();

      // Count by risk category
      const byRiskCategory = {
        [RiskCategory.MINIMAL]: 0,
        [RiskCategory.LIMITED]: 0,
        [RiskCategory.HIGH]: 0,
        [RiskCategory.UNACCEPTABLE]: 0,
      };

      // Count by system type
      const bySystemType = {
        [AISystemType.RECOMMENDER]: 0,
        [AISystemType.CLASSIFIER]: 0,
        [AISystemType.ANALYZER]: 0,
        [AISystemType.GENERATOR]: 0,
      };

      // Count systems requiring review
      let requiresReview = 0;
      const now = new Date();

      for (const system of allSystems) {
        byRiskCategory[system.riskCategory]++;
        bySystemType[system.systemType]++;

        if (!system.nextReviewDate || system.nextReviewDate < now) {
          requiresReview++;
        }
      }

      return {
        totalSystems: allSystems.length,
        byRiskCategory,
        bySystemType,
        requiresReview,
      };
    } catch (error) {
      Logger.error(`Failed to get inventory stats: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }

  /**
   * Batch register multiple systems
   *
   * Useful for initial data loading or migrations
   *
   * @param inputs - Array of system registration inputs
   * @returns Array of created systems
   */
  async batchRegisterSystems(inputs: AISystemRegistryInput[]): Promise<AISystemRegistry[]> {
    try {
      Logger.info(`Batch registering ${inputs.length} AI systems`, 'AISystemInventory');

      const systems: AISystemRegistry[] = [];

      for (const input of inputs) {
        const system = await this.registerSystem(input);
        systems.push(system);
      }

      Logger.info(
        `Successfully batch registered ${systems.length} AI systems`,
        'AISystemInventory'
      );

      return systems;
    } catch (error) {
      Logger.error(`Failed to batch register systems: ${error.message}`, 'AISystemInventory');
      throw error;
    }
  }
}
