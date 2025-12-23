/**
 * Message Entity
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Task C.1.2
 *
 * Represents an individual message within a conversation
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Conversation } from './Conversation.entity';

export enum SenderType {
  VENDOR = 'VENDOR',
  SPA = 'SPA',
  ADMIN = 'ADMIN',
}

export enum ContentType {
  TEXT = 'TEXT',
  HTML = 'HTML',
}

export enum ModerationStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export interface MessageAttachment {
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
}

@Entity({ schema: 'jade', name: 'message' })
@Index(['conversationId', 'createdAt'])
@Index(['senderType', 'senderId'])
@Index(['createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relationship
  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  // Sender
  @Column({
    name: 'sender_type',
    type: 'varchar',
    length: 50,
  })
  senderType: SenderType;

  @Column({ name: 'sender_id', length: 255 })
  senderId: string;

  @Column({ name: 'sender_name', length: 255 })
  senderName: string;

  // Content
  @Column({ type: 'text' })
  content: string;

  @Column({
    name: 'content_type',
    type: 'varchar',
    length: 50,
    default: ContentType.TEXT,
  })
  contentType: ContentType;

  // Attachments (JSON array)
  @Column({ type: 'jsonb', default: '[]' })
  attachments: MessageAttachment[];

  // Metadata
  @Column({ name: 'is_system_message', type: 'boolean', default: false })
  isSystemMessage: boolean;

  @Column({ name: 'is_edited', type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ name: 'edited_at', type: 'timestamp', nullable: true })
  editedAt?: Date;

  // Moderation
  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({ name: 'flagged_reason', type: 'text', nullable: true })
  flaggedReason?: string;

  @Column({
    name: 'moderation_status',
    type: 'varchar',
    length: 50,
    default: ModerationStatus.APPROVED,
  })
  moderationStatus: ModerationStatus;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
