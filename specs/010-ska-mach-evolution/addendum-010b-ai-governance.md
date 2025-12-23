# Addendum 010-B: AI Governance Integration

## Integrating Frase AI Incident Response into JADE Marketplace Migration

**Document Version**: 1.0.0  
**Date**: December 19, 2025  
**Status**: APPROVED - Option A: Full Integration  
**Parent Document**: Feature 010 - SKA MACH Evolution Strategy  
**Integration Source**: FraseAI-IncidentResponse / ISO 42001 SKA Atoms

---

## Executive Summary

This addendum integrates the Frase AI Incident Response framework's **AI governance capabilities** into the JADE Marketplace AWS migration plan. The integration adds ISO 42001 compliance infrastructure to govern the marketplace's AI-powered product recommendations, ingredient analysis, and skincare intelligence features.

### Strategic Metaphor

Think of this integration like adding a **safety certification system** to an automotive factory. The factory (JADE Marketplace) already produces excellent vehicles (product recommendations), but now we're adding the quality management system (ISO 42001 AIMS) that documents how we ensure safety, monitor performance, and respond when things go wrong—enabling us to earn "ISO Certified" trust with enterprise spa clients.

### Approved Approach: Parallel Track Integration

1. Extends the 18-week timeline by **4 additional weeks** (22 weeks total)
2. Runs AI governance infrastructure development **parallel to Phase 2-3**
3. Integrates governance observability with existing monitoring (Phase 3)
4. Deploys governance services alongside MACH migration (Phase 4)
5. Maintains **constitutional compliance** with Article VIII (UI Stability)

---

## Integration Rationale

### Why AI Governance for a Skincare Marketplace?

The JADE Marketplace employs AI in **four critical areas** that benefit from ISO 42001 governance:

| AI Capability | Risk Profile | Governance Need |
|---------------|--------------|-----------------|
| **Product Recommendations** | Ingredient allergies → adverse reactions | Risk assessment, human oversight |
| **Ingredient Causal Mapping** | Scientific claim accuracy | Evidence chain, auditability |
| **Constraint Checking** | Drug/ingredient interactions | Safety controls, monitoring |
| **Tensor Similarity Search** | Personalization accuracy | Transparency, explanation |

### Market Differentiator

Enterprise spa chains and medical aesthetics providers increasingly require vendor AI governance:

- Medical Spa Chains → Now qualify for vendor shortlist
- Hospital-Affiliated Spas → Meet healthcare AI requirements
- International Chains → EU AI Act preparation
- Insurance-Linked Spas → Demonstrate AI risk management

---

## ISO 42001 → JADE Marketplace Mapping

### Threshold-to-Feature Matrix

| ISO 42001 Threshold | JADE Marketplace Application |
|---------------------|------------------------------|
| **T1: AIMS Foundation** | AI system inventory (SKA, tensor search, recommendations) |
| **T2: Resource Infrastructure** | Data science team competencies, documentation |
| **T3: Operational Controls** | Constraint checking, seller QA, ingredient validation |
| **T4: Performance Evaluation** | Segment-level metrics, calibration tracking (Phase 3) |
| **T5: Continual Improvement** | Data corrections, curator feedback (Loop C) |
| **T6: AI-Specific Controls** | Human oversight for high-risk recommendations |

### Critical ISO 42001 Controls for Marketplace AI

```typescript
// Mapping ISO 42001 Annex A controls to JADE features

interface GovernanceControlMapping {
  // A.4.2 - Competence for AI Systems
  'A.4.2_competence': {
    jadeFeature: 'Curator Role System',
    implementation: 'data_corrections.curator_role validation',
    evidenceArtifact: 'Curator qualification records',
  };
  
  // A.5.3 - AI System Categorization  
  'A.5.3_categorization': {
    jadeFeature: 'Product Intelligence Risk Tiers',
    implementation: 'Recommendation confidence thresholds',
    evidenceArtifact: 'AI system risk register',
  };
  
  // A.5.4 - AI System Impact Assessment
  'A.5.4_impact_assessment': {
    jadeFeature: 'Ingredient Constraint Engine',
    implementation: 'CRITICAL/WARNING/CAUTION severity levels',
    evidenceArtifact: 'Impact assessment for high-risk ingredients',
  };
  
  // A.7 - Data Quality Controls  
  'A.7_data_controls': {
    jadeFeature: 'Seller QA Service',
    implementation: 'Ingredient normalization, consistency checks',
    evidenceArtifact: 'Data quality metrics dashboard',
  };
  
  // A.8 - AI System Information
  'A.8_system_info': {
    jadeFeature: 'Explanation Service',
    implementation: 'generateExplanation() with citations',
    evidenceArtifact: 'Explanation audit logs',
  };
  
  // A.9 - Human Oversight
  'A.9_human_oversight': {
    jadeFeature: 'Curator Correction Workflow',
    implementation: 'DataCorrection entity with peer_review',
    evidenceArtifact: 'Override logs, intervention records',
  };
}
```

---

## Database Schema Extension

New tables for governance layer (compatible with existing schema):

```sql
-- AI System Inventory (T1: AIMS Foundation)
CREATE TABLE jade.ai_system_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(255) NOT NULL,           -- 'Product Recommendation Engine'
  system_type VARCHAR(50) NOT NULL,            -- 'recommender', 'classifier', 'analyzer'
  risk_category VARCHAR(50) NOT NULL,          -- 'minimal', 'limited', 'high', 'unacceptable'
  intended_purpose TEXT NOT NULL,
  operational_domain VARCHAR(100),              -- 'skincare_recommendations'
  human_oversight_level VARCHAR(50) NOT NULL,  -- 'in_the_loop', 'on_the_loop', 'in_command'
  last_risk_assessment_date DATE,
  next_review_date DATE,
  owner_id UUID REFERENCES jade.user(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance State per Requirement (T3-T4)
CREATE TABLE jade.ai_compliance_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id UUID REFERENCES jade.ai_system_registry(id),
  requirement_clause VARCHAR(50) NOT NULL,     -- 'iso42001_8.4.2'
  compliance_status VARCHAR(50) NOT NULL,      -- 'compliant', 'partial', 'non_compliant', 'not_assessed'
  evidence_ids UUID[],                         -- References to evidence documents
  assessed_by UUID REFERENCES jade.user(id),
  assessed_at TIMESTAMPTZ,
  gap_analysis TEXT,
  remediation_plan TEXT,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Incident Log (links to existing outcome_events)
CREATE TABLE jade.ai_incident (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  outcome_event_id UUID REFERENCES jade.outcome_events(id),  -- Link to user outcome
  affected_system_id UUID REFERENCES jade.ai_system_registry(id),
  severity VARCHAR(20) NOT NULL,               -- 'catastrophic', 'critical', 'marginal', 'negligible'
  current_step VARCHAR(50) NOT NULL,           -- 'detect', 'assess', 'stabilize', 'report', 'investigate', 'correct', 'verify'
  detection_method VARCHAR(100),               -- 'user_report', 'monitoring', 'audit'
  occurred_at TIMESTAMPTZ NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  root_cause TEXT,
  corrective_action TEXT,
  lessons_learned TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  tensor_position FLOAT8[13],                  -- 13-D incident positioning
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Human Oversight Actions (A.9 Control)
CREATE TABLE jade.human_oversight_action (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id UUID REFERENCES jade.ai_system_registry(id),
  action_type VARCHAR(50) NOT NULL,            -- 'override', 'intervention', 'shutdown', 'approval'
  triggered_by_id UUID REFERENCES jade.user(id),
  recommendation_id UUID,                       -- The AI output that was overridden
  original_output JSONB,
  modified_output JSONB,
  justification TEXT NOT NULL,
  risk_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for governance queries
CREATE INDEX idx_ai_incident_severity ON jade.ai_incident(severity);
CREATE INDEX idx_ai_incident_step ON jade.ai_incident(current_step);
CREATE INDEX idx_ai_incident_tensor ON jade.ai_incident USING hnsw (tensor_position vector_cosine_ops);
CREATE INDEX idx_compliance_state_status ON jade.ai_compliance_state(compliance_status);
CREATE INDEX idx_oversight_action_type ON jade.human_oversight_action(action_type);
```

---

## Service Layer

```typescript
// New governance services (compatible with existing architecture)

// /apps/vendure-backend/src/plugins/jade-governance/
├── entities/
│   ├── ai-system-registry.entity.ts
│   ├── ai-compliance-state.entity.ts
│   ├── ai-incident.entity.ts
│   └── human-oversight-action.entity.ts
├── services/
│   ├── ai-system-inventory.service.ts      // T1: Foundation
│   ├── compliance-assessment.service.ts    // T3-T4: Operational/Evaluation
│   ├── incident-response.service.ts        // T5: Improvement
│   ├── human-oversight.service.ts          // A.9 Control
│   └── governance-metrics.service.ts       // Monitoring
├── api/
│   └── governance.resolver.ts
└── index.ts
```

---

## GraphQL Contract Extension

```graphql
# contracts/governance.graphql (NEW)

"""
AI System registered for governance oversight
"""
type AISystem {
  id: ID!
  systemName: String!
  systemType: AISystemType!
  riskCategory: RiskCategory!
  intendedPurpose: String!
  humanOversightLevel: OversightLevel!
  lastRiskAssessmentDate: DateTime
  nextReviewDate: DateTime
  complianceStates: [ComplianceState!]!
  incidents: [AIIncident!]!
  oversightActions: [HumanOversightAction!]!
}

enum AISystemType {
  RECOMMENDER
  CLASSIFIER
  ANALYZER
  GENERATOR
}

enum RiskCategory {
  MINIMAL
  LIMITED
  HIGH
  UNACCEPTABLE
}

enum OversightLevel {
  IN_THE_LOOP      # Human approves each decision
  ON_THE_LOOP      # Human monitors with intervention ability
  IN_COMMAND       # Human sets parameters, oversees
}

type ComplianceState {
  id: ID!
  system: AISystem!
  requirementClause: String!
  status: ComplianceStatus!
  evidenceUrls: [String!]
  assessedBy: User
  assessedAt: DateTime
  gapAnalysis: String
  remediationPlan: String
  targetDate: Date
}

enum ComplianceStatus {
  COMPLIANT
  SUBSTANTIALLY_COMPLIANT
  PARTIALLY_COMPLIANT
  NON_COMPLIANT
  NOT_APPLICABLE
  NOT_ASSESSED
}

type AIIncident {
  id: ID!
  title: String!
  description: String!
  affectedSystem: AISystem!
  severity: IncidentSeverity!
  currentStep: IncidentStep!
  occurredAt: DateTime!
  detectedAt: DateTime!
  resolvedAt: DateTime
  rootCause: String
  correctiveAction: String
  lessonsLearned: String
  tensorPosition: [Float!]
  mappedRequirements: [RequirementMapping!]!
}

enum IncidentSeverity {
  CATASTROPHIC
  CRITICAL
  MARGINAL
  NEGLIGIBLE
}

enum IncidentStep {
  DETECT
  ASSESS
  STABILIZE
  REPORT
  INVESTIGATE
  CORRECT
  VERIFY
}

type RequirementMapping {
  requirementClause: String!
  frameworkName: String!
  relevanceType: RelevanceType!
  confidenceScore: Float!
}

enum RelevanceType {
  VIOLATED
  IMPLICATED
  TESTED
  NOT_APPLICABLE
}

type HumanOversightAction {
  id: ID!
  system: AISystem!
  actionType: OversightActionType!
  triggeredBy: User!
  originalOutput: JSON
  modifiedOutput: JSON
  justification: String!
  createdAt: DateTime!
}

enum OversightActionType {
  OVERRIDE
  INTERVENTION
  SHUTDOWN
  APPROVAL
}

# Queries
extend type Query {
  """Get all registered AI systems"""
  aiSystems: [AISystem!]!
  
  """Get AI system by ID"""
  aiSystem(id: ID!): AISystem
  
  """Get compliance dashboard summary"""
  complianceDashboard: ComplianceDashboard!
  
  """Get open incidents"""
  aiIncidents(status: [IncidentStep!], severity: [IncidentSeverity!]): [AIIncident!]!
  
  """Find similar incidents using tensor position"""
  similarIncidents(tensorPosition: [Float!]!, limit: Int): [AIIncident!]!
  
  """Get applicable ISO 42001 requirements for a system"""
  applicableRequirements(systemId: ID!): [RequirementAtom!]!
}

type ComplianceDashboard {
  totalSystems: Int!
  compliantSystems: Int!
  partiallyCompliantSystems: Int!
  nonCompliantSystems: Int!
  openIncidents: Int!
  avgResolutionTimeDays: Float
  complianceByFramework: [FrameworkCompliance!]!
}

type FrameworkCompliance {
  frameworkName: String!
  compliancePercentage: Float!
  gapCount: Int!
}

# Mutations
extend type Mutation {
  """Register an AI system for governance"""
  registerAISystem(input: RegisterAISystemInput!): AISystem!
  
  """Update compliance assessment"""
  assessCompliance(input: AssessComplianceInput!): ComplianceState!
  
  """Create an AI incident"""
  createAIIncident(input: CreateIncidentInput!): AIIncident!
  
  """Advance incident through response steps"""
  advanceIncident(id: ID!, step: IncidentStep!, notes: String): AIIncident!
  
  """Record human oversight action"""
  recordOversightAction(input: RecordOversightInput!): HumanOversightAction!
}

input RegisterAISystemInput {
  systemName: String!
  systemType: AISystemType!
  riskCategory: RiskCategory!
  intendedPurpose: String!
  humanOversightLevel: OversightLevel!
}

input AssessComplianceInput {
  systemId: ID!
  requirementClause: String!
  status: ComplianceStatus!
  evidenceUrls: [String!]
  gapAnalysis: String
  remediationPlan: String
  targetDate: Date
}

input CreateIncidentInput {
  title: String!
  description: String!
  affectedSystemId: ID!
  severity: IncidentSeverity!
  occurredAt: DateTime!
  outcomeEventId: ID  # Link to user-reported outcome
}

input RecordOversightInput {
  systemId: ID!
  actionType: OversightActionType!
  originalOutput: JSON
  modifiedOutput: JSON
  justification: String!
}
```

---

## Implementation Timeline

### Extended Timeline: 22 Weeks (was 18)

```
Week 1-6:   Phase 1 Foundation (existing + Addendum 010-A)
Week 7-10:  Phase 2 Intelligence + Governance Foundation (PARALLEL)
Week 11-14: Phase 3 Observability + Governance Metrics (PARALLEL)
Week 15-18: Phase 4 Migration + Governance Deployment
Week 19-20: Phase 5 Governance Integration Testing (NEW)
Week 21-22: Phase 6 Compliance Certification Prep (NEW)
```

---

## New Governance Sprints

### Sprint G1: Governance Schema (Week 7, parallel with Sprint 2.1)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G1.1 | Create `jade-governance` plugin structure | 2 | - |
| G1.2 | Create `ai_system_registry` entity | 3 | G1.1 |
| G1.3 | Create `ai_compliance_state` entity | 3 | G1.1 |
| G1.4 | Create `ai_incident` entity with 13-D tensor | 4 | G1.1 |
| G1.5 | Create `human_oversight_action` entity | 3 | G1.1 |
| G1.6 | Create migration scripts | 3 | G1.2-G1.5 |
| G1.7 | Write Zod validation schemas | 2 | G1.2-G1.5 |
| G1.8 | Write unit tests (100% coverage) | 4 | G1.2-G1.5 |
| G1.9 | Load ISO 42001 SKA atoms (78 atoms) | 4 | G1.6 |
| G1.10 | Verify foreign key relationships | 2 | G1.9 |

**Sprint G1 Subtotal**: 30 hours

### Sprint G2: Governance Services (Week 8, parallel with Sprint 2.2)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G2.1 | Create `ai-system-inventory.service.ts` | 4 | G1.2 |
| G2.2 | Implement system registration workflow | 3 | G2.1 |
| G2.3 | Create `compliance-assessment.service.ts` | 5 | G1.3 |
| G2.4 | Implement requirement-to-system matching | 4 | G2.3, G1.9 |
| G2.5 | Create `incident-response.service.ts` | 6 | G1.4 |
| G2.6 | Implement 7-step incident workflow | 4 | G2.5 |
| G2.7 | Implement incident tensor positioning | 4 | G2.5 |
| G2.8 | Create `human-oversight.service.ts` | 4 | G1.5 |
| G2.9 | Write integration tests | 6 | G2.1-G2.8 |

**Sprint G2 Subtotal**: 40 hours

### Sprint G3: Governance GraphQL API (Week 9, parallel with Sprint 2.3)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G3.1 | Create `governance.graphql` contract | 4 | - |
| G3.2 | Create `governance.resolver.ts` | 5 | G3.1 |
| G3.3 | Implement `aiSystems` query | 2 | G3.2, G2.1 |
| G3.4 | Implement `complianceDashboard` query | 4 | G3.2, G2.3 |
| G3.5 | Implement `aiIncidents` query with filters | 3 | G3.2, G2.5 |
| G3.6 | Implement `similarIncidents` tensor search | 4 | G3.2, G2.7 |
| G3.7 | Implement `registerAISystem` mutation | 3 | G3.2, G2.1 |
| G3.8 | Implement `createAIIncident` mutation | 3 | G3.2, G2.5 |
| G3.9 | Implement `recordOversightAction` mutation | 3 | G3.2, G2.8 |
| G3.10 | Write E2E tests | 6 | G3.3-G3.9 |
| G3.11 | Generate TypeScript types | 1 | G3.1 |

**Sprint G3 Subtotal**: 38 hours

### Sprint G4: Governance Observability (Week 11-12, parallel with Sprint 3.1-3.2)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G4.1 | Create `governance-metrics.service.ts` | 4 | G2.3 |
| G4.2 | Implement compliance percentage by framework | 3 | G4.1 |
| G4.3 | Implement gap count aggregation | 2 | G4.1 |
| G4.4 | Implement incident MTTR (mean time to resolve) | 3 | G4.1, G2.5 |
| G4.5 | Implement oversight action frequency | 2 | G4.1, G2.8 |
| G4.6 | Add Prometheus custom metrics | 4 | G4.1-G4.5 |
| G4.7 | Create Grafana dashboard for governance | 6 | G4.6 |
| G4.8 | Configure alerts (compliance < 80%, open incidents) | 3 | G4.6 |
| G4.9 | Write tests for metrics | 4 | G4.1-G4.5 |

**Sprint G4 Subtotal**: 31 hours

### Sprint G5: Incident-Feedback Integration (Week 13-14)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G5.1 | Link `OutcomeEvent` to `AIIncident` creation | 4 | G2.5, 1.4.8 |
| G5.2 | Implement outcome → incident trigger for adverse events | 5 | G5.1 |
| G5.3 | Map incident tensor position from outcome data | 4 | G5.2 |
| G5.4 | Auto-map incidents to ISO 42001 requirements | 6 | G5.3, G1.9 |
| G5.5 | Create notification service for incident escalation | 4 | G5.2 |
| G5.6 | Integrate with existing data_corrections for curator link | 3 | G5.2, 1.4.9 |
| G5.7 | Write E2E: outcome → incident → requirement flow | 6 | G5.1-G5.6 |

**Sprint G5 Subtotal**: 32 hours

### Sprint G6: AWS Governance Service (Week 15-16, parallel with Sprint 4.1-4.2)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G6.1 | Create `jade-governance-service` repository | 2 | - |
| G6.2 | Extract governance plugin to standalone | 6 | G6.1, G2.* |
| G6.3 | Configure Neptune for compliance graph queries | 4 | G6.2, 3.4.5 |
| G6.4 | Configure OpenSearch for incident tensor search | 4 | G6.2, 3.4.6 |
| G6.5 | Create Lambda for incident escalation | 4 | G6.2 |
| G6.6 | Integrate with EventBridge for events | 3 | G6.5, 3.4.7 |
| G6.7 | Write Dockerfile | 2 | G6.2 |
| G6.8 | Deploy to ECS (dev) | 3 | G6.7 |
| G6.9 | Parallel running validation | 4 | G6.8 |

**Sprint G6 Subtotal**: 32 hours

### Sprint G7: Compliance Certification Prep (Week 19-22, NEW)

| ID | Task | Hours | Dependencies |
|----|------|-------|--------------|
| G7.1 | Register marketplace AI systems in inventory | 4 | G2.1 |
| G7.2 | Conduct initial compliance assessment | 8 | G2.3, G7.1 |
| G7.3 | Document gap remediation plans | 6 | G7.2 |
| G7.4 | Generate evidence chain for each requirement | 8 | G7.2 |
| G7.5 | Create AI risk register document | 6 | G7.1 |
| G7.6 | Document human oversight procedures | 4 | G2.8 |
| G7.7 | Create incident response playbook | 6 | G2.5 |
| G7.8 | Internal audit simulation | 8 | G7.1-G7.7 |
| G7.9 | Remediate findings from audit | 16 | G7.8 |
| G7.10 | Final compliance dashboard validation | 4 | G7.9 |

**Sprint G7 Subtotal**: 70 hours

---

## Summary: Updated Totals

| Metric | Before (010) | + 010-A | + 010-B (Total) |
|--------|--------------|---------|-----------------|
| Weeks | 16 | 18 | 22 |
| Tasks | 84 | 102 | 158 |
| Hours | 642 | 730 | 1003 |
| New Services | 4 | 5 | 6 (+Governance) |
| New Tables | 4 | 8 | 12 (+4 governance) |

---

## Constitutional Compliance

### Article VIII Amendment Compatibility

The governance integration respects the UI Stability Protection Protocol:

- ✅ No changes to existing UI components
- ✅ New governance UI is additive (admin dashboard only)
- ✅ GraphQL contract additions are non-breaking
- ✅ Backend services adapt to existing data contracts

---

## ISO 42001 SKA Atoms Reference

The 78 ISO 42001 SKA atoms are located at:
`/specs/010-ska-mach-evolution/data/iso42001-ska-atoms.json`

Key thresholds:
- **T1_AIMS_Foundation** (Clauses 4.1-6.2): Organizational context, leadership
- **T2_Resource_Infrastructure** (Clauses 7.1-7.5): Support mechanisms
- **T3_Operational_Controls** (Clauses 8.1-8.4): Day-to-day operations
- **T4_Performance_Evaluation** (Clauses 9.1-9.3): Monitoring, audit
- **T5_Continual_Improvement** (Clauses 10.1-10.2): Nonconformity handling
- **T6_AI_Controls_Annex** (Annex A.2-A.10): AI-specific controls

---

**Approved**: December 19, 2025  
**Implementation Start**: Upon completion of Sprint 1.6 (Week 7)
