# Claude Code Handoff: Option A Implementation

## Context Summary

This document provides Claude Code with the complete context from the claude.ai conversation that developed Addendum 010-B: AI Governance Integration.

**Decision Made**: Option A (Full Integration) - APPROVED  
**Timeline**: 22 weeks (extended from 18)  
**New Hours**: +273 hours (1003 total)  
**New Sprints**: G1-G7 (governance track)

---

## What Was Decided

### The Integration
We are integrating the **Frase AI Incident Response** framework's ISO 42001 governance capabilities into the **JADE Marketplace AWS migration** (Feature 010). This adds enterprise-grade AI governance to the skincare marketplace's recommendation engine, ingredient analyzer, and tensor search systems.

### Why It Matters
- Medical spa chains now require vendor AI governance
- EU AI Act preparation for international expansion
- Competitive differentiation in enterprise market
- Unified SKA framework enables automatic compliance evidence generation

---

## Key Files Created

| File | Purpose |
|------|---------|
| `addendum-010b-ai-governance.md` | Full specification with schemas, GraphQL, services |
| `data/iso42001-ska-atoms.json` | 78 ISO 42001 requirement atoms for compliance mapping |
| `CLAUDE-CODE-HANDOFF.md` | This context document |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    JADE Marketplace                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Product Rec │  │ Ingredient  │  │ Tensor Similarity   │  │
│  │   Engine    │  │  Analyzer   │  │     Search          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AI GOVERNANCE LAYER (NEW)                 │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌────────────────┐  │  │
│  │  │ AI System   │ │ Compliance   │ │ Incident       │  │  │
│  │  │ Registry    │ │ Assessment   │ │ Response       │  │  │
│  │  └─────────────┘ └──────────────┘ └────────────────┘  │  │
│  │  ┌─────────────┐ ┌──────────────┐                     │  │
│  │  │ Human       │ │ Governance   │                     │  │
│  │  │ Oversight   │ │ Metrics      │                     │  │
│  │  └─────────────┘ └──────────────┘                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           ISO 42001 SKA ATOMS (78 atoms)              │  │
│  │    T1: Foundation → T6: AI-Specific Controls          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema (4 New Tables)

```sql
-- 1. AI System Registry
CREATE TABLE jade.ai_system_registry (
  id UUID PRIMARY KEY,
  system_name VARCHAR(255) NOT NULL,
  system_type VARCHAR(50) NOT NULL,        -- 'recommender', 'classifier', 'analyzer'
  risk_category VARCHAR(50) NOT NULL,       -- 'minimal', 'limited', 'high'
  human_oversight_level VARCHAR(50) NOT NULL,
  ...
);

-- 2. Compliance State
CREATE TABLE jade.ai_compliance_state (
  id UUID PRIMARY KEY,
  system_id UUID REFERENCES jade.ai_system_registry(id),
  requirement_clause VARCHAR(50) NOT NULL,  -- 'iso42001_8.4.2'
  compliance_status VARCHAR(50) NOT NULL,
  evidence_ids UUID[],
  ...
);

-- 3. AI Incident (links to outcome_events)
CREATE TABLE jade.ai_incident (
  id UUID PRIMARY KEY,
  outcome_event_id UUID REFERENCES jade.outcome_events(id),
  affected_system_id UUID REFERENCES jade.ai_system_registry(id),
  severity VARCHAR(20) NOT NULL,
  current_step VARCHAR(50) NOT NULL,        -- 7-step workflow
  tensor_position FLOAT8[13],               -- 13-D for similarity search
  ...
);

-- 4. Human Oversight Actions
CREATE TABLE jade.human_oversight_action (
  id UUID PRIMARY KEY,
  system_id UUID REFERENCES jade.ai_system_registry(id),
  action_type VARCHAR(50) NOT NULL,         -- 'override', 'intervention'
  original_output JSONB,
  modified_output JSONB,
  justification TEXT NOT NULL,
  ...
);
```

---

## Sprint Schedule

| Sprint | Week | Focus | Hours |
|--------|------|-------|-------|
| G1 | 7 | Governance schema + entities | 30 |
| G2 | 8 | Governance services | 40 |
| G3 | 9 | GraphQL API | 38 |
| G4 | 11-12 | Observability integration | 31 |
| G5 | 13-14 | Incident-feedback integration | 32 |
| G6 | 15-16 | AWS deployment | 32 |
| G7 | 19-22 | Certification prep | 70 |

---

## Key Integration Points

### 1. OutcomeEvent → AIIncident Flow
When a user reports an adverse outcome (e.g., skin reaction):
```typescript
// Existing: outcome_events table receives user report
// NEW: Trigger creates ai_incident automatically
// NEW: Incident tensor positioned in 13-D space
// NEW: Auto-map to ISO 42001 requirements
```

### 2. DataCorrection → HumanOversightAction
When curator overrides AI recommendation:
```typescript
// Existing: data_corrections table logs correction
// NEW: human_oversight_action records override
// NEW: Evidence chain for ISO 42001 A.9 (Human Oversight)
```

### 3. Constraint Checking → Compliance Evidence
When ingredient constraint triggers:
```typescript
// Existing: ConstraintRelation checks interactions
// NEW: Logs as operational control evidence
// NEW: Maps to ISO 42001 T3 (Operational Controls)
```

---

## Constitutional Compliance

**Article VIII (UI Stability)**: This integration adds NO UI changes to existing interfaces. The governance dashboard is:
- Admin-only
- Additive feature
- Does not modify existing component contracts

---

## Implementation Starting Point

Begin with **Sprint G1** tasks:

1. Create `jade-governance` plugin structure in Vendure backend
2. Create entity files for the 4 new tables
3. Create TypeORM migrations
4. Load ISO 42001 atoms from `data/iso42001-ska-atoms.json`
5. Write Zod validation schemas
6. Write unit tests

---

## Source Files Reference

| Source | Location | Purpose |
|--------|----------|---------|
| ISO 42001 Atoms | `/specs/010-ska-mach-evolution/data/iso42001-ska-atoms.json` | Compliance requirement atoms |
| Frase AI Source | `/Users/jessegarza/claude-mcp/SemanticTech/FraseAI-IncidentResponse/` | Reference implementation |
| JADE Marketplace | `/Users/jessegarza/JADE/jade-spa-marketplace/` | Target application |
| Migration Specs | `/Users/jessegarza/JADE/Five-Rings-Temp/specs/010-ska-mach-evolution/` | Feature 010 specs |

---

## Commands to Start

```bash
# Navigate to project
cd /Users/jessegarza/JADE/jade-spa-marketplace

# Read the full addendum
cat ../Five-Rings-Temp/specs/010-ska-mach-evolution/addendum-010b-ai-governance.md

# Check existing tasks
cat ../Five-Rings-Temp/specs/010-ska-mach-evolution/tasks.md

# Begin implementation
# (Claude Code will create the governance plugin)
```

---

---

## 🆕 Related Handoff: SKA Agentic Architecture Integration

**See also**: `CLAUDE-CODE-HANDOFF-SKA-AGENTIC.md`

A new handoff document has been created for integrating the **SKA Agentic Architecture Extension** with the governance layer. This includes:

- **Core Thesis**: SKA as an appreciating asset vs depreciating context engineering
- **New Package**: `@jade/ska-ontology` with unified ontology
- **Three-Layer Architecture**: Model (depreciating) → Knowledge (appreciating) → Coordination
- **Neurosymbolic Reasoning Modes**: Symbolic (99%), Hybrid (95%), Neural (85%)
- **Agent Readiness Capabilities**: 50K QPS, 99-hop traversal, graph-backed context
- **7 SPARQL Queries**: Multi-hop compliance chains, reasoning mode routing

### Integration Priority

1. Complete Sprint G4 (Governance Observability) ✅
2. Integrate `@jade/ska-ontology` package
3. Add SKA agentic metrics to governance dashboard
4. Enable multi-hop compliance queries via `ska:entails+`

---

**Prepared**: December 19, 2025  
**Source**: claude.ai conversation with Jesse Garza  
**Updated**: December 19, 2025 - Added SKA Agentic Architecture reference
