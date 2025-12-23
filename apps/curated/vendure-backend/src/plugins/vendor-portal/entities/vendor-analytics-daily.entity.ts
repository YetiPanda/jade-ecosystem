/**
 * Vendor Analytics Daily Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.3: Analytics Schema (Tasks A.3.1, A.3.2)
 *
 * Daily aggregated metrics for vendor performance tracking.
 * Powers the VendorDashboard with time-series data for revenue,
 * orders, active spas, and discovery metrics.
 *
 * Design: One row per vendor per day
 */

import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'jade', name: 'vendor_analytics_daily' })
@Index('idx_analytics_vendor_date', ['vendorId', 'date'], { unique: true })
@Index('idx_analytics_date', ['date'])
export class VendorAnalyticsDaily {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // VENDOR & DATE
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'varchar', length: 255, nullable: false })
  vendorId: string;

  @Column({ type: 'date', nullable: false, comment: 'The day these metrics represent (UTC)' })
  date: Date;

  // ──────────────────────────────────────────────────────────────
  // REVENUE METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Total revenue for this day',
  })
  revenue: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Revenue from new spa customers',
  })
  revenueFromNewSpas: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Revenue from repeat spa customers',
  })
  revenueFromRepeatSpas: number;

  // ──────────────────────────────────────────────────────────────
  // ORDER METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'int', default: 0, nullable: false, comment: 'Total orders placed' })
  orderCount: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Orders from new spa customers',
  })
  ordersFromNewSpas: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Orders from repeat spa customers',
  })
  ordersFromRepeatSpas: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Average order value for this day',
  })
  avgOrderValue: number;

  // ──────────────────────────────────────────────────────────────
  // SPA METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Unique spas that placed orders',
  })
  activeSpas: number;

  @Column({ type: 'int', default: 0, nullable: false, comment: 'New spas who ordered' })
  newSpas: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Spas who reordered (previously ordered)',
  })
  repeatSpas: number;

  // ──────────────────────────────────────────────────────────────
  // DISCOVERY METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Profile views (from any source)',
  })
  impressions: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Views from search results',
  })
  impressionsFromSearch: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Views from category browse',
  })
  impressionsFromBrowse: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Views from values filter',
  })
  impressionsFromValues: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Views from recommendations',
  })
  impressionsFromRecommendations: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Direct profile visits',
  })
  impressionsFromDirect: number;

  // ──────────────────────────────────────────────────────────────
  // ENGAGEMENT METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Clicks to product catalog',
  })
  catalogViews: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Individual product clicks',
  })
  productClicks: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Contact button clicks',
  })
  contactClicks: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Total seconds spent on profile (sum of all sessions)',
  })
  totalTimeOnProfile: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Number of profile visits that bounced',
  })
  bounces: number;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
