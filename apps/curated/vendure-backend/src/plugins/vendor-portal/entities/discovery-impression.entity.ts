/**
 * Discovery Impression Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.3: Analytics Schema (Tasks A.3.7, A.3.8)
 *
 * Tracks individual impressions of vendor profiles, capturing how
 * spas discover vendors and what queries/filters led to discovery.
 *
 * Powers:
 * - "How Spas Find You" analytics
 * - Search query insights ("Queries leading to you")
 * - Values performance ("Which values drive traffic")
 * - Missed opportunities detection
 *
 * Design: One row per impression event
 */

import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

export enum ImpressionSource {
  SEARCH = 'search',
  BROWSE = 'browse',
  VALUES = 'values',
  RECOMMENDATION = 'recommendation',
  DIRECT = 'direct',
}

export enum ImpressionAction {
  VIEW = 'view',
  CLICK = 'click',
  CATALOG_VIEW = 'catalog_view',
  PRODUCT_CLICK = 'product_click',
  CONTACT_CLICK = 'contact_click',
  BOUNCE = 'bounce',
}

@Entity({ schema: 'jade', name: 'discovery_impression' })
@Index('idx_impression_vendor_created', ['vendorId', 'createdAt'])
@Index('idx_impression_spa_vendor', ['spaId', 'vendorId'])
@Index('idx_impression_source', ['source'])
@Index('idx_impression_query', ['queryText'])
@Index('idx_impression_created', ['createdAt'])
export class DiscoveryImpression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // WHO & WHAT
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Vendor profile viewed' })
  vendorId: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Spa user viewing (null if anonymous)' })
  spaId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Session ID for anonymous tracking' })
  sessionId: string | null;

  // ──────────────────────────────────────────────────────────────
  // HOW THEY FOUND THE VENDOR
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'enum',
    enum: ImpressionSource,
    nullable: false,
    comment: 'How the spa discovered this vendor',
  })
  source: ImpressionSource;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Search query text (if source=search)',
  })
  queryText: string | null;

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Active values filters (if source=values)',
  })
  valuesFilters: string[] | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Category browsed (if source=browse)',
  })
  categoryBrowsed: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Recommendation algorithm ID (if source=recommendation)',
  })
  recommendationId: string | null;

  // ──────────────────────────────────────────────────────────────
  // WHAT THEY DID
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'enum',
    enum: ImpressionAction,
    default: ImpressionAction.VIEW,
    nullable: false,
    comment: 'Action taken by spa',
  })
  action: ImpressionAction;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Seconds spent on profile (null if bounced immediately)',
  })
  timeOnProfile: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Product ID clicked (if action=product_click)',
  })
  productClicked: string | null;

  // ──────────────────────────────────────────────────────────────
  // RANKING CONTEXT
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Position in search/browse results (1-indexed)',
  })
  position: number | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Total results shown in search/browse',
  })
  totalResults: number | null;

  // ──────────────────────────────────────────────────────────────
  // METADATA
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Referrer URL',
  })
  referrer: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User agent string',
  })
  userAgent: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Device type (mobile, tablet, desktop)',
  })
  deviceType: string | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz', comment: 'When the impression occurred' })
  createdAt: Date;
}
