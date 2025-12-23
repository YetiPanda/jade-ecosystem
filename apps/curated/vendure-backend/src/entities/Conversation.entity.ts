/**
 * Conversation Entity
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Task C.1.1
 *
 * Represents a conversation thread between a vendor and spa
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Message } from './Message.entity';

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  CLOSED = 'CLOSED',
}

export enum ConversationContextType {
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  GENERAL = 'GENERAL',
}

@Entity({ schema: 'jade', name: 'conversation' })
@Index(['vendorId'])
@Index(['spaId'])
@Index(['contextType', 'contextId'])
@Index(['lastMessageAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Participants
  @Column({ name: 'vendor_id', length: 255 })
  vendorId: string;

  @Column({ name: 'spa_id', length: 255 })
  spaId: string;

  // Context linking
  @Column({
    name: 'context_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  contextType?: ConversationContextType;

  @Column({ name: 'context_id', length: 255, nullable: true })
  contextId?: string;

  // Subject
  @Column({ length: 500 })
  subject: string;

  // Status
  @Column({
    type: 'varchar',
    length: 50,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  // Last activity
  @Column({ name: 'last_message_at', type: 'timestamp', nullable: true })
  lastMessageAt?: Date;

  @Column({ name: 'last_message_preview', type: 'text', nullable: true })
  lastMessagePreview?: string;

  // Unread counts (denormalized for performance)
  @Column({ name: 'unread_count_vendor', type: 'int', default: 0 })
  unreadCountVendor: number;

  @Column({ name: 'unread_count_spa', type: 'int', default: 0 })
  unreadCountSpa: number;

  // Moderation
  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({ name: 'flagged_reason', type: 'text', nullable: true })
  flaggedReason?: string;

  @Column({ name: 'flagged_at', type: 'timestamp', nullable: true })
  flaggedAt?: Date;

  @Column({ name: 'flagged_by', length: 255, nullable: true })
  flaggedBy?: string;

  // Relationships
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
