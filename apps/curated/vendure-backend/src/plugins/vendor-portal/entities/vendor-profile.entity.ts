/**
 * Vendor Profile Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Tasks A.1.1-A.1.4)
 *
 * Stores vendor brand identity, values, and visual assets.
 * Linked to Vendure's Seller entity via vendorId.
 *
 * This entity supports the marketing claim:
 * "Your story, your values, your imagery—presented to spas looking for brands like yours"
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { VendorValue, TeamSize } from '../types/vendor.enums';
import { VendorCertification } from './vendor-certification.entity';

/**
 * Social Links JSON structure
 */
interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
}

/**
 * Vendor Profile
 *
 * One profile per vendor (Seller). Contains all brand information
 * that spas see when discovering and evaluating vendors.
 */
@Entity({ schema: 'jade', name: 'vendor_profile' })
export class VendorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // VENDOR REFERENCE
  // ──────────────────────────────────────────────────────────────

  /**
   * Reference to Vendure Seller ID
   * One-to-one relationship with Seller entity
   */
  @Index('idx_vendor_profile_vendor_id')
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  vendorId: string;

  // ──────────────────────────────────────────────────────────────
  // BRAND IDENTITY (Tasks A.1.2)
  // ──────────────────────────────────────────────────────────────

  /**
   * Brand name (e.g., "Luminara Skincare")
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  brandName: string;

  /**
   * Brand tagline (e.g., "Clean beauty for sensitive souls")
   * Max 200 characters
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  tagline: string | null;

  /**
   * Founder story - rich text, 2000 char limit
   * Supports markdown formatting
   */
  @Column({ type: 'text', nullable: true })
  founderStory: string | null;

  /**
   * Mission statement - 500 char limit
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  missionStatement: string | null;

  /**
   * Brand video URL (YouTube/Vimeo embed)
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  brandVideoUrl: string | null;

  // ──────────────────────────────────────────────────────────────
  // VISUAL IDENTITY (Task A.1.3)
  // ──────────────────────────────────────────────────────────────

  /**
   * Logo URL (S3 or CDN)
   * Recommended: 400x400px min, PNG or SVG
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  /**
   * Hero image URL (S3 or CDN)
   * Recommended: 1920x600px, JPG or PNG
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  heroImageUrl: string | null;

  /**
   * Primary brand color (hex code)
   */
  @Column({ type: 'varchar', length: 7, nullable: true })
  brandColorPrimary: string | null;

  /**
   * Secondary brand color (hex code)
   */
  @Column({ type: 'varchar', length: 7, nullable: true })
  brandColorSecondary: string | null;

  /**
   * Gallery images - array of URLs
   * Up to 10 images for brand showcase
   */
  @Column({ type: 'simple-array', nullable: true })
  galleryImages: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // CONTACT & LINKS (Task A.1.4)
  // ──────────────────────────────────────────────────────────────

  /**
   * Website URL
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  websiteUrl: string | null;

  /**
   * Social media links (JSON)
   * {instagram, facebook, tiktok, linkedin}
   */
  @Column({ type: 'jsonb', nullable: true })
  socialLinks: SocialLinks | null;

  // ──────────────────────────────────────────────────────────────
  // BUSINESS INFO
  // ──────────────────────────────────────────────────────────────

  /**
   * Year the brand was founded
   */
  @Column({ type: 'int', nullable: true })
  foundedYear: number | null;

  /**
   * Headquarters location (City, State/Country)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  headquarters: string | null;

  /**
   * Team size category
   */
  @Column({
    type: 'enum',
    enum: TeamSize,
    nullable: true,
  })
  teamSize: TeamSize | null;

  // ──────────────────────────────────────────────────────────────
  // PROFILE HEALTH & METRICS
  // ──────────────────────────────────────────────────────────────

  /**
   * Profile completeness score (0-100)
   * Calculated based on filled fields
   * Affects discovery visibility
   */
  @Column({ type: 'int', default: 0 })
  completenessScore: number;

  // ──────────────────────────────────────────────────────────────
  // RELATIONSHIPS
  // ──────────────────────────────────────────────────────────────

  /**
   * Vendor values (many-to-many through junction table)
   * Handled in Task A.1.6
   */
  // This will be added after creating the junction table

  /**
   * Certifications (one-to-many)
   */
  @OneToMany(() => VendorCertification, cert => cert.vendorProfile)
  certifications: VendorCertification[];

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
