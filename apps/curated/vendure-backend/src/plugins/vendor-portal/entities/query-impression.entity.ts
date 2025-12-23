/**
 * Query Impression Entity (Junction Table)
 *
 * Feature 011: Vendor Portal MVP
 * Sprint D.1: Discovery Analytics Backend - Task D.1.4
 *
 * Links search queries to vendor impressions, tracking:
 * - Which vendors appeared in which search results
 * - Position/rank in search results
 * - Click-through behavior (impression → profile visit)
 *
 * Powers:
 * - Click-through rate (CTR) per query
 * - Position-based performance analysis
 * - "Queries leading to you" attribution
 * - Search ranking effectiveness
 *
 * Design: One row per (query, vendor) pair
 */

import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'jade', name: 'query_impression' })
@Index('idx_query_impression_query', ['queryId'])
@Index('idx_query_impression_vendor', ['vendorId'])
@Index('idx_query_impression_query_vendor', ['queryId', 'vendorId'])
@Index('idx_query_impression_position', ['position'])
@Index('idx_query_impression_clicked', ['clicked'])
export class QueryImpression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // RELATIONSHIPS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key to search_query table'
  })
  queryId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Vendor ID shown in search results'
  })
  vendorId: string;

  // ──────────────────────────────────────────────────────────────
  // POSITION & RANKING
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    nullable: false,
    comment: 'Position in search results (1-indexed)'
  })
  position: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Total results in search (for CTR normalization)'
  })
  totalResults: number | null;

  @Column({
    type: 'float',
    nullable: true,
    comment: 'Relevance score from search algorithm'
  })
  relevanceScore: number | null;

  // ──────────────────────────────────────────────────────────────
  // ENGAGEMENT
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'True if vendor profile was clicked from search results'
  })
  clicked: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'When the vendor profile was clicked (null if not clicked)'
  })
  clickedAt: Date | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Time to click (milliseconds from search to click)'
  })
  timeToClick: number | null;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'True if click led to product catalog view'
  })
  viewedCatalog: boolean;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'True if click led to product add-to-cart'
  })
  addedToCart: boolean;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'True if click led to completed order'
  })
  converted: boolean;

  // ──────────────────────────────────────────────────────────────
  // ATTRIBUTION
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Order ID if conversion occurred'
  })
  orderId: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Order value if conversion occurred (for ROI calculation)'
  })
  orderValue: number | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({
    type: 'timestamptz',
    comment: 'When the impression was recorded'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: 'When engagement data was last updated'
  })
  updatedAt: Date;
}
