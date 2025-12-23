import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * AI Governance Schema Migration
 *
 * Sprint G1.6: Creates the 4 governance tables for ISO 42001 compliance
 *
 * Tables:
 * - ai_system_registry: Inventory of AI systems
 * - ai_compliance_state: Compliance assessment per requirement
 * - ai_incident: AI incidents with 13-D tensor positioning
 * - human_oversight_action: Human oversight tracking (A.9 control)
 *
 * Feature: Addendum 010-B - AI Governance Integration
 */
export class AIGovernanceSchema1734624000000 implements MigrationInterface {
  name = 'AIGovernanceSchema1734624000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set schema
    await queryRunner.query(`SET search_path TO jade, public`);

    // Create AI System Type enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.ai_system_type AS ENUM (
          'recommender',
          'classifier',
          'analyzer',
          'generator'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Risk Category enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.risk_category AS ENUM (
          'minimal',
          'limited',
          'high',
          'unacceptable'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Oversight Level enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.oversight_level AS ENUM (
          'in_the_loop',
          'on_the_loop',
          'in_command'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Compliance Status enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.compliance_status AS ENUM (
          'compliant',
          'substantially_compliant',
          'partially_compliant',
          'non_compliant',
          'not_applicable',
          'not_assessed'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Incident Severity enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.incident_severity AS ENUM (
          'catastrophic',
          'critical',
          'marginal',
          'negligible'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Incident Step enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.incident_step AS ENUM (
          'detect',
          'assess',
          'stabilize',
          'report',
          'investigate',
          'correct',
          'verify'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Detection Method enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.detection_method AS ENUM (
          'user_report',
          'monitoring',
          'audit',
          'external_audit'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Oversight Action Type enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.oversight_action_type AS ENUM (
          'override',
          'intervention',
          'shutdown',
          'approval'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // ========================================
    // Table 1: AI System Registry
    // ========================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.ai_system_registry (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        system_name VARCHAR(255) NOT NULL,
        system_type jade.ai_system_type NOT NULL,
        risk_category jade.risk_category NOT NULL,
        intended_purpose TEXT NOT NULL,
        operational_domain VARCHAR(100),
        human_oversight_level jade.oversight_level NOT NULL,
        last_risk_assessment_date DATE,
        next_review_date DATE,
        owner_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Indexes for AI System Registry
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_system_registry_type
      ON jade.ai_system_registry(system_type);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_system_registry_risk
      ON jade.ai_system_registry(risk_category);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_system_registry_owner
      ON jade.ai_system_registry(owner_id);
    `);

    // ========================================
    // Table 2: AI Compliance State
    // ========================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.ai_compliance_state (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        system_id UUID NOT NULL,
        requirement_clause VARCHAR(50) NOT NULL,
        compliance_status jade.compliance_status NOT NULL,
        evidence_ids UUID[],
        assessed_by UUID,
        assessed_at TIMESTAMPTZ,
        gap_analysis TEXT,
        remediation_plan TEXT,
        target_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_compliance_system FOREIGN KEY (system_id)
          REFERENCES jade.ai_system_registry(id) ON DELETE CASCADE
      )
    `);

    // Indexes for AI Compliance State
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_compliance_state_system
      ON jade.ai_compliance_state(system_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_compliance_state_status
      ON jade.ai_compliance_state(compliance_status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_compliance_state_clause
      ON jade.ai_compliance_state(requirement_clause);
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_compliance_state_unique
      ON jade.ai_compliance_state(system_id, requirement_clause);
    `);

    // ========================================
    // Table 3: AI Incident
    // ========================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.ai_incident (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        outcome_event_id UUID,
        affected_system_id UUID NOT NULL,
        severity jade.incident_severity NOT NULL,
        current_step jade.incident_step NOT NULL,
        detection_method jade.detection_method,
        occurred_at TIMESTAMPTZ NOT NULL,
        detected_at TIMESTAMPTZ NOT NULL,
        resolved_at TIMESTAMPTZ,
        root_cause TEXT,
        corrective_action TEXT,
        lessons_learned TEXT,
        notification_sent BOOLEAN DEFAULT false,
        tensor_position FLOAT8[13],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_incident_system FOREIGN KEY (affected_system_id)
          REFERENCES jade.ai_system_registry(id) ON DELETE CASCADE
      )
    `);

    // Indexes for AI Incident
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_incident_system
      ON jade.ai_incident(affected_system_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_incident_severity
      ON jade.ai_incident(severity);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_incident_step
      ON jade.ai_incident(current_step);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_incident_outcome
      ON jade.ai_incident(outcome_event_id) WHERE outcome_event_id IS NOT NULL;
    `);

    // Comment on tensor_position column
    await queryRunner.query(`
      COMMENT ON COLUMN jade.ai_incident.tensor_position IS
      '13-D incident tensor: [severity_score, impact_breadth, impact_depth, detection_lag, resolution_time, regulatory_exposure, reputational_risk, technical_complexity, data_sensitivity, user_affected_count, financial_impact, recurrence_likelihood, systemic_risk]';
    `);

    // ========================================
    // Table 4: Human Oversight Action
    // ========================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.human_oversight_action (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        system_id UUID NOT NULL,
        action_type jade.oversight_action_type NOT NULL,
        triggered_by_id UUID NOT NULL,
        recommendation_id UUID,
        original_output JSONB,
        modified_output JSONB,
        justification TEXT NOT NULL,
        risk_assessment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_oversight_system FOREIGN KEY (system_id)
          REFERENCES jade.ai_system_registry(id) ON DELETE CASCADE
      )
    `);

    // Indexes for Human Oversight Action
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_oversight_action_system
      ON jade.human_oversight_action(system_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_oversight_action_type
      ON jade.human_oversight_action(action_type);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_oversight_action_user
      ON jade.human_oversight_action(triggered_by_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_oversight_action_recommendation
      ON jade.human_oversight_action(recommendation_id) WHERE recommendation_id IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Set schema
    await queryRunner.query(`SET search_path TO jade, public`);

    // Drop tables in reverse dependency order
    await queryRunner.query(`DROP TABLE IF EXISTS jade.human_oversight_action CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.ai_incident CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.ai_compliance_state CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.ai_system_registry CASCADE`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS jade.oversight_action_type`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.detection_method`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.incident_step`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.incident_severity`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.compliance_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.oversight_level`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.risk_category`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.ai_system_type`);
  }
}
