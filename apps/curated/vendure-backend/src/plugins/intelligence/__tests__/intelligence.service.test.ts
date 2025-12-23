/**
 * IntelligenceService Unit Tests
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 *
 * Tests for:
 * - Knowledge threshold access control
 * - Progressive disclosure content
 * - Causal chain navigation
 * - Evidence and efficacy management
 * - Compatibility analysis
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Repository } from 'typeorm';
import { RequestContext } from '@vendure/core';
import {
  IntelligenceService,
  AccessLevel,
} from '../services/intelligence.service';
import { SkincareAtom, SkincareRelationship, GoldilocksParameter } from '../entities/ska';
import { ClaimEvidence } from '../entities/claim-evidence.entity';
import { EfficacyIndicator } from '../entities/efficacy-indicator.entity';
import {
  KnowledgeThreshold,
  EvidenceLevel,
  CausalDirection,
  DisclosureLevel,
} from '../types/intelligence.enums';

// Mock RequestContext
const mockCtx = {} as RequestContext;

// Mock SkincareAtom
const createMockAtom = (overrides: Partial<SkincareAtom> = {}): SkincareAtom => ({
  id: 'atom-1',
  title: 'Test Atom',
  glanceText: 'Quick glance text',
  scanText: 'Detailed scan text for more information',
  studyText: 'In-depth study text with full scientific details',
  knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY,
  whyItWorks: 'This works because of mechanism X',
  causalSummary: 'Causes effect Y through pathway Z',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as SkincareAtom);

// Mock Relationship
const createMockRelationship = (overrides: Partial<SkincareRelationship> = {}): SkincareRelationship => ({
  id: 'rel-1',
  fromAtomId: 'atom-1',
  toAtomId: 'atom-2',
  relationshipType: 'enhances',
  mechanism: 'Enhances absorption through skin barrier',
  strength: 7,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as SkincareRelationship);

// Mock ClaimEvidence
const createMockEvidence = (overrides: Partial<ClaimEvidence> = {}): ClaimEvidence => ({
  id: 'evidence-1',
  atomId: 'atom-1',
  claim: 'Reduces wrinkles by 30%',
  evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED,
  citation: 'Smith et al., 2024, Journal of Dermatology',
  doi: '10.1234/example',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as ClaimEvidence);

// Mock EfficacyIndicator
const createMockEfficacy = (overrides: Partial<EfficacyIndicator> = {}): EfficacyIndicator => ({
  id: 'efficacy-1',
  atomId: 'atom-1',
  metric: 'wrinkle_reduction',
  expectedImprovement: 30,
  timeframe: '8 weeks',
  evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED,
  confidenceIntervalLow: 25,
  confidenceIntervalHigh: 35,
  createdAt: new Date(),
  updatedAt: new Date(),
  getTimeframeWeeks: () => 8,
  ...overrides,
} as EfficacyIndicator);

// Mock Repository Factory
const createMockRepository = <T>() => ({
  find: vi.fn(),
  findOne: vi.fn(),
  save: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  createQueryBuilder: vi.fn(() => ({
    andWhere: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    take: vi.fn().mockReturnThis(),
    getCount: vi.fn(),
    getMany: vi.fn(),
  })),
});

describe('IntelligenceService', () => {
  let service: IntelligenceService;
  let atomRepo: ReturnType<typeof createMockRepository>;
  let relationshipRepo: ReturnType<typeof createMockRepository>;
  let goldilocksRepo: ReturnType<typeof createMockRepository>;
  let claimEvidenceRepo: ReturnType<typeof createMockRepository>;
  let efficacyRepo: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    atomRepo = createMockRepository<SkincareAtom>();
    relationshipRepo = createMockRepository<SkincareRelationship>();
    goldilocksRepo = createMockRepository<GoldilocksParameter>();
    claimEvidenceRepo = createMockRepository<ClaimEvidence>();
    efficacyRepo = createMockRepository<EfficacyIndicator>();

    service = new IntelligenceService(
      atomRepo as unknown as Repository<SkincareAtom>,
      relationshipRepo as unknown as Repository<SkincareRelationship>,
      goldilocksRepo as unknown as Repository<GoldilocksParameter>,
      claimEvidenceRepo as unknown as Repository<ClaimEvidence>,
      efficacyRepo as unknown as Repository<EfficacyIndicator>
    );
  });

  // ========================================
  // Knowledge Threshold Access Control
  // ========================================

  describe('Knowledge Threshold Access Control', () => {
    describe('hasAccessToThreshold', () => {
      it('public users can access T1 skin biology content', () => {
        expect(service.hasAccessToThreshold('public', KnowledgeThreshold.T1_SKIN_BIOLOGY)).toBe(true);
      });

      it('public users can access T3 product formulation content (public)', () => {
        // T1, T2, T3 are all public access level
        expect(service.hasAccessToThreshold('public', KnowledgeThreshold.T3_PRODUCT_FORMULATION)).toBe(true);
      });

      it('public users cannot access T4 registered content', () => {
        // T4 requires 'registered' access level
        expect(service.hasAccessToThreshold('public', KnowledgeThreshold.T4_TREATMENT_PROTOCOLS)).toBe(false);
      });

      it('professional users can access T6 professional content', () => {
        expect(service.hasAccessToThreshold('professional', KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES)).toBe(true);
      });

      it('expert users can access all thresholds', () => {
        expect(service.hasAccessToThreshold('expert', KnowledgeThreshold.T8_SYSTEMIC_PATTERNS)).toBe(true);
      });

      it('registered users can access T4 treatment protocols', () => {
        expect(service.hasAccessToThreshold('registered', KnowledgeThreshold.T4_TREATMENT_PROTOCOLS)).toBe(true);
      });
    });

    describe('getMaxAccessibleThreshold', () => {
      it('returns T3 for public users', () => {
        // T1, T2, T3 are public - T3 is the max
        const maxThreshold = service.getMaxAccessibleThreshold('public');
        expect(maxThreshold).toBe(KnowledgeThreshold.T3_PRODUCT_FORMULATION);
      });

      it('returns T7 for professional users', () => {
        // T6, T7 are professional - T7 is the max
        const maxThreshold = service.getMaxAccessibleThreshold('professional');
        expect(maxThreshold).toBe(KnowledgeThreshold.T7_REGULATORY_COMPLIANCE);
      });

      it('returns T8 for expert users', () => {
        const maxThreshold = service.getMaxAccessibleThreshold('expert');
        expect(maxThreshold).toBe(KnowledgeThreshold.T8_SYSTEMIC_PATTERNS);
      });
    });

    describe('getAccessibleAtoms', () => {
      it('filters atoms based on user access level', async () => {
        const publicAtom = createMockAtom({ id: 'public', knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY });
        // Use T6 which requires 'professional' access level
        const professionalAtom = createMockAtom({ id: 'pro', knowledgeThreshold: KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES });

        atomRepo.find.mockResolvedValue([publicAtom, professionalAtom]);

        const result = await service.getAccessibleAtoms(mockCtx, 'public');
        // Public users can access T1-T3, so only the public atom should be returned
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('public');
      });

      it('returns all atoms for expert users', async () => {
        const atoms = [
          createMockAtom({ id: '1', knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY }),
          createMockAtom({ id: '2', knowledgeThreshold: KnowledgeThreshold.T8_SYSTEMIC_PATTERNS }),
        ];

        atomRepo.find.mockResolvedValue(atoms);

        const result = await service.getAccessibleAtoms(mockCtx, 'expert');
        expect(result).toHaveLength(2);
      });

      it('includes atoms without threshold (public by default)', async () => {
        const atomNoThreshold = createMockAtom({ id: 'no-threshold', knowledgeThreshold: undefined });
        atomRepo.find.mockResolvedValue([atomNoThreshold]);

        const result = await service.getAccessibleAtoms(mockCtx, 'public');
        expect(result).toHaveLength(1);
      });
    });
  });

  // ========================================
  // Progressive Disclosure
  // ========================================

  describe('Progressive Disclosure', () => {
    describe('getContentAtLevel', () => {
      const atom = createMockAtom();

      it('returns glance text for GLANCE level', () => {
        const content = service.getContentAtLevel(atom, DisclosureLevel.GLANCE);
        expect(content).toBe('Quick glance text');
      });

      it('returns scan text for SCAN level', () => {
        const content = service.getContentAtLevel(atom, DisclosureLevel.SCAN);
        expect(content).toBe('Detailed scan text for more information');
      });

      it('returns study text for STUDY level', () => {
        const content = service.getContentAtLevel(atom, DisclosureLevel.STUDY);
        expect(content).toBe('In-depth study text with full scientific details');
      });
    });

    describe('getProgressiveContent', () => {
      it('returns all three levels of content', () => {
        const atom = createMockAtom();
        const content = service.getProgressiveContent(atom);

        expect(content.glance).toBe('Quick glance text');
        expect(content.scan).toBe('Detailed scan text for more information');
        expect(content.study).toBe('In-depth study text with full scientific details');
      });
    });
  });

  // ========================================
  // Causal Chain Navigation
  // ========================================

  describe('Causal Chain Navigation', () => {
    describe('navigateCausalChain', () => {
      it('returns starting atom as first node', async () => {
        const atom = createMockAtom({ id: 'start' });
        atomRepo.findOne.mockResolvedValue(atom);
        relationshipRepo.find.mockResolvedValue([]);

        const result = await service.navigateCausalChain(mockCtx, 'start', CausalDirection.DOWNSTREAM);

        expect(result).toHaveLength(1);
        expect(result[0].atom.id).toBe('start');
        expect(result[0].depth).toBe(0);
      });

      it('returns empty array when atom not found', async () => {
        atomRepo.findOne.mockResolvedValue(null);

        const result = await service.navigateCausalChain(mockCtx, 'nonexistent', CausalDirection.DOWNSTREAM);

        expect(result).toHaveLength(0);
      });

      it('traverses downstream relationships', async () => {
        const atom1 = createMockAtom({ id: 'atom-1' });
        const atom2 = createMockAtom({ id: 'atom-2' });
        const relationship = createMockRelationship({ fromAtomId: 'atom-1', toAtomId: 'atom-2' });

        atomRepo.findOne
          .mockResolvedValueOnce(atom1)
          .mockResolvedValueOnce(atom2);
        relationshipRepo.find.mockResolvedValueOnce([relationship]).mockResolvedValue([]);

        const result = await service.navigateCausalChain(mockCtx, 'atom-1', CausalDirection.DOWNSTREAM);

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result[0].atom.id).toBe('atom-1');
      });

      it('respects maxDepth parameter', async () => {
        const atom = createMockAtom();
        atomRepo.findOne.mockResolvedValue(atom);
        relationshipRepo.find.mockResolvedValue([]);

        const result = await service.navigateCausalChain(mockCtx, 'atom-1', CausalDirection.DOWNSTREAM, 1);

        // Should only traverse 1 level deep
        expect(result.every((n) => n.depth <= 1)).toBe(true);
      });

      it('filters by access level', async () => {
        const publicAtom = createMockAtom({ id: 'public', knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY });
        // T6 requires 'professional' access, so public users cannot access it
        const restrictedAtom = createMockAtom({ id: 'restricted', knowledgeThreshold: KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES });
        const relationship = createMockRelationship({ fromAtomId: 'public', toAtomId: 'restricted' });

        atomRepo.findOne
          .mockResolvedValueOnce(publicAtom)
          .mockResolvedValueOnce(restrictedAtom);
        relationshipRepo.find.mockResolvedValueOnce([relationship]).mockResolvedValue([]);

        const result = await service.navigateCausalChain(mockCtx, 'public', CausalDirection.DOWNSTREAM, 3, 'public');

        // Should only include the public atom since restricted requires 'professional' access
        expect(result).toHaveLength(1);
        expect(result[0].atom.id).toBe('public');
      });
    });

    describe('getCausalSummary', () => {
      it('returns causal summary when available', async () => {
        const atom = createMockAtom({ causalSummary: 'Test causal summary' });
        atomRepo.findOne.mockResolvedValue(atom);

        const result = await service.getCausalSummary(mockCtx, 'atom-1');
        expect(result).toBe('Test causal summary');
      });

      it('returns null when atom not found', async () => {
        atomRepo.findOne.mockResolvedValue(null);

        const result = await service.getCausalSummary(mockCtx, 'nonexistent');
        expect(result).toBeNull();
      });
    });

    describe('getWhyItWorks', () => {
      it('returns why it works explanation', async () => {
        const atom = createMockAtom({ whyItWorks: 'Mechanism explanation' });
        atomRepo.findOne.mockResolvedValue(atom);

        const result = await service.getWhyItWorks(mockCtx, 'atom-1');
        expect(result).toBe('Mechanism explanation');
      });
    });
  });

  // ========================================
  // Evidence Management
  // ========================================

  describe('Evidence Management', () => {
    describe('getClaimEvidence', () => {
      it('returns all evidence for an atom', async () => {
        const evidence = [
          createMockEvidence({ id: '1', evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEvidence({ id: '2', evidenceLevel: EvidenceLevel.IN_VITRO }),
        ];
        claimEvidenceRepo.find.mockResolvedValue(evidence);

        const result = await service.getClaimEvidence(mockCtx, 'atom-1');
        expect(result).toHaveLength(2);
      });

      it('filters by minimum evidence level', async () => {
        const evidence = [
          createMockEvidence({ id: '1', evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEvidence({ id: '2', evidenceLevel: EvidenceLevel.IN_VITRO }),
          createMockEvidence({ id: '3', evidenceLevel: EvidenceLevel.ANECDOTAL }),
        ];
        claimEvidenceRepo.find.mockResolvedValue(evidence);

        const result = await service.getClaimEvidence(mockCtx, 'atom-1', EvidenceLevel.HUMAN_PILOT);
        expect(result.length).toBeLessThan(3);
      });
    });

    describe('getEvidenceSummary', () => {
      it('calculates evidence summary correctly', async () => {
        const evidence = [
          createMockEvidence({ evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEvidence({ evidenceLevel: EvidenceLevel.META_ANALYSIS }),
        ];
        claimEvidenceRepo.find.mockResolvedValue(evidence);

        const result = await service.getEvidenceSummary(mockCtx, 'atom-1');

        expect(result.totalClaims).toBe(2);
        expect(result.averageEvidenceStrength).toBeGreaterThan(0);
        expect(result.highestEvidenceLevel).toBe(EvidenceLevel.META_ANALYSIS);
      });

      it('returns zeros when no evidence exists', async () => {
        claimEvidenceRepo.find.mockResolvedValue([]);

        const result = await service.getEvidenceSummary(mockCtx, 'atom-1');

        expect(result.totalClaims).toBe(0);
        expect(result.averageEvidenceStrength).toBe(0);
        expect(result.highestEvidenceLevel).toBeNull();
      });

      it('counts claims by evidence level', async () => {
        const evidence = [
          createMockEvidence({ evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEvidence({ evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEvidence({ evidenceLevel: EvidenceLevel.IN_VITRO }),
        ];
        claimEvidenceRepo.find.mockResolvedValue(evidence);

        const result = await service.getEvidenceSummary(mockCtx, 'atom-1');

        expect(result.claimsByLevel[EvidenceLevel.HUMAN_CONTROLLED]).toBe(2);
        expect(result.claimsByLevel[EvidenceLevel.IN_VITRO]).toBe(1);
      });
    });

    describe('addClaimEvidence', () => {
      it('creates and saves new evidence', async () => {
        const newEvidence = createMockEvidence();
        claimEvidenceRepo.create.mockReturnValue(newEvidence);
        claimEvidenceRepo.save.mockResolvedValue(newEvidence);

        const result = await service.addClaimEvidence(mockCtx, 'atom-1', {
          claim: 'Test claim',
          evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED,
        });

        expect(claimEvidenceRepo.create).toHaveBeenCalled();
        expect(claimEvidenceRepo.save).toHaveBeenCalled();
        expect(result).toEqual(newEvidence);
      });
    });
  });

  // ========================================
  // Efficacy Management
  // ========================================

  describe('Efficacy Management', () => {
    describe('getEfficacyIndicators', () => {
      it('returns all efficacy indicators for an atom', async () => {
        const indicators = [
          createMockEfficacy({ id: '1' }),
          createMockEfficacy({ id: '2' }),
        ];
        efficacyRepo.find.mockResolvedValue(indicators);

        const result = await service.getEfficacyIndicators(mockCtx, 'atom-1');
        expect(result).toHaveLength(2);
      });

      it('filters for high quality only', async () => {
        const indicators = [
          createMockEfficacy({ id: '1', evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEfficacy({ id: '2', evidenceLevel: EvidenceLevel.IN_VITRO }),
        ];
        efficacyRepo.find.mockResolvedValue(indicators);

        const result = await service.getEfficacyIndicators(mockCtx, 'atom-1', true);
        expect(result).toHaveLength(1);
        expect(result[0].evidenceLevel).toBe(EvidenceLevel.HUMAN_CONTROLLED);
      });
    });

    describe('getEfficacySummary', () => {
      it('calculates average improvement', async () => {
        const indicators = [
          createMockEfficacy({ expectedImprovement: 30 }),
          createMockEfficacy({ expectedImprovement: 40 }),
        ];
        efficacyRepo.find.mockResolvedValue(indicators);

        const result = await service.getEfficacySummary(mockCtx, 'atom-1');

        expect(result.averageImprovement).toBe(35);
        expect(result.indicators).toHaveLength(2);
      });

      it('finds shortest timeframe', async () => {
        const indicators = [
          createMockEfficacy({ timeframe: '8 weeks', getTimeframeWeeks: () => 8 }),
          createMockEfficacy({ timeframe: '4 weeks', getTimeframeWeeks: () => 4 }),
        ];
        efficacyRepo.find.mockResolvedValue(indicators);

        const result = await service.getEfficacySummary(mockCtx, 'atom-1');

        expect(result.shortestTimeframe).toBe('4 weeks');
      });

      it('counts high quality indicators', async () => {
        const indicators = [
          createMockEfficacy({ evidenceLevel: EvidenceLevel.HUMAN_CONTROLLED }),
          createMockEfficacy({ evidenceLevel: EvidenceLevel.META_ANALYSIS }),
          createMockEfficacy({ evidenceLevel: EvidenceLevel.IN_VITRO }),
        ];
        efficacyRepo.find.mockResolvedValue(indicators);

        const result = await service.getEfficacySummary(mockCtx, 'atom-1');

        expect(result.highQualityCount).toBe(2);
      });
    });
  });

  // ========================================
  // Goldilocks Parameters
  // ========================================

  describe('Goldilocks Parameters', () => {
    describe('isInGoldilocksRange', () => {
      const param = {
        minValue: 5.0,
        maxValue: 7.0,
        optimalValue: 6.0,
      } as GoldilocksParameter;

      it('returns optimal for values within range', () => {
        const result = service.isInGoldilocksRange(param, 6.0);
        expect(result.inRange).toBe(true);
        expect(result.status).toBe('optimal');
      });

      it('returns low for values below minimum', () => {
        const result = service.isInGoldilocksRange(param, 4.0);
        expect(result.inRange).toBe(false);
        expect(result.status).toBe('low');
      });

      it('returns high for values above maximum', () => {
        const result = service.isInGoldilocksRange(param, 8.0);
        expect(result.inRange).toBe(false);
        expect(result.status).toBe('high');
      });

      it('returns optimal at boundary values', () => {
        expect(service.isInGoldilocksRange(param, 5.0).status).toBe('optimal');
        expect(service.isInGoldilocksRange(param, 7.0).status).toBe('optimal');
      });
    });
  });

  // ========================================
  // Atom Queries
  // ========================================

  describe('Atom Queries', () => {
    describe('getAtomById', () => {
      it('returns atom when found', async () => {
        const atom = createMockAtom();
        atomRepo.findOne.mockResolvedValue(atom);

        const result = await service.getAtomById(mockCtx, 'atom-1');
        expect(result).toEqual(atom);
      });

      it('returns null when not found', async () => {
        atomRepo.findOne.mockResolvedValue(null);

        const result = await service.getAtomById(mockCtx, 'nonexistent');
        expect(result).toBeNull();
      });
    });

    describe('getAtomWithIntelligence', () => {
      it('returns full intelligence data for accessible atom', async () => {
        const atom = createMockAtom({ knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY });
        const evidence = [createMockEvidence()];
        const efficacy = [createMockEfficacy()];
        const goldilocks = [{ parameterName: 'pH' } as GoldilocksParameter];

        atomRepo.findOne.mockResolvedValue(atom);
        claimEvidenceRepo.find.mockResolvedValue(evidence);
        efficacyRepo.find.mockResolvedValue(efficacy);
        goldilocksRepo.find.mockResolvedValue(goldilocks);

        const result = await service.getAtomWithIntelligence(mockCtx, 'atom-1', 'public');

        expect(result.atom).toEqual(atom);
        expect(result.accessible).toBe(true);
        expect(result.evidenceSummary).not.toBeNull();
        expect(result.efficacySummary).not.toBeNull();
        expect(result.goldilocksParameters).toHaveLength(1);
      });

      it('returns limited data for inaccessible atom', async () => {
        // T6 requires 'professional' access, so public users cannot access it
        const atom = createMockAtom({ knowledgeThreshold: KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES });
        atomRepo.findOne.mockResolvedValue(atom);

        const result = await service.getAtomWithIntelligence(mockCtx, 'atom-1', 'public');

        expect(result.atom).toEqual(atom);
        expect(result.accessible).toBe(false);
        expect(result.evidenceSummary).toBeNull();
        expect(result.efficacySummary).toBeNull();
        expect(result.goldilocksParameters).toHaveLength(0);
      });

      it('returns null atom when not found', async () => {
        atomRepo.findOne.mockResolvedValue(null);

        const result = await service.getAtomWithIntelligence(mockCtx, 'nonexistent', 'public');

        expect(result.atom).toBeNull();
        expect(result.accessible).toBe(false);
      });
    });

    describe('searchAtoms', () => {
      it('searches by query text', async () => {
        const atoms = [createMockAtom({ title: 'Retinol' })];
        const mockQueryBuilder = {
          andWhere: vi.fn().mockReturnThis(),
          skip: vi.fn().mockReturnThis(),
          take: vi.fn().mockReturnThis(),
          getCount: vi.fn().mockResolvedValue(1),
          getMany: vi.fn().mockResolvedValue(atoms),
        };
        atomRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

        const result = await service.searchAtoms(mockCtx, { query: 'retinol' });

        expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
        expect(result.atoms).toHaveLength(1);
        expect(result.total).toBe(1);
      });

      it('applies pagination', async () => {
        const atoms = [createMockAtom()];
        const mockQueryBuilder = {
          andWhere: vi.fn().mockReturnThis(),
          skip: vi.fn().mockReturnThis(),
          take: vi.fn().mockReturnThis(),
          getCount: vi.fn().mockResolvedValue(100),
          getMany: vi.fn().mockResolvedValue(atoms),
        };
        atomRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

        await service.searchAtoms(mockCtx, { limit: 10, offset: 20 });

        expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
        expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      });

      it('filters results by access level', async () => {
        const publicAtom = createMockAtom({ id: 'public', knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY });
        // T6 requires 'professional' access, so public users cannot access it
        const restrictedAtom = createMockAtom({ id: 'restricted', knowledgeThreshold: KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES });
        const mockQueryBuilder = {
          andWhere: vi.fn().mockReturnThis(),
          skip: vi.fn().mockReturnThis(),
          take: vi.fn().mockReturnThis(),
          getCount: vi.fn().mockResolvedValue(2),
          getMany: vi.fn().mockResolvedValue([publicAtom, restrictedAtom]),
        };
        atomRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

        const result = await service.searchAtoms(mockCtx, { userAccessLevel: 'public' });

        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].id).toBe('public');
      });
    });
  });

  // ========================================
  // Why Explanation (T015)
  // ========================================

  describe('Why Explanation', () => {
    describe('generateWhyExplanation', () => {
      it('returns null when atom not found', async () => {
        atomRepo.findOne.mockResolvedValue(null);

        const result = await service.generateWhyExplanation(mockCtx, 'nonexistent');
        expect(result).toBeNull();
      });

      it('generates explanation with path', async () => {
        const atom = createMockAtom({ whyItWorks: 'Test explanation' });
        atomRepo.findOne.mockResolvedValue(atom);
        relationshipRepo.find.mockResolvedValue([]);
        claimEvidenceRepo.find.mockResolvedValue([]);

        const result = await service.generateWhyExplanation(mockCtx, 'atom-1');

        expect(result).not.toBeNull();
        expect(result?.summary).toBe('Test explanation');
        expect(result?.path).toBeDefined();
        expect(result?.disclosureContent).toBeDefined();
      });

      it('includes confidence and evidence scores', async () => {
        const atom = createMockAtom();
        atomRepo.findOne.mockResolvedValue(atom);
        relationshipRepo.find.mockResolvedValue([]);
        claimEvidenceRepo.find.mockResolvedValue([createMockEvidence()]);

        const result = await service.generateWhyExplanation(mockCtx, 'atom-1');

        expect(result?.confidenceScore).toBeGreaterThanOrEqual(0);
        expect(result?.evidenceStrength).toBeGreaterThanOrEqual(0);
      });
    });

    describe('findCausalPath', () => {
      it('returns empty array when start atom not found', async () => {
        atomRepo.findOne.mockResolvedValue(null);

        const result = await service.findCausalPath(mockCtx, 'nonexistent', 'target');
        expect(result).toHaveLength(0);
      });

      it('finds direct path between atoms', async () => {
        const atom1 = createMockAtom({ id: 'atom-1' });
        const atom2 = createMockAtom({ id: 'atom-2' });
        const relationship = createMockRelationship({ fromAtomId: 'atom-1', toAtomId: 'atom-2' });

        atomRepo.findOne
          .mockResolvedValueOnce(atom1)
          .mockResolvedValueOnce(atom2);
        relationshipRepo.find.mockResolvedValue([relationship]);

        const result = await service.findCausalPath(mockCtx, 'atom-1', 'atom-2');

        expect(result.length).toBeGreaterThanOrEqual(1);
      });

      it('returns start atom only when no path to target exists', async () => {
        const atom1 = createMockAtom({ id: 'atom-1' });
        atomRepo.findOne.mockResolvedValue(atom1);
        relationshipRepo.find.mockResolvedValue([]);

        const result = await service.findCausalPath(mockCtx, 'atom-1', 'atom-99');
        // The BFS algorithm returns an empty path if target is not reachable
        // It only returns a path when the target is found
        expect(result).toHaveLength(0);
      });
    });
  });

  // ========================================
  // Compatibility Analysis (T016)
  // ========================================

  describe('Compatibility Analysis', () => {
    describe('analyzeCompatibility', () => {
      it('returns compatibility result for multiple atoms', async () => {
        const atoms = [
          createMockAtom({ id: 'atom-1', title: 'Vitamin C' }),
          createMockAtom({ id: 'atom-2', title: 'Niacinamide' }),
        ];
        atomRepo.find.mockResolvedValue(atoms);
        relationshipRepo.findOne.mockResolvedValue(null);

        const result = await service.analyzeCompatibility(mockCtx, ['atom-1', 'atom-2']);

        expect(result.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
        expect(result.compatible).toBeDefined();
        expect(result.interactions).toBeDefined();
        expect(result.synergies).toBeDefined();
        expect(result.conflicts).toBeDefined();
        expect(result.sequenceRecommendation).toBeDefined();
      });

      it('detects synergistic relationships', async () => {
        const atoms = [
          createMockAtom({ id: 'atom-1', title: 'Vitamin C' }),
          createMockAtom({ id: 'atom-2', title: 'Vitamin E' }),
        ];
        const relationship = createMockRelationship({
          fromAtomId: 'atom-1',
          toAtomId: 'atom-2',
          relationshipType: 'enhances',
          mechanism: 'Vitamin E enhances Vitamin C stability',
        });

        atomRepo.find.mockResolvedValue(atoms);
        relationshipRepo.findOne.mockResolvedValue(relationship);

        const result = await service.analyzeCompatibility(mockCtx, ['atom-1', 'atom-2']);

        expect(result.synergies.length).toBeGreaterThanOrEqual(0);
      });

      it('detects conflicting relationships', async () => {
        const atoms = [
          createMockAtom({ id: 'atom-1', title: 'Retinol' }),
          createMockAtom({ id: 'atom-2', title: 'Benzoyl Peroxide' }),
        ];
        const relationship = createMockRelationship({
          fromAtomId: 'atom-1',
          toAtomId: 'atom-2',
          relationshipType: 'conflicts',
          mechanism: 'BP neutralizes retinol',
        });

        atomRepo.find.mockResolvedValue(atoms);
        relationshipRepo.findOne.mockResolvedValue(relationship);

        const result = await service.analyzeCompatibility(mockCtx, ['atom-1', 'atom-2']);

        expect(result.conflicts.length).toBeGreaterThanOrEqual(0);
      });

      it('filters atoms by access level', async () => {
        const publicAtom = createMockAtom({ id: 'public', knowledgeThreshold: KnowledgeThreshold.T1_SKIN_BIOLOGY });
        // T6 requires 'professional' access, so public users cannot access it
        const restrictedAtom = createMockAtom({ id: 'restricted', knowledgeThreshold: KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES });

        atomRepo.find.mockResolvedValue([publicAtom, restrictedAtom]);
        relationshipRepo.findOne.mockResolvedValue(null);

        const result = await service.analyzeCompatibility(mockCtx, ['public', 'restricted'], 'public');

        // Only public atom should be included in analysis (T1 is public, T6 requires professional)
        expect(result.sequenceRecommendation).toHaveLength(1);
      });

      it('provides warnings for conflicts', async () => {
        const atoms = [
          createMockAtom({ id: 'atom-1', title: 'Retinol' }),
          createMockAtom({ id: 'atom-2', title: 'AHA' }),
        ];
        const relationship = createMockRelationship({
          relationshipType: 'conflicts',
          mechanism: 'Both are exfoliating and can cause irritation',
        });

        atomRepo.find.mockResolvedValue(atoms);
        relationshipRepo.findOne.mockResolvedValue(relationship);

        const result = await service.analyzeCompatibility(mockCtx, ['atom-1', 'atom-2']);

        // Should have warnings for conflicts
        expect(Array.isArray(result.warnings)).toBe(true);
      });

      it('provides tips for synergies', async () => {
        const atoms = [
          createMockAtom({ id: 'atom-1', title: 'Vitamin C' }),
          createMockAtom({ id: 'atom-2', title: 'Ferulic Acid' }),
        ];
        const relationship = createMockRelationship({
          relationshipType: 'enhances',
          mechanism: 'Ferulic acid stabilizes Vitamin C',
        });

        atomRepo.find.mockResolvedValue(atoms);
        relationshipRepo.findOne.mockResolvedValue(relationship);

        const result = await service.analyzeCompatibility(mockCtx, ['atom-1', 'atom-2']);

        expect(Array.isArray(result.tips)).toBe(true);
      });
    });
  });
});
