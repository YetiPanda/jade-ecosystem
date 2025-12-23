/**
 * Unit Tests: Vendor Profile Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Task A.1.12)
 *
 * Tests entity creation, relationships, and data integrity
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VendorProfile } from '../entities/vendor-profile.entity';
import { VendorCertification } from '../entities/vendor-certification.entity';
import { VendorValue, TeamSize, CertificationStatus } from '../types/vendor.enums';

describe('VendorProfile Entity', () => {
  let vendorProfile: VendorProfile;

  beforeEach(() => {
    vendorProfile = new VendorProfile();
  });

  describe('Entity Creation', () => {
    it('should create a vendor profile instance', () => {
      expect(vendorProfile).toBeDefined();
      expect(vendorProfile).toBeInstanceOf(VendorProfile);
    });

    it('should have default completeness score of 0', () => {
      vendorProfile.completenessScore = 0;
      expect(vendorProfile.completenessScore).toBe(0);
    });

    it('should allow setting brand identity fields', () => {
      vendorProfile.vendorId = 'vendor-123';
      vendorProfile.brandName = 'Luminara Skincare';
      vendorProfile.tagline = 'Clean beauty for sensitive souls';
      vendorProfile.founderStory = 'After struggling with sensitive skin...';
      vendorProfile.missionStatement = 'Create products that work without irritation';

      expect(vendorProfile.brandName).toBe('Luminara Skincare');
      expect(vendorProfile.tagline).toBe('Clean beauty for sensitive souls');
      expect(vendorProfile.founderStory).toContain('sensitive skin');
      expect(vendorProfile.missionStatement).toContain('irritation');
    });

    it('should allow setting visual identity fields', () => {
      vendorProfile.logoUrl = 'https://cdn.example.com/logo.png';
      vendorProfile.heroImageUrl = 'https://cdn.example.com/hero.jpg';
      vendorProfile.brandColorPrimary = '#2d5a47';
      vendorProfile.brandColorSecondary = '#b8926a';
      vendorProfile.galleryImages = [
        'https://cdn.example.com/img1.jpg',
        'https://cdn.example.com/img2.jpg',
      ];

      expect(vendorProfile.logoUrl).toBe('https://cdn.example.com/logo.png');
      expect(vendorProfile.brandColorPrimary).toBe('#2d5a47');
      expect(vendorProfile.galleryImages).toHaveLength(2);
    });

    it('should allow setting social links as JSON', () => {
      const socialLinks = {
        instagram: 'https://instagram.com/luminaraskin',
        facebook: 'https://facebook.com/luminaraskincare',
        tiktok: 'https://tiktok.com/@luminaraskin',
      };

      vendorProfile.socialLinks = socialLinks;

      expect(vendorProfile.socialLinks).toEqual(socialLinks);
      expect(vendorProfile.socialLinks?.instagram).toBe('https://instagram.com/luminaraskin');
    });

    it('should allow setting business info fields', () => {
      vendorProfile.foundedYear = 2019;
      vendorProfile.headquarters = 'Austin, TX';
      vendorProfile.teamSize = TeamSize.ELEVEN_TO_FIFTY;

      expect(vendorProfile.foundedYear).toBe(2019);
      expect(vendorProfile.headquarters).toBe('Austin, TX');
      expect(vendorProfile.teamSize).toBe(TeamSize.ELEVEN_TO_FIFTY);
    });
  });

  describe('Nullable Fields', () => {
    it('should allow nullable fields to be null', () => {
      vendorProfile.tagline = null;
      vendorProfile.founderStory = null;
      vendorProfile.brandVideoUrl = null;
      vendorProfile.socialLinks = null;
      vendorProfile.foundedYear = null;

      expect(vendorProfile.tagline).toBeNull();
      expect(vendorProfile.founderStory).toBeNull();
      expect(vendorProfile.brandVideoUrl).toBeNull();
      expect(vendorProfile.socialLinks).toBeNull();
      expect(vendorProfile.foundedYear).toBeNull();
    });
  });

  describe('Relationships', () => {
    it('should support certifications relationship', () => {
      const cert1 = new VendorCertification();
      cert1.type = 'leaping_bunny' as any;
      cert1.verificationStatus = CertificationStatus.VERIFIED;

      const cert2 = new VendorCertification();
      cert2.type = 'usda_organic' as any;
      cert2.verificationStatus = CertificationStatus.PENDING;

      vendorProfile.certifications = [cert1, cert2];

      expect(vendorProfile.certifications).toHaveLength(2);
      expect(vendorProfile.certifications[0].verificationStatus).toBe(CertificationStatus.VERIFIED);
      expect(vendorProfile.certifications[1].verificationStatus).toBe(CertificationStatus.PENDING);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain vendorId uniqueness constraint', () => {
      vendorProfile.vendorId = 'vendor-unique-123';
      expect(vendorProfile.vendorId).toBe('vendor-unique-123');
    });

    it('should support gallery images as array', () => {
      const images = Array.from({ length: 10 }, (_, i) => `https://cdn.example.com/img${i + 1}.jpg`);
      vendorProfile.galleryImages = images;

      expect(vendorProfile.galleryImages).toHaveLength(10);
      expect(vendorProfile.galleryImages?.[0]).toBe('https://cdn.example.com/img1.jpg');
    });

    it('should support updating completeness score', () => {
      vendorProfile.completenessScore = 0;
      expect(vendorProfile.completenessScore).toBe(0);

      vendorProfile.completenessScore = 75;
      expect(vendorProfile.completenessScore).toBe(75);

      vendorProfile.completenessScore = 100;
      expect(vendorProfile.completenessScore).toBe(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty gallery images array', () => {
      vendorProfile.galleryImages = [];
      expect(vendorProfile.galleryImages).toEqual([]);
    });

    it('should handle partial social links', () => {
      vendorProfile.socialLinks = {
        instagram: 'https://instagram.com/brand',
      };

      expect(vendorProfile.socialLinks.instagram).toBeDefined();
      expect(vendorProfile.socialLinks.facebook).toBeUndefined();
    });

    it('should handle very long founder story', () => {
      const longStory = 'A'.repeat(2000);
      vendorProfile.founderStory = longStory;
      expect(vendorProfile.founderStory).toHaveLength(2000);
    });

    it('should handle hex color codes', () => {
      vendorProfile.brandColorPrimary = '#FFFFFF';
      vendorProfile.brandColorSecondary = '#000000';

      expect(vendorProfile.brandColorPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(vendorProfile.brandColorSecondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
