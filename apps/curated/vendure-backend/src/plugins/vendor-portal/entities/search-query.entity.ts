/**
 * Search Query Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint D.1: Discovery Analytics Backend - Task D.1.3
 *
 * Tracks search queries performed by spa users, capturing:
 * - Query text and filters used
 * - Results count and vendors shown
 * - User behavior (clicks, conversions)
 *
 * Powers:
 * - "Queries leading to you" analytics
 * - "Missed opportunities" detection (queries where vendor could rank)
 * - Search performance insights
 * - Query-to-conversion attribution
 *
 * Design: One row per search query execution
 */

import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'jade', name: 'search_query' })
@Index('idx_search_query_text', ['queryText'])
@Index('idx_search_query_user', ['userId'])
@Index('idx_search_query_created', ['createdAt'])
@Index('idx_search_query_results', ['resultsCount'])
export class SearchQuery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // QUERY DETAILS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    comment: 'Search query text'
  })
  queryText: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Normalized query text (lowercase, trimmed, lemmatized)'
  })
  normalizedQuery: string | null;

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Query tokens for analysis (e.g., ["organic", "moisturizer"])'
  })
  tokens: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // USER & SESSION
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Spa user ID (null if anonymous)'
  })
  userId: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Session ID for anonymous tracking'
  })
  sessionId: string | null;

  // ──────────────────────────────────────────────────────────────
  // FILTERS & CONTEXT
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Active values filters (e.g., ["organic", "cruelty_free"])'
  })
  valuesFilters: string[] | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Category filter (e.g., "skincare", "haircare")'
  })
  categoryFilter: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Additional filters (price range, product type, etc.)'
  })
  additionalFilters: Record<string, any> | null;

  // ──────────────────────────────────────────────────────────────
  // RESULTS
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    comment: 'Total number of results returned'
  })
  resultsCount: number;

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Vendor IDs shown in results (in rank order)'
  })
  vendorResults: string[] | null;

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: 'Product IDs shown in results (in rank order)'
  })
  productResults: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // ENGAGEMENT
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Number of vendors clicked from results'
  })
  vendorsClicked: number | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Number of products clicked from results'
  })
  productsClicked: number | null;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'True if user refined/modified the search'
  })
  wasRefined: boolean;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'True if user found results unsatisfactory (zero engagement)'
  })
  wasAbandoned: boolean;

  // ──────────────────────────────────────────────────────────────
  // METADATA
  // ──────────────────────────────────────────────────────────────

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Referrer URL'
  })
  referrer: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User agent string'
  })
  userAgent: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Device type (mobile, tablet, desktop)'
  })
  deviceType: string | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({
    type: 'timestamptz',
    comment: 'When the search was performed'
  })
  createdAt: Date;
}
