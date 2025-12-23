/**
 * Unit Tests: Vendor Portal Validation Schemas
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Task A.1.12)
 *
 * Tests Zod validation schemas for input validation and completeness scoring
 */

import { describe, it, expect } from 'vitest';
import {
  createVendorProfileSchema,
  updateVendorProfileSchema,
  addCertificationSchema,
  certificationVerificationSchema,
  socialLinksSchema,
  completeProfileSchema,
  minimumProfileRequirements,
  calculateCompletenessScore,
} from '../types/vendor.validation';
import { VendorValue, CertificationType, TeamSize } from '../types/vendor.enums';

describe('Vendor Validation Schemas', () => {
  describe('socialLinksSchema', () => {
    it('should validate correct social links', () => {
      const validLinks = {
        instagram: 'https://instagram.com/brand',
        facebook: 'https://facebook.com/brand',
        tiktok: 'https://tiktok.com/@brand',
        linkedin: 'https://linkedin.com/company/brand',
      };

      const result = socialLinksSchema.safeParse(validLinks);
      expect(result.success).toBe(true);
    });

    it('should allow partial social links', () => {
      const partialLinks = {
        instagram: 'https://instagram.com/brand',
      };

      const result = socialLinksSchema.safeParse(partialLinks);
      expect(result.success).toBe(true);
    });

    it('should reject invalid Instagram URL', () => {
      const invalidLinks = {
        instagram: 'https://twitter.com/brand',
      };

      const result = socialLinksSchema.safeParse(invalidLinks);
      expect(result.success).toBe(false);
    });

    it('should reject non-URL strings', () => {
      const invalidLinks = {
        instagram: 'not-a-url',
      };

      const result = socialLinksSchema.safeParse(invalidLinks);
      expect(result.success).toBe(false);
    });
  });

  describe('createVendorProfileSchema', () => {
    it('should validate correct profile creation', () => {
      const validInput = {
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        brandName: 'Luminara Skincare',
      };

      const result = createVendorProfileSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID for vendorId', () => {
      const invalidInput = {
        vendorId: 'not-a-uuid',
        brandName: 'Luminara Skincare',
      };

      const result = createVendorProfileSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject brand name that is too short', () => {
      const invalidInput = {
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        brandName: 'A',
      };

      const result = createVendorProfileSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 2 characters');
      }
    });

    it('should trim whitespace from brand name', () => {
      const input = {
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        brandName: '  Luminara Skincare  ',
      };

      const result = createVendorProfileSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('updateVendorProfileSchema', () => {
    it('should validate correct profile update', () => {
      const validUpdate = {
        brandName: 'Updated Brand Name',
        tagline: 'New tagline',
        foundedYear: 2020,
        teamSize: TeamSize.ELEVEN_TO_FIFTY,
      };

      const result = updateVendorProfileSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const partialUpdate = {
        tagline: 'Just updating the tagline',
      };

      const result = updateVendorProfileSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate hex color codes', () => {
      const validColors = {
        brandColorPrimary: '#2d5a47',
        brandColorSecondary: '#b8926a',
      };

      const result = updateVendorProfileSchema.safeParse(validColors);
      expect(result.success).toBe(true);
    });

    it('should reject invalid hex color codes', () => {
      const invalidColors = {
        brandColorPrimary: 'red',
      };

      const result = updateVendorProfileSchema.safeParse(invalidColors);
      expect(result.success).toBe(false);
    });

    it('should validate YouTube/Vimeo video URLs', () => {
      const validVideo = {
        brandVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      };

      const result = updateVendorProfileSchema.safeParse(validVideo);
      expect(result.success).toBe(true);
    });

    it('should reject non-YouTube/Vimeo video URLs', () => {
      const invalidVideo = {
        brandVideoUrl: 'https://example.com/video.mp4',
      };

      const result = updateVendorProfileSchema.safeParse(invalidVideo);
      expect(result.success).toBe(false);
    });

    it('should validate gallery images array', () => {
      const validGallery = {
        galleryImages: [
          'https://cdn.example.com/img1.jpg',
          'https://cdn.example.com/img2.jpg',
          'https://cdn.example.com/img3.jpg',
        ],
      };

      const result = updateVendorProfileSchema.safeParse(validGallery);
      expect(result.success).toBe(true);
    });

    it('should reject more than 10 gallery images', () => {
      const tooManyImages = {
        galleryImages: Array.from({ length: 11 }, (_, i) => `https://cdn.example.com/img${i + 1}.jpg`),
      };

      const result = updateVendorProfileSchema.safeParse(tooManyImages);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('10');
      }
    });

    it('should validate values array', () => {
      const validValues = {
        values: [
          VendorValue.CLEAN_BEAUTY,
          VendorValue.VEGAN,
          VendorValue.WOMAN_FOUNDED,
        ],
      };

      const result = updateVendorProfileSchema.safeParse(validValues);
      expect(result.success).toBe(true);
    });

    it('should reject unknown fields (strict mode)', () => {
      const invalidUpdate = {
        brandName: 'Valid Brand',
        unknownField: 'This should not be allowed',
      };

      const result = updateVendorProfileSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should validate founded year constraints', () => {
      const validYear = {
        foundedYear: 2020,
      };

      const result = updateVendorProfileSchema.safeParse(validYear);
      expect(result.success).toBe(true);
    });

    it('should reject founded year before 1900', () => {
      const tooOldYear = {
        foundedYear: 1899,
      };

      const result = updateVendorProfileSchema.safeParse(tooOldYear);
      expect(result.success).toBe(false);
    });

    it('should reject founded year in the future', () => {
      const futureYear = {
        foundedYear: new Date().getFullYear() + 1,
      };

      const result = updateVendorProfileSchema.safeParse(futureYear);
      expect(result.success).toBe(false);
    });
  });

  describe('addCertificationSchema', () => {
    it('should validate correct certification input', () => {
      const validCert = {
        type: CertificationType.LEAPING_BUNNY,
        certificateNumber: 'LB-2024-5847',
        expirationDate: '2025-12-31T00:00:00Z',
        documentUrl: 'https://s3.example.com/cert.pdf',
        issuingBody: 'Leaping Bunny Program',
      };

      const result = addCertificationSchema.safeParse(validCert);
      expect(result.success).toBe(true);
    });

    it('should allow optional certificate number', () => {
      const certWithoutNumber = {
        type: CertificationType.FAIR_TRADE,
        documentUrl: 'https://s3.example.com/cert.pdf',
        issuingBody: 'Fair Trade USA',
      };

      const result = addCertificationSchema.safeParse(certWithoutNumber);
      expect(result.success).toBe(true);
    });

    it('should validate document URL file types', () => {
      const validPdf = {
        type: CertificationType.USDA_ORGANIC,
        documentUrl: 'https://s3.example.com/cert.pdf',
        issuingBody: 'USDA',
      };

      const result = addCertificationSchema.safeParse(validPdf);
      expect(result.success).toBe(true);
    });

    it('should reject invalid document file types', () => {
      const invalidFileType = {
        type: CertificationType.USDA_ORGANIC,
        documentUrl: 'https://s3.example.com/cert.txt',
        issuingBody: 'USDA',
      };

      const result = addCertificationSchema.safeParse(invalidFileType);
      expect(result.success).toBe(false);
    });

    it('should reject expired expiration dates', () => {
      const expiredCert = {
        type: CertificationType.USDA_ORGANIC,
        expirationDate: '2020-12-31T00:00:00Z',
        documentUrl: 'https://s3.example.com/cert.pdf',
        issuingBody: 'USDA',
      };

      const result = addCertificationSchema.safeParse(expiredCert);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('future');
      }
    });
  });

  describe('certificationVerificationSchema', () => {
    it('should validate approval decision', () => {
      const approval = {
        certificationId: '550e8400-e29b-41d4-a716-446655440000',
        decision: 'approve' as const,
        note: 'Certificate verified against official database',
      };

      const result = certificationVerificationSchema.safeParse(approval);
      expect(result.success).toBe(true);
    });

    it('should validate rejection with reason', () => {
      const rejection = {
        certificationId: '550e8400-e29b-41d4-a716-446655440000',
        decision: 'reject' as const,
        rejectionReason: 'Document appears to be expired based on visible date',
      };

      const result = certificationVerificationSchema.safeParse(rejection);
      expect(result.success).toBe(true);
    });

    it('should require rejection reason to be at least 10 characters', () => {
      const shortReason = {
        certificationId: '550e8400-e29b-41d4-a716-446655440000',
        decision: 'reject' as const,
        rejectionReason: 'Too short',
      };

      const result = certificationVerificationSchema.safeParse(shortReason);
      expect(result.success).toBe(false);
    });
  });

  describe('completeProfileSchema', () => {
    it('should validate complete profile', () => {
      const completeProfile = {
        brandName: 'Luminara Skincare',
        tagline: 'Clean beauty for sensitive souls',
        founderStory: 'A'.repeat(100), // At least 100 characters
        logoUrl: 'https://cdn.example.com/logo.png',
        heroImageUrl: 'https://cdn.example.com/hero.jpg',
        websiteUrl: 'https://luminaraskincare.com',
        foundedYear: 2020,
        headquarters: 'Austin, TX',
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
      };

      const result = completeProfileSchema.safeParse(completeProfile);
      expect(result.success).toBe(true);
    });

    it('should require founder story to be at least 100 characters', () => {
      const shortStory = {
        brandName: 'Luminara Skincare',
        tagline: 'Clean beauty',
        founderStory: 'Too short',
        logoUrl: 'https://cdn.example.com/logo.png',
        heroImageUrl: 'https://cdn.example.com/hero.jpg',
        websiteUrl: 'https://luminaraskincare.com',
        foundedYear: 2020,
        headquarters: 'Austin, TX',
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
      };

      const result = completeProfileSchema.safeParse(shortStory);
      expect(result.success).toBe(false);
    });
  });

  describe('minimumProfileRequirements', () => {
    it('should validate minimum requirements for going live', () => {
      const minProfile = {
        brandName: 'Luminara Skincare',
        logoUrl: 'https://cdn.example.com/logo.png',
        websiteUrl: 'https://luminaraskincare.com',
        founderStory: 'A'.repeat(100),
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
      };

      const result = minimumProfileRequirements.safeParse(minProfile);
      expect(result.success).toBe(true);
    });

    it('should require at least 3 values', () => {
      const tooFewValues = {
        brandName: 'Luminara Skincare',
        logoUrl: 'https://cdn.example.com/logo.png',
        websiteUrl: 'https://luminaraskincare.com',
        founderStory: 'A'.repeat(100),
        values: [VendorValue.CLEAN_BEAUTY],
      };

      const result = minimumProfileRequirements.safeParse(tooFewValues);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('3 values');
      }
    });
  });

  describe('calculateCompletenessScore', () => {
    it('should return 0 for empty profile', () => {
      const emptyProfile = {};
      const score = calculateCompletenessScore(emptyProfile);
      expect(score).toBe(0);
    });

    it('should give 10 points for critical fields', () => {
      const profileWithCriticalFields = {
        brandName: 'Luminara',
        logoUrl: 'https://cdn.example.com/logo.png',
        websiteUrl: 'https://luminaraskincare.com',
      };

      const score = calculateCompletenessScore(profileWithCriticalFields);
      expect(score).toBe(30); // 3 critical fields × 10 points
    });

    it('should give 8 points for important fields', () => {
      const profile = {
        tagline: 'Clean beauty',
        founderStory: 'A'.repeat(100),
        heroImageUrl: 'https://cdn.example.com/hero.jpg',
      };

      const score = calculateCompletenessScore(profile);
      expect(score).toBe(24); // 3 important fields × 8 points
    });

    it('should give points for values (up to 3)', () => {
      const profileWith1Value = {
        values: [VendorValue.CLEAN_BEAUTY],
      };
      const score1 = calculateCompletenessScore(profileWith1Value);
      expect(score1).toBe(2); // 1 value × (5/3) = 1.67, rounded to 2

      const profileWith3Values = {
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
      };
      const score3 = calculateCompletenessScore(profileWith3Values);
      expect(score3).toBe(5); // 3 values × (5/3) = 5
    });

    it('should give 10 points for verified certifications', () => {
      const profile = {
        certifications: [{ verificationStatus: 'verified' }],
      };

      const score = calculateCompletenessScore(profile);
      expect(score).toBe(10);
    });

    it('should not give points for unverified certifications', () => {
      const profile = {
        certifications: [{ verificationStatus: 'pending' }],
      };

      const score = calculateCompletenessScore(profile);
      expect(score).toBe(0);
    });

    it('should cap score at 100', () => {
      const maxProfile = {
        brandName: 'Luminara',
        tagline: 'Clean beauty',
        founderStory: 'A'.repeat(100),
        missionStatement: 'Create products...',
        logoUrl: 'https://cdn.example.com/logo.png',
        heroImageUrl: 'https://cdn.example.com/hero.jpg',
        brandColorPrimary: '#2d5a47',
        brandColorSecondary: '#b8926a',
        galleryImages: ['https://cdn.example.com/img1.jpg'],
        websiteUrl: 'https://luminaraskincare.com',
        socialLinks: { instagram: 'https://instagram.com/brand' },
        foundedYear: 2020,
        headquarters: 'Austin, TX',
        teamSize: TeamSize.ELEVEN_TO_FIFTY,
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
        certifications: [{ verificationStatus: 'verified' }],
      };

      const score = calculateCompletenessScore(maxProfile);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate realistic completeness score', () => {
      const realisticProfile = {
        brandName: 'Luminara Skincare',
        tagline: 'Clean beauty for sensitive souls',
        founderStory: 'A'.repeat(150),
        logoUrl: 'https://cdn.example.com/logo.png',
        heroImageUrl: 'https://cdn.example.com/hero.jpg',
        websiteUrl: 'https://luminaraskincare.com',
        foundedYear: 2019,
        headquarters: 'Austin, TX',
        values: [VendorValue.CLEAN_BEAUTY, VendorValue.VEGAN, VendorValue.WOMAN_FOUNDED],
      };

      const score = calculateCompletenessScore(realisticProfile);
      expect(score).toBeGreaterThan(50);
      expect(score).toBeLessThan(100);
    });
  });
});
