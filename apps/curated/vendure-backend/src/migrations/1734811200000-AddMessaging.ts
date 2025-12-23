/**
 * Migration: Add Messaging System
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Tasks C.1.1, C.1.2, C.1.11
 *
 * Creates tables:
 * - jade.conversation - Vendor-spa conversation threads
 * - jade.message - Individual messages within conversations
 * - jade.message_read_status - Track read/unread per participant
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessaging1734811200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create conversation table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.conversation (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Participants
        vendor_id VARCHAR(255) NOT NULL,
        spa_id VARCHAR(255) NOT NULL,

        -- Context linking (order/product)
        context_type VARCHAR(50), -- 'ORDER' | 'PRODUCT' | 'GENERAL'
        context_id VARCHAR(255), -- order_id or product_id

        -- Subject
        subject VARCHAR(500) NOT NULL,

        -- Status
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'ARCHIVED' | 'CLOSED'

        -- Last activity
        last_message_at TIMESTAMP,
        last_message_preview TEXT,

        -- Unread counts (denormalized for performance)
        unread_count_vendor INTEGER DEFAULT 0,
        unread_count_spa INTEGER DEFAULT 0,

        -- Moderation
        is_flagged BOOLEAN DEFAULT FALSE,
        flagged_reason TEXT,
        flagged_at TIMESTAMP,
        flagged_by VARCHAR(255),

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        -- Indexes
        -- NOTE: Foreign key to jade.vendor disabled - table doesn't exist yet
        -- CONSTRAINT fk_vendor FOREIGN KEY (vendor_id) REFERENCES jade.vendor(id) ON DELETE CASCADE,
        CONSTRAINT unique_vendor_spa_context UNIQUE (vendor_id, spa_id, context_type, context_id)
      );

      CREATE INDEX idx_conversation_vendor ON jade.conversation(vendor_id);
      CREATE INDEX idx_conversation_spa ON jade.conversation(spa_id);
      CREATE INDEX idx_conversation_context ON jade.conversation(context_type, context_id);
      CREATE INDEX idx_conversation_last_message ON jade.conversation(last_message_at DESC);
      CREATE INDEX idx_conversation_flagged ON jade.conversation(is_flagged) WHERE is_flagged = TRUE;
    `);

    // Create message table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.message (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Relationship
        conversation_id UUID NOT NULL,

        -- Sender
        sender_type VARCHAR(50) NOT NULL, -- 'VENDOR' | 'SPA' | 'ADMIN'
        sender_id VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,

        -- Content
        content TEXT NOT NULL,
        content_type VARCHAR(50) DEFAULT 'TEXT', -- 'TEXT' | 'HTML'

        -- Attachments (JSON array of URLs)
        attachments JSONB DEFAULT '[]',

        -- Metadata
        is_system_message BOOLEAN DEFAULT FALSE,
        is_edited BOOLEAN DEFAULT FALSE,
        edited_at TIMESTAMP,

        -- Moderation
        is_flagged BOOLEAN DEFAULT FALSE,
        flagged_reason TEXT,
        moderation_status VARCHAR(50) DEFAULT 'APPROVED', -- 'APPROVED' | 'PENDING' | 'REJECTED'

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        -- Constraints
        CONSTRAINT fk_conversation FOREIGN KEY (conversation_id) REFERENCES jade.conversation(id) ON DELETE CASCADE
      );

      CREATE INDEX idx_message_conversation ON jade.message(conversation_id, created_at DESC);
      CREATE INDEX idx_message_sender ON jade.message(sender_type, sender_id);
      CREATE INDEX idx_message_created ON jade.message(created_at DESC);
      CREATE INDEX idx_message_flagged ON jade.message(is_flagged) WHERE is_flagged = TRUE;
    `);

    // Create message_read_status table for tracking reads
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.message_read_status (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        message_id UUID NOT NULL,
        conversation_id UUID NOT NULL,

        -- Reader
        reader_type VARCHAR(50) NOT NULL, -- 'VENDOR' | 'SPA'
        reader_id VARCHAR(255) NOT NULL,

        -- Status
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),

        -- Constraints
        CONSTRAINT fk_message FOREIGN KEY (message_id) REFERENCES jade.message(id) ON DELETE CASCADE,
        CONSTRAINT fk_conversation_read FOREIGN KEY (conversation_id) REFERENCES jade.conversation(id) ON DELETE CASCADE,
        CONSTRAINT unique_reader_message UNIQUE (message_id, reader_type, reader_id)
      );

      CREATE INDEX idx_read_status_conversation ON jade.message_read_status(conversation_id, reader_type, reader_id);
      CREATE INDEX idx_read_status_unread ON jade.message_read_status(is_read, reader_type, reader_id) WHERE is_read = FALSE;
    `);

    // Create function to update conversation last_message_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_conversation_last_message()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE jade.conversation
        SET
          last_message_at = NEW.created_at,
          last_message_preview = LEFT(NEW.content, 100),
          updated_at = NOW()
        WHERE id = NEW.conversation_id;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_conversation_last_message
      AFTER INSERT ON jade.message
      FOR EACH ROW
      EXECUTE FUNCTION jade.update_conversation_last_message();
    `);

    // Create function to increment unread count
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.increment_unread_count()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Increment unread count for the recipient
        IF NEW.sender_type = 'VENDOR' THEN
          UPDATE jade.conversation
          SET unread_count_spa = unread_count_spa + 1
          WHERE id = NEW.conversation_id;
        ELSIF NEW.sender_type = 'SPA' THEN
          UPDATE jade.conversation
          SET unread_count_vendor = unread_count_vendor + 1
          WHERE id = NEW.conversation_id;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_increment_unread_count
      AFTER INSERT ON jade.message
      FOR EACH ROW
      WHEN (NEW.is_system_message = FALSE)
      EXECUTE FUNCTION jade.increment_unread_count();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers first
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_increment_unread_count ON jade.message;
      DROP FUNCTION IF EXISTS jade.increment_unread_count();

      DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON jade.message;
      DROP FUNCTION IF EXISTS jade.update_conversation_last_message();
    `);

    // Drop tables in reverse order
    await queryRunner.query(`
      DROP TABLE IF EXISTS jade.message_read_status CASCADE;
      DROP TABLE IF EXISTS jade.message CASCADE;
      DROP TABLE IF EXISTS jade.conversation CASCADE;
    `);
  }
}
