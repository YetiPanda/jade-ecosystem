/**
 * Product Performance Daily Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.3: Analytics Schema (Tasks A.3.5, A.3.6)
 *
 * Daily aggregated metrics for individual product performance.
 * Allows vendors to see which products are top sellers.
 *
 * Powers:
 * - "Best Sellers" table in dashboard
 * - Product performance trends
 * - Inventory planning insights
 *
 * Design: One row per product per day
 */

import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'jade', name: 'product_performance_daily' })
@Index('idx_product_perf_vendor_date', ['vendorId', 'date'])
@Index('idx_product_perf_product_date', ['productId', 'date'])
@Index('idx_product_perf_date', ['date'])
export class ProductPerformanceDaily {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // PRODUCT & DATE
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Vendor who owns product' })
  vendorId: string;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Product ID' })
  productId: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Product name (denormalized)' })
  productName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Product SKU (denormalized)' })
  productSku: string | null;

  @Column({ type: 'date', nullable: false, comment: 'The day these metrics represent (UTC)' })
  date: Date;

  // ──────────────────────────────────────────────────────────────
  // SALES METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Total units sold',
  })
  unitsSold: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
    comment: 'Total revenue from this product',
  })
  revenue: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Number of orders containing this product',
  })
  orderCount: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Unique spas that ordered this product',
  })
  uniqueSpas: number;

  // ──────────────────────────────────────────────────────────────
  // ENGAGEMENT METRICS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Product detail page views',
  })
  views: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Add to cart clicks',
  })
  addToCartClicks: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Conversion rate (orders / views * 100)',
  })
  conversionRate: number | null;

  // ──────────────────────────────────────────────────────────────
  // PRODUCT CONTEXT
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Product category (denormalized)',
  })
  category: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Product price on this day',
  })
  price: number | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
