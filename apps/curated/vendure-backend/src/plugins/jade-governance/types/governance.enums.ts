/**
 * Governance Enums for AI Governance System
 *
 * ISO 42001 AI Management System (AIMS) enumerations
 */

/**
 * AI System Type Classification
 */
export enum AISystemType {
  /** Recommender system (product recommendations, suggestions) */
  RECOMMENDER = 'recommender',

  /** Classifier system (categorization, tagging) */
  CLASSIFIER = 'classifier',

  /** Analyzer system (content analysis, insights) */
  ANALYZER = 'analyzer',

  /** Generator system (content generation, synthesis) */
  GENERATOR = 'generator',
}

/**
 * Risk Category per EU AI Act / ISO 42001
 */
export enum RiskCategory {
  /** Minimal risk - basic AI applications */
  MINIMAL = 'minimal',

  /** Limited risk - systems with transparency obligations */
  LIMITED = 'limited',

  /** High risk - critical applications requiring compliance */
  HIGH = 'high',

  /** Unacceptable risk - prohibited systems */
  UNACCEPTABLE = 'unacceptable',
}

/**
 * Human Oversight Level (ISO 42001 Annex A.9)
 */
export enum OversightLevel {
  /** Human approves each AI decision before execution */
  IN_THE_LOOP = 'in_the_loop',

  /** Human monitors AI with ability to intervene */
  ON_THE_LOOP = 'on_the_loop',

  /** Human sets parameters and oversees overall system */
  IN_COMMAND = 'in_command',
}

/**
 * Compliance Status per Requirement
 */
export enum ComplianceStatus {
  /** Fully compliant with requirement */
  COMPLIANT = 'compliant',

  /** Substantially compliant (minor gaps) */
  SUBSTANTIALLY_COMPLIANT = 'substantially_compliant',

  /** Partially compliant (significant gaps) */
  PARTIALLY_COMPLIANT = 'partially_compliant',

  /** Not compliant */
  NON_COMPLIANT = 'non_compliant',

  /** Requirement not applicable to this system */
  NOT_APPLICABLE = 'not_applicable',

  /** Not yet assessed */
  NOT_ASSESSED = 'not_assessed',
}

/**
 * AI Incident Severity (FMEA-style)
 */
export enum IncidentSeverity {
  /** Catastrophic - severe harm, major business impact */
  CATASTROPHIC = 'catastrophic',

  /** Critical - significant harm, major degradation */
  CRITICAL = 'critical',

  /** Marginal - minor harm, some degradation */
  MARGINAL = 'marginal',

  /** Negligible - minimal impact */
  NEGLIGIBLE = 'negligible',
}

/**
 * Incident Response Workflow Steps (7-step process)
 */
export enum IncidentStep {
  /** Step 1: Detect the incident */
  DETECT = 'detect',

  /** Step 2: Assess severity and scope */
  ASSESS = 'assess',

  /** Step 3: Stabilize the system */
  STABILIZE = 'stabilize',

  /** Step 4: Report to stakeholders */
  REPORT = 'report',

  /** Step 5: Investigate root cause */
  INVESTIGATE = 'investigate',

  /** Step 6: Correct the issue */
  CORRECT = 'correct',

  /** Step 7: Verify resolution */
  VERIFY = 'verify',
}

/**
 * Detection Method for Incidents
 */
export enum DetectionMethod {
  /** User-reported outcome or complaint */
  USER_REPORT = 'user_report',

  /** Automated monitoring alert */
  MONITORING = 'monitoring',

  /** Internal audit finding */
  AUDIT = 'audit',

  /** External audit or regulator */
  EXTERNAL_AUDIT = 'external_audit',
}

/**
 * Requirement Relevance Type
 */
export enum RelevanceType {
  /** Requirement was violated by incident */
  VIOLATED = 'violated',

  /** Requirement was implicated but not violated */
  IMPLICATED = 'implicated',

  /** Requirement was tested during incident */
  TESTED = 'tested',

  /** Requirement not applicable to incident */
  NOT_APPLICABLE = 'not_applicable',
}

/**
 * Human Oversight Action Types (A.9 Control)
 */
export enum OversightActionType {
  /** Override AI decision with human judgment */
  OVERRIDE = 'override',

  /** Intervene to modify AI output */
  INTERVENTION = 'intervention',

  /** Emergency shutdown of AI system */
  SHUTDOWN = 'shutdown',

  /** Explicit approval of AI recommendation */
  APPROVAL = 'approval',
}

/**
 * Framework Names for Cross-Framework Mapping
 */
export enum ComplianceFramework {
  /** ISO/IEC 42001:2023 AI Management System */
  ISO_42001 = 'ISO_42001',

  /** NIST AI Risk Management Framework */
  NIST_AI_RMF = 'NIST_AI_RMF',

  /** EU AI Act */
  EU_AI_ACT = 'EU_AI_ACT',

  /** GDPR (for data protection) */
  GDPR = 'GDPR',

  /** SOC 2 (for AI controls) */
  SOC2 = 'SOC2',

  /** OECD AI Principles */
  OECD_AI = 'OECD_AI',
}

/**
 * ISO 42001 Threshold IDs
 */
export enum ISO42001Threshold {
  /** T1: AIMS Foundation (Clauses 4.1-6.2) */
  T1_AIMS_FOUNDATION = 'T1_AIMS_Foundation',

  /** T2: Resource Infrastructure (Clauses 7.1-7.5) */
  T2_RESOURCE_INFRASTRUCTURE = 'T2_Resource_Infrastructure',

  /** T3: Operational Controls (Clauses 8.1-8.4) */
  T3_OPERATIONAL_CONTROLS = 'T3_Operational_Controls',

  /** T4: Performance Evaluation (Clauses 9.1-9.3) */
  T4_PERFORMANCE_EVALUATION = 'T4_Performance_Evaluation',

  /** T5: Continual Improvement (Clauses 10.1-10.2) */
  T5_CONTINUAL_IMPROVEMENT = 'T5_Continual_Improvement',

  /** T6: AI-Specific Controls (Annex A) */
  T6_AI_CONTROLS_ANNEX = 'T6_AI_Controls_Annex',
}
