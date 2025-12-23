# Specification: JADE SKA MACH Evolution Strategy

**Feature ID**: 010
**Feature Name**: SKA-to-MACH Composable Evolution
**Version**: 1.0.0
**Status**: RECOMMENDATION - PENDING APPROVAL
**Created**: December 18, 2025
**Based On**: Five Rings Strategic Framework Analysis
**Migration Path**: Northflank POC → AWS MACH Composable

---

## Executive Summary

This specification defines the strategic evolution of the JADE Spa Marketplace from its current proof-of-concept (Northflank/Vendure) to a production-ready MACH Composable architecture on AWS. The strategy is informed by the **Five Rings Analysis** which identified that SKA implements ~70-75% of recommended architectural patterns, with specific gaps in feedback loops, explanation generation, and segment-level observability.

### Strategic Metaphor
Think of this evolution like upgrading from a well-designed prototype car to a production vehicle. The engine (SKA knowledge graph + tensor search) is excellent—we're adding the instrumentation (feedback loops), safety systems (constraint enforcement), and load handling (segment-aware scaling) needed for marketplace-scale operation.

### Key Architectural Principles

| Principle | POC State | Target State |
|-----------|-----------|--------------|
| **Data Architecture** | Monolithic Vendure | MACH Composable |
| **Deployment** | Northflank containers | AWS ECS/Lambda |
| **Knowledge Graph** | Apache AGE + pgvector | Neptune + OpenSearch |
| **Event Processing** | Request-response | Event-driven (EventBridge) |
| **Observability** | Aggregate metrics | Segment-level + ML feedback |

---

## Five Rings Gap Analysis Implementation

### 🪨 EARTH (Foundations) — Enhancement Required

**Current Strength**: BFO + OWL 2 classification, CausalRelation models, Zod validation, Apache AGE

**Gap Identified**: Missing constraint/prohibition relationships for safety-critical domains

**Implementation**: Add `ConstraintRelation` model with `INCOMPATIBLE_WITH`, `CONTRAINDICATED_FOR`, `REQUIRES_BUFFER` relationship types

```typescript
// New relationship types to implement
type ConstraintType = 
  | 'INCOMPATIBLE_WITH'     // Chemical interaction conflict
  | 'CONTRAINDICATED_FOR'   // Skin type prohibition
  | 'REQUIRES_BUFFER'       // Time/sequence requirement
  | 'ENHANCES_RISK_OF'      // Conditional warning
  | 'CANCELS_EFFICACY_OF';  // Neutral but wasteful

interface ConstraintRelation {
  sourceAtomId: string;
  targetAtomId: string;
  constraintType: ConstraintType;
  severity: 'CRITICAL' | 'WARNING' | 'CAUTION';
  condition?: string;        // "When used on sensitive skin"
  scientificBasis: string;   // Citation required
  goldilocksOverride?: boolean; // Can Goldilocks params mitigate?
}
```

---

### 💧 WATER (Feedback Loops) — Critical Gap [Priority 1]

**Current State**: Basic Prometheus metrics, ReviewCard for spaced repetition

**Gap**: No event sourcing for ML training, no outcome tracking, no human-in-the-loop QA

**Implementation**: Three-loop feedback architecture

#### Loop A: Implicit Feedback (High Volume, Noisy)
```sql
-- Interaction event stream
CREATE TABLE jade.interaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_hash VARCHAR(64) NOT NULL, -- Anonymized session
  event_type VARCHAR(50) NOT NULL,   -- 'impression', 'click', 'add_to_cart', 'purchase', 'dwell'
  atom_id UUID REFERENCES skincare_atoms(id),
  product_id UUID REFERENCES jade.product_extension(id),
  search_query TEXT,                  -- Original search for relevance
  position INT,                       -- Rank position when shown
  dwell_time_ms INT,                  -- Time spent viewing
  device_type VARCHAR(20),
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month for analytics performance
CREATE INDEX idx_interaction_events_type_date ON jade.interaction_events(event_type, created_at);
```

#### Loop B: Explicit Feedback (Lower Volume, High Signal)
```sql
-- Outcome reporting
CREATE TABLE jade.outcome_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES jade.user(id),
  product_id UUID REFERENCES jade.product_extension(id),
  outcome_type VARCHAR(50) NOT NULL,  -- 'irritation', 'improvement', 'neutral', 'breakout', 'allergic'
  skin_type VARCHAR(50),
  skin_concerns VARCHAR(255)[],        -- Array of concerns
  usage_duration_days INT,
  application_frequency VARCHAR(50),   -- 'daily', 'twice_daily', 'weekly'
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  would_repurchase BOOLEAN,
  notes TEXT,
  photo_evidence_url TEXT,             -- Optional before/after
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Loop C: Human-in-the-Loop (Curator Corrections)
```sql
-- Data quality corrections
CREATE TABLE jade.data_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corrected_by UUID REFERENCES jade.user(id),
  curator_role VARCHAR(50) NOT NULL,   -- 'esthetician', 'dermatologist', 'chemist', 'admin'
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  correction_type VARCHAR(50) NOT NULL,
  before_value JSONB,
  after_value JSONB,
  reason TEXT NOT NULL,
  confidence_impact FLOAT,             -- How much does this affect confidence?
  peer_reviewed BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES jade.user(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 🔥 FIRE (Execution Architecture) — Enhancement Required

**Current Strength**: Zilliz hybrid search, Apache AGE graph, tensor-similarity service

**Gap**: Pure similarity ranking (no behavioral signals), no explanation generation service

**Implementation**: Multi-signal learned ranker + explanation engine

#### Ranker Enhancement
```typescript
// Multi-signal ranking model
interface RankingSignals {
  // Semantic (existing)
  semanticSimilarity: number;      // 792-D embedding distance
  tensorMatch: number;             // 17-D domain tensor match
  
  // Graph (existing, underutilized)  
  causalRelevance: number;         // Path length in causal graph
  relationshipStrength: number;    // Edge confidence scores
  constraintViolations: number;    // Safety penalties
  
  // Behavioral (NEW - from Loop A)
  clickThroughRate: number;        // Historical CTR for this product
  conversionRate: number;          // Purchase rate when shown
  returnRate: number;              // Negative signal
  dwellTimeNormalized: number;     // Engagement signal
  
  // Contextual (NEW)
  skinTypeMatch: number;           // User profile alignment
  concernAlignment: number;        // Problem-solution fit
  pricePointFit: number;          // Budget appropriateness
  
  // Exploration (NEW - multi-armed bandit)
  explorationBonus: number;        // Encourage discovery of new products
}

// Weighted combination (weights learned from Loop B outcomes)
const combinedScore = 
  w1 * semanticSimilarity +
  w2 * tensorMatch +
  w3 * causalRelevance +
  w4 * clickThroughRate +
  w5 * skinTypeMatch +
  w6 * explorationBonus -
  w7 * constraintViolations;
```

#### Explanation Generation Service
```typescript
// New service: lib/services/explanation.service.ts
interface ExplanationPath {
  steps: ExplanationStep[];
  confidence: number;
  readableExplanation: string;
  scientificBasis: Source[];
}

interface ExplanationStep {
  fromAtom: SkincareAtom;
  relationship: RelationType;
  toAtom: SkincareAtom;
  mechanism?: string;
}

class ExplanationService {
  /**
   * Generates human-readable "why" explanation from graph paths
   * Example: "Niacinamide → REGULATES → sebum production → REDUCES → pore visibility"
   */
  async generateExplanation(
    productAtomId: string, 
    userProfile: UserSkinProfile
  ): Promise<ExplanationPath[]> {
    // 1. Find relevant causal chains from product ingredients
    // 2. Match chains to user concerns
    // 3. Translate to natural language
    // 4. Attach scientific sources
  }

  private verbForRelationship(rel: RelationType): string {
    const verbs = {
      'CAUSES': 'leads to',
      'PREVENTS': 'helps prevent',
      'REGULATES': 'balances',
      'ENHANCES': 'amplifies',
      'INHIBITS': 'reduces',
    };
    return verbs[rel] || 'affects';
  }
}
```

---

### 🌬️ WIND (Observability) — Operational Gap

**Current State**: Prometheus metrics (aggregate), performance benchmarks

**Gap**: No segment-level metrics, no recommendation quality tracking, no calibration

**Implementation**: Segment-aware observability dashboard

```yaml
# intelligence-service-metrics.yaml
segment_dimensions:
  - skin_type: [oily, dry, combination, normal, sensitive]
  - primary_concern: [acne, aging, hyperpigmentation, rosacea, general]
  - experience_level: [beginner, intermediate, advanced]
  - price_sensitivity: [budget, mid_range, premium, luxury]

metrics:
  # Recommendation Quality (Per Segment)
  - name: recommendation_acceptance_rate
    description: "% of shown recommendations that were clicked/purchased"
    segment_by: [skin_type, primary_concern]
    alert_if_delta: 0.15

  - name: outcome_satisfaction_by_segment
    description: "Positive outcome rate per user segment"
    segment_by: [skin_type, experience_level]
    alert_threshold:
      sensitive: 0.70  # Higher bar for sensitive skin
      default: 0.60

  - name: cold_start_coverage
    description: "% of new users receiving useful recommendations"
    segment_by: [skin_type]
    target:
      sensitive: 0.80
      default: 0.90

  # Calibration Metrics
  - name: high_confidence_accuracy
    description: "When we say 'HIGH' confidence, how often is outcome positive?"
    expected: 0.85
    alert_if_below: 0.75

  - name: match_score_calibration
    description: "Correlation between match_score and actual satisfaction"
    measurement: "pearson_correlation(match_score, outcome_rating)"
    expected: 0.70

  # Data Quality
  - name: ingredient_completeness
    description: "% of products with verified INCI lists"
    target: 0.95

  - name: tensor_coverage
    description: "% of atoms with 17-D tensor fully populated"
    target: 0.90
```

---

### 🕳️ VOID (Mastery & Simplification) — Strategic Alignment

**Current Strength**: Privacy-first design, progressive disclosure, domain-specific tensors, constitutional compliance

**Enhancement**: Explicit uncertainty communication for trust-sensitive domains

```typescript
// Confidence communication in UI
interface RecommendationConfidence {
  level: 'HIGH' | 'MODERATE' | 'LOW' | 'EXPLORE';
  explanation: string;
  dataPointsUsed: number;
  
  // Transparency
  limitationsDisclosure?: string;
  alternativeConsiderations?: string[];
}

// Example usage
const confidence: RecommendationConfidence = {
  level: 'MODERATE',
  explanation: 'Based on 847 similar skin profiles with 72% positive outcomes',
  dataPointsUsed: 847,
  limitationsDisclosure: 'Limited data for combination skin with rosacea',
  alternativeConsiderations: [
    'Patch test recommended',
    'Consider consulting dermatologist for persistent rosacea'
  ]
};
```

---

## MACH Architecture Target State

### Service Decomposition

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AWS API Gateway + CloudFront                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   Commerce        │  │   Vendor         │  │   Intelligence           │  │
│  │   Service         │  │   Service        │  │   Service                │  │
│  │   (ECS Fargate)   │  │   (ECS Fargate)  │  │   (ECS + Lambda)         │  │
│  │                   │  │                  │  │                          │  │
│  │   • Cart          │  │   • Storefront   │  │   • SKA Queries          │  │
│  │   • Checkout      │  │   • Products     │  │   • Causal Chains        │  │
│  │   • Orders        │  │   • Inventory    │  │   • Compatibility        │  │
│  │   • Payments      │  │   • Analytics    │  │   • Recommendations      │  │
│  │                   │  │                  │  │   • Explanations         │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────────┬─────────────┘  │
│           │                     │                          │               │
│  ┌────────┴─────────────────────┴──────────────────────────┴───────────┐   │
│  │                    Amazon EventBridge (Event Bus)                    │   │
│  └────────┬─────────────────────┬──────────────────────────┬───────────┘   │
│           │                     │                          │               │
│  ┌────────┴─────────┐  ┌────────┴─────────┐  ┌─────────────┴───────────┐   │
│  │   Feedback       │  │   Analytics      │  │   Identity              │   │
│  │   Service        │  │   Service        │  │   Service               │   │
│  │   (Lambda)       │  │   (Lambda +      │  │   (Cognito + Lambda)    │   │
│  │                  │  │    Kinesis)      │  │                         │   │
│  │   • Outcomes     │  │                  │  │   • License Verify      │   │
│  │   • Corrections  │  │   • Dashboards   │  │   • Wholesale Approval  │   │
│  │   • ML Training  │  │   • Reporting    │  │   • Role Management     │   │
│  └──────────────────┘  └──────────────────┘  └─────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Data Stores:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐
│ Aurora          │  │ Neptune         │  │ OpenSearch      │  │ Kinesis     │
│ PostgreSQL      │  │ (Graph)         │  │ (Vectors)       │  │ Firehose    │
│                 │  │                 │  │                 │  │             │
│ • Commerce      │  │ • SKA Atoms     │  │ • 792-D         │  │ • Events    │
│ • Users         │  │ • Causal Rels   │  │   Embeddings    │  │ • Analytics │
│ • Vendors       │  │ • Constraints   │  │ • 17-D Tensors  │  │             │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘
```

### Contract-First Development

Each service is defined by its GraphQL contract in `/contracts/`:

| Contract File | Current POC | AWS Service |
|---------------|-------------|-------------|
| `intelligence.graphql` | Vendure plugin | Intelligence Service |
| `marketplace.graphql` | Vendure core | Commerce Service |
| `vendor.graphql` | Vendure plugin | Vendor Service |
| `analytics.graphql` | *New* | Analytics Service |
| `feedback.graphql` | *New* | Feedback Service |

---

## Constitutional Compliance

### Article VIII Amendment: UI Stability Protection

This specification includes the proposed **UI Stability Protection Protocol**:

```markdown
## Amendment 001: UI Stability Protection Protocol

### Principle
The user interface, once established through approved design patterns, 
becomes immutable except through explicit, documented change requests.
Backend updates MUST adapt to existing UI contracts.

### Rules
1. UI components define explicit TypeScript interfaces
2. Contract changes require 2-week deprecation notice
3. Breaking changes require migration tooling
4. Pre-commit hooks detect UI structure changes
5. CI/CD validates contract compatibility

### Protected Elements
- Navigation structure
- Route definitions  
- Component prop interfaces
- Design system tokens
- Progressive disclosure patterns (Glance/Scan/Study)
```

---

## Skincare-Specific Tensor Dimensions

Leveraging SKA's sophisticated tensor system for interpretable matching:

```typescript
// 17-Dimensional Skincare Tensor
interface SkincareTensorDimensions {
  // Efficacy Dimensions (0-6)
  hydrationIndex: number;        // [0] Moisture delivery
  sebumRegulation: number;       // [1] Oil control
  antiAgingPotency: number;      // [2] Wrinkle/firmness
  brighteningCapacity: number;   // [3] Pigmentation correction
  soothingEffect: number;        // [4] Anti-inflammatory
  exfoliationStrength: number;   // [5] Cell turnover
  antioxidantPower: number;      // [6] Free radical defense

  // Formulation Dimensions (7-11)
  phBalance: number;             // [7] Acid/alkaline position
  penetrationDepth: number;      // [8] Skin layer reach
  stabilityProfile: number;      // [9] Formulation stability
  potencyConcentration: number;  // [10] Active concentration
  absorptionRate: number;        // [11] Absorption speed

  // Interaction Dimensions (12-16)
  synergyPotential: number;      // [12] Combination friendliness
  irritationPotential: number;   // [13] Adverse reaction risk
  toleranceBuilding: number;     // [14] Skin adaptation curve
  efficacyTimeline: number;      // [15] Time to results
  concentrationSensitivity: number; // [16] Dosing sensitivity
}

// Example: Matching "gentle anti-aging for sensitive skin"
const userIntent: Partial<SkincareTensorDimensions> = {
  antiAgingPotency: 0.6,         // Moderate (not aggressive)
  irritationPotential: 0.2,      // LOW required
  soothingEffect: 0.7,           // HIGH preferred
  toleranceBuilding: 0.8,        // Gradual introduction
};
```

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Search latency (P95) | < 200ms | CloudWatch |
| Recommendation accuracy | > 75% | A/B testing |
| Explanation generation | < 500ms | Service metrics |
| System availability | 99.9% | Uptime monitoring |
| Event processing lag | < 1 minute | Kinesis metrics |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cold-start coverage | 85% | New user analytics |
| Outcome satisfaction | 70% | Explicit feedback |
| Recommendation regret | < 15% | Quick bounce + returns |
| Data quality score | 95% | Automated audits |

---

## Risk Assessment

### High Priority Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Feedback loop cold start | High | High | Seed with synthetic data + industry benchmarks |
| AWS migration complexity | Medium | High | Phased migration, contract-first approach |
| Constraint enforcement gaps | Medium | High | Comprehensive testing, curator review |

### Medium Priority Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Explanation quality | Medium | Medium | User testing, iterative improvement |
| Segment observability cost | Low | Medium | Sampling for high-cardinality segments |

---

## Approval Required

**Approach Options**:

### Option A: Phased Evolution (RECOMMENDED)
- ✅ Minimal disruption to existing POC
- ✅ Validates patterns before full migration
- ⏱️ 16-week timeline
- 💰 Moderate investment

### Option B: Big Bang Migration
- ⚠️ Higher risk
- ⚠️ Longer initial timeline
- ⏱️ 24+ week timeline
- 💰 Higher upfront investment

### Option C: Continue POC Only
- ⚠️ Accumulates technical debt
- ⚠️ Misses competitive window
- ⏱️ Indefinite
- 💰 Low short-term cost, high long-term cost

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-18 | AI Assistant | Initial specification based on Five Rings Analysis |

---

**Prepared by**: Claude AI Development Assistant  
**Review required by**: Jesse Garza  
**Decision deadline**: December 22, 2025
