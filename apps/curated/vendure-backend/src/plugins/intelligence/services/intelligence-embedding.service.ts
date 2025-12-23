/**
 * Intelligence Embedding Service
 *
 * DermaLogica Intelligence MVP - Task T018-T020
 *
 * Generates intelligence-enhanced embeddings for semantic search:
 * - 768D semantic embeddings (knowledge content)
 * - 17D tensor embeddings (scientific profile)
 * - Hybrid search with configurable weights
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OpenAI } from 'openai';
import {
  createSKAZillizClient,
  SKA_ATOMS_COLLECTION,
  SEMANTIC_EMBEDDING_DIM,
  TENSOR_EMBEDDING_DIM,
  SKASearchParams,
} from '../../../config/zilliz-ska';
import { SkincareAtom, SkincareTensor } from '../entities/ska';
import {
  KnowledgeThreshold,
  EvidenceLevel,
  THRESHOLD_METADATA,
} from '../types/intelligence.enums';

// OpenAI configuration
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 768;

/**
 * Intelligence-enhanced search result
 */
export interface IntelligenceSearchResult {
  atom: SkincareAtom;
  semanticScore: number;
  tensorScore: number;
  combinedScore: number;
  knowledgeThreshold: KnowledgeThreshold | null;
  evidenceStrength: number;
}

/**
 * Search options for intelligence queries
 */
export interface IntelligenceSearchOptions {
  query: string;
  limit?: number;
  semanticWeight?: number; // 0-1, default 0.6
  tensorWeight?: number; // 0-1, default 0.4
  thresholdFilter?: KnowledgeThreshold[];
  minEvidenceLevel?: EvidenceLevel;
  atomTypes?: string[];
  tensorFilters?: Partial<{
    minHydration: number;
    minAntiAging: number;
    minBrightening: number;
    maxSensitivity: number;
    minBarrierRepair: number;
  }>;
}

/**
 * Embedding data structure for Zilliz
 */
export interface IntelligenceEmbeddingData {
  id: string;
  pillar_id: string;
  atom_type: string;
  title: string;
  slug: string;
  inci_name: string;
  market_segment: string;
  causes_purging: boolean;
  fda_approved: boolean;
  eu_compliant: boolean;
  efficacy_score: number;
  innovation_score: number;
  knowledge_threshold: string;
  evidence_strength: number;
  hydration_index: number;
  anti_aging_potency: number;
  brightening_efficacy: number;
  sensitivity_risk: number;
  exfoliation_strength: number;
  created_at: number;
  updated_at: number;
  semantic_embedding: number[];
  tensor_embedding: number[];
}

@Injectable()
export class IntelligenceEmbeddingService {
  private openai: OpenAI;
  private zillizClient: any;

  constructor(
    @InjectRepository(SkincareAtom)
    private atomRepo: Repository<SkincareAtom>,
    @InjectRepository(SkincareTensor)
    private tensorRepo: Repository<SkincareTensor>
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize Zilliz client (lazy)
    try {
      this.zillizClient = createSKAZillizClient();
    } catch (error) {
      console.warn('Zilliz client initialization deferred:', error);
    }
  }

  // ========================================
  // Embedding Generation (T019)
  // ========================================

  /**
   * Generate intelligence-enhanced embedding for an atom
   * Combines knowledge content with scientific profile
   */
  async generateIntelligenceEmbedding(
    atom: SkincareAtom
  ): Promise<{ semantic: number[]; tensor: number[] }> {
    // Build rich semantic text from atom fields
    const semanticText = this.buildSemanticText(atom);

    // Generate 768D semantic embedding
    const semanticEmbedding = await this.generateSemanticEmbedding(semanticText);

    // Get or generate 17D tensor embedding
    const tensorEmbedding = await this.getTensorEmbedding(atom.id);

    return {
      semantic: semanticEmbedding,
      tensor: tensorEmbedding,
    };
  }

  /**
   * Build rich semantic text for embedding generation
   * Combines progressive disclosure content with intelligence metadata
   */
  private buildSemanticText(atom: SkincareAtom): string {
    const parts: string[] = [];

    // Title and type (highest weight)
    parts.push(`${atom.atomType}: ${atom.title}`);

    // INCI name for ingredients
    if (atom.inciName) {
      parts.push(`INCI: ${atom.inciName}`);
    }

    // Progressive disclosure content
    if (atom.glanceText) {
      parts.push(`Summary: ${atom.glanceText}`);
    }
    if (atom.scanText) {
      parts.push(`Details: ${atom.scanText}`);
    }
    // Include study text for deeper semantic understanding
    if (atom.studyText) {
      const truncatedStudy = atom.studyText.length > 1500
        ? atom.studyText.substring(0, 1500) + '...'
        : atom.studyText;
      parts.push(`Scientific Background: ${truncatedStudy}`);
    }

    // Intelligence MVP content
    if (atom.whyItWorks) {
      parts.push(`Mechanism: ${atom.whyItWorks}`);
    }
    if (atom.causalSummary) {
      parts.push(`Causal Chain: ${atom.causalSummary}`);
    }

    // Knowledge threshold context
    if (atom.knowledgeThreshold) {
      const meta = THRESHOLD_METADATA[atom.knowledgeThreshold];
      parts.push(`Knowledge Level: ${meta.label} - ${meta.description}`);
    }

    // Market segment
    if (atom.marketSegment) {
      parts.push(`Market Segment: ${atom.marketSegment}`);
    }

    return parts.join('\n\n');
  }

  /**
   * Generate semantic embedding using OpenAI
   */
  private async generateSemanticEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
        dimensions: EMBEDDING_DIMENSIONS,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Semantic embedding generation failed:', error);
      // Fallback to zero vector
      return new Array(EMBEDDING_DIMENSIONS).fill(0);
    }
  }

  /**
   * Get tensor embedding for an atom
   */
  private async getTensorEmbedding(atomId: string): Promise<number[]> {
    const tensor = await this.tensorRepo.findOne({
      where: { atomId },
    });

    if (!tensor) {
      // Return zero tensor if not found
      return new Array(TENSOR_EMBEDDING_DIM).fill(0);
    }

    // Build 17D tensor from individual dimensions
    return [
      Number(tensor.hydrationIndex) || 0,
      Number(tensor.sebumRegulation) || 0,
      Number(tensor.antiAgingPotency) || 0,
      Number(tensor.brighteningEfficacy) || 0,
      Number(tensor.antiInflammatory) || 0,
      Number(tensor.barrierRepair) || 0,
      Number(tensor.exfoliationStrength) || 0,
      Number(tensor.antioxidantCapacity) || 0,
      Number(tensor.collagenStimulation) || 0,
      Number(tensor.sensitivityRisk) || 0,
      Number(tensor.photosensitivity) || 0,
      Number(tensor.phDependency) || 0,
      Number(tensor.molecularPenetration) || 0,
      Number(tensor.stabilityRating) || 0,
      Number(tensor.compatibilityScore) || 0,
      Number(tensor.clinicalEvidenceLevel) || 0,
      Number(tensor.marketSaturation) || 0,
    ];
  }

  // ========================================
  // Intelligence Search (T020)
  // ========================================

  /**
   * Perform hybrid intelligence search
   * Combines semantic and tensor similarity with configurable weights
   */
  async intelligenceSearch(
    options: IntelligenceSearchOptions
  ): Promise<IntelligenceSearchResult[]> {
    const {
      query,
      limit = 10,
      semanticWeight = 0.6,
      tensorWeight = 0.4,
      thresholdFilter,
      atomTypes,
      tensorFilters,
    } = options;

    if (!this.zillizClient) {
      console.warn('Zilliz client not initialized, falling back to database search');
      return this.fallbackDatabaseSearch(options);
    }

    try {
      // Generate query embedding
      const queryEmbedding = await this.generateSemanticEmbedding(query);

      // Build filter expression
      const filterParts: string[] = [];

      if (thresholdFilter && thresholdFilter.length > 0) {
        const thresholds = thresholdFilter.map((t) => `"${t}"`).join(', ');
        filterParts.push(`knowledge_threshold in [${thresholds}]`);
      }

      if (atomTypes && atomTypes.length > 0) {
        const types = atomTypes.map((t) => `"${t}"`).join(', ');
        filterParts.push(`atom_type in [${types}]`);
      }

      if (tensorFilters) {
        if (tensorFilters.minHydration !== undefined) {
          filterParts.push(`hydration_index >= ${tensorFilters.minHydration}`);
        }
        if (tensorFilters.minAntiAging !== undefined) {
          filterParts.push(`anti_aging_potency >= ${tensorFilters.minAntiAging}`);
        }
        if (tensorFilters.maxSensitivity !== undefined) {
          filterParts.push(`sensitivity_risk <= ${tensorFilters.maxSensitivity}`);
        }
      }

      const filterExpr = filterParts.length > 0 ? filterParts.join(' && ') : undefined;

      // Perform semantic search
      const semanticResults = await this.zillizClient.search({
        collection_name: SKA_ATOMS_COLLECTION,
        vector: queryEmbedding,
        vector_field: 'semantic_embedding',
        filter: filterExpr,
        limit: limit * 2, // Get more for re-ranking
        output_fields: ['id', 'title', 'atom_type', 'knowledge_threshold', 'efficacy_score'],
        ...SKASearchParams.semantic,
      });

      // Fetch full atoms from database
      const atomIds = semanticResults.results.map((r: any) => r.id);
      const atoms = await this.atomRepo.find({
        where: { id: In(atomIds) },
      });

      // Build results with combined scoring
      const results: IntelligenceSearchResult[] = [];
      for (const result of semanticResults.results) {
        const atom = atoms.find((a) => a.id === result.id);
        if (!atom) continue;

        // Calculate combined score
        const semanticScore = 1 - (result.distance || 0); // Convert distance to similarity
        const tensorScore = Number(result.efficacy_score) || 0.5;
        const combinedScore = semanticWeight * semanticScore + tensorWeight * tensorScore;

        results.push({
          atom,
          semanticScore,
          tensorScore,
          combinedScore,
          knowledgeThreshold: atom.knowledgeThreshold,
          evidenceStrength: tensorScore, // Proxy for evidence
        });
      }

      // Sort by combined score and return top results
      return results
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Intelligence search failed:', error);
      return this.fallbackDatabaseSearch(options);
    }
  }

  /**
   * Fallback database search when Zilliz is unavailable
   */
  private async fallbackDatabaseSearch(
    options: IntelligenceSearchOptions
  ): Promise<IntelligenceSearchResult[]> {
    const { query, limit = 10, thresholdFilter, atomTypes } = options;

    let queryBuilder = this.atomRepo.createQueryBuilder('atom');

    // Text search
    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(atom.title ILIKE :query OR atom.glanceText ILIKE :query OR atom.scanText ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    // Threshold filter
    if (thresholdFilter && thresholdFilter.length > 0) {
      queryBuilder = queryBuilder.andWhere(
        'atom.knowledgeThreshold IN (:...thresholds)',
        { thresholds: thresholdFilter }
      );
    }

    // Atom type filter
    if (atomTypes && atomTypes.length > 0) {
      queryBuilder = queryBuilder.andWhere('atom.atomType IN (:...types)', {
        types: atomTypes,
      });
    }

    const atoms = await queryBuilder.take(limit).getMany();

    return atoms.map((atom) => ({
      atom,
      semanticScore: 0.5,
      tensorScore: 0.5,
      combinedScore: 0.5,
      knowledgeThreshold: atom.knowledgeThreshold,
      evidenceStrength: 0.5,
    }));
  }

  /**
   * Find similar atoms based on tensor profile
   */
  async findSimilarByTensor(
    atomId: string,
    limit: number = 10
  ): Promise<IntelligenceSearchResult[]> {
    const tensorEmbedding = await this.getTensorEmbedding(atomId);

    if (!this.zillizClient) {
      return [];
    }

    try {
      const results = await this.zillizClient.search({
        collection_name: SKA_ATOMS_COLLECTION,
        vector: tensorEmbedding,
        vector_field: 'tensor_embedding',
        limit: limit + 1, // +1 to exclude self
        output_fields: ['id', 'title', 'atom_type', 'knowledge_threshold'],
        ...SKASearchParams.tensor,
      });

      // Fetch atoms and filter out source
      const atomIds = results.results
        .filter((r: any) => r.id !== atomId)
        .slice(0, limit)
        .map((r: any) => r.id);

      const atoms = await this.atomRepo.find({
        where: { id: In(atomIds) },
      });

      return results.results
        .filter((r: any) => r.id !== atomId)
        .slice(0, limit)
        .map((result: any) => {
          const atom = atoms.find((a) => a.id === result.id);
          return {
            atom: atom!,
            semanticScore: 0,
            tensorScore: 1 - (result.distance || 0),
            combinedScore: 1 - (result.distance || 0),
            knowledgeThreshold: atom?.knowledgeThreshold || null,
            evidenceStrength: 0.5,
          };
        })
        .filter((r: IntelligenceSearchResult) => r.atom);
    } catch (error) {
      console.error('Tensor similarity search failed:', error);
      return [];
    }
  }

  /**
   * Upsert atom embedding to Zilliz
   */
  async upsertAtomEmbedding(atom: SkincareAtom): Promise<void> {
    if (!this.zillizClient) {
      console.warn('Zilliz client not initialized, skipping embedding upsert');
      return;
    }

    try {
      const { semantic, tensor } = await this.generateIntelligenceEmbedding(atom);
      const tensorData = await this.tensorRepo.findOne({ where: { atomId: atom.id } });

      const embeddingData: IntelligenceEmbeddingData = {
        id: atom.id,
        pillar_id: atom.pillarId || '',
        atom_type: atom.atomType,
        title: atom.title,
        slug: atom.slug,
        inci_name: atom.inciName || '',
        market_segment: atom.marketSegment || '',
        causes_purging: atom.causesPurging || false,
        fda_approved: atom.fdaApproved || false,
        eu_compliant: atom.euCompliant || false,
        efficacy_score: Number(atom.efficacyScore) || 0,
        innovation_score: Number(atom.innovationScore) || 0,
        knowledge_threshold: atom.knowledgeThreshold || '',
        evidence_strength: tensorData?.clinicalEvidenceLevel || 0,
        hydration_index: tensor[0],
        anti_aging_potency: tensor[2],
        brightening_efficacy: tensor[3],
        sensitivity_risk: tensor[9],
        exfoliation_strength: tensor[6],
        created_at: atom.createdAt?.getTime() || Date.now(),
        updated_at: atom.updatedAt?.getTime() || Date.now(),
        semantic_embedding: semantic,
        tensor_embedding: tensor,
      };

      await this.zillizClient.upsert({
        collection_name: SKA_ATOMS_COLLECTION,
        data: [embeddingData],
      });

      console.log(`✓ Upserted intelligence embedding: ${atom.title}`);
    } catch (error) {
      console.error(`Failed to upsert embedding for ${atom.id}:`, error);
      throw error;
    }
  }

  /**
   * Batch upsert atom embeddings
   */
  async batchUpsertEmbeddings(atoms: SkincareAtom[]): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const atom of atoms) {
      try {
        await this.upsertAtomEmbedding(atom);
        success++;
      } catch (error) {
        failed++;
        errors.push(`${atom.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { success, failed, errors };
  }
}
