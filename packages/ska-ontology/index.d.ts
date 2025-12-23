/**
 * @jade/ska-ontology TypeScript definitions
 */

export interface Namespaces {
  ska: string;
  skam: string;
  skaa: string;
  skar: string;
  skac: string;
  jade: string;
  skos: string;
  owl: string;
  rdfs: string;
  rdf: string;
  xsd: string;
  sh: string;
}

export const NAMESPACES: Namespaces;

export interface SchemaKeys {
  META_SCHEMA: string;
  AGENTIC_EXTENSION: string;
  REGULATORY_ATOMS: string;
  UNIFIED: string;
}

export const SCHEMAS: SchemaKeys;

export const ReasoningMode: {
  SYMBOLIC: 'skaa:SymbolicReasoning';
  NEURAL: 'skaa:NeuralReasoning';
  HYBRID: 'skaa:HybridReasoning';
};

export const AssetValueDynamic: {
  APPRECIATING: 'skaa:AppreciatingAsset';
  DEPRECIATING: 'skaa:DepreciatingAsset';
};

export const ArchitectureLayer: {
  MODEL: 'skaa:ModelLayer';
  KNOWLEDGE: 'skaa:KnowledgeLayer';
  COORDINATION: 'skaa:CoordinationLayer';
};

export interface QueryTemplates {
  FIND_APPRECIATING_ASSETS: string;
  FIND_BY_REASONING_MODE: (mode: string) => string;
  COMPLIANCE_CHAIN: (startAtom: string) => string;
  FIND_PATTERNS: string;
}

export const QueryTemplates: QueryTemplates;

export function getSchemaPath(schemaKey: keyof SchemaKeys): string;
export function getUnifiedOntologyPath(): string;
export function readSchema(schemaKey: keyof SchemaKeys): string;
export function readUnifiedOntology(): string;
export function generatePrefixes(prefixes?: string[]): string;
