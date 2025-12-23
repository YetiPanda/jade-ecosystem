# Service Architecture Map

**Version**: 1.0.0
**Status**: Target Architecture
**Migration Path**: POC → MACH

---

## Service Decomposition

### POC to MACH Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CURRENT POC (Northflank)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        Vendure Monolith                               │   │
│  │                                                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │   │
│  │  │ Commerce    │ │ Vendor      │ │ Intelligence│ │ (Feedback)  │    │   │
│  │  │ (Core)      │ │ Plugin      │ │ Plugin      │ │ NEW Plugin  │    │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL + Apache AGE + Redis                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                     │
                                     │ EVOLUTION
                                     ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                         TARGET STATE (AWS MACH)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    API Gateway + CloudFront                           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│      ┌──────────────┬───────────────┼───────────────┬──────────────┐        │
│      │              │               │               │              │        │
│      ▼              ▼               ▼               ▼              ▼        │
│  ┌────────┐    ┌────────┐    ┌───────────┐    ┌─────────┐    ┌────────┐   │
│  │Commerce│    │ Vendor │    │Intelligence│   │Feedback │    │Identity│   │
│  │Service │    │Service │    │  Service   │   │ Service │    │Service │   │
│  │        │    │        │    │            │   │         │    │        │   │
│  │ ECS    │    │ ECS    │    │ ECS+Lambda │   │ Lambda  │    │Cognito │   │
│  └───┬────┘    └───┬────┘    └─────┬──────┘   └────┬────┘    └───┬────┘   │
│      │             │               │               │              │        │
│      └─────────────┴───────────────┴───────────────┴──────────────┘        │
│                                    │                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Amazon EventBridge (Event Bus)                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│      ┌─────────────────────────────┼─────────────────────────────┐          │
│      │                             │                             │          │
│      ▼                             ▼                             ▼          │
│  ┌────────────┐            ┌───────────────┐            ┌────────────┐     │
│  │  Aurora    │            │   Neptune     │            │ OpenSearch │     │
│  │ PostgreSQL │            │   (Graph)     │            │  (Vectors) │     │
│  │            │            │               │            │            │     │
│  │ • Commerce │            │ • SKA Atoms   │            │ • 792-D    │     │
│  │ • Users    │            │ • Causal Rels │            │   Semantic │     │
│  │ • Vendors  │            │ • Constraints │            │ • 17-D     │     │
│  │ • Feedback │            │               │            │   Tensor   │     │
│  └────────────┘            └───────────────┘            └────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Service Definitions

### 1. Intelligence Service

**Purpose**: Skincare knowledge graph queries, recommendations, explanations

**Contract**: `contracts/intelligence.graphql`

**Responsibilities**:
- SKA atom search (hybrid 792-D + 17-D)
- Causal chain traversal
- Compatibility checking with constraints
- Explanation generation
- Profile matching and recommendations

**Data Stores**:
- Neptune: Graph data (atoms, relationships, constraints)
- OpenSearch: Vector embeddings
- Redis: Query cache

**Endpoints**:
```graphql
# Queries
skaSearch(query: String!, tensorProfile: TensorInput): [SearchResult!]!
skaAtom(id: ID!): SkincareAtom
skaCausalChain(atomId: ID!, maxDepth: Int): CausalChain
skaCheckCompatibility(atomIds: [ID!]!): CompatibilityReport
explainRecommendation(productId: ID!, userProfile: UserProfileInput): [ExplanationPath!]!

# Mutations (Admin)
createAtom(input: AtomInput!): SkincareAtom!
createConstraintRelation(input: ConstraintInput!): ConstraintRelation!
```

---

### 2. Feedback Service

**Purpose**: Collect interaction events, outcomes, and curator corrections

**Contract**: `contracts/feedback.graphql`

**Responsibilities**:
- Interaction event ingestion (high-volume)
- Outcome reporting (user satisfaction)
- Data correction workflow (curator QA)
- Event emission for analytics

**Data Stores**:
- Aurora: Feedback tables (partitioned)
- Kinesis Firehose: Event streaming to analytics
- EventBridge: Cross-service events

**Endpoints**:
```graphql
# Mutations
trackInteraction(input: InteractionInput!): Boolean!
reportOutcome(input: OutcomeInput!): OutcomeEvent!
submitCorrection(input: CorrectionInput!): DataCorrection!  # Curator only

# Queries (Analytics)
interactionSummary(period: DateRange!): InteractionStats!
outcomeSummary(period: DateRange!, segmentBy: [SegmentDimension!]): OutcomeStats!
```

---

### 3. Commerce Service

**Purpose**: Cart, checkout, orders, payments

**Contract**: `contracts/marketplace.graphql`

**Responsibilities**:
- Shopping cart management
- Checkout flow
- Order processing
- Payment integration
- Product catalog (commerce metadata)

**Data Stores**:
- Aurora: Orders, cart, payment records
- EventBridge: Order events

**Note**: In Phase 4, this remains in Vendure POC. Full extraction in Phase 5.

---

### 4. Vendor Service

**Purpose**: Vendor storefronts, inventory, analytics

**Contract**: `contracts/vendor.graphql`

**Responsibilities**:
- Vendor profile management
- Product listing management
- Inventory tracking
- Vendor analytics dashboard
- Wholesale application workflow

**Data Stores**:
- Aurora: Vendor data, inventory
- S3: Product media

**Note**: In Phase 4, this remains in Vendure POC. Full extraction in Phase 5.

---

### 5. Identity Service

**Purpose**: Authentication, authorization, license verification

**Contract**: `contracts/identity.graphql` (future)

**Responsibilities**:
- User authentication (Cognito)
- Role-based access control
- Professional license verification
- Wholesale approval workflow

**Data Stores**:
- Cognito: User pool
- Aurora: License verification records
- S3: License document storage

---

### 6. Analytics Service

**Purpose**: Metrics aggregation, dashboards, reporting

**Contract**: `contracts/analytics.graphql`

**Responsibilities**:
- Segment-level metrics computation
- Calibration tracking
- Data quality monitoring
- Dashboard data API
- Automated reports

**Data Stores**:
- Redshift/Timestream: Analytics warehouse
- QuickSight: Dashboards
- S3: Report storage

---

## Event Catalog

### Cross-Service Events (EventBridge)

| Event | Producer | Consumers | Purpose |
|-------|----------|-----------|---------|
| `interaction.tracked` | Feedback | Analytics | Update behavioral signals |
| `outcome.reported` | Feedback | Analytics, Intelligence | Update calibration, retrain |
| `correction.approved` | Feedback | Intelligence | Update atom data |
| `order.completed` | Commerce | Feedback, Analytics | Link purchase to outcomes |
| `product.created` | Vendor | Intelligence | Index new product atoms |
| `recommendation.shown` | Intelligence | Feedback | Track impression for CTR |

### Event Schema Example

```json
{
  "version": "1.0",
  "id": "evt_abc123",
  "source": "jade.feedback",
  "type": "outcome.reported",
  "time": "2025-12-18T10:30:00Z",
  "data": {
    "outcomeId": "out_xyz789",
    "productId": "prod_123",
    "outcomeType": "IMPROVEMENT",
    "skinType": "combination",
    "rating": 4,
    "usageDurationDays": 30
  }
}
```

---

## Data Flow Diagrams

### Recommendation Flow

```
User Query → API Gateway → Intelligence Service
                               │
                               ├──▶ OpenSearch (vector search)
                               │         │
                               │         ▼
                               ├──▶ Neptune (graph filter + constraints)
                               │         │
                               │         ▼
                               ├──▶ Aurora (behavioral signals via Feedback)
                               │         │
                               │         ▼
                               └──▶ Multi-Signal Ranker
                                         │
                                         ▼
                               Ranked Results + Explanations
                                         │
                                         ▼
                               API Gateway → User
```

### Feedback Loop Flow

```
User Interaction → API Gateway → Feedback Service
                                      │
                                      ├──▶ Aurora (store event)
                                      │
                                      ├──▶ Kinesis Firehose (stream to analytics)
                                      │
                                      └──▶ EventBridge (emit event)
                                                │
                                                ▼
                                      Analytics Service (aggregate)
                                                │
                                                ▼
                                      Intelligence Service (update signals)
```

---

## Migration Sequence

1. **Phase 4a**: Extract Intelligence Service to AWS (parallel run)
2. **Phase 4b**: Extract Feedback Service to AWS (parallel run)
3. **Phase 5**: Extract Commerce Service (future)
4. **Phase 6**: Extract Vendor Service (future)
5. **Phase 7**: Decommission Vendure POC (future)

---

## Security Boundaries

### Service-to-Service Authentication
- IAM roles for ECS tasks
- Lambda execution roles
- API Gateway authorizers

### Network Isolation
- VPC with private subnets for data stores
- VPC endpoints for AWS services
- Security groups per service

### Data Classification
- PII: Identity Service only (Cognito)
- Anonymized: Feedback Service (session hashes)
- Public: Intelligence Service (product/atom data)

---

**Architecture Owner**: DevOps Team
**Last Updated**: December 18, 2025
