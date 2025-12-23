/**
 * Intelligence MVP Enums
 *
 * Knowledge threshold and evidence level classifications
 * for DermaLogica Intelligence integration.
 */

/**
 * Knowledge Threshold (T1-T8)
 * Classification of knowledge complexity and access level
 */
export enum KnowledgeThreshold {
  /** Fundamental skin science concepts - Public access */
  T1_SKIN_BIOLOGY = 'T1_SKIN_BIOLOGY',

  /** How ingredients work - Public access */
  T2_INGREDIENT_SCIENCE = 'T2_INGREDIENT_SCIENCE',

  /** Formulation principles - Public access */
  T3_PRODUCT_FORMULATION = 'T3_PRODUCT_FORMULATION',

  /** Application methods - Registered users */
  T4_TREATMENT_PROTOCOLS = 'T4_TREATMENT_PROTOCOLS',

  /** Safety considerations - Registered users */
  T5_CONTRAINDICATIONS = 'T5_CONTRAINDICATIONS',

  /** Advanced procedures - Licensed professionals */
  T6_PROFESSIONAL_TECHNIQUES = 'T6_PROFESSIONAL_TECHNIQUES',

  /** Legal requirements - Licensed professionals */
  T7_REGULATORY_COMPLIANCE = 'T7_REGULATORY_COMPLIANCE',

  /** Holistic understanding - Credentialed experts */
  T8_SYSTEMIC_PATTERNS = 'T8_SYSTEMIC_PATTERNS',
}

/**
 * Evidence Level
 * Scientific rigor classification from anecdotal to gold standard
 */
export enum EvidenceLevel {
  /** Personal reports, no controlled study */
  ANECDOTAL = 'ANECDOTAL',

  /** Laboratory studies only */
  IN_VITRO = 'IN_VITRO',

  /** Animal model studies */
  ANIMAL = 'ANIMAL',

  /** Small human trials (<30 participants) */
  HUMAN_PILOT = 'HUMAN_PILOT',

  /** Controlled trials (30+ participants) */
  HUMAN_CONTROLLED = 'HUMAN_CONTROLLED',

  /** Systematic reviews of multiple studies */
  META_ANALYSIS = 'META_ANALYSIS',

  /** Multiple RCTs with consistent results */
  GOLD_STANDARD = 'GOLD_STANDARD',
}

/**
 * Causal Direction for graph traversal
 */
export enum CausalDirection {
  /** Navigate to what causes this concept */
  UPSTREAM = 'UPSTREAM',

  /** Navigate to what this concept causes */
  DOWNSTREAM = 'DOWNSTREAM',

  /** Bidirectional exploration */
  BOTH = 'BOTH',
}

/**
 * Causal Node Type for visualization
 */
export enum CausalNodeType {
  ROOT = 'ROOT',
  CAUSE = 'CAUSE',
  EFFECT = 'EFFECT',
  MECHANISM = 'MECHANISM',
  OUTCOME = 'OUTCOME',
}

/**
 * Disclosure Level for progressive disclosure
 */
export enum DisclosureLevel {
  /** Brief overview - 3 seconds */
  GLANCE = 'GLANCE',

  /** Moderate depth - 30 seconds */
  SCAN = 'SCAN',

  /** Full detail - 5 minutes */
  STUDY = 'STUDY',
}

/**
 * Synergy Type for ingredient interactions
 */
export enum SynergyType {
  ENHANCED_PENETRATION = 'ENHANCED_PENETRATION',
  STABILITY_BOOST = 'STABILITY_BOOST',
  EFFICACY_MULTIPLIER = 'EFFICACY_MULTIPLIER',
  TOLERANCE_IMPROVEMENT = 'TOLERANCE_IMPROVEMENT',
  COMPLEMENTARY_MECHANISMS = 'COMPLEMENTARY_MECHANISMS',
}

/**
 * Conflict Type for ingredient interactions
 */
export enum ConflictType {
  PH_INCOMPATIBILITY = 'PH_INCOMPATIBILITY',
  OXIDATION_RISK = 'OXIDATION_RISK',
  IRRITATION_STACKING = 'IRRITATION_STACKING',
  NEUTRALIZATION = 'NEUTRALIZATION',
  PHOTOSENSITIVITY_AMPLIFICATION = 'PHOTOSENSITIVITY_AMPLIFICATION',
}

/**
 * Interaction Type for compatibility analysis
 */
export enum InteractionType {
  SYNERGY = 'SYNERGY',
  COMPATIBLE = 'COMPATIBLE',
  CAUTION = 'CAUTION',
  SEPARATE = 'SEPARATE',
  CONTRAINDICATED = 'CONTRAINDICATED',
}

/**
 * Threshold metadata for UI display
 */
export const THRESHOLD_METADATA: Record<
  KnowledgeThreshold,
  {
    level: number;
    label: string;
    fullLabel: string;
    description: string;
    color: string;
    accessLevel: 'public' | 'registered' | 'professional' | 'expert';
  }
> = {
  [KnowledgeThreshold.T1_SKIN_BIOLOGY]: {
    level: 1,
    label: 'T1',
    fullLabel: 'Skin Biology',
    description: 'Fundamental skin science concepts',
    color: '#3B82F6', // Blue
    accessLevel: 'public',
  },
  [KnowledgeThreshold.T2_INGREDIENT_SCIENCE]: {
    level: 2,
    label: 'T2',
    fullLabel: 'Ingredient Science',
    description: 'How ingredients work',
    color: '#10B981', // Green
    accessLevel: 'public',
  },
  [KnowledgeThreshold.T3_PRODUCT_FORMULATION]: {
    level: 3,
    label: 'T3',
    fullLabel: 'Product Formulation',
    description: 'Formulation principles',
    color: '#8B5CF6', // Purple
    accessLevel: 'public',
  },
  [KnowledgeThreshold.T4_TREATMENT_PROTOCOLS]: {
    level: 4,
    label: 'T4',
    fullLabel: 'Treatment Protocols',
    description: 'Application methods',
    color: '#F59E0B', // Amber
    accessLevel: 'registered',
  },
  [KnowledgeThreshold.T5_CONTRAINDICATIONS]: {
    level: 5,
    label: 'T5',
    fullLabel: 'Contraindications',
    description: 'Safety considerations',
    color: '#EF4444', // Red
    accessLevel: 'registered',
  },
  [KnowledgeThreshold.T6_PROFESSIONAL_TECHNIQUES]: {
    level: 6,
    label: 'T6',
    fullLabel: 'Professional Techniques',
    description: 'Advanced procedures',
    color: '#6366F1', // Indigo
    accessLevel: 'professional',
  },
  [KnowledgeThreshold.T7_REGULATORY_COMPLIANCE]: {
    level: 7,
    label: 'T7',
    fullLabel: 'Regulatory Compliance',
    description: 'Legal requirements',
    color: '#6B7280', // Gray
    accessLevel: 'professional',
  },
  [KnowledgeThreshold.T8_SYSTEMIC_PATTERNS]: {
    level: 8,
    label: 'T8',
    fullLabel: 'Systemic Patterns',
    description: 'Holistic understanding',
    color: '#14B8A6', // Teal
    accessLevel: 'expert',
  },
};

/**
 * Evidence level metadata for UI display
 */
export const EVIDENCE_METADATA: Record<
  EvidenceLevel,
  {
    level: number;
    label: string;
    description: string;
    color: string;
    strength: number; // 0-1
  }
> = {
  [EvidenceLevel.ANECDOTAL]: {
    level: 1,
    label: 'Anecdotal',
    description: 'Personal reports, no controlled study',
    color: '#9CA3AF',
    strength: 0.14,
  },
  [EvidenceLevel.IN_VITRO]: {
    level: 2,
    label: 'In Vitro',
    description: 'Laboratory studies only',
    color: '#A5B4FC',
    strength: 0.28,
  },
  [EvidenceLevel.ANIMAL]: {
    level: 3,
    label: 'Animal',
    description: 'Animal model studies',
    color: '#93C5FD',
    strength: 0.42,
  },
  [EvidenceLevel.HUMAN_PILOT]: {
    level: 4,
    label: 'Human Pilot',
    description: 'Small human trials (<30 participants)',
    color: '#86EFAC',
    strength: 0.57,
  },
  [EvidenceLevel.HUMAN_CONTROLLED]: {
    level: 5,
    label: 'Human Controlled',
    description: 'Controlled trials (30+ participants)',
    color: '#4ADE80',
    strength: 0.71,
  },
  [EvidenceLevel.META_ANALYSIS]: {
    level: 6,
    label: 'Meta-Analysis',
    description: 'Systematic reviews of multiple studies',
    color: '#22C55E',
    strength: 0.85,
  },
  [EvidenceLevel.GOLD_STANDARD]: {
    level: 7,
    label: 'Gold Standard',
    description: 'Multiple RCTs with consistent results',
    color: '#FBBF24',
    strength: 1.0,
  },
};
