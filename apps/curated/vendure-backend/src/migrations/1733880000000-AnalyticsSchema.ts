import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Analytics Schema Migration
 *
 * Creates tables for:
 * - analytics_event: Tracking user and system events
 * - business_alert: Storing business alerts and notifications
 * - generated_report: Storing generated reports
 * - scheduled_report: Storing scheduled report configurations
 */
export class AnalyticsSchema1733880000000 implements MigrationInterface {
  name = 'AnalyticsSchema1733880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =========================================================================
    // Analytics Event Table
    // =========================================================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.analytics_event (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB DEFAULT '{}'::jsonb,
        organization_id UUID,
        user_id UUID,
        session_id VARCHAR(100),
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes for analytics_event
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type
        ON jade.analytics_event(event_type)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_timestamp
        ON jade.analytics_event(timestamp DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_org_timestamp
        ON jade.analytics_event(organization_id, timestamp DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_session
        ON jade.analytics_event(session_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_data
        ON jade.analytics_event USING GIN(event_data)
    `);

    // =========================================================================
    // Business Alert Table
    // =========================================================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.business_alert (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
        category VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL',
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        affected_metrics JSONB DEFAULT '[]'::jsonb,
        threshold_value NUMERIC,
        current_value NUMERIC,
        recommended_actions JSONB DEFAULT '[]'::jsonb,
        acknowledged BOOLEAN DEFAULT FALSE,
        acknowledged_at TIMESTAMP WITH TIME ZONE,
        acknowledged_by UUID,
        organization_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT chk_alert_severity
          CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
        CONSTRAINT chk_alert_category
          CHECK (category IN ('FINANCIAL', 'OPERATIONAL', 'CUSTOMER', 'PRODUCT', 'TECHNICAL'))
      )
    `);

    // Create indexes for business_alert
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_business_alert_severity
        ON jade.business_alert(severity)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_business_alert_category
        ON jade.business_alert(category)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_business_alert_timestamp
        ON jade.business_alert(timestamp DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_business_alert_acknowledged
        ON jade.business_alert(acknowledged)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_business_alert_org
        ON jade.business_alert(organization_id)
    `);

    // =========================================================================
    // Generated Report Table
    // =========================================================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.generated_report (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_type VARCHAR(50) NOT NULL,
        format VARCHAR(20) NOT NULL DEFAULT 'PDF',
        timeframe VARCHAR(50),
        filters JSONB DEFAULT '{}'::jsonb,
        generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        generated_by UUID,
        download_url TEXT,
        file_path TEXT,
        file_size_bytes BIGINT,
        expires_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        error_message TEXT,
        metrics_snapshot JSONB,
        insights_snapshot JSONB,
        organization_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT chk_report_type
          CHECK (report_type IN ('EXECUTIVE', 'OPERATIONAL', 'ANALYTICAL', 'CUSTOMER', 'PRODUCT', 'FINANCIAL')),
        CONSTRAINT chk_report_format
          CHECK (format IN ('PDF', 'EXCEL', 'JSON', 'HTML')),
        CONSTRAINT chk_report_status
          CHECK (status IN ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED'))
      )
    `);

    // Create indexes for generated_report
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_generated_report_type
        ON jade.generated_report(report_type)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_generated_report_status
        ON jade.generated_report(status)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_generated_report_generated_at
        ON jade.generated_report(generated_at DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_generated_report_org
        ON jade.generated_report(organization_id)
    `);

    // =========================================================================
    // Scheduled Report Table
    // =========================================================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.scheduled_report (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        report_type VARCHAR(50) NOT NULL,
        format VARCHAR(20) NOT NULL DEFAULT 'PDF',
        frequency VARCHAR(20) NOT NULL DEFAULT 'WEEKLY',
        recipients JSONB DEFAULT '[]'::jsonb,
        filters JSONB DEFAULT '{}'::jsonb,
        is_active BOOLEAN DEFAULT TRUE,
        last_run_at TIMESTAMP WITH TIME ZONE,
        next_run_at TIMESTAMP WITH TIME ZONE,
        cron_expression VARCHAR(50),
        created_by UUID,
        organization_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT chk_scheduled_report_type
          CHECK (report_type IN ('EXECUTIVE', 'OPERATIONAL', 'ANALYTICAL', 'CUSTOMER', 'PRODUCT', 'FINANCIAL')),
        CONSTRAINT chk_scheduled_report_format
          CHECK (format IN ('PDF', 'EXCEL', 'JSON', 'HTML')),
        CONSTRAINT chk_scheduled_report_frequency
          CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'))
      )
    `);

    // Create indexes for scheduled_report
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_scheduled_report_active
        ON jade.scheduled_report(is_active)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_scheduled_report_next_run
        ON jade.scheduled_report(next_run_at)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_scheduled_report_org
        ON jade.scheduled_report(organization_id)
    `);

    // =========================================================================
    // Metrics Snapshot Table (for historical tracking)
    // =========================================================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.metrics_snapshot (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        snapshot_date DATE NOT NULL,
        timeframe VARCHAR(20) NOT NULL,
        organization_id UUID,
        financial_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
        customer_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
        product_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
        skincare_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
        ai_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_metrics_snapshot
          UNIQUE (snapshot_date, timeframe, organization_id)
      )
    `);

    // Create indexes for metrics_snapshot
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_metrics_snapshot_date
        ON jade.metrics_snapshot(snapshot_date DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_metrics_snapshot_org_date
        ON jade.metrics_snapshot(organization_id, snapshot_date DESC)
    `);

    console.log('Analytics schema migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order of creation
    await queryRunner.query(`DROP TABLE IF EXISTS jade.metrics_snapshot CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.scheduled_report CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.generated_report CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.business_alert CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.analytics_event CASCADE`);

    console.log('Analytics schema migration rolled back successfully');
  }
}
