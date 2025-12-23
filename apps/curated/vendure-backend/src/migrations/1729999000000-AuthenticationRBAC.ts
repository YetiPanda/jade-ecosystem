import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Authentication and RBAC Schema Migration
 *
 * Creates the core authentication and role-based access control tables
 * that were missing from the initial schema.
 */
export class AuthenticationRBAC1729999000000 implements MigrationInterface {
  name = 'AuthenticationRBAC1729999000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set schema
    await queryRunner.query(`SET search_path TO jade, public`);

    // Create UserRole enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.user_role AS ENUM (
          'ADMIN',
          'SPA_OWNER',
          'SPA_MANAGER',
          'SERVICE_PROVIDER',
          'CLIENT',
          'VENDOR'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create User table (core authentication table)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade."user" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role jade.user_role NOT NULL,
        spa_organization_id UUID,
        vendor_organization_id UUID,
        phone VARCHAR(50),
        avatar_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        is_email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP WITH TIME ZONE,
        last_login_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_user_spa_org FOREIGN KEY (spa_organization_id)
          REFERENCES jade.spa_organization(id) ON DELETE SET NULL,
        CONSTRAINT fk_user_vendor_org FOREIGN KEY (vendor_organization_id)
          REFERENCES jade.vendor_organization(id) ON DELETE SET NULL
      )
    `);

    // Create index on email for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_email ON jade."user"(email);
    `);

    // Create index on role for RBAC queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_role ON jade."user"(role);
    `);

    // Create Session table for managing user sessions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.session (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        token VARCHAR(500) NOT NULL UNIQUE,
        refresh_token VARCHAR(500),
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_session_user FOREIGN KEY (user_id)
          REFERENCES jade."user"(id) ON DELETE CASCADE
      )
    `);

    // Create index on token for fast session lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_session_token ON jade.session(token);
    `);

    // Create index on user_id for user's sessions
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_session_user_id ON jade.session(user_id);
    `);

    // Create Permission table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.permission (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        resource VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create RolePermission junction table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.role_permission (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role jade.user_role NOT NULL,
        permission_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id)
          REFERENCES jade.permission(id) ON DELETE CASCADE,
        CONSTRAINT unique_role_permission UNIQUE (role, permission_id)
      )
    `);

    // Create AuditLog table for tracking important actions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.audit_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100),
        resource_id UUID,
        details JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id)
          REFERENCES jade."user"(id) ON DELETE SET NULL
      )
    `);

    // Create index on audit log for efficient queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON jade.audit_log(user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON jade.audit_log(created_at DESC);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_action ON jade.audit_log(action);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Set schema
    await queryRunner.query(`SET search_path TO jade, public`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS jade.audit_log CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.role_permission CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.permission CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.session CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade."user" CASCADE`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE IF EXISTS jade.user_role CASCADE`);
  }
}
