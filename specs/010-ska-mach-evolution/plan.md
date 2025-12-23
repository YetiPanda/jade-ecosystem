# Implementation Plan: JADE SKA MACH Evolution

**Feature ID**: 010
**Version**: 1.0.0
**Status**: PENDING APPROVAL
**Timeline**: 16 weeks (4 phases)
**Approach**: Phased Evolution (Option A)

---

## Overview

This plan implements the Five Rings gap analysis recommendations while preparing for MACH Composable architecture on AWS. The approach follows the principle: **"Validate patterns in POC, then migrate proven designs."**

### Planning Metaphor
Think of this like renovating a house while living in it. Phase 1-2 adds new rooms (feedback loops, explanation service) to the existing structure. Phase 3 prepares the architectural blueprints for the new house. Phase 4 begins the move.

---

## Phase 1: Foundation Enhancement (Weeks 1-4)

### Objective
Close critical gaps identified in Five Rings analysis without disrupting current POC functionality.

### Week 1-2: Constraint Relations Implementation

#### 1.1 Database Schema (Week 1)

**Files to Create/Modify**:
```
apps/vendure-backend/
├── src/
│   ├── migrations/
│   │   └── 1734530400000-AddConstraintRelations.ts
│   └── plugins/
│       └── jade-intelligence/
│           └── entities/
│               └── constraint-relation.entity.ts
```

**Tasks**:
- [ ] Create `ConstraintRelation` entity with TypeORM
- [ ] Add relationship types enum: `INCOMPATIBLE_WITH`, `CONTRAINDICATED_FOR`, `REQUIRES_BUFFER`, `ENHANCES_RISK_OF`, `CANCELS_EFFICACY_OF`
- [ ] Add severity levels: `CRITICAL`, `WARNING`, `CAUTION`
- [ ] Create migration script
- [ ] Add Zod validation schemas
- [ ] Write unit tests (100% coverage for constraint logic)

**Acceptance Criteria**:
- [ ] Migration runs without errors
- [ ] TypeScript types generated
- [ ] API can CRUD constraint relations
- [ ] Validation rejects invalid severity/type combinations

#### 1.2 GraphQL Schema Extension (Week 2)

**Files to Modify**:
```
contracts/
└── intelligence.graphql  (add ConstraintRelation types)

apps/vendure-backend/
└── src/plugins/jade-intelligence/
    ├── api/
    │   └── constraint.resolver.ts
    └── services/
        └── constraint.service.ts
```

**Tasks**:
- [ ] Define `ConstraintRelation` GraphQL type
- [ ] Add `constraintsBetween(atomIds: [ID!]!)` query
- [ ] Add `checkCompatibilityWithConstraints` query
- [ ] Add `createConstraintRelation` mutation (admin only)
- [ ] Implement resolver with caching
- [ ] Write integration tests

**Acceptance Criteria**:
- [ ] GraphQL schema validates
- [ ] Queries return correct constraints
- [ ] Performance < 100ms for constraint checks
- [ ] Admin-only mutations enforced

### Week 3-4: Feedback Loop Infrastructure

#### 1.3 Event Tables (Week 3)

**Files to Create**:
```
apps/vendure-backend/
├── src/
│   ├── migrations/
│   │   ├── 1734617600000-AddInteractionEvents.ts
│   │   ├── 1734617601000-AddOutcomeEvents.ts
│   │   └── 1734617602000-AddDataCorrections.ts
│   └── plugins/
│       └── jade-feedback/
│           ├── entities/
│           │   ├── interaction-event.entity.ts
│           │   ├── outcome-event.entity.ts
│           │   └── data-correction.entity.ts
│           └── index.ts
```

**Tasks**:
- [ ] Create `jade-feedback` plugin structure
- [ ] Implement `InteractionEvent` entity with partitioning strategy
- [ ] Implement `OutcomeEvent` entity
- [ ] Implement `DataCorrection` entity
- [ ] Add foreign key relationships
- [ ] Create database indexes for analytics queries
- [ ] Write migration scripts

**Acceptance Criteria**:
- [ ] Tables created with correct schema
- [ ] Indexes optimize common query patterns
- [ ] Partitioning enabled for interaction_events

#### 1.4 Feedback GraphQL API (Week 4)

**Files to Create/Modify**:
```
contracts/
└── feedback.graphql  (NEW)

apps/vendure-backend/
└── src/plugins/jade-feedback/
    ├── api/
    │   └── feedback.resolver.ts
    └── services/
        ├── interaction.service.ts
        ├── outcome.service.ts
        └── correction.service.ts
```

**Tasks**:
- [ ] Define `feedback.graphql` contract
- [ ] Implement `trackInteraction` mutation (high-volume, async)
- [ ] Implement `reportOutcome` mutation
- [ ] Implement `submitCorrection` mutation (curator-only)
- [ ] Add rate limiting for interaction tracking
- [ ] Implement batch insertion for performance
- [ ] Write load tests

**Acceptance Criteria**:
- [ ] GraphQL schema validates
- [ ] Interaction tracking handles 1000 req/sec
- [ ] Outcome submission validates skin type/concern enums
- [ ] Correction requires curator role
- [ ] All mutations return within 100ms

---

## Phase 2: Intelligence Enhancement (Weeks 5-8)

### Objective
Build explanation generation and multi-signal ranking to close Fire (execution) gaps.

### Week 5-6: Explanation Generation Service

#### 2.1 Explanation Service Core (Week 5)

**Files to Create**:
```
apps/vendure-backend/
└── src/plugins/jade-intelligence/
    └── services/
        └── explanation.service.ts

packages/shared-types/
└── src/
    └── explanation.types.ts
```

**Tasks**:
- [ ] Define `ExplanationPath` and `ExplanationStep` interfaces
- [ ] Implement `generateExplanation(atomId, userProfile)` method
- [ ] Build graph traversal for causal chains
- [ ] Create natural language templates for relationship verbs
- [ ] Add source citation attachment
- [ ] Implement confidence scoring for explanations
- [ ] Write comprehensive unit tests

**Acceptance Criteria**:
- [ ] Service generates readable explanations
- [ ] Explanations cite scientific sources
- [ ] Performance < 500ms for depth-5 chains
- [ ] 95%+ unit test coverage

#### 2.2 Explanation GraphQL Integration (Week 6)

**Files to Modify**:
```
contracts/
└── intelligence.graphql

apps/vendure-backend/
└── src/plugins/jade-intelligence/
    └── api/
        └── explanation.resolver.ts
```

**Tasks**:
- [ ] Add `ExplanationPath` type to GraphQL schema
- [ ] Add `explainRecommendation(productId, userProfile)` query
- [ ] Add `explainIngredient(atomId, concernId)` query
- [ ] Implement resolver with caching (5 min TTL)
- [ ] Add explanation to `ProfileMatch` response type
- [ ] Write E2E tests

**Acceptance Criteria**:
- [ ] Queries return structured explanations
- [ ] Frontend can render explanation paths
- [ ] Cache reduces duplicate computations
- [ ] Explanations appear in search results

### Week 7-8: Multi-Signal Ranker

#### 2.3 Ranking Signal Collection (Week 7)

**Files to Create/Modify**:
```
apps/vendure-backend/
└── src/plugins/jade-intelligence/
    └── services/
        ├── ranking/
        │   ├── signal-collector.service.ts
        │   ├── behavioral-signals.service.ts
        │   └── contextual-signals.service.ts
        └── tensor-similarity.service.ts  (modify)
```

**Tasks**:
- [ ] Create `SignalCollector` service
- [ ] Implement behavioral signal aggregation from feedback tables
- [ ] Implement contextual signal computation (skin type match, etc.)
- [ ] Integrate with existing tensor similarity
- [ ] Add exploration bonus (multi-armed bandit) calculation
- [ ] Create signal weighting configuration
- [ ] Write unit tests with mock data

**Acceptance Criteria**:
- [ ] All signal types computed correctly
- [ ] Signals normalized to 0-1 range
- [ ] Configuration allows weight adjustment
- [ ] Performance < 50ms per signal set

#### 2.4 Learned Ranker Integration (Week 8)

**Files to Create/Modify**:
```
apps/vendure-backend/
└── src/plugins/jade-intelligence/
    └── services/
        ├── ranking/
        │   └── learned-ranker.service.ts
        └── search.service.ts  (modify)
```

**Tasks**:
- [ ] Implement `LearnedRanker` service
- [ ] Create weighted combination formula
- [ ] Integrate constraint violations as negative signals
- [ ] Modify search service to use multi-signal ranking
- [ ] Add A/B test flag for ranker comparison
- [ ] Implement ranking explanation (which signals contributed)
- [ ] Write integration tests

**Acceptance Criteria**:
- [ ] Search results use multi-signal ranking
- [ ] A/B test compares old vs new ranker
- [ ] Ranking explanations available in debug mode
- [ ] No regression in search latency

---

## Phase 3: Observability & Contracts (Weeks 9-12)

### Objective
Implement segment-level metrics and prepare service contracts for MACH migration.

### Week 9-10: Segment-Level Observability

#### 3.1 Metrics Infrastructure (Week 9)

**Files to Create**:
```
apps/vendure-backend/
└── src/plugins/jade-analytics/
    ├── entities/
    │   └── segment-metric.entity.ts
    ├── services/
    │   ├── segment-metrics.service.ts
    │   └── calibration.service.ts
    └── index.ts

infrastructure/
└── monitoring/
    └── intelligence-metrics.yaml
```

**Tasks**:
- [ ] Create `jade-analytics` plugin
- [ ] Define segment dimensions (skin_type, concern, experience)
- [ ] Implement metric aggregation by segment
- [ ] Create calibration tracking (confidence vs outcomes)
- [ ] Add Prometheus custom metrics export
- [ ] Configure alert thresholds per segment
- [ ] Write dashboards (Grafana JSON)

**Acceptance Criteria**:
- [ ] Metrics computed per segment
- [ ] Prometheus scrape endpoint works
- [ ] Alerts fire on threshold breach
- [ ] Dashboard shows segment breakdowns

#### 3.2 Data Quality Metrics (Week 10)

**Files to Create/Modify**:
```
apps/vendure-backend/
└── src/plugins/jade-analytics/
    └── services/
        ├── data-quality.service.ts
        └── tensor-coverage.service.ts
```

**Tasks**:
- [ ] Implement ingredient completeness metric
- [ ] Implement tensor coverage metric
- [ ] Create vendor consistency scoring
- [ ] Add stale content detection (last_updated thresholds)
- [ ] Build data quality dashboard
- [ ] Create automated quality reports

**Acceptance Criteria**:
- [ ] Quality metrics computed daily
- [ ] Dashboard shows data health
- [ ] Alerts on quality degradation
- [ ] Reports sent to stakeholders

### Week 11-12: Service Contract Finalization

#### 3.3 Contract Documentation (Week 11)

**Files to Create/Modify**:
```
contracts/
├── intelligence.graphql  (finalize)
├── marketplace.graphql   (finalize)
├── vendor.graphql        (finalize)
├── feedback.graphql      (finalize)
├── analytics.graphql     (NEW)
└── README.md             (contract usage guide)

docs/
└── architecture/
    ├── service-boundaries.md
    └── event-catalog.md
```

**Tasks**:
- [ ] Audit all GraphQL contracts for completeness
- [ ] Add operation descriptions and examples
- [ ] Define event types for EventBridge
- [ ] Document service boundaries
- [ ] Create API versioning strategy
- [ ] Write contract testing suite

**Acceptance Criteria**:
- [ ] All contracts have complete documentation
- [ ] Event catalog covers all cross-service events
- [ ] Boundary document approved by team
- [ ] Contract tests pass

#### 3.4 Migration Preparation (Week 12)

**Files to Create**:
```
infrastructure/
└── aws/
    ├── terraform/
    │   ├── main.tf
    │   ├── variables.tf
    │   ├── modules/
    │   │   ├── intelligence-service/
    │   │   ├── commerce-service/
    │   │   └── feedback-service/
    │   └── environments/
    │       ├── dev.tfvars
    │       └── staging.tfvars
    └── cdk/  (alternative)
        └── ...
```

**Tasks**:
- [ ] Create Terraform module structure
- [ ] Define IAM roles and policies
- [ ] Configure VPC and networking
- [ ] Set up Aurora PostgreSQL
- [ ] Configure Neptune cluster
- [ ] Set up OpenSearch domain
- [ ] Create EventBridge bus
- [ ] Document manual migration steps

**Acceptance Criteria**:
- [ ] Terraform plan succeeds
- [ ] Dev environment deployable
- [ ] Cost estimate within budget
- [ ] Migration runbook complete

---

## Phase 4: MACH Migration Begin (Weeks 13-16)

### Objective
Begin extracting services from POC to AWS while maintaining POC stability.

### Week 13-14: Intelligence Service Extraction

#### 4.1 Service Scaffolding (Week 13)

**New Repository**: `jade-intelligence-service`

```
jade-intelligence-service/
├── src/
│   ├── graphql/
│   │   ├── schema.graphql
│   │   └── resolvers/
│   ├── services/
│   │   ├── ska/
│   │   ├── explanation/
│   │   └── ranking/
│   ├── data/
│   │   ├── neptune/
│   │   └── opensearch/
│   └── index.ts
├── test/
├── Dockerfile
├── package.json
└── README.md
```

**Tasks**:
- [ ] Create new repository from template
- [ ] Extract intelligence plugin code
- [ ] Adapt for standalone service
- [ ] Configure Neptune client
- [ ] Configure OpenSearch client
- [ ] Set up health checks
- [ ] Write Dockerfile

**Acceptance Criteria**:
- [ ] Service runs standalone
- [ ] GraphQL schema matches contract
- [ ] Connects to AWS data stores
- [ ] Health endpoint returns 200

#### 4.2 Parallel Running (Week 14)

**Tasks**:
- [ ] Deploy Intelligence Service to ECS Fargate (dev)
- [ ] Configure API Gateway routes
- [ ] Set up feature flag for service selection
- [ ] Implement request mirroring (POC + new service)
- [ ] Compare response consistency
- [ ] Monitor latency and errors
- [ ] Document discrepancies

**Acceptance Criteria**:
- [ ] Both services return same results
- [ ] Latency within 10% of POC
- [ ] Error rate < 0.1%
- [ ] Feature flag switches cleanly

### Week 15-16: Feedback Service Extraction

#### 4.3 Feedback Service Deployment (Week 15)

**New Repository**: `jade-feedback-service`

**Tasks**:
- [ ] Create Feedback Service repository
- [ ] Extract feedback plugin code
- [ ] Configure Kinesis Firehose integration
- [ ] Set up Lambda for event processing
- [ ] Implement EventBridge event emission
- [ ] Deploy to AWS (dev)

**Acceptance Criteria**:
- [ ] Service handles event ingestion
- [ ] Events flow to analytics pipeline
- [ ] Lambda processes corrections
- [ ] EventBridge events fire correctly

#### 4.4 Integration Testing (Week 16)

**Tasks**:
- [ ] End-to-end test: Search → Interaction → Outcome → Ranking update
- [ ] Load testing: 10,000 interactions/minute
- [ ] Chaos testing: Service failure scenarios
- [ ] Security audit: IAM permissions, network access
- [ ] Documentation: Runbook, troubleshooting guide
- [ ] Stakeholder demo

**Acceptance Criteria**:
- [ ] E2E tests pass
- [ ] Load test meets targets
- [ ] Recovery from failures < 5 minutes
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Demo approved

---

## Resource Requirements

### Team Allocation

| Role | Phase 1-2 | Phase 3-4 |
|------|-----------|-----------|
| Backend Developer | 1.5 FTE | 2 FTE |
| DevOps/Platform | 0.5 FTE | 1 FTE |
| QA Engineer | 0.5 FTE | 0.5 FTE |
| Product Owner | 0.25 FTE | 0.25 FTE |

### Infrastructure Costs (Estimated)

| Service | Dev Environment | Staging | Production (Est.) |
|---------|-----------------|---------|-------------------|
| Aurora PostgreSQL | $50/month | $150/month | $500/month |
| Neptune | $100/month | $300/month | $1,000/month |
| OpenSearch | $75/month | $200/month | $800/month |
| ECS Fargate | $100/month | $300/month | $1,500/month |
| **Total** | **$325/month** | **$950/month** | **$3,800/month** |

---

## Dependencies

### External Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| AWS Account setup | DevOps | Pending | Low |
| Neptune cluster | AWS | Available | Low |
| OpenSearch domain | AWS | Available | Low |
| Domain routing | DevOps | Pending | Medium |

### Internal Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| POC stability | Backend | ✅ Stable | Low |
| GraphQL contracts | Backend | In progress | Low |
| Design system | Frontend | ✅ Ready | Low |
| Test data | QA | Pending | Medium |

---

## Rollback Strategy

### Phase 1-2 Rollback
- Revert database migrations
- Remove plugin code
- No external dependencies affected

### Phase 3-4 Rollback
- Feature flag to POC services
- DNS rollback to original endpoints
- AWS resources can be destroyed safely

---

## Success Criteria (End of Phase 4)

### Technical

- [ ] Intelligence Service running on AWS
- [ ] Feedback loop collecting data
- [ ] Explanation generation operational
- [ ] Multi-signal ranking active
- [ ] Segment metrics in dashboard
- [ ] All contracts documented

### Business

- [ ] No degradation in user experience
- [ ] Recommendation quality measurable
- [ ] Foundation for ML improvements
- [ ] Path to production clear

---

## Next Steps After Phase 4

### Phase 5 (Future): Production Migration
- Commerce Service extraction
- Vendor Service extraction
- Full traffic migration
- POC decommissioning

### Phase 6 (Future): ML Enhancement
- Train ranking model on collected feedback
- Implement personalization
- A/B testing framework
- Continuous learning pipeline

---

**Prepared by**: Claude AI Development Assistant
**Review required by**: Jesse Garza
**Approval deadline**: December 22, 2025
