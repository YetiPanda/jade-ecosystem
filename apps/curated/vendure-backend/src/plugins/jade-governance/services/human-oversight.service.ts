/**
 * Human Oversight Service
 *
 * Sprint G2.8: Human Oversight Action Tracking
 *
 * This service manages human oversight actions for AI systems, implementing
 * ISO 42001 Annex A.9 (Human Oversight of AI Systems) requirements.
 *
 * Tracks four types of oversight actions:
 * - OVERRIDE: Human replaces AI decision
 * - INTERVENTION: Human modifies AI output
 * - SHUTDOWN: Emergency AI system stop
 * - APPROVAL: Explicit human approval of AI recommendation
 *
 * Implements ISO 42001 A.9 Control: Human Oversight
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Repository, Between } from 'typeorm';
import { Logger } from '@vendure/core';
import { HumanOversightAction, DataCorrectionInput, mapCorrectionToSystem } from '../entities/human-oversight-action.entity';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import {
  HumanOversightActionSchema,
  HumanOversightActionUpdateSchema,
  HumanOversightActionInput,
  HumanOversightActionUpdate,
  validateInput,
  formatValidationError,
} from '../types/governance.validation';
import { OversightActionType } from '../types/governance.enums';

/**
 * Oversight action statistics
 */
export interface OversightStats {
  totalActions: number;
  byActionType: Record<OversightActionType, number>;
  bySystem: Record<string, number>;
  overrideRate: number; // Percentage of actions that were overrides
  interventionRate: number; // Percentage of actions that were interventions
}

/**
 * Human Oversight Service
 *
 * Manages human oversight action tracking for AI governance compliance
 */
@Injectable()
export class HumanOversightService {
  private oversightRepository: Repository<HumanOversightAction>;
  private systemRepository: Repository<AISystemRegistry>;

  constructor(@InjectConnection() private connection: Connection) {
    this.oversightRepository = connection.getRepository(HumanOversightAction);
    this.systemRepository = connection.getRepository(AISystemRegistry);
  }

  /**
   * Record a human oversight action
   *
   * @param input - Oversight action data
   * @returns The created oversight action
   * @throws NotFoundException if system not found
   * @throws BadRequestException if validation fails
   */
  async recordAction(input: HumanOversightActionInput): Promise<HumanOversightAction> {
    try {
      // Validate input
      const validatedInput = validateInput(HumanOversightActionSchema, input);

      Logger.info(
        `Recording ${validatedInput.actionType} action for system ${validatedInput.systemId} by user ${validatedInput.triggeredById}`,
        'HumanOversight'
      );

      // Verify system exists
      const system = await this.systemRepository.findOne({
        where: { id: validatedInput.systemId },
      });

      if (!system) {
        throw new NotFoundException(`AI system not found: ${validatedInput.systemId}`);
      }

      // Create oversight action entity
      const action = this.oversightRepository.create({
        systemId: validatedInput.systemId,
        actionType: validatedInput.actionType,
        triggeredById: validatedInput.triggeredById,
        recommendationId: validatedInput.recommendationId,
        originalOutput: validatedInput.originalOutput,
        modifiedOutput: validatedInput.modifiedOutput,
        justification: validatedInput.justification,
        riskAssessment: validatedInput.riskAssessment,
      });

      // Save to database
      const savedAction = await this.oversightRepository.save(action);

      Logger.info(
        `Oversight action recorded successfully: ${savedAction.id}`,
        'HumanOversight'
      );

      return savedAction;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        Logger.error(`Validation failed: ${message}`, 'HumanOversight');
        throw new BadRequestException(`Validation failed: ${message}`);
      }

      Logger.error(`Failed to record oversight action: ${error.message}`, 'HumanOversight');
      throw error;
    }
  }

  /**
   * Update an existing oversight action
   *
   * @param id - Oversight action ID
   * @param updates - Fields to update
   * @returns The updated oversight action
   */
  async updateAction(
    id: string,
    updates: Partial<HumanOversightActionUpdate>
  ): Promise<HumanOversightAction> {
    try {
      const validationInput = { ...updates, id };
      const validatedUpdates = validateInput(HumanOversightActionUpdateSchema, validationInput);

      Logger.info(`Updating oversight action: ${id}`, 'HumanOversight');

      const existingAction = await this.oversightRepository.findOne({ where: { id } });
      if (!existingAction) {
        throw new NotFoundException(`Oversight action not found: ${id}`);
      }

      Object.assign(existingAction, validatedUpdates);
      const updatedAction = await this.oversightRepository.save(existingAction);

      Logger.info(`Oversight action updated: ${id}`, 'HumanOversight');
      return updatedAction;
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = formatValidationError(error);
        throw new BadRequestException(`Validation failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get oversight action by ID
   *
   * @param id - Oversight action ID
   * @param loadRelations - Whether to load related entities
   * @returns The oversight action
   */
  async getActionById(
    id: string,
    loadRelations = false
  ): Promise<HumanOversightAction> {
    const options: any = { where: { id } };

    if (loadRelations) {
      options.relations = ['system', 'triggeredBy'];
    }

    const action = await this.oversightRepository.findOne(options);

    if (!action) {
      throw new NotFoundException(`Oversight action not found: ${id}`);
    }

    return action;
  }

  /**
   * List oversight actions for a system
   *
   * @param systemId - AI system ID
   * @param loadRelations - Whether to load related entities
   * @returns Array of oversight actions
   */
  async listActionsBySystem(
    systemId: string,
    loadRelations = false
  ): Promise<HumanOversightAction[]> {
    const options: any = {
      where: { systemId },
      order: { createdAt: 'DESC' },
    };

    if (loadRelations) {
      options.relations = ['system', 'triggeredBy'];
    }

    return this.oversightRepository.find(options);
  }

  /**
   * List oversight actions by user
   *
   * @param userId - User ID
   * @param loadRelations - Whether to load related entities
   * @returns Array of oversight actions
   */
  async listActionsByUser(
    userId: string,
    loadRelations = false
  ): Promise<HumanOversightAction[]> {
    const options: any = {
      where: { triggeredById: userId },
      order: { createdAt: 'DESC' },
    };

    if (loadRelations) {
      options.relations = ['system', 'triggeredBy'];
    }

    return this.oversightRepository.find(options);
  }

  /**
   * List oversight actions by type
   *
   * @param actionType - Oversight action type
   * @param systemId - Optional system ID to filter by
   * @returns Array of oversight actions
   */
  async listActionsByType(
    actionType: OversightActionType,
    systemId?: string
  ): Promise<HumanOversightAction[]> {
    const where: any = { actionType };
    if (systemId) {
      where.systemId = systemId;
    }

    return this.oversightRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['system', 'triggeredBy'],
    });
  }

  /**
   * Get oversight actions within a date range
   *
   * @param startDate - Start date
   * @param endDate - End date
   * @param systemId - Optional system ID to filter by
   * @returns Array of oversight actions
   */
  async getActionsByDateRange(
    startDate: Date,
    endDate: Date,
    systemId?: string
  ): Promise<HumanOversightAction[]> {
    const queryBuilder = this.oversightRepository
      .createQueryBuilder('action')
      .leftJoinAndSelect('action.system', 'system')
      .leftJoinAndSelect('action.triggeredBy', 'user')
      .where('action.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (systemId) {
      queryBuilder.andWhere('action.systemId = :systemId', { systemId });
    }

    queryBuilder.orderBy('action.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Get oversight statistics
   *
   * @param systemId - Optional system ID to filter by
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   * @returns Oversight statistics
   */
  async getOversightStats(
    systemId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<OversightStats> {
    try {
      let actions: HumanOversightAction[];

      if (startDate && endDate) {
        actions = await this.getActionsByDateRange(startDate, endDate, systemId);
      } else {
        const where: any = {};
        if (systemId) {
          where.systemId = systemId;
        }
        actions = await this.oversightRepository.find({ where });
      }

      // Count by action type
      const byActionType = {
        [OversightActionType.OVERRIDE]: 0,
        [OversightActionType.INTERVENTION]: 0,
        [OversightActionType.SHUTDOWN]: 0,
        [OversightActionType.APPROVAL]: 0,
      };

      // Count by system
      const bySystem: Record<string, number> = {};

      for (const action of actions) {
        byActionType[action.actionType]++;

        if (!bySystem[action.systemId]) {
          bySystem[action.systemId] = 0;
        }
        bySystem[action.systemId]++;
      }

      const totalActions = actions.length;
      const overrideRate = totalActions > 0
        ? (byActionType[OversightActionType.OVERRIDE] / totalActions) * 100
        : 0;
      const interventionRate = totalActions > 0
        ? (byActionType[OversightActionType.INTERVENTION] / totalActions) * 100
        : 0;

      return {
        totalActions,
        byActionType,
        bySystem,
        overrideRate,
        interventionRate,
      };
    } catch (error) {
      Logger.error(
        `Failed to get oversight stats: ${error.message}`,
        'HumanOversight'
      );
      throw error;
    }
  }

  /**
   * Record oversight action from data correction
   *
   * Bridges the existing data_corrections table with governance tracking
   *
   * @param correction - Data correction input
   * @returns The created oversight action
   */
  async recordFromDataCorrection(
    correction: DataCorrectionInput
  ): Promise<HumanOversightAction | null> {
    try {
      // Map entity type to AI system
      const systemName = mapCorrectionToSystem(correction.entityType);
      if (!systemName) {
        Logger.warn(
          `No AI system mapping for entity type: ${correction.entityType}`,
          'HumanOversight'
        );
        return null;
      }

      // Find system by operational domain or name
      const system = await this.systemRepository.findOne({
        where: [
          { operationalDomain: systemName },
          { systemName },
        ],
      });

      if (!system) {
        Logger.warn(
          `AI system not found for entity type: ${correction.entityType}`,
          'HumanOversight'
        );
        return null;
      }

      Logger.info(
        `Recording oversight action from data correction ${correction.correctionId}`,
        'HumanOversight'
      );

      // Create oversight action
      const action = await this.recordAction({
        systemId: system.id,
        actionType: OversightActionType.OVERRIDE,
        triggeredById: correction.curatorId,
        recommendationId: correction.correctionId,
        originalOutput: correction.originalValue,
        modifiedOutput: correction.correctedValue,
        justification: correction.reason,
      });

      Logger.info(
        `Oversight action created from data correction: ${action.id}`,
        'HumanOversight'
      );

      return action;
    } catch (error) {
      Logger.error(
        `Failed to record oversight from data correction: ${error.message}`,
        'HumanOversight'
      );
      return null; // Don't throw - this is best-effort integration
    }
  }

  /**
   * Get recent overrides for a system
   *
   * Used to detect patterns of AI system unreliability
   *
   * @param systemId - AI system ID
   * @param limit - Maximum number of overrides to return
   * @returns Array of recent override actions
   */
  async getRecentOverrides(
    systemId: string,
    limit = 10
  ): Promise<HumanOversightAction[]> {
    return this.oversightRepository.find({
      where: {
        systemId,
        actionType: OversightActionType.OVERRIDE,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['triggeredBy'],
    });
  }

  /**
   * Get emergency shutdowns
   *
   * Critical events requiring immediate attention
   *
   * @param systemId - Optional system ID to filter by
   * @returns Array of shutdown actions
   */
  async getShutdowns(systemId?: string): Promise<HumanOversightAction[]> {
    const where: any = { actionType: OversightActionType.SHUTDOWN };
    if (systemId) {
      where.systemId = systemId;
    }

    return this.oversightRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['system', 'triggeredBy'],
    });
  }

  /**
   * Calculate oversight frequency for a system
   *
   * Returns the rate of oversight actions over time
   *
   * @param systemId - AI system ID
   * @param days - Number of days to look back (default: 30)
   * @returns Oversight actions per day
   */
  async calculateOversightFrequency(
    systemId: string,
    days = 30
  ): Promise<number> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const actions = await this.getActionsByDateRange(
        startDate,
        new Date(),
        systemId
      );

      return actions.length / days;
    } catch (error) {
      Logger.error(
        `Failed to calculate oversight frequency: ${error.message}`,
        'HumanOversight'
      );
      throw error;
    }
  }

  /**
   * Delete an oversight action
   *
   * Note: Use with caution. Oversight actions are compliance evidence.
   *
   * @param id - Oversight action ID
   */
  async deleteAction(id: string): Promise<void> {
    try {
      Logger.warn(`Deleting oversight action: ${id}`, 'HumanOversight');

      const result = await this.oversightRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(`Oversight action not found: ${id}`);
      }

      Logger.info(`Oversight action deleted: ${id}`, 'HumanOversight');
    } catch (error) {
      Logger.error(
        `Failed to delete oversight action: ${error.message}`,
        'HumanOversight'
      );
      throw error;
    }
  }
}
