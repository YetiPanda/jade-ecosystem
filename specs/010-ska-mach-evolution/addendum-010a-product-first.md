# SPECKIT Addendum 010-A: Product-First Marketplace Integration
## Extending SKA MACH Evolution for Catalog-Heavy Architecture

**Version**: 1.0.0  
**Parent Feature**: 010-ska-mach-evolution  
**Status**: DRAFT - PENDING APPROVAL  
**Date**: December 19, 2025

---

## Executive Summary

This addendum extends the approved SKA MACH Evolution plan with product-first marketplace patterns. It adds:

1. **Ingredient Normalization Pipeline** - Canonical ingredient graph
2. **Seller Ingestion QA Loop** - Data quality as first-class system
3. **Multi-Vector Strategy** - Three specialized embedding types
4. **Extended Graph Ontology** - 20 high-value relationships
5. **4-Step Retrieval Pipeline** - Structured ranking architecture

**Impact on Timeline**: +2 sprints (4 weeks) integrated into Phase 1-2  
**Impact on Budget**: +$50/month (additional vector index storage)

---

## 1. Gap Analysis: Current Plan vs. Product-First Requirements

### 1.1 What's Already Covered ✅

| Requirement | Current Implementation | Location |
|-------------|----------------------|----------|
| Post-purchase outcomes | `outcome_events` table | feedback-tables.sql |
| Behavioral signals | `interaction_events` table | feedback-tables.sql |
| Basic constraints | `constraint_relations` table | feedback-tables.sql |
| Segment metrics | WIND metrics config | metrics.yaml |
| Adverse outcome alerts | Segment-level thresholds | metrics.yaml |

### 1.2 Gaps Requiring New Work 🔴

| Gap | Impact | Priority |
|-----|--------|----------|
| Ingredient normalization | Can't dedupe aliases (e.g., "Vitamin C" vs "Ascorbic Acid") | HIGH |
| Seller QA loop | Bad data enters system unchecked | HIGH |
| Formula-based similarity | "Similar products" uses marketing text, not composition | MEDIUM |
| Product search vector | Single tensor conflates search + similarity | MEDIUM |
| Extended graph relations | Only 6 constraint types vs 20 needed | MEDIUM |

### 1.3 Enhancements to Existing Components 🟡

| Component | Current | Enhanced |
|-----------|---------|----------|
| `constraint_relations.constraint_type` | 6 types | 12 types (add commerce/catalog) |
| Vector strategy | Single 17-D tensor | 3 specialized vectors |
| Retrieval pipeline | 2-step (search + rank) | 4-step (intent → candidates → filter → rank) |

---

## 2. Extended Ontology: 20 High-Value Relationships

### 2.1 New Relationship Types for constraint_relations

```sql
-- Add to constraint_type enum (feedback-tables.sql)
ALTER TYPE constraint_type ADD VALUE 'CONTAINS_INGREDIENT';
ALTER TYPE constraint_type ADD VALUE 'HAS_INCI';
ALTER TYPE constraint_type ADD VALUE 'ALIASES_TO';
ALTER TYPE constraint_type ADD VALUE 'IN_INGREDIENT_CLASS';
ALTER TYPE constraint_type ADD VALUE 'MAY_IRRITATE';
ALTER TYPE constraint_type ADD VALUE 'COMMONLY_USED_FOR';
```

### 2.2 Full Relationship Taxonomy

**Catalog + Commerce (6)**
```
(:Brand)-[:MAKES]->(:Product)
(:Product)-[:HAS_VARIANT]->(:SKU)
(:Seller)-[:LISTS]->(:InventoryOffer)
(:InventoryOffer)-[:FOR_SKU]->(:SKU)
(:InventoryOffer)-[:SHIPS_TO]->(:Region)
(:InventoryOffer)-[:IN_STOCK {qty}]->(:StockState)
```

**Product Semantics (4)**
```
(:Product)-[:IN_CATEGORY]->(:Category)
(:Product)-[:FOR_STEP]->(:RoutineStep)
(:Product)-[:HAS_ATTRIBUTE {value}]->(:Attribute)
(:Product)-[:HAS_TAG]->(:ClaimTag)
```

**Ingredients & Normalization (4)**
```
(:SKU)-[:CONTAINS {position, pct}]->(:Ingredient)
(:Ingredient)-[:HAS_INCI]->(:INCIName)
(:IngredientAlias)-[:ALIASES]->(:Ingredient)
(:Ingredient)-[:IN_CLASS]->(:IngredientClass)
```

**Skin Mapping (3)** - Cautious language, not medical claims
```
(:Ingredient)-[:MAY_IRRITATE]->(:Sensitivity)
(:Product)-[:COMMONLY_USED_FOR]->(:Concern)
(:Product)-[:SUITABLE_FOR]->(:SkinType)
```

**Personalization (3)**
```
(:User)-[:HAS_CONSTRAINT]->(:UserConstraint)
(:UserConstraint)-[:EXCLUDES]->(:Ingredient|:ClaimTag|:Category)
(:User)-[:INTERACTED {type, ts}]->(:Product|:SKU|:Offer)
```

---

## 3. Ingredient Normalization Pipeline

### 3.1 New Tables

```sql
-- Canonical ingredient registry
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name VARCHAR(255) NOT NULL UNIQUE,
    inci_name VARCHAR(255),
    ingredient_class VARCHAR(100), -- humectant, surfactant, preservative, etc.
    ewg_score SMALLINT CHECK (ewg_score BETWEEN 1 AND 10),
    comedogenic_rating SMALLINT CHECK (comedogenic_rating BETWEEN 0 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alias resolution table
CREATE TABLE ingredient_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alias VARCHAR(255) NOT NULL,
    canonical_ingredient_id UUID REFERENCES ingredients(id),
    confidence DECIMAL(3,2) DEFAULT 1.00, -- 0.00-1.00
    source VARCHAR(50), -- 'inci_decoder', 'manual', 'ml_match'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(alias)
);

-- Product-ingredient junction with position
CREATE TABLE sku_ingredients (
    sku_id UUID NOT NULL, -- References Vendure SKU
    ingredient_id UUID REFERENCES ingredients(id),
    position SMALLINT, -- Order in INCI list (1 = highest concentration)
    percentage DECIMAL(5,2), -- If known
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (sku_id, ingredient_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_ingredients_class ON ingredients(ingredient_class);
CREATE INDEX idx_aliases_lookup ON ingredient_aliases(LOWER(alias));
CREATE INDEX idx_sku_ingredients_position ON sku_ingredients(sku_id, position);
```

### 3.2 Normalization Service

```typescript
// Intelligence Service: Ingredient Normalizer
interface IngredientNormalizerService {
  // Parse raw INCI string into canonical ingredients
  parseInciList(raw: string): Promise<ParsedIngredient[]>;
  
  // Resolve alias to canonical ingredient
  resolveAlias(alias: string): Promise<Ingredient | null>;
  
  // Bulk normalize for seller ingestion
  normalizeProductIngredients(productId: string, inciList: string): Promise<NormalizationResult>;
  
  // Flag unknown ingredients for review
  flagUnknownIngredient(alias: string, productId: string): Promise<void>;
}

interface ParsedIngredient {
  raw: string;
  canonical: Ingredient | null;
  position: number;
  confidence: number;
  needsReview: boolean;
}
```

---

## 4. Seller Ingestion QA Loop (Loop A)

### 4.1 New Tables

```sql
-- Data quality issues flagged during ingestion
CREATE TABLE seller_data_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL,
    product_id UUID,
    sku_id UUID,
    issue_type VARCHAR(50) NOT NULL,
    -- 'missing_ingredients', 'conflicting_claims', 'variant_mismatch',
    -- 'unverified_claim', 'suspicious_pricing', 'duplicate_listing'
    severity severity_level NOT NULL,
    details JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    -- 'open', 'acknowledged', 'resolved', 'disputed', 'escalated'
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seller quality scores (aggregated)
CREATE TABLE seller_quality_scores (
    seller_id UUID PRIMARY KEY,
    ingredient_completeness DECIMAL(3,2), -- % of products with INCI
    claim_accuracy DECIMAL(3,2), -- % of claims verified
    data_consistency DECIMAL(3,2), -- % without variant mismatches
    response_time_hours DECIMAL(5,1), -- Avg time to resolve issues
    overall_score DECIMAL(3,2) GENERATED ALWAYS AS (
        (ingredient_completeness + claim_accuracy + data_consistency) / 3
    ) STORED,
    last_calculated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seller_issues_open ON seller_data_issues(seller_id, status) 
    WHERE status = 'open';
```

### 4.2 Automated QA Checks

```typescript
// Seller Ingestion QA Service
interface SellerQAService {
  // Run on every product submission
  validateProductSubmission(submission: ProductSubmission): Promise<QAResult>;
  
  // Specific checks
  checkIngredientListPresent(product: Product): QACheck;
  checkClaimConsistency(product: Product): QACheck; // "fragrance-free" but has parfum
  checkVariantConsistency(product: Product): QACheck; // SKU ingredients differ unexpectedly
  checkPricingAnomaly(offer: Offer): QACheck; // Suspiciously low/high
  checkDuplicateListing(product: Product): QACheck;
  
  // Aggregate seller scores
  recalculateSellerScore(sellerId: string): Promise<SellerQualityScore>;
}

interface QAResult {
  passed: boolean;
  issues: DataQualityIssue[];
  blockers: DataQualityIssue[]; // Prevent listing until resolved
  warnings: DataQualityIssue[]; // Allow listing but flag
}
```

### 4.3 QA Metrics (Add to metrics.yaml)

```yaml
seller_quality_metrics:
  - name: seller_ingredient_completeness
    type: gauge
    description: "Average % of products with verified INCI across all sellers"
    target: 0.90
    alert_if_below: 0.80
    
  - name: new_listing_rejection_rate
    type: gauge
    description: "% of new listings blocked by QA"
    target: 0.10  # Some rejection is healthy
    alert_if_above: 0.30  # Too many = bad seller experience
    
  - name: claim_conflict_rate
    type: gauge
    description: "% of products with conflicting claims"
    target: 0.02
    alert_if_above: 0.05
    
  - name: avg_issue_resolution_hours
    type: histogram
    description: "Time for sellers to resolve flagged issues"
    target: 48
    alert_if_above: 168  # 1 week
```

---

## 5. Multi-Vector Strategy

### 5.1 Three Embedding Types

| Vector | Purpose | Input Fields | Dimension |
|--------|---------|--------------|-----------|
| `product_search_vector` | Query → Product matching | name, description, tags, category, step | 768 |
| `product_formula_vector` | Formula similarity | Top 10 ingredients + classes | 768 |
| `ingredient_vector` | Ingredient → Ingredient similarity | INCI, aliases, class, roles | 384 |

### 5.2 Vector Generation

```typescript
// Vector Generation Service
interface VectorGenerationService {
  // Product search vector (for query matching)
  generateSearchVector(product: Product): Promise<Float32Array>;
  
  // Formula vector (for "similar products")
  generateFormulaVector(sku: SKU): Promise<Float32Array>;
  
  // Ingredient vector (for ingredient similarity)
  generateIngredientVector(ingredient: Ingredient): Promise<Float32Array>;
  
  // Batch generation for catalog updates
  regenerateAllVectors(type: 'search' | 'formula' | 'ingredient'): Promise<void>;
}

// Formula string construction
function buildFormulaString(sku: SKU): string {
  // "glycerin humectant | niacinamide active | dimethicone occlusive | ..."
  return sku.ingredients
    .slice(0, 10)
    .map(i => `${i.canonical_name} ${i.ingredient_class}`)
    .join(' | ');
}
```

### 5.3 pgvector Schema Extension

```sql
-- Add to existing products/SKUs (via Vendure custom fields or separate table)
CREATE TABLE product_vectors (
    product_id UUID PRIMARY KEY,
    search_vector vector(768),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sku_vectors (
    sku_id UUID PRIMARY KEY,
    formula_vector vector(768),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ingredient_vectors (
    ingredient_id UUID PRIMARY KEY REFERENCES ingredients(id),
    embedding vector(384),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW indexes for fast similarity search
CREATE INDEX idx_product_search_vector ON product_vectors 
    USING hnsw (search_vector vector_cosine_ops);
CREATE INDEX idx_sku_formula_vector ON sku_vectors 
    USING hnsw (formula_vector vector_cosine_ops);
CREATE INDEX idx_ingredient_vector ON ingredient_vectors 
    USING hnsw (embedding vector_cosine_ops);
```

---

## 6. 4-Step Retrieval Pipeline

### 6.1 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 0: Intent Detection                                        │
│ "fragrance-free moisturizer under $25 for sensitive skin"       │
│ → { category: moisturizer, constraints: [fragrance-free],       │
│     price_max: 25, skin_type: sensitive }                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Candidate Generation (~200 products)                    │
│ • Vector search: product_search_vector                          │
│ • OR formula similarity: product_formula_vector (if browsing)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Hard Filtering (~20-60 products)                        │
│ • User constraints (allergies, preferences)                     │
│ • Offer constraints (in-stock, ships-to, price)                 │
│ • Category/step match                                           │
│ • Adverse outcome threshold (sensitive skin protection)         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Ranking (weighted score)                                │
│ • Semantic similarity (vector score)                            │
│ • Formula overlap (ingredient class overlap)                    │
│ • Marketplace strength (price, ship speed, stock)               │
│ • Behavioral signals (CTR, conversion, repeat)                  │
│ • Satisfaction signals (ratings, outcomes)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Explanation Generation                                  │
│ • "Matches fragrance-free preference" (constraint path)         │
│ • "Similar formula to [X]" (ingredient overlap)                 │
│ • "Popular for sensitive skin" (segment performance)            │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 GraphQL Query Extension

```graphql
# Add to existing schema (contracts/feedback.graphql)

type SearchIntent {
  query: String!
  category: String
  routineStep: String
  skinType: String
  concerns: [String!]
  constraints: [String!]  # fragrance-free, vegan, etc.
  priceMin: Float
  priceMax: Float
  shipsTo: String
}

type RetrievalResult {
  products: [RankedProduct!]!
  totalCandidates: Int!
  filteredCount: Int!
  appliedFilters: [AppliedFilter!]!
  searchLatencyMs: Int!
}

type RankedProduct {
  product: Product!
  score: Float!
  scoreBreakdown: ScoreBreakdown!
  explanations: [Explanation!]!
}

type ScoreBreakdown {
  semanticScore: Float!
  formulaOverlapScore: Float!
  marketplaceScore: Float!
  behavioralScore: Float!
  satisfactionScore: Float!
}

type Explanation {
  type: ExplanationType!
  text: String!
  confidence: ConfidenceLevel!
  sourcePath: String  # Graph path that generated this
}

enum ExplanationType {
  CONSTRAINT_MATCH
  FORMULA_SIMILARITY
  SEGMENT_PERFORMANCE
  INGREDIENT_BENEFIT
  USER_HISTORY
}

extend type Query {
  search(intent: SearchIntent!): RetrievalResult!
  similarProducts(productId: ID!, limit: Int = 8): [RankedProduct!]!
}
```

---

## 7. Integration with Existing SPECKIT

### 7.1 Modified Sprint Plan

**Phase 1 Extended: Foundation + Normalization**

| Sprint | Original Tasks | Added Tasks |
|--------|---------------|-------------|
| 1.1 | Constraint relations | + Ingredient tables |
| 1.2 | Feedback tables | + Alias resolution |
| 1.3 | GraphQL mutations | + Normalization service |
| 1.4 | Event ingestion | + Seller QA loop |
| **1.5** | *NEW* | Multi-vector schema |
| **1.6** | *NEW* | Vector generation service |

**Phase 2 Extended: Intelligence + Retrieval**

| Sprint | Original Tasks | Added Tasks |
|--------|---------------|-------------|
| 2.1 | Explanation service | + 4-step pipeline (steps 0-1) |
| 2.2 | Multi-signal ranking | + Pipeline steps 2-3 |
| 2.3 | Confidence calibration | + Explanation templates (step 4) |
| 2.4 | A/B framework | + Formula similarity |

### 7.2 New Tasks to Add

```markdown
## Sprint 1.5: Multi-Vector Schema (NEW)

### Task 1.5.1: Create ingredient tables migration
- **Hours**: 4
- **Dependencies**: None
- **Acceptance Criteria**:
  - [ ] ingredients table with canonical names
  - [ ] ingredient_aliases table with confidence scores
  - [ ] sku_ingredients junction table
  - [ ] Appropriate indexes created

### Task 1.5.2: Create vector tables migration
- **Hours**: 3
- **Dependencies**: 1.5.1
- **Acceptance Criteria**:
  - [ ] product_vectors table with search_vector column
  - [ ] sku_vectors table with formula_vector column
  - [ ] ingredient_vectors table
  - [ ] HNSW indexes for similarity search

### Task 1.5.3: Create seller QA tables migration
- **Hours**: 3
- **Dependencies**: None
- **Acceptance Criteria**:
  - [ ] seller_data_issues table
  - [ ] seller_quality_scores table
  - [ ] Appropriate indexes

## Sprint 1.6: Normalization Service (NEW)

### Task 1.6.1: Implement ingredient normalizer
- **Hours**: 8
- **Dependencies**: 1.5.1
- **Acceptance Criteria**:
  - [ ] parseInciList() handles common formats
  - [ ] resolveAlias() with confidence thresholds
  - [ ] Unknown ingredients flagged for review

### Task 1.6.2: Implement vector generation service
- **Hours**: 8
- **Dependencies**: 1.5.2
- **Acceptance Criteria**:
  - [ ] Search vector generation from product fields
  - [ ] Formula vector generation from ingredients
  - [ ] Ingredient vector generation
  - [ ] Batch regeneration capability

### Task 1.6.3: Implement seller QA service
- **Hours**: 6
- **Dependencies**: 1.5.3
- **Acceptance Criteria**:
  - [ ] validateProductSubmission() runs all checks
  - [ ] Blockers prevent listing
  - [ ] Warnings allow listing with flags
  - [ ] Seller scores recalculated
```

### 7.3 Updated Timeline

```
Original: 16 weeks (Phases 1-4)
Extended: 18 weeks (+2 weeks for normalization + vectors)

Week 1-4:   Phase 1 Foundation (original)
Week 5-6:   Phase 1 Extended (normalization, vectors, seller QA)  ← NEW
Week 7-10:  Phase 2 Intelligence (original + retrieval pipeline)
Week 11-14: Phase 3 Observability (original)
Week 15-18: Phase 4 Migration (original)
```

---

## 8. 90-Day Build Order (Recommended Sequence)

Based on the analysis, here's the optimal build sequence:

### Month 1: Foundation
1. ✅ Constraint relations (Sprint 1.1) - *Already planned*
2. ✅ Feedback tables (Sprint 1.2) - *Already planned*
3. 🆕 Ingredient normalization pipeline (Sprint 1.5-1.6)
4. 🆕 Seller ingestion QA flags (Sprint 1.6)

### Month 2: Intelligence
5. ✅ Explanation service (Sprint 2.1) - *Already planned*
6. 🆕 Product search vectors + basic hybrid retrieval (Sprint 2.1-2.2)
7. ✅ User constraints → hard filtering (Sprint 2.2) - *Already planned*
8. ✅ Post-purchase outcome collection (Sprint 2.3) - *Already planned*

### Month 3: Similarity & Polish
9. 🆕 Formula-based similarity vectors (Sprint 2.4)
10. 🆕 "Similar products" shelf using formula vectors
11. ✅ Adverse outcome guardrails (Sprint 2.3) - *Already planned*
12. ✅ Segment metrics dashboard (Sprint 3.1) - *Already planned*

---

## 9. Decision Required

**Option A: Full Integration (+2 weeks)**
- Add all 6 new components
- 18-week timeline
- Most comprehensive solution

**Option B: Essential Integration (+1 week)**
- Add ingredient normalization + seller QA only
- Skip multi-vector (keep single tensor)
- 17-week timeline

**Option C: Defer to Phase 5**
- Complete original 16-week plan first
- Add product-first features as separate initiative
- Lower risk but delayed marketplace benefits

---

## Appendix A: Example Queries

### Cypher: Fragrance-free moisturizers under $25 shipping to IL

```cypher
MATCH (p:Product)-[:IN_CATEGORY]->(:Category {name: 'moisturizer'})
MATCH (p)-[:HAS_TAG]->(:ClaimTag {name: 'fragrance-free'})
MATCH (p)-[:HAS_VARIANT]->(sku:SKU)
MATCH (seller:Seller)-[:LISTS]->(offer:InventoryOffer)-[:FOR_SKU]->(sku)
MATCH (offer)-[:SHIPS_TO]->(:Region {code: 'IL'})
WHERE offer.price <= 25.00 AND offer.in_stock = true
OPTIONAL MATCH (sku)-[:CONTAINS]->(ing:Ingredient)-[:MAY_IRRITATE]->(:Sensitivity {name: 'sensitive'})
WITH p, sku, offer, seller, COUNT(ing) AS irritant_count
ORDER BY irritant_count ASC, offer.price ASC
RETURN p.name, sku.id, offer.price, seller.name, irritant_count
LIMIT 20
```

### SQL: Seller quality dashboard

```sql
SELECT 
    s.name AS seller_name,
    sq.ingredient_completeness,
    sq.claim_accuracy,
    sq.data_consistency,
    sq.overall_score,
    COUNT(di.id) FILTER (WHERE di.status = 'open') AS open_issues
FROM sellers s
JOIN seller_quality_scores sq ON s.id = sq.seller_id
LEFT JOIN seller_data_issues di ON s.id = di.seller_id
GROUP BY s.id, s.name, sq.ingredient_completeness, 
         sq.claim_accuracy, sq.data_consistency, sq.overall_score
ORDER BY sq.overall_score DESC;
```

---

**Prepared by**: Claude (AI Development Assistant)  
**Review required by**: Jesse Garza  
**Integration with**: 010-ska-mach-evolution SPECKIT
