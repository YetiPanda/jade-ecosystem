# Tasks: JADE SKA MACH Evolution

**Feature ID**: 010  
**Version**: 1.1.0 (with Addendum 010-A: Product-First Integration)  
**Total Tasks**: 102  
**Estimated Hours**: 720 hours (18 weeks × 40 hours)  
**Approved**: December 19, 2025 - Option A: Full Integration

---

## Task Tracking Legend

- 🔴 **Not Started** - Task pending
- 🟡 **In Progress** - Currently being worked on
- 🟢 **Complete** - Task finished and verified
- ⏸️ **Blocked** - Waiting on dependency
- 🔵 **Under Review** - Awaiting code review

---

## Phase 1: Foundation Enhancement (Weeks 1-6)

### Sprint 1.1: Constraint Relations Database (Week 1)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 1.1.1 | Create `ConstraintRelation` TypeORM entity | Backend | 4 | 🔴 | - |
| 1.1.2 | Define `ConstraintType` enum with 5 relationship types | Backend | 2 | 🔴 | - |
| 1.1.3 | Define `Severity` enum (CRITICAL, WARNING, CAUTION) | Backend | 1 | 🔴 | - |
| 1.1.4 | Add `condition` field for conditional constraints | Backend | 2 | 🔴 | 1.1.1 |
| 1.1.5 | Add `scientific_basis` required field with validation | Backend | 2 | 🔴 | 1.1.1 |
| 1.1.6 | Create migration `1734530400000-AddConstraintRelations.ts` | Backend | 3 | 🔴 | 1.1.1-1.1.5 |
| 1.1.7 | Add Zod schema for constraint validation | Backend | 2 | 🔴 | 1.1.2, 1.1.3 |
| 1.1.8 | Write unit tests for constraint entity (target: 100%) | QA | 4 | 🔴 | 1.1.1-1.1.5 |
| 1.1.9 | Run migration on local development database | Backend | 1 | 🔴 | 1.1.6 |
| 1.1.10 | Verify TypeScript types generate correctly | Backend | 1 | 🔴 | 1.1.9 |

**Sprint 1.1 Subtotal**: 22 hours

### Sprint 1.2: Constraint GraphQL API (Week 2)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 1.2.1 | Add `ConstraintRelation` type to `intelligence.graphql` | Backend | 2 | 🔴 | 1.1.1 |
| 1.2.2 | Add `ConstraintType` and `Severity` enums to schema | Backend | 1 | 🔴 | 1.1.2, 1.1.3 |
| 1.2.3 | Create `constraint.service.ts` with CRUD operations | Backend | 6 | 🔴 | 1.1.1 |
| 1.2.4 | Implement `constraintsBetween(atomIds: [ID!]!)` query | Backend | 4 | 🔴 | 1.2.3 |
| 1.2.5 | Implement `checkCompatibilityWithConstraints` query | Backend | 6 | 🔴 | 1.2.3 |
| 1.2.6 | Create `constraint.resolver.ts` | Backend | 4 | 🔴 | 1.2.4, 1.2.5 |
| 1.2.7 | Add `createConstraintRelation` mutation (admin-only) | Backend | 3 | 🔴 | 1.2.3 |
| 1.2.8 | Implement Redis caching for constraint queries (5 min TTL) | Backend | 4 | 🔴 | 1.2.4 |
| 1.2.9 | Write integration tests for constraint API | QA | 6 | 🔴 | 1.2.4-1.2.7 |
| 1.2.10 | Performance test: constraint check < 100ms | QA | 2 | 🔴 | 1.2.9 |
| 1.2.11 | Update GraphQL codegen configuration | Backend | 1 | 🔴 | 1.2.1, 1.2.2 |
| 1.2.12 | Generate and commit TypeScript types | Backend | 1 | 🔴 | 1.2.11 |

**Sprint 1.2 Subtotal**: 40 hours

### Sprint 1.3: Feedback Event Tables (Week 3)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 1.3.1 | Create `jade-feedback` plugin directory structure | Backend | 2 | 🔴 | - |
| 1.3.2 | Create `InteractionEvent` entity with fields | Backend | 4 | 🔴 | 1.3.1 |
| 1.3.3 | Add partitioning strategy for interaction_events (by month) | Backend | 3 | 🔴 | 1.3.2 |
| 1.3.4 | Create `OutcomeEvent` entity with skin type/concerns | Backend | 4 | 🔴 | 1.3.1 |
| 1.3.5 | Add check constraint for rating (1-5) | Backend | 1 | 🔴 | 1.3.4 |
| 1.3.6 | Create `DataCorrection` entity with before/after JSONB | Backend | 4 | 🔴 | 1.3.1 |
| 1.3.7 | Add curator_role validation | Backend | 2 | 🔴 | 1.3.6 |
| 1.3.8 | Create migration `1734617600000-AddInteractionEvents.ts` | Backend | 2 | 🔴 | 1.3.2 |
| 1.3.9 | Create migration `1734617601000-AddOutcomeEvents.ts` | Backend | 2 | 🔴 | 1.3.4 |
| 1.3.10 | Create migration `1734617602000-AddDataCorrections.ts` | Backend | 2 | 🔴 | 1.3.6 |
| 1.3.11 | Add database indexes for analytics queries | Backend | 3 | 🔴 | 1.3.8-1.3.10 |
| 1.3.12 | Create foreign key relationships | Backend | 2 | 🔴 | 1.3.2, 1.3.4, 1.3.6 |
| 1.3.13 | Write unit tests for feedback entities | QA | 4 | 🔴 | 1.3.2, 1.3.4, 1.3.6 |
| 1.3.14 | Run migrations on development database | Backend | 1 | 🔴 | 1.3.8-1.3.10 |

**Sprint 1.3 Subtotal**: 36 hours

### Sprint 1.4: Feedback GraphQL API (Week 4)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 1.4.1 | Create `contracts/feedback.graphql` schema file | Backend | 3 | 🔴 | 1.3.2, 1.3.4, 1.3.6 |
| 1.4.2 | Define `InteractionEvent` GraphQL type | Backend | 1 | 🔴 | 1.4.1 |
| 1.4.3 | Define `OutcomeEvent` GraphQL type with enums | Backend | 2 | 🔴 | 1.4.1 |
| 1.4.4 | Define `DataCorrection` GraphQL type | Backend | 1 | 🔴 | 1.4.1 |
| 1.4.5 | Create `interaction.service.ts` | Backend | 4 | 🔴 | 1.3.2 |
| 1.4.6 | Implement batch insertion for interactions (performance) | Backend | 4 | 🔴 | 1.4.5 |
| 1.4.7 | Add rate limiting: 100 interactions/sec/session | Backend | 3 | 🔴 | 1.4.5 |
| 1.4.8 | Create `outcome.service.ts` | Backend | 4 | 🔴 | 1.3.4 |
| 1.4.9 | Create `correction.service.ts` | Backend | 4 | 🔴 | 1.3.6 |
| 1.4.10 | Implement `trackInteraction` mutation (async) | Backend | 3 | 🔴 | 1.4.5 |
| 1.4.11 | Implement `reportOutcome` mutation | Backend | 3 | 🔴 | 1.4.8 |
| 1.4.12 | Implement `submitCorrection` mutation (curator-only) | Backend | 3 | 🔴 | 1.4.9 |
| 1.4.13 | Create `feedback.resolver.ts` | Backend | 4 | 🔴 | 1.4.10-1.4.12 |
| 1.4.14 | Write integration tests for feedback API | QA | 6 | 🔴 | 1.4.10-1.4.12 |
| 1.4.15 | Load test: 1000 req/sec for interactions | QA | 4 | 🔴 | 1.4.10 |
| 1.4.16 | Generate and commit feedback types | Backend | 1 | 🔴 | 1.4.1-1.4.4 |

**Sprint 1.4 Subtotal**: 50 hours

### Sprint 1.5: Ingredient Normalization Database (Week 5) — NEW (Addendum 010-A)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 1.5.1 | Create `ingredients` table with canonical names | Backend | 3 | 🔴 | - |
| 1.5.2 | Add `ingredient_class` enum (humectant, surfactant, etc.) | Backend | 2 | 🔴 | 1.5.1 |
| 1.5.3 | Create `ingredient_aliases` table with confidence scores | Backend | 3 | 🔴 | 1.5.1 |
| 1.5.4 | Create `sku_ingredients` junction table with position | Backend | 3 | 🔴 | 1.5.1 |
| 1.5.5 | Create `product_vectors` table with search_vector column | Backend | 2 | 🔴 | - |
| 1.5.6 | Create `sku_vectors` table with formula_vector column | Backend | 2 | 🔴 | 1.5.4 |
| 1.5.7 | Create `ingredient_vectors` table | Backend | 2 | 🔴 | 1.5.1 |
| 1.5.8 | Add HNSW indexes for vector similarity search | Backend | 3 | 🔴 | 1.5.5-1.5.7 |
| 1.5.9 | Create `seller_data_issues` table | Backend | 3 | 🔴 | - |
| 1.5.10 | Create `seller_quality_scores` table with computed fields | Backend | 3 | 🔴 | 1.5.9 |
| 1.5.11 | Create migration `1734700000000-AddIngredientNormalization.ts` | Backend | 3 | 🔴 | 1.5.1-1.5.4 |
| 1.5.12 | Create migration `1734700001000-AddVectorTables.ts` | Backend | 2 | 🔴 | 1.5.5-1.5.8 |
| 1.5.13 | Create migration `1734700002000-AddSellerQATables.ts` | Backend | 2 | 🔴 | 1.5.9-1.5.10 |
| 1.5.14 | Write unit tests for ingredient entities | QA | 4 | 🔴 | 1.5.1-1.5.4 |
| 1.5.15 | Run migrations on development database | Backend | 1 | 🔴 | 1.5.11-1.5.13 |

**Sprint 1.5 Subtotal**: 38 hours

### Sprint 1.6: Normalization & QA Services (Week 6) — NEW (Addendum 010-A)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 1.6.1 | Create `ingredient-normalizer.service.ts` | Backend | 4 | 🔴 | 1.5.1 |
| 1.6.2 | Implement `parseInciList()` for common INCI formats | Backend | 4 | 🔴 | 1.6.1 |
| 1.6.3 | Implement `resolveAlias()` with confidence thresholds | Backend | 3 | 🔴 | 1.6.1, 1.5.3 |
| 1.6.4 | Implement `flagUnknownIngredient()` for curator review | Backend | 2 | 🔴 | 1.6.1 |
| 1.6.5 | Create `vector-generator.service.ts` | Backend | 4 | 🔴 | 1.5.5-1.5.7 |
| 1.6.6 | Implement `generateSearchVector()` from product fields | Backend | 3 | 🔴 | 1.6.5 |
| 1.6.7 | Implement `generateFormulaVector()` from ingredients | Backend | 4 | 🔴 | 1.6.5, 1.5.4 |
| 1.6.8 | Implement `generateIngredientVector()` | Backend | 2 | 🔴 | 1.6.5 |
| 1.6.9 | Create `seller-qa.service.ts` | Backend | 4 | 🔴 | 1.5.9 |
| 1.6.10 | Implement `checkIngredientListPresent()` | Backend | 2 | 🔴 | 1.6.9 |
| 1.6.11 | Implement `checkClaimConsistency()` (fragrance-free vs parfum) | Backend | 3 | 🔴 | 1.6.9 |
| 1.6.12 | Implement `checkVariantConsistency()` | Backend | 2 | 🔴 | 1.6.9 |
| 1.6.13 | Implement `recalculateSellerScore()` | Backend | 3 | 🔴 | 1.6.9, 1.5.10 |
| 1.6.14 | Write integration tests for normalizer | QA | 4 | 🔴 | 1.6.1-1.6.4 |
| 1.6.15 | Write integration tests for seller QA | QA | 4 | 🔴 | 1.6.9-1.6.13 |
| 1.6.16 | Performance test: vector generation < 100ms per product | QA | 2 | 🔴 | 1.6.5-1.6.8 |

**Sprint 1.6 Subtotal**: 50 hours

---

## Phase 2: Intelligence Enhancement (Weeks 7-10)

### Sprint 2.1: Explanation Service Core (Week 7)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 2.1.1 | Define `ExplanationPath` interface in shared-types | Backend | 2 | 🔴 | - |
| 2.1.2 | Define `ExplanationStep` interface | Backend | 2 | 🔴 | 2.1.1 |
| 2.1.3 | Create `explanation.service.ts` file structure | Backend | 2 | 🔴 | - |
| 2.1.4 | Implement graph traversal for causal chains | Backend | 8 | 🔴 | 2.1.3 |
| 2.1.5 | Create relationship verb mapping (CAUSES → "leads to") | Backend | 3 | 🔴 | 2.1.3 |
| 2.1.6 | Implement `generateExplanation(atomId, userProfile)` | Backend | 8 | 🔴 | 2.1.4, 2.1.5 |
| 2.1.7 | Add source citation attachment to explanations | Backend | 4 | 🔴 | 2.1.6 |
| 2.1.8 | Implement explanation confidence scoring | Backend | 4 | 🔴 | 2.1.6 |
| 2.1.9 | Write unit tests (target: 95% coverage) | QA | 6 | 🔴 | 2.1.6 |
| 2.1.10 | Performance test: < 500ms for depth-5 chains | QA | 2 | 🔴 | 2.1.6 |

**Sprint 2.1 Subtotal**: 41 hours

### Sprint 2.2: Explanation GraphQL Integration (Week 8)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 2.2.1 | Add `ExplanationPath` type to `intelligence.graphql` | Backend | 2 | 🔴 | 2.1.1 |
| 2.2.2 | Add `ExplanationStep` type | Backend | 1 | 🔴 | 2.1.2 |
| 2.2.3 | Add `explainRecommendation(productId, userProfile)` query | Backend | 4 | 🔴 | 2.1.6 |
| 2.2.4 | Add `explainIngredient(atomId, concernId)` query | Backend | 4 | 🔴 | 2.1.6 |
| 2.2.5 | Create `explanation.resolver.ts` | Backend | 4 | 🔴 | 2.2.3, 2.2.4 |
| 2.2.6 | Implement Redis caching (5 min TTL) | Backend | 3 | 🔴 | 2.2.5 |
| 2.2.7 | Add `explanation` field to `ProfileMatch` type | Backend | 2 | 🔴 | 2.2.1 |
| 2.2.8 | Modify search resolver to include explanations | Backend | 4 | 🔴 | 2.2.7 |
| 2.2.9 | Write E2E tests for explanation queries | QA | 6 | 🔴 | 2.2.3-2.2.5 |
| 2.2.10 | Generate and commit updated types | Backend | 1 | 🔴 | 2.2.1, 2.2.2 |

**Sprint 2.2 Subtotal**: 31 hours

### Sprint 2.3: Ranking Signal Collection (Week 9)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 2.3.1 | Create `ranking/` services directory structure | Backend | 1 | 🔴 | - |
| 2.3.2 | Define `RankingSignals` interface | Backend | 2 | 🔴 | - |
| 2.3.3 | Create `signal-collector.service.ts` | Backend | 4 | 🔴 | 2.3.1 |
| 2.3.4 | Create `behavioral-signals.service.ts` | Backend | 6 | 🔴 | 2.3.1, 1.3.2 |
| 2.3.5 | Implement CTR aggregation from interaction_events | Backend | 4 | 🔴 | 2.3.4 |
| 2.3.6 | Implement conversion rate calculation | Backend | 3 | 🔴 | 2.3.4 |
| 2.3.7 | Implement dwell time normalization | Backend | 2 | 🔴 | 2.3.4 |
| 2.3.8 | Create `contextual-signals.service.ts` | Backend | 4 | 🔴 | 2.3.1 |
| 2.3.9 | Implement skin type match scoring | Backend | 3 | 🔴 | 2.3.8 |
| 2.3.10 | Implement concern alignment scoring | Backend | 3 | 🔴 | 2.3.8 |
| 2.3.11 | Implement exploration bonus (multi-armed bandit) | Backend | 4 | 🔴 | 2.3.3 |
| 2.3.12 | Create signal weighting configuration file | Backend | 2 | 🔴 | 2.3.2 |
| 2.3.13 | Write unit tests with mock feedback data | QA | 6 | 🔴 | 2.3.3-2.3.11 |
| 2.3.14 | Verify signal normalization (0-1 range) | QA | 2 | 🔴 | 2.3.13 |

**Sprint 2.3 Subtotal**: 46 hours

### Sprint 2.4: Learned Ranker Integration (Week 10)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 2.4.1 | Create `learned-ranker.service.ts` | Backend | 4 | 🔴 | 2.3.3 |
| 2.4.2 | Implement weighted combination formula | Backend | 4 | 🔴 | 2.4.1 |
| 2.4.3 | Integrate constraint violations as negative signals | Backend | 3 | 🔴 | 2.4.2, 1.2.5 |
| 2.4.4 | Add A/B test flag configuration | Backend | 3 | 🔴 | - |
| 2.4.5 | Modify `search.service.ts` to use multi-signal ranking | Backend | 6 | 🔴 | 2.4.2 |
| 2.4.6 | Implement ranking explanation (debug mode) | Backend | 4 | 🔴 | 2.4.5 |
| 2.4.7 | Add `rankingDebug` field to search response | Backend | 2 | 🔴 | 2.4.6 |
| 2.4.8 | Write integration tests comparing old vs new ranker | QA | 6 | 🔴 | 2.4.5 |
| 2.4.9 | Performance regression test: search latency | QA | 3 | 🔴 | 2.4.5 |
| 2.4.10 | Document ranking signal weights and tuning | Backend | 2 | 🔴 | 2.4.2 |

**Sprint 2.4 Subtotal**: 37 hours

---

## Phase 3: Observability & Contracts (Weeks 11-14)

### Sprint 3.1: Segment-Level Metrics Infrastructure (Week 11)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 3.1.1 | Create `jade-analytics` plugin directory | Backend | 2 | 🔴 | - |
| 3.1.2 | Define segment dimensions in configuration | Backend | 2 | 🔴 | - |
| 3.1.3 | Create `segment-metrics.service.ts` | Backend | 6 | 🔴 | 3.1.1 |
| 3.1.4 | Implement metric aggregation by skin_type | Backend | 4 | 🔴 | 3.1.3, 1.3.4 |
| 3.1.5 | Implement metric aggregation by concern | Backend | 4 | 🔴 | 3.1.3 |
| 3.1.6 | Implement metric aggregation by experience_level | Backend | 3 | 🔴 | 3.1.3 |
| 3.1.7 | Create `calibration.service.ts` | Backend | 6 | 🔴 | 3.1.1 |
| 3.1.8 | Implement confidence vs outcome tracking | Backend | 4 | 🔴 | 3.1.7 |
| 3.1.9 | Create `intelligence-metrics.yaml` configuration | DevOps | 3 | 🔴 | 3.1.2 |
| 3.1.10 | Add Prometheus custom metrics export | DevOps | 4 | 🔴 | 3.1.3 |
| 3.1.11 | Configure alert thresholds per segment | DevOps | 3 | 🔴 | 3.1.9 |
| 3.1.12 | Create Grafana dashboard JSON | DevOps | 4 | 🔴 | 3.1.10 |
| 3.1.13 | Write tests for metric calculations | QA | 4 | 🔴 | 3.1.3-3.1.8 |

**Sprint 3.1 Subtotal**: 49 hours

### Sprint 3.2: Data Quality Metrics (Week 12)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 3.2.1 | Create `data-quality.service.ts` | Backend | 4 | 🔴 | 3.1.1 |
| 3.2.2 | Implement ingredient completeness metric | Backend | 4 | 🔴 | 3.2.1 |
| 3.2.3 | Create `tensor-coverage.service.ts` | Backend | 4 | 🔴 | 3.1.1 |
| 3.2.4 | Implement 17-D tensor coverage calculation | Backend | 3 | 🔴 | 3.2.3 |
| 3.2.5 | Implement vendor consistency scoring | Backend | 4 | 🔴 | 3.2.1 |
| 3.2.6 | Add stale content detection (last_updated threshold) | Backend | 3 | 🔴 | 3.2.1 |
| 3.2.7 | Create data quality dashboard in Grafana | DevOps | 4 | 🔴 | 3.2.2-3.2.6 |
| 3.2.8 | Configure alerts on quality degradation | DevOps | 2 | 🔴 | 3.2.7 |
| 3.2.9 | Create automated quality report (weekly) | Backend | 4 | 🔴 | 3.2.1-3.2.6 |
| 3.2.10 | Write tests for quality metrics | QA | 4 | 🔴 | 3.2.2-3.2.6 |

**Sprint 3.2 Subtotal**: 36 hours

### Sprint 3.3: Service Contract Finalization (Week 13)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 3.3.1 | Audit `intelligence.graphql` for completeness | Backend | 3 | 🔴 | - |
| 3.3.2 | Audit `marketplace.graphql` for completeness | Backend | 3 | 🔴 | - |
| 3.3.3 | Audit `vendor.graphql` for completeness | Backend | 3 | 🔴 | - |
| 3.3.4 | Audit `feedback.graphql` for completeness | Backend | 2 | 🔴 | 1.4.1 |
| 3.3.5 | Create `analytics.graphql` contract | Backend | 4 | 🔴 | 3.1.3 |
| 3.3.6 | Add operation descriptions to all queries/mutations | Backend | 4 | 🔴 | 3.3.1-3.3.5 |
| 3.3.7 | Add examples to contract documentation | Backend | 3 | 🔴 | 3.3.6 |
| 3.3.8 | Define EventBridge event types catalog | Backend | 4 | 🔴 | - |
| 3.3.9 | Create `docs/architecture/service-boundaries.md` | Backend | 4 | 🔴 | 3.3.1-3.3.5 |
| 3.3.10 | Create `docs/architecture/event-catalog.md` | Backend | 3 | 🔴 | 3.3.8 |
| 3.3.11 | Define API versioning strategy | Backend | 2 | 🔴 | - |
| 3.3.12 | Create contract testing suite | QA | 6 | 🔴 | 3.3.1-3.3.5 |
| 3.3.13 | Create `contracts/README.md` usage guide | Backend | 2 | 🔴 | 3.3.1-3.3.7 |

**Sprint 3.3 Subtotal**: 43 hours

### Sprint 3.4: AWS Migration Preparation (Week 14)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 3.4.1 | Create Terraform module directory structure | DevOps | 3 | 🔴 | - |
| 3.4.2 | Define IAM roles and policies | DevOps | 4 | 🔴 | 3.4.1 |
| 3.4.3 | Configure VPC and networking module | DevOps | 6 | 🔴 | 3.4.1 |
| 3.4.4 | Set up Aurora PostgreSQL module | DevOps | 4 | 🔴 | 3.4.3 |
| 3.4.5 | Configure Neptune cluster module | DevOps | 4 | 🔴 | 3.4.3 |
| 3.4.6 | Set up OpenSearch domain module | DevOps | 4 | 🔴 | 3.4.3 |
| 3.4.7 | Create EventBridge bus configuration | DevOps | 3 | 🔴 | 3.4.1 |
| 3.4.8 | Create ECS Fargate service module | DevOps | 4 | 🔴 | 3.4.3 |
| 3.4.9 | Create Lambda function module | DevOps | 3 | 🔴 | 3.4.1 |
| 3.4.10 | Create `dev.tfvars` environment configuration | DevOps | 2 | 🔴 | 3.4.1-3.4.9 |
| 3.4.11 | Create `staging.tfvars` environment configuration | DevOps | 2 | 🔴 | 3.4.1-3.4.9 |
| 3.4.12 | Test `terraform plan` for dev environment | DevOps | 2 | 🔴 | 3.4.10 |
| 3.4.13 | Estimate AWS costs and document | DevOps | 2 | 🔴 | 3.4.10 |
| 3.4.14 | Create migration runbook document | DevOps | 3 | 🔴 | 3.4.1-3.4.9 |

**Sprint 3.4 Subtotal**: 46 hours

---

## Phase 4: MACH Migration Begin (Weeks 15-18)

### Sprint 4.1: Intelligence Service Scaffolding (Week 15)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 4.1.1 | Create `jade-intelligence-service` repository | DevOps | 1 | 🔴 | - |
| 4.1.2 | Initialize Node.js project with TypeScript | Backend | 2 | 🔴 | 4.1.1 |
| 4.1.3 | Extract intelligence plugin code to new repo | Backend | 8 | 🔴 | 4.1.2 |
| 4.1.4 | Adapt code for standalone service | Backend | 6 | 🔴 | 4.1.3 |
| 4.1.5 | Configure Neptune client adapter | Backend | 4 | 🔴 | 4.1.4, 3.4.5 |
| 4.1.6 | Configure OpenSearch client adapter | Backend | 4 | 🔴 | 4.1.4, 3.4.6 |
| 4.1.7 | Set up Apollo Server (standalone) | Backend | 3 | 🔴 | 4.1.4 |
| 4.1.8 | Create health check endpoint | Backend | 1 | 🔴 | 4.1.7 |
| 4.1.9 | Write Dockerfile for service | DevOps | 2 | 🔴 | 4.1.7 |
| 4.1.10 | Test local Docker build | DevOps | 2 | 🔴 | 4.1.9 |
| 4.1.11 | Write README for new repository | Backend | 2 | 🔴 | 4.1.1-4.1.9 |
| 4.1.12 | Verify GraphQL schema matches contract | QA | 2 | 🔴 | 4.1.7 |

**Sprint 4.1 Subtotal**: 37 hours

### Sprint 4.2: Parallel Running (Week 16)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 4.2.1 | Deploy Intelligence Service to ECS (dev) | DevOps | 4 | 🔴 | 4.1.9, 3.4.8 |
| 4.2.2 | Configure API Gateway route | DevOps | 3 | 🔴 | 4.2.1 |
| 4.2.3 | Set up feature flag for service selection | Backend | 3 | 🔴 | 4.2.2 |
| 4.2.4 | Implement request mirroring to both services | Backend | 6 | 🔴 | 4.2.3 |
| 4.2.5 | Create response comparison tool | Backend | 4 | 🔴 | 4.2.4 |
| 4.2.6 | Run parallel traffic for 24 hours | DevOps | 4 | 🔴 | 4.2.4 |
| 4.2.7 | Analyze response consistency report | QA | 4 | 🔴 | 4.2.5, 4.2.6 |
| 4.2.8 | Monitor latency comparison | DevOps | 2 | 🔴 | 4.2.6 |
| 4.2.9 | Monitor error rate comparison | DevOps | 2 | 🔴 | 4.2.6 |
| 4.2.10 | Document any discrepancies found | Backend | 3 | 🔴 | 4.2.7 |
| 4.2.11 | Fix discrepancies if needed | Backend | 4 | 🔴 | 4.2.10 |
| 4.2.12 | Verify feature flag switch is clean | QA | 2 | 🔴 | 4.2.3 |

**Sprint 4.2 Subtotal**: 41 hours

### Sprint 4.3: Feedback Service Deployment (Week 17)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 4.3.1 | Create `jade-feedback-service` repository | DevOps | 1 | 🔴 | - |
| 4.3.2 | Extract feedback plugin to new repo | Backend | 6 | 🔴 | 4.3.1, 1.4.13 |
| 4.3.3 | Configure Kinesis Firehose integration | DevOps | 4 | 🔴 | 4.3.2 |
| 4.3.4 | Create Lambda for event processing | Backend | 6 | 🔴 | 4.3.2 |
| 4.3.5 | Implement EventBridge event emission | Backend | 4 | 🔴 | 4.3.4, 3.4.7 |
| 4.3.6 | Create event schema validation | Backend | 3 | 🔴 | 4.3.5 |
| 4.3.7 | Write Dockerfile for service | DevOps | 2 | 🔴 | 4.3.2 |
| 4.3.8 | Deploy to ECS (dev) | DevOps | 3 | 🔴 | 4.3.7 |
| 4.3.9 | Configure API Gateway route | DevOps | 2 | 🔴 | 4.3.8 |
| 4.3.10 | Test interaction event ingestion | QA | 3 | 🔴 | 4.3.8 |
| 4.3.11 | Test outcome event processing | QA | 3 | 🔴 | 4.3.8 |
| 4.3.12 | Verify events flow to analytics pipeline | QA | 3 | 🔴 | 4.3.5 |

**Sprint 4.3 Subtotal**: 40 hours

### Sprint 4.4: Integration Testing (Week 18)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| 4.4.1 | Create E2E test: Search → Interaction → Outcome → Ranking | QA | 8 | 🔴 | 4.2.1, 4.3.8 |
| 4.4.2 | Run load test: 10,000 interactions/minute | QA | 4 | 🔴 | 4.3.10 |
| 4.4.3 | Analyze load test results | QA | 3 | 🔴 | 4.4.2 |
| 4.4.4 | Chaos testing: Intelligence Service failure | QA | 4 | 🔴 | 4.2.1 |
| 4.4.5 | Chaos testing: Feedback Service failure | QA | 4 | 🔴 | 4.3.8 |
| 4.4.6 | Document recovery procedures | DevOps | 3 | 🔴 | 4.4.4, 4.4.5 |
| 4.4.7 | Security audit: IAM permissions | DevOps | 4 | 🔴 | 4.2.1, 4.3.8 |
| 4.4.8 | Security audit: Network access | DevOps | 3 | 🔴 | 3.4.3 |
| 4.4.9 | Create operations runbook | DevOps | 4 | 🔴 | 4.4.6 |
| 4.4.10 | Create troubleshooting guide | Backend | 3 | 🔴 | 4.4.1-4.4.5 |
| 4.4.11 | Prepare stakeholder demo | Product | 3 | 🔴 | 4.4.1 |
| 4.4.12 | Conduct stakeholder demo | Product | 2 | 🔴 | 4.4.11 |
| 4.4.13 | Document demo feedback and next steps | Product | 2 | 🔴 | 4.4.12 |

**Sprint 4.4 Subtotal**: 47 hours

---

## Summary

| Phase | Sprints | Total Hours | Primary Focus |
|-------|---------|-------------|---------------|
| Phase 1 | 6 | 236 hours | Foundation (Constraints + Feedback + Normalization + QA) |
| Phase 2 | 4 | 155 hours | Intelligence (Explanations + Ranking) |
| Phase 3 | 4 | 174 hours | Observability + Contracts |
| Phase 4 | 4 | 165 hours | Migration Begin |
| **Total** | **18** | **730 hours** | **Complete Evolution + Product-First** |

---

**Task assignments and progress will be updated weekly during sprint planning.**
