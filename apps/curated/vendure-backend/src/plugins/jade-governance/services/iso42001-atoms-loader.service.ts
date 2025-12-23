/**
 * ISO 42001 Atoms Loader Service
 *
 * Sprint G1.9: Load ISO 42001 SKA atoms into database
 *
 * This service loads the 78 ISO 42001 requirement atoms from the JSON file
 * and stores them in the database for compliance mapping and requirement tracking.
 *
 * The atoms are used to:
 * - Map incidents to ISO 42001 requirements
 * - Generate compliance evidence chains
 * - Provide requirement context in governance dashboards
 */

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '@vendure/core';
import {
  ISO42001AtomsSchema,
  ISO42001Atoms,
  RequirementAtom,
  validateInput,
} from '../types/governance.validation';

/**
 * ISO 42001 Atoms Loader Service
 *
 * Handles loading and querying of ISO 42001 requirement atoms
 */
@Injectable()
export class ISO42001AtomsLoaderService {
  private atoms: RequirementAtom[] = [];
  private atomsById: Map<string, RequirementAtom> = new Map();
  private atomsByClause: Map<string, RequirementAtom> = new Map();
  private atomsByThreshold: Map<string, RequirementAtom[]> = new Map();
  private loaded = false;

  constructor(@InjectConnection() private connection: Connection) {}

  /**
   * Load ISO 42001 atoms from JSON file
   *
   * @param filePath - Path to iso42001-ska-atoms.json
   * @returns Number of atoms loaded
   */
  async loadAtoms(filePath?: string): Promise<number> {
    if (this.loaded) {
      Logger.info('ISO 42001 atoms already loaded, skipping', 'GovernanceLoader');
      return this.atoms.length;
    }

    try {
      // Default path to the data file
      const defaultPath = path.join(
        __dirname,
        '../../../../../..',
        'Five-Rings-Temp/specs/010-ska-mach-evolution/data/iso42001-ska-atoms.json'
      );
      const atomsPath = filePath || defaultPath;

      Logger.info(`Loading ISO 42001 atoms from: ${atomsPath}`, 'GovernanceLoader');

      // Read and parse JSON file
      const fileContent = await fs.readFile(atomsPath, 'utf-8');
      const rawData = JSON.parse(fileContent);

      // Validate structure
      const atomsData: ISO42001Atoms = validateInput(ISO42001AtomsSchema, rawData);

      Logger.info(
        `Validated ${atomsData.atoms.length} atoms from ISO ${atomsData.metadata.framework}`,
        'GovernanceLoader'
      );

      // Store atoms in memory
      this.atoms = atomsData.atoms;

      // Index by atomId
      for (const atom of this.atoms) {
        this.atomsById.set(atom.atomId, atom);
        this.atomsByClause.set(atom.clause, atom);

        // Index by threshold
        if (!this.atomsByThreshold.has(atom.thresholdId)) {
          this.atomsByThreshold.set(atom.thresholdId, []);
        }
        this.atomsByThreshold.get(atom.thresholdId)!.push(atom);
      }

      // Optionally persist to database
      await this.persistToDatabase(atomsData);

      this.loaded = true;
      Logger.info(`Successfully loaded ${this.atoms.length} ISO 42001 atoms`, 'GovernanceLoader');

      return this.atoms.length;
    } catch (error) {
      Logger.error(`Failed to load ISO 42001 atoms: ${error.message}`, 'GovernanceLoader');
      throw error;
    }
  }

  /**
   * Get atom by ID
   */
  getAtomById(atomId: string): RequirementAtom | undefined {
    return this.atomsById.get(atomId);
  }

  /**
   * Get atom by clause
   */
  getAtomByClause(clause: string): RequirementAtom | undefined {
    return this.atomsByClause.get(clause);
  }

  /**
   * Get all atoms for a threshold
   */
  getAtomsByThreshold(thresholdId: string): RequirementAtom[] {
    return this.atomsByThreshold.get(thresholdId) || [];
  }

  /**
   * Get all atoms
   */
  getAllAtoms(): RequirementAtom[] {
    return this.atoms;
  }

  /**
   * Find atoms by keyword search
   */
  searchAtoms(query: string): RequirementAtom[] {
    const lowerQuery = query.toLowerCase();
    return this.atoms.filter(
      (atom) =>
        atom.title.toLowerCase().includes(lowerQuery) ||
        atom.atomContent.glance.toLowerCase().includes(lowerQuery) ||
        atom.atomContent.scan.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get prerequisite chain for an atom
   */
  getPrerequisiteChain(atomId: string): RequirementAtom[] {
    const chain: RequirementAtom[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const atom = this.atomsById.get(id);
      if (!atom) return;

      chain.push(atom);

      for (const prereqId of atom.prerequisiteAtoms) {
        traverse(prereqId);
      }
    };

    traverse(atomId);
    return chain;
  }

  /**
   * Get enabled atoms chain (what this atom enables)
   */
  getEnabledChain(atomId: string): RequirementAtom[] {
    const chain: RequirementAtom[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const atom = this.atomsById.get(id);
      if (!atom) return;

      chain.push(atom);

      for (const enabledId of atom.enabledAtoms) {
        traverse(enabledId);
      }
    };

    traverse(atomId);
    return chain;
  }

  /**
   * Get applicable atoms for an AI system based on risk category and type
   */
  getApplicableAtoms(
    riskCategory: string,
    systemType: string
  ): RequirementAtom[] {
    // All systems must comply with T1 (Foundation) and T2 (Infrastructure)
    const mandatoryAtoms = [
      ...this.getAtomsByThreshold('T1_AIMS_Foundation'),
      ...this.getAtomsByThreshold('T2_Resource_Infrastructure'),
    ];

    // High risk systems must comply with all thresholds
    if (riskCategory === 'high' || riskCategory === 'unacceptable') {
      return this.atoms;
    }

    // Limited risk systems need T3, T4, T5
    if (riskCategory === 'limited') {
      return [
        ...mandatoryAtoms,
        ...this.getAtomsByThreshold('T3_Operational_Controls'),
        ...this.getAtomsByThreshold('T4_Performance_Evaluation'),
        ...this.getAtomsByThreshold('T5_Continual_Improvement'),
      ];
    }

    // Minimal risk systems need T1, T2, basic T3
    return mandatoryAtoms;
  }

  /**
   * Persist atoms to database (optional - for caching)
   */
  private async persistToDatabase(atomsData: ISO42001Atoms): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create governance_atoms table if not exists (for caching)
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS jade.governance_atoms (
          atom_id VARCHAR(100) PRIMARY KEY,
          threshold_id VARCHAR(50) NOT NULL,
          clause VARCHAR(20) NOT NULL,
          title VARCHAR(255) NOT NULL,
          atom_content JSONB NOT NULL,
          content_type VARCHAR(20) NOT NULL,
          prerequisite_atoms TEXT[] DEFAULT '{}',
          enabled_atoms TEXT[] DEFAULT '{}',
          tensor_coordinates JSONB NOT NULL,
          cross_framework_mappings JSONB,
          evidence_artifacts TEXT[],
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);

      // Clear existing atoms
      await queryRunner.query(`TRUNCATE TABLE jade.governance_atoms`);

      // Insert atoms
      for (const atom of atomsData.atoms) {
        await queryRunner.query(
          `
          INSERT INTO jade.governance_atoms (
            atom_id, threshold_id, clause, title, atom_content,
            content_type, prerequisite_atoms, enabled_atoms,
            tensor_coordinates, cross_framework_mappings, evidence_artifacts
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (atom_id) DO UPDATE SET
            threshold_id = EXCLUDED.threshold_id,
            clause = EXCLUDED.clause,
            title = EXCLUDED.title,
            atom_content = EXCLUDED.atom_content,
            content_type = EXCLUDED.content_type,
            prerequisite_atoms = EXCLUDED.prerequisite_atoms,
            enabled_atoms = EXCLUDED.enabled_atoms,
            tensor_coordinates = EXCLUDED.tensor_coordinates,
            cross_framework_mappings = EXCLUDED.cross_framework_mappings,
            evidence_artifacts = EXCLUDED.evidence_artifacts
        `,
          [
            atom.atomId,
            atom.thresholdId,
            atom.clause,
            atom.title,
            JSON.stringify(atom.atomContent),
            atom.contentType,
            atom.prerequisiteAtoms,
            atom.enabledAtoms,
            JSON.stringify(atom.tensorCoordinates),
            JSON.stringify(atom.crossFrameworkMappings),
            atom.evidenceArtifacts,
          ]
        );
      }

      await queryRunner.commitTransaction();
      Logger.info('ISO 42001 atoms persisted to database', 'GovernanceLoader');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.warn(
        `Failed to persist atoms to database: ${error.message}`,
        'GovernanceLoader'
      );
      // Don't throw - atoms are still loaded in memory
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Check if atoms are loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      loaded: this.loaded,
      totalAtoms: this.atoms.length,
      thresholds: Array.from(this.atomsByThreshold.keys()),
      atomsByThreshold: Object.fromEntries(
        Array.from(this.atomsByThreshold.entries()).map(([key, atoms]) => [
          key,
          atoms.length,
        ])
      ),
    };
  }
}
