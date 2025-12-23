/**
 * Marketing Campaign Entity
 *
 * Feature: Vendor Marketing Analytics Integration
 *
 * Tracks vendor marketing campaigns with performance metrics for ROAS analysis.
 * Supports multiple campaign types (email, social, content, paid search).
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Campaign Type
 */
export enum CampaignType {
  EMAIL = 'EMAIL',
  SOCIAL = 'SOCIAL',
  CONTENT = 'CONTENT',
  PAID_SEARCH = 'PAID_SEARCH',
  DISPLAY = 'DISPLAY',
  AFFILIATE = 'AFFILIATE',
}

/**
 * Campaign Status
 */
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Marketing Campaign
 *
 * Stores vendor marketing campaigns with comprehensive performance tracking.
 */
@Entity({ schema: 'jade', name: 'marketing_campaign' })
export class MarketingCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // VENDOR RELATIONSHIP
  // ──────────────────────────────────────────────────────────────

  /**
   * Vendor ID (references Vendure Customer ID)
   */
  @Index('idx_campaign_vendor')
  @Column({ type: 'uuid', nullable: false })
  vendorId: string;

  // ──────────────────────────────────────────────────────────────
  // CAMPAIGN DETAILS
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: CampaignType,
    nullable: false,
  })
  type: CampaignType;

  @Index('idx_campaign_status')
  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
    nullable: false,
  })
  status: CampaignStatus;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // ──────────────────────────────────────────────────────────────
  // CAMPAIGN DATES
  // ──────────────────────────────────────────────────────────────

  @Index('idx_campaign_dates')
  @Column({ type: 'timestamptz', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamptz', nullable: false })
  endDate: Date;

  // ──────────────────────────────────────────────────────────────
  // BUDGET & SPEND
  // ──────────────────────────────────────────────────────────────

  /**
   * Total budget allocated (in cents)
   */
  @Column({ type: 'int', nullable: false })
  budgetCents: number;

  /**
   * Amount spent so far (in cents)
   */
  @Column({ type: 'int', default: 0, nullable: false })
  spentCents: number;

  // ──────────────────────────────────────────────────────────────
  // PERFORMANCE METRICS
  // ──────────────────────────────────────────────────────────────

  /**
   * Total impressions (ad views)
   */
  @Column({ type: 'int', default: 0, nullable: false })
  impressions: number;

  /**
   * Total clicks
   */
  @Column({ type: 'int', default: 0, nullable: false })
  clicks: number;

  /**
   * Total conversions (completed purchases)
   */
  @Column({ type: 'int', default: 0, nullable: false })
  conversions: number;

  /**
   * Total revenue generated (in cents)
   */
  @Column({ type: 'int', default: 0, nullable: false })
  revenueCents: number;

  // ──────────────────────────────────────────────────────────────
  // CALCULATED METRICS (Stored for performance)
  // ──────────────────────────────────────────────────────────────

  /**
   * Click-Through Rate (percentage)
   * CTR = (clicks / impressions) * 100
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: false })
  ctr: number;

  /**
   * Cost Per Click (in cents)
   * CPC = spent / clicks
   */
  @Column({ type: 'int', default: 0, nullable: false })
  cpcCents: number;

  /**
   * Return on Ad Spend (multiplier)
   * ROAS = revenue / spent
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  roas: number;

  /**
   * Conversion Rate (percentage)
   * Conversion Rate = (conversions / clicks) * 100
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: false })
  conversionRate: number;

  // ──────────────────────────────────────────────────────────────
  // AUDIENCE
  // ──────────────────────────────────────────────────────────────

  /**
   * Target audience size
   */
  @Column({ type: 'int', nullable: true })
  audienceSize: number | null;

  /**
   * Audience segment details (JSON)
   * {segments: [], targeting: {}}
   */
  @Column({ type: 'jsonb', nullable: true })
  audienceDetails: object | null;

  // ──────────────────────────────────────────────────────────────
  // METADATA
  // ──────────────────────────────────────────────────────────────

  /**
   * Additional campaign metadata (JSON)
   * Platform-specific data, UTM parameters, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: object | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // ──────────────────────────────────────────────────────────────
  // HELPER METHODS
  // ──────────────────────────────────────────────────────────────

  /**
   * Calculate and update performance metrics
   */
  calculateMetrics(): void {
    // CTR
    this.ctr = this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0;

    // CPC
    this.cpcCents = this.clicks > 0 ? Math.round(this.spentCents / this.clicks) : 0;

    // ROAS
    this.roas = this.spentCents > 0 ? this.revenueCents / this.spentCents : 0;

    // Conversion Rate
    this.conversionRate = this.clicks > 0 ? (this.conversions / this.clicks) * 100 : 0;
  }

  /**
   * Get budget in dollars
   */
  get budgetDollars(): number {
    return this.budgetCents / 100;
  }

  /**
   * Get spent in dollars
   */
  get spentDollars(): number {
    return this.spentCents / 100;
  }

  /**
   * Get revenue in dollars
   */
  get revenueDollars(): number {
    return this.revenueCents / 100;
  }

  /**
   * Get CPC in dollars
   */
  get cpcDollars(): number {
    return this.cpcCents / 100;
  }

  /**
   * Get budget utilization percentage
   */
  get budgetUtilization(): number {
    return this.budgetCents > 0 ? (this.spentCents / this.budgetCents) * 100 : 0;
  }
}
