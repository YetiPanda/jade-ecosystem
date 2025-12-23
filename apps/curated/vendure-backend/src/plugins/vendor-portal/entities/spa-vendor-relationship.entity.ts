/**
 * Spa-Vendor Relationship Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.3: Analytics Schema (Tasks A.3.3, A.3.4)
 *
 * Tracks the relationship between spas and vendors, including
 * lifetime value, order history, and relationship status.
 *
 * Powers:
 * - "Active Spas" metric
 * - "Reorder Rate" calculation
 * - Top customers list
 * - Churn risk indicators
 *
 * Design: One row per spa-vendor pair
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RelationshipStatus {
  ACTIVE = 'active',
  CHURNED = 'churned',
  AT_RISK = 'at_risk',
  NEW = 'new',
}

@Entity({ schema: 'jade', name: 'spa_vendor_relationship' })
@Index('idx_relationship_vendor', ['vendorId'])
@Index('idx_relationship_spa', ['spaId'])
@Index('idx_relationship_status', ['status'])
@Index('idx_relationship_last_order', ['lastOrderAt'])
export class SpaVendorRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // RELATIONSHIP IDS
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'varchar', length: 255, nullable: false })
  vendorId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  spaId: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Spa business name' })
  spaName: string | null;

  // ──────────────────────────────────────────────────────────────
  // RELATIONSHIP STATUS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'enum',
    enum: RelationshipStatus,
    default: RelationshipStatus.NEW,
    nullable: false,
    comment: 'Current relationship status',
  })
  status: RelationshipStatus;

  // ──────────────────────────────────────────────────────────────
  // LIFETIME METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Total revenue from this spa',
  })
  lifetimeValue: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Total number of orders placed',
  })
  orderCount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Average order value across all orders',
  })
  avgOrderValue: number;

  // ──────────────────────────────────────────────────────────────
  // ORDER TIMING
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'First order date',
  })
  firstOrderAt: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Most recent order date',
  })
  lastOrderAt: Date | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Average days between orders',
  })
  avgDaysBetweenOrders: number | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Days since last order (used for churn risk)',
  })
  daysSinceLastOrder: number | null;

  // ──────────────────────────────────────────────────────────────
  // PRODUCT PREFERENCES
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Most frequently ordered product categories',
  })
  favoriteCategories: string[] | null;

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Top 5 most ordered product IDs',
  })
  topProducts: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // ENGAGEMENT METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Number of times spa viewed vendor profile',
  })
  profileViews: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Number of messages exchanged',
  })
  messageCount: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Last message sent/received',
  })
  lastMessageAt: Date | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz', comment: 'Relationship start date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: 'Last update to this record' })
  updatedAt: Date;
}
