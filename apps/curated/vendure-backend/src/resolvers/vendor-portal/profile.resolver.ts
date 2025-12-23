/**
 * Vendor Portal Profile Resolvers
 * Feature 011: Vendor Portal MVP
 * Sprint B.3: Profile Management Backend
 *
 * Implements CRUD operations for vendor profiles, values, and certifications
 */

import { AppDataSource } from '../../config/database';
import {
  validateUpdateVendorProfile,
  validateAddCertification,
} from '../../validators/vendor-profile.validator';

interface Context {
  user?: {
    id: string;
    role: string;
    vendorId?: string;
  };
}

interface UpdateVendorProfileInput {
  // Brand Identity
  brandName?: string;
  tagline?: string;
  founderStory?: string;
  missionStatement?: string;
  brandVideoUrl?: string;

  // Visual Identity
  logoUrl?: string;
  heroImageUrl?: string;
  brandColorPrimary?: string;
  brandColorSecondary?: string;
  galleryImages?: string[];

  // Contact & Links
  websiteUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };

  // Business Info
  foundedYear?: number;
  headquarters?: string;
  teamSize?: string;

  // Values
  values?: string[];
}

interface AddCertificationInput {
  type: string;
  certificateNumber?: string;
  expirationDate?: string;
  documentUrl: string;
  issuingBody: string;
}

/**
 * Get vendor profile query
 *
 * @example
 * query {
 *   vendorProfile {
 *     id
 *     brandName
 *     tagline
 *     values
 *     certifications {
 *       type
 *       verificationStatus
 *     }
 *     completenessScore
 *   }
 * }
 */
export async function vendorProfile(
  _parent: any,
  _args: any,
  context: Context
) {
  console.log('[vendorProfile] Query called');
  console.log('[vendorProfile] Context:', context);

  // TODO: Re-enable authentication once auth is properly set up
  // For now, allow unauthenticated access to test the integration
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  try {
    // Get vendor profile
    const profileResult = await AppDataSource.query(
      `
      SELECT
        id,
        "vendorId",
        "brandName",
        tagline,
        "founderStory",
        "missionStatement",
        "brandVideoUrl",
        "logoUrl",
        "heroImageUrl",
        "brandColorPrimary",
        "brandColorSecondary",
        "galleryImages",
        "websiteUrl",
        "socialLinks",
        "foundedYear",
        headquarters,
        "teamSize",
        "completenessScore",
        "createdAt",
        "updatedAt"
      FROM jade.vendor_profile
      WHERE "vendorId" = $1
      `,
      [vendorId]
    );

    if (!profileResult[0]) {
      return null;
    }

    const profile = profileResult[0];

    // Get values
    const valuesResult = await AppDataSource.query(
      `
      SELECT value
      FROM jade.vendor_profile_values
      WHERE vendor_profile_id = $1
      ORDER BY "createdAt"
      `,
      [profile.id]
    );

    const values = valuesResult.map((v: any) => v.value);

    // Get certifications
    const certificationsResult = await AppDataSource.query(
      `
      SELECT
        id,
        type,
        "certificateNumber",
        "issuingBody",
        "expirationDate",
        "verificationStatus",
        "documentUrl",
        "verifiedAt",
        "verifierName" as "verifiedBy",
        "rejectionReason",
        "createdAt" as "submittedAt",
        "slaDeadline"
      FROM jade.vendor_certification
      WHERE "vendorProfileId" = $1
      ORDER BY "createdAt" DESC
      `,
      [profile.id]
    );

    // Parse JSON fields
    const socialLinks = profile.socialLinks || {};
    const galleryImages = profile.galleryImages
      ? profile.galleryImages.split(',').filter((url: string) => url.trim())
      : [];

    return {
      id: profile.id,
      vendorId: profile.vendorId,
      brandName: profile.brandName,
      tagline: profile.tagline,
      founderStory: profile.founderStory,
      missionStatement: profile.missionStatement,
      brandVideoUrl: profile.brandVideoUrl,
      logoUrl: profile.logoUrl,
      heroImageUrl: profile.heroImageUrl,
      brandColorPrimary: profile.brandColorPrimary,
      brandColorSecondary: profile.brandColorSecondary,
      galleryImages,
      websiteUrl: profile.websiteUrl,
      socialLinks,
      foundedYear: profile.foundedYear,
      headquarters: profile.headquarters,
      teamSize: profile.teamSize,
      values,
      certifications: certificationsResult,
      completenessScore: profile.completenessScore,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } catch (error) {
    console.error('[vendorProfile] Error:', error);
    throw error;
  }
}

/**
 * Update vendor profile mutation
 *
 * @example
 * mutation {
 *   updateVendorProfile(input: {
 *     brandName: "Radiant Glow"
 *     tagline: "Pure, sustainable skincare"
 *     values: [CLEAN_BEAUTY, VEGAN, WOMAN_FOUNDED]
 *   }) {
 *     success
 *     profile {
 *       id
 *       brandName
 *       completenessScore
 *     }
 *   }
 * }
 */
export async function updateVendorProfile(
  _parent: any,
  args: { input: UpdateVendorProfileInput },
  context: Context
) {
  console.log('[updateVendorProfile] Mutation called with input:', args.input);
  console.log('[updateVendorProfile] Context:', context);

  // TODO: Re-enable authentication once auth is properly set up
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';
  const { input } = args;

  try {
    // Check if profile exists
    const existingProfile = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE "vendorId" = $1`,
      [vendorId]
    );

    if (!existingProfile[0]) {
      // Create new profile if it doesn't exist
      await AppDataSource.query(
        `
        INSERT INTO jade.vendor_profile ("vendorId", "brandName", "completenessScore")
        VALUES ($1, $2, 0)
        `,
        [vendorId, input.brandName || 'New Vendor']
      );
    }

    // Get profile ID
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE "vendorId" = $1`,
      [vendorId]
    );
    const profileId = profileResult[0].id;

    // Build dynamic update query
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (input.brandName !== undefined) {
      updates.push(`"brandName" = $${paramIndex}`);
      params.push(input.brandName);
      paramIndex++;
    }

    if (input.tagline !== undefined) {
      updates.push(`tagline = $${paramIndex}`);
      params.push(input.tagline);
      paramIndex++;
    }

    if (input.founderStory !== undefined) {
      updates.push(`"founderStory" = $${paramIndex}`);
      params.push(input.founderStory);
      paramIndex++;
    }

    if (input.missionStatement !== undefined) {
      updates.push(`"missionStatement" = $${paramIndex}`);
      params.push(input.missionStatement);
      paramIndex++;
    }

    if (input.brandVideoUrl !== undefined) {
      updates.push(`"brandVideoUrl" = $${paramIndex}`);
      params.push(input.brandVideoUrl);
      paramIndex++;
    }

    if (input.logoUrl !== undefined) {
      updates.push(`"logoUrl" = $${paramIndex}`);
      params.push(input.logoUrl);
      paramIndex++;
    }

    if (input.heroImageUrl !== undefined) {
      updates.push(`"heroImageUrl" = $${paramIndex}`);
      params.push(input.heroImageUrl);
      paramIndex++;
    }

    if (input.brandColorPrimary !== undefined) {
      updates.push(`"brandColorPrimary" = $${paramIndex}`);
      params.push(input.brandColorPrimary);
      paramIndex++;
    }

    if (input.brandColorSecondary !== undefined) {
      updates.push(`"brandColorSecondary" = $${paramIndex}`);
      params.push(input.brandColorSecondary);
      paramIndex++;
    }

    if (input.galleryImages !== undefined) {
      updates.push(`"galleryImages" = $${paramIndex}`);
      params.push(input.galleryImages.join(','));
      paramIndex++;
    }

    if (input.websiteUrl !== undefined) {
      updates.push(`"websiteUrl" = $${paramIndex}`);
      params.push(input.websiteUrl);
      paramIndex++;
    }

    if (input.socialLinks !== undefined) {
      updates.push(`"socialLinks" = $${paramIndex}`);
      params.push(JSON.stringify(input.socialLinks));
      paramIndex++;
    }

    if (input.foundedYear !== undefined) {
      updates.push(`"foundedYear" = $${paramIndex}`);
      params.push(input.foundedYear);
      paramIndex++;
    }

    if (input.headquarters !== undefined) {
      updates.push(`headquarters = $${paramIndex}`);
      params.push(input.headquarters);
      paramIndex++;
    }

    if (input.teamSize !== undefined) {
      updates.push(`"teamSize" = $${paramIndex}`);
      params.push(input.teamSize);
      paramIndex++;
    }

    // Always update timestamp
    updates.push(`"updatedAt" = NOW()`);

    // Execute update if there are changes
    if (updates.length > 1) { // More than just updatedAt
      params.push(profileId);
      await AppDataSource.query(
        `
        UPDATE jade.vendor_profile
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        `,
        params
      );
    }

    // Update values if provided
    if (input.values !== undefined) {
      // Delete existing values
      await AppDataSource.query(
        `DELETE FROM jade.vendor_profile_values WHERE vendor_profile_id = $1`,
        [profileId]
      );

      // Insert new values
      if (input.values.length > 0) {
        const valueInserts = input.values.map((value, index) => {
          return `($1, $${index + 2})`;
        });

        await AppDataSource.query(
          `
          INSERT INTO jade.vendor_profile_values (vendor_profile_id, value)
          VALUES ${valueInserts.join(', ')}
          `,
          [profileId, ...input.values]
        );
      }
    }

    // Calculate and update completeness score
    const completenessScore = await calculateCompletenessScore(profileId);
    await AppDataSource.query(
      `UPDATE jade.vendor_profile SET "completenessScore" = $1 WHERE id = $2`,
      [completenessScore, profileId]
    );

    console.log(`[updateVendorProfile] Profile ${profileId} updated, completeness: ${completenessScore}%`);

    // Return updated profile
    const updatedProfile = await vendorProfile(_parent, {}, context);

    return {
      success: true,
      profile: updatedProfile,
      errors: [],
    };
  } catch (error) {
    console.error('[updateVendorProfile] Error:', error);
    return {
      success: false,
      profile: null,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
    };
  }
}

/**
 * Add certification mutation
 *
 * @example
 * mutation {
 *   addCertification(input: {
 *     type: USDA_ORGANIC
 *     certificateNumber: "12345"
 *     documentUrl: "https://s3.aws.com/cert.pdf"
 *     issuingBody: "USDA"
 *     expirationDate: "2026-12-31"
 *   }) {
 *     success
 *     certification {
 *       id
 *       type
 *       verificationStatus
 *     }
 *   }
 * }
 */
export async function addCertification(
  _parent: any,
  args: { input: AddCertificationInput },
  context: Context
) {
  console.log('[addCertification] Mutation called with input:', args.input);

  // TODO: Re-enable authentication once auth is properly set up
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';
  const { input } = args;

  try {
    // Get profile ID
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE "vendorId" = $1`,
      [vendorId]
    );

    if (!profileResult[0]) {
      throw new Error('Vendor profile not found. Please create a profile first.');
    }

    const profileId = profileResult[0].id;

    // Calculate SLA deadline (3 business days)
    const slaDeadline = new Date();
    slaDeadline.setDate(slaDeadline.getDate() + 3);

    // Insert certification
    const certResult = await AppDataSource.query(
      `
      INSERT INTO jade.vendor_certification (
        "vendorProfileId",
        vendor_profile_id,
        type,
        "certificateNumber",
        "issuingBody",
        "expirationDate",
        "documentUrl",
        "verificationStatus",
        "slaDeadline"
      )
      VALUES ($1, $1, $2, $3, $4, $5, $6, 'PENDING', $7)
      RETURNING
        id,
        type,
        "certificateNumber",
        "issuingBody",
        "expirationDate",
        "verificationStatus",
        "documentUrl",
        "createdAt" as "submittedAt",
        "slaDeadline"
      `,
      [
        profileId,
        input.type,
        input.certificateNumber || null,
        input.issuingBody,
        input.expirationDate || null,
        input.documentUrl,
        slaDeadline,
      ]
    );

    console.log(`[addCertification] Certification ${certResult[0].id} added for profile ${profileId}`);

    return {
      success: true,
      certification: certResult[0],
      errors: [],
    };
  } catch (error) {
    console.error('[addCertification] Error:', error);
    return {
      success: false,
      certification: null,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
    };
  }
}

/**
 * Remove certification mutation
 *
 * @example
 * mutation {
 *   removeCertification(certificationId: "cert-123")
 * }
 */
export async function removeCertification(
  _parent: any,
  args: { certificationId: string },
  context: Context
) {
  console.log('[removeCertification] Mutation called for:', args.certificationId);

  // TODO: Re-enable authentication once auth is properly set up
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  try {
    // Verify ownership
    const certResult = await AppDataSource.query(
      `
      SELECT vc.id
      FROM jade.vendor_certification vc
      INNER JOIN jade.vendor_profile vp ON vc.vendor_profile_id = vp.id
      WHERE vc.id = $1 AND vp."vendorId" = $2
      `,
      [args.certificationId, vendorId]
    );

    if (!certResult[0]) {
      throw new Error('Certification not found or you do not have permission to delete it');
    }

    // Delete certification
    await AppDataSource.query(
      `DELETE FROM jade.vendor_certification WHERE id = $1`,
      [args.certificationId]
    );

    console.log(`[removeCertification] Certification ${args.certificationId} removed`);

    return true;
  } catch (error) {
    console.error('[removeCertification] Error:', error);
    throw error;
  }
}

/**
 * Calculate profile completeness score (0-100)
 *
 * Scoring breakdown:
 * - Brand name: 5 (required, always present)
 * - Tagline: 5
 * - Founder story: 10
 * - Mission statement: 10
 * - Brand video: 10
 * - Logo: 10
 * - Hero image: 10
 * - Brand colors: 5 (both)
 * - Gallery images: 5 (at least 3)
 * - Website URL: 5
 * - Social links: 5 (at least 2)
 * - Founded year: 3
 * - Headquarters: 3
 * - Team size: 3
 * - Values: 10 (at least 3)
 * - Certifications: 10 (at least 1 verified)
 *
 * Total: 109 points, normalized to 100
 */
async function calculateCompletenessScore(profileId: string): Promise<number> {
  const profile = await AppDataSource.query(
    `
    SELECT
      "brandName",
      tagline,
      "founderStory",
      "missionStatement",
      "brandVideoUrl",
      "logoUrl",
      "heroImageUrl",
      "brandColorPrimary",
      "brandColorSecondary",
      "galleryImages",
      "websiteUrl",
      "socialLinks",
      "foundedYear",
      headquarters,
      "teamSize"
    FROM jade.vendor_profile
    WHERE id = $1
    `,
    [profileId]
  );

  if (!profile[0]) return 0;

  const p = profile[0];
  let score = 0;

  // Brand identity (40 points)
  if (p.brandName) score += 5;
  if (p.tagline) score += 5;
  if (p.founderStory && p.founderStory.length > 100) score += 10;
  if (p.missionStatement) score += 10;
  if (p.brandVideoUrl) score += 10;

  // Visual identity (30 points)
  if (p.logoUrl) score += 10;
  if (p.heroImageUrl) score += 10;
  if (p.brandColorPrimary && p.brandColorSecondary) score += 5;
  const galleryCount = p.galleryImages ? p.galleryImages.split(',').filter((url: string) => url.trim()).length : 0;
  if (galleryCount >= 3) score += 5;

  // Contact & links (10 points)
  if (p.websiteUrl) score += 5;
  const socialLinks = p.socialLinks || {};
  const socialCount = Object.keys(socialLinks).filter(key => socialLinks[key]).length;
  if (socialCount >= 2) score += 5;

  // Business info (9 points)
  if (p.foundedYear) score += 3;
  if (p.headquarters) score += 3;
  if (p.teamSize) score += 3;

  // Values (10 points)
  const valuesResult = await AppDataSource.query(
    `SELECT COUNT(*) as count FROM jade.vendor_profile_values WHERE vendor_profile_id = $1`,
    [profileId]
  );
  const valuesCount = parseInt(valuesResult[0].count);
  if (valuesCount >= 3) score += 10;
  else if (valuesCount > 0) score += Math.floor((valuesCount / 3) * 10);

  // Certifications (10 points)
  const certResult = await AppDataSource.query(
    `SELECT COUNT(*) as count FROM jade.vendor_certification WHERE "vendorProfileId" = $1 AND "verificationStatus" = 'VERIFIED'`,
    [profileId]
  );
  const certCount = parseInt(certResult[0].count);
  if (certCount >= 1) score += 10;

  // Normalize to 100 (max possible is 109)
  return Math.min(Math.round((score / 109) * 100), 100);
}
