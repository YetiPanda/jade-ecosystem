/**
 * @jade/ska-ontology
 * Semantic Knowledge Atoms ontology package for JADE Skincare Marketplace
 */

const path = require('path');
const fs = require('fs');

// Schema file paths
const SCHEMAS = {
  META_SCHEMA: 'ska-meta-schema.ttl',
  AGENTIC_EXTENSION: 'ska-agentic-extension.ttl',
  REGULATORY_ATOMS: 'ska-regulatory-atoms.ttl',
  UNIFIED: '../ska-unified.ttl'
};

// Namespace prefixes
const NAMESPACES = {
  ska: 'https://w3id.org/ska/',
  skam: 'https://w3id.org/ska/meta/',
  skaa: 'https://w3id.org/ska/agentic/',
  skar: 'https://w3id.org/ska/regulatory/',
  skac: 'https://w3id.org/ska/chemistry/',
  jade: 'https://jade.eco/ontology/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  owl: 'http://www.w3.org/2002/07/owl#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  sh: 'http://www.w3.org/ns/shacl#'
};

// Reasoning modes from the agentic extension
const ReasoningMode = {
  SYMBOLIC: 'skaa:SymbolicReasoning',
  NEURAL: 'skaa:NeuralReasoning',
  HYBRID: 'skaa:HybridReasoning'
};

// Asset value dynamics
const AssetValueDynamic = {
  APPRECIATING: 'skaa:AppreciatingAsset',
  DEPRECIATING: 'skaa:DepreciatingAsset'
};

// Architecture layers
const ArchitectureLayer = {
  MODEL: 'skaa:ModelLayer',
  KNOWLEDGE: 'skaa:KnowledgeLayer',
  COORDINATION: 'skaa:CoordinationLayer'
};

// Helper to get schema file path
function getSchemaPath(schemaKey) {
  const schemaFile = SCHEMAS[schemaKey];
  if (!schemaFile) {
    throw new Error(`Unknown schema: ${schemaKey}`);
  }
  return path.join(__dirname, 'schemas', schemaFile);
}

// Helper to get unified ontology path
function getUnifiedOntologyPath() {
  return path.join(__dirname, 'ska-unified.ttl');
}

// Helper to read schema content
function readSchema(schemaKey) {
  const schemaPath = getSchemaPath(schemaKey);
  return fs.readFileSync(schemaPath, 'utf-8');
}

// Helper to read unified ontology
function readUnifiedOntology() {
  return fs.readFileSync(getUnifiedOntologyPath(), 'utf-8');
}

// Generate SPARQL PREFIX declarations
function generatePrefixes(prefixes = Object.keys(NAMESPACES)) {
  return prefixes
    .map(prefix => `PREFIX ${prefix}: <${NAMESPACES[prefix]}>`)
    .join('\n');
}

// Common SPARQL query templates
const QueryTemplates = {
  // Find all appreciating assets
  FIND_APPRECIATING_ASSETS: `
${generatePrefixes()}
SELECT ?resource ?label WHERE {
  ?resource skaa:hasAssetValueDynamic skaa:AppreciatingAsset .
  OPTIONAL { ?resource rdfs:label ?label }
}`,

  // Find atoms by reasoning mode
  FIND_BY_REASONING_MODE: (mode) => `
${generatePrefixes()}
SELECT ?atom ?label ?mode WHERE {
  ?atom skaa:preferredReasoningMode ${mode} .
  OPTIONAL { ?atom skos:prefLabel ?label }
  BIND(${mode} AS ?mode)
}`,

  // Multi-hop compliance traversal
  COMPLIANCE_CHAIN: (startAtom) => `
${generatePrefixes()}
SELECT ?satisfied ?label ?depth WHERE {
  ${startAtom} ska:entails+ ?satisfied .
  ?satisfied skos:prefLabel ?label .
  {
    SELECT ?satisfied (COUNT(?mid) AS ?depth) WHERE {
      ${startAtom} ska:entails* ?mid .
      ?mid ska:entails+ ?satisfied .
    }
    GROUP BY ?satisfied
  }
}
ORDER BY ?depth`,

  // Find cross-domain patterns
  FIND_PATTERNS: `
${generatePrefixes()}
SELECT ?pattern ?label ?confidence ?domains WHERE {
  ?pattern a ska:PatternAtom ;
           skos:prefLabel ?label ;
           ska:patternConfidence ?confidence ;
           ska:discoveredInDomains ?domains .
}
ORDER BY DESC(?confidence)`
};

module.exports = {
  SCHEMAS,
  NAMESPACES,
  ReasoningMode,
  AssetValueDynamic,
  ArchitectureLayer,
  QueryTemplates,
  getSchemaPath,
  getUnifiedOntologyPath,
  readSchema,
  readUnifiedOntology,
  generatePrefixes
};
