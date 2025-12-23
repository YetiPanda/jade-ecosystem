/**
 * Migration: Governance Audit Log
 *
 * Creates the governance_audit_log table for Sprint G4.2
 * - Immutable audit trail for all governance operations
 * - Sequence numbers for integrity verification
 * - Indexes for performance
 */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class GovernanceAuditLog1734637800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'governance_audit_log',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'eventType',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'entityType',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'entityId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'actorId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'actorType',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'before',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'after',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
            comment: 'IPv4 (15 chars) or IPv6 (45 chars)',
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'sessionId',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'requestId',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'sequenceNumber',
            type: 'bigserial',
            isNullable: false,
            comment: 'Auto-incrementing sequence for integrity verification',
          },
          {
            name: 'timestamp',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create indexes for query performance
    await queryRunner.createIndex(
      'jade.governance_audit_log',
      new TableIndex({
        name: 'IDX_event_type_timestamp',
        columnNames: ['eventType', 'timestamp'],
      })
    );

    await queryRunner.createIndex(
      'jade.governance_audit_log',
      new TableIndex({
        name: 'IDX_entity_id_timestamp',
        columnNames: ['entityId', 'timestamp'],
      })
    );

    await queryRunner.createIndex(
      'jade.governance_audit_log',
      new TableIndex({
        name: 'IDX_actor_id_timestamp',
        columnNames: ['actorId', 'timestamp'],
      })
    );

    // Create index on sequence number for integrity checks
    await queryRunner.createIndex(
      'jade.governance_audit_log',
      new TableIndex({
        name: 'IDX_sequence_number',
        columnNames: ['sequenceNumber'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('jade.governance_audit_log', 'IDX_sequence_number');
    await queryRunner.dropIndex('jade.governance_audit_log', 'IDX_actor_id_timestamp');
    await queryRunner.dropIndex('jade.governance_audit_log', 'IDX_entity_id_timestamp');
    await queryRunner.dropIndex('jade.governance_audit_log', 'IDX_event_type_timestamp');

    // Drop table
    await queryRunner.dropTable('jade.governance_audit_log');
  }
}
