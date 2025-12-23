# @jade/ska-ontology

**Semantic Knowledge Atoms Ontology Package for JADE Skincare Marketplace**

This package provides the unified SKA Meta-Schema with the Agentic Architecture Extension, enabling appreciating-asset knowledge graph capabilities for the JADE ecosystem.

---

## 📦 Package Contents

```
packages/ska-ontology/
├── ska-unified.ttl              # Master import file (entry point)
├── schemas/
│   ├── ska-meta-schema.ttl      # Core atom definitions, meta-level types
│   ├── ska-agentic-extension.ttl# Appreciating asset paradigm, 2026 readiness
│   └── ska-regulatory-atoms.ttl # NIST, ISO 42001, EU AI Act requirements
├── queries/
│   ├── 01-find-appreciating-assets.sparql
│   ├── 02-depreciating-patterns.sparql
│   ├── 03-reasoning-modes.sparql
│   ├── 04-compliance-chains.sparql
│   ├── 05-agent-readiness.sparql
│   ├── 06-architecture-layers.sparql
│   └── 07-jade-marketplace.sparql
├── index.js                     # Node.js entry point
├── index.d.ts                   # TypeScript definitions
└── package.json
```

---

## 🚀 Installation

### Step 1: Install the package

Since this is a workspace package, it's automatically available:

```bash
# From the monorepo root
pnpm install

# Or explicitly add to another package
pnpm add @jade/ska-ontology --filter @jade/backend
```

### Step 2: Install a SPARQL endpoint (optional, for queries)

For local development with SPARQL queries:

```bash
# Option A: Apache Jena Fuseki (recommended)
brew install jena
fuseki-server --mem /jade

# Option B: Oxigraph (lightweight)
cargo install oxigraph_server
oxigraph_server --location ./jade-graph serve
```

### Step 3: Load the ontology

```bash
# For Fuseki
curl -X POST http://localhost:3030/jade/data \
  -H "Content-Type: text/turtle" \
  --data-binary @packages/ska-ontology/ska-unified.ttl

# Load each schema
for f in packages/ska-ontology/schemas/*.ttl; do
  curl -X POST http://localhost:3030/jade/data \
    -H "Content-Type: text/turtle" \
    --data-binary @$f
done
```

---

## 💻 Usage in Code

### JavaScript/TypeScript

```typescript
import {
  NAMESPACES,
  ReasoningMode,
  AssetValueDynamic,
  ArchitectureLayer,
  QueryTemplates,
  generatePrefixes,
  readUnifiedOntology
} from '@jade/ska-ontology';

// Get SPARQL prefixes
const prefixes = generatePrefixes();
console.log(prefixes);
// PREFIX ska: <https://w3id.org/ska/>
// PREFIX skam: <https://w3id.org/ska/meta/>
// PREFIX skaa: <https://w3id.org/ska/agentic/>
// ...

// Use pre-built query templates
const appreciatingAssetsQuery = QueryTemplates.FIND_APPRECIATING_ASSETS;

// Find atoms by reasoning mode
const symbolicAtoms = QueryTemplates.FIND_BY_REASONING_MODE(ReasoningMode.SYMBOLIC);

// Multi-hop compliance traversal
const complianceChain = QueryTemplates.COMPLIANCE_CHAIN('skar:EUAIA_Article9');
```

### Direct SPARQL Queries

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

// Read a query file
const queryPath = join(__dirname, 'node_modules/@jade/ska-ontology/queries/04-compliance-chains.sparql');
const query = readFileSync(queryPath, 'utf-8');

// Execute against your SPARQL endpoint
const response = await fetch('http://localhost:3030/jade/sparql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/sparql-query' },
  body: query
});
```

---

## 🔍 Key SPARQL Queries Demonstrated

### 1. Find Appreciating Assets

```sparql
PREFIX skaa: <https://w3id.org/ska/agentic/>

SELECT ?resource ?label WHERE {
  ?resource skaa:hasAssetValueDynamic skaa:AppreciatingAsset .
  OPTIONAL { ?resource rdfs:label ?label }
}
```

### 2. Multi-Hop Compliance Chain (Transitive Entailment)

```sparql
PREFIX ska: <https://w3id.org/ska/>
PREFIX skar: <https://w3id.org/ska/regulatory/>

# What requirements does EU AI Act Article 9 satisfy?
SELECT ?satisfied ?label WHERE {
  skar:EUAIA_Article9 ska:entails+ ?satisfied .
  ?satisfied skos:prefLabel ?label .
}

# Results: ISO 42001 6.1.2 AND NIST MAP-1.1 (via transitivity)
```

### 3. Reasoning Mode Selection

```sparql
PREFIX skaa: <https://w3id.org/ska/agentic/>

SELECT ?mode ?reliability WHERE {
  ?mode a skaa:ReasoningMode .
  ?mode skaa:reasoningReliability ?reliability .
}
ORDER BY DESC(?reliability)

# | mode                   | reliability |
# |------------------------|-------------|
# | skaa:SymbolicReasoning | 0.99        |
# | skaa:HybridReasoning   | 0.95        |
# | skaa:NeuralReasoning   | 0.85        |
```

### 4. Agent Readiness Metrics

```sparql
PREFIX skaa: <https://w3id.org/ska/agentic/>

SELECT ?capability ?metric ?value WHERE {
  ?capability a skaa:AgentSpeedWorkloadSupport .
  ?capability ?metric ?value .
  FILTER(?metric IN (skaa:queriesPerSecondCapacity, skaa:burstCapacity))
}

# | capability                   | metric                       | value  |
# |------------------------------|------------------------------|--------|
# | skaa:SKAAgentSpeedCapability | skaa:queriesPerSecondCapacity| 50000  |
# | skaa:SKAAgentSpeedCapability | skaa:burstCapacity           | 1000   |
```

### 5. Depreciating Patterns to Retire

```sparql
PREFIX skaa: <https://w3id.org/ska/agentic/>

SELECT ?pattern ?label ?depreciationRate WHERE {
  ?pattern rdfs:subClassOf skaa:ContextEngineeringPattern .
  ?pattern rdfs:label ?label .
  ?pattern skaa:depreciationRate ?depreciationRate .
}
ORDER BY DESC(?depreciationRate)

# | pattern                      | label               | rate |
# |------------------------------|---------------------|------|
# | skaa:PromptScaffolding       | Prompt Scaffolding  | 0.40 |
# | skaa:ChainOfThoughtFramework | Chain-of-Thought    | 0.35 |
# | skaa:SearchTree              | Search Tree         | 0.30 |
# | skaa:RAGPipeline             | RAG Pipeline        | 0.25 |
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  THREE-LAYER AGENTIC ARCHITECTURE                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  MODEL LAYER (Depreciating 📉)                                               │
│  • LLM APIs, prompt templates, orchestration                                 │
│  • Investment here becomes technical debt                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  KNOWLEDGE LAYER (Appreciating 📈) ★ SKA OPERATES HERE ★                    │
│  • Semantic Knowledge Atoms                                                  │
│  • SKOS/OWL dual serialization                                               │
│  • SHACL constraints, transitive inference                                   │
│  • Investment here compounds with every connection                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  COORDINATION LAYER (Strategic Asset)                                        │
│  • Multi-agent governance                                                    │
│  • Capability negotiation                                                    │
│  • SKA enables via shared semantic substrate                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Reasoning Mode Selection

| Atom Type | Preferred Mode | Reliability | Use Case |
|-----------|----------------|-------------|----------|
| `skam:AxiomAtom` | Symbolic | 99% | Deterministic entailment |
| `skam:ConstraintAtom` | Symbolic | 99% | SHACL validation |
| `skam:EntityAtom` | Hybrid | 95% | Discovery + validation |
| `ska:PatternAtom` | Neural | 85% | Embedding similarity |

---

## 🔗 Namespace Reference

| Prefix | Namespace | Purpose |
|--------|-----------|---------|
| `ska:` | `https://w3id.org/ska/` | Core SKA ontology |
| `skam:` | `https://w3id.org/ska/meta/` | Meta-schema types |
| `skaa:` | `https://w3id.org/ska/agentic/` | Agentic extension |
| `skar:` | `https://w3id.org/ska/regulatory/` | Regulatory atoms |
| `jade:` | `https://jade.eco/ontology/` | JADE marketplace |
| `skos:` | `http://www.w3.org/2004/02/skos/core#` | Navigation |
| `owl:` | `http://www.w3.org/2002/07/owl#` | Reasoning |
| `sh:` | `http://www.w3.org/ns/shacl#` | Validation |

---

## 🧪 Validation

```bash
# Validate all Turtle files (requires Apache Jena)
pnpm --filter @jade/ska-ontology validate

# Or manually:
riot --validate packages/ska-ontology/schemas/*.ttl
riot --validate packages/ska-ontology/ska-unified.ttl
```

---

## 📈 Why SKA is an Appreciating Asset

1. **Network Effects**: Each new relationship (ska:entails, ska:mapsToControl) increases queryable inference paths for ALL queries
2. **Model-Agnostic**: Works with any LLM - value transfers across model upgrades
3. **Deterministic Reasoning**: Symbolic queries have 99% reliability vs 45% for SQL generation
4. **Low Entropy**: SHACL validation maintains data quality, preventing hallucination inputs
5. **Multi-Hop Native**: Transitive properties enable arbitrary-depth reasoning without recursive CTEs

---

## 📝 License

MIT © JADE Ecosystem Team
