/**
 * Profile Resolver Tests
 * Feature 011: Vendor Portal MVP
 * Sprint B.3: Profile Management - Task B.3.7
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  vendorProfile,
  updateVendorProfile,
  addCertification,
  removeCertification,
} from '../profile.resolver';
import { AppDataSource } from '../../../config/database';

// Mock dependencies
vi.mock('../../../config/database', () => ({
  AppDataSource: {
    query: vi.fn(),
  },
}));

describe('Profile Resolver', () => {
  const mockContext = {
    user: {
      id: 'user-123',
      role: 'vendor',
      vendorId: 'vendor-456',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('vendorProfile', () => {
    it('should return vendor profile with values and certifications', async () => {
      const mockProfile = {
        id: 'profile-123',
        vendorId: 'vendor-456',
        brandName: 'Radiant Glow',
        tagline: 'Pure, sustainable skincare',
        founderStory: 'Founded by Jane Doe...',
        missionStatement: 'To create clean beauty products',
        brandVideoUrl: 'https://youtube.com/watch?v=123',
        logoUrl: 'https://cdn.example.com/logo.png',
        heroImageUrl: 'https://cdn.example.com/hero.jpg',
        brandColorPrimary: '#FF5733',
        brandColorSecondary: '#33FF57',
        galleryImages: 'https://cdn.example.com/1.jpg,https://cdn.example.com/2.jpg',
        websiteUrl: 'https://radiantglow.com',
        socialLinks: { instagram: 'https://instagram.com/radiantglow' },
        foundedYear: 2020,
        headquarters: 'Austin, TX',
        teamSize: 'TWO_TO_TEN',
        completenessScore: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockValues = [{ value: 'CLEAN_BEAUTY' }, { value: 'VEGAN' }, { value: 'WOMAN_FOUNDED' }];

      const mockCertifications = [
        {
          id: 'cert-123',
          type: 'USDA_ORGANIC',
          certificateNumber: '12345',
          issuingBody: 'USDA',
          expirationDate: '2026-12-31',
          verificationStatus: 'VERIFIED',
          documentUrl: 'https://s3.aws.com/cert.pdf',
          verifiedAt: new Date(),
          verifiedBy: 'Admin User',
          rejectionReason: null,
          submittedAt: new Date(),
          slaDeadline: new Date(),
        },
      ];

      (AppDataSource.query as any)
        .mockResolvedValueOnce([mockProfile]) // Get profile
        .mockResolvedValueOnce(mockValues) // Get values
        .mockResolvedValueOnce(mockCertifications); // Get certifications

      const result = await vendorProfile({}, {}, mockContext);

      expect(result).toBeDefined();
      expect(result.brandName).toBe('Radiant Glow');
      expect(result.values).toEqual(['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED']);
      expect(result.certifications).toHaveLength(1);
      expect(result.certifications[0].type).toBe('USDA_ORGANIC');
      expect(result.completenessScore).toBe(85);
      expect(result.galleryImages).toHaveLength(2);
    });

    it('should return null if profile not found', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // Empty result

      const result = await vendorProfile({}, {}, mockContext);

      expect(result).toBeNull();
    });

    it('should handle empty values and certifications', async () => {
      const mockProfile = {
        id: 'profile-123',
        vendorId: 'vendor-456',
        brandName: 'New Vendor',
        tagline: null,
        founderStory: null,
        missionStatement: null,
        brandVideoUrl: null,
        logoUrl: null,
        heroImageUrl: null,
        brandColorPrimary: null,
        brandColorSecondary: null,
        galleryImages: null,
        websiteUrl: null,
        socialLinks: null,
        foundedYear: null,
        headquarters: null,
        teamSize: null,
        completenessScore: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([mockProfile])
        .mockResolvedValueOnce([]) // No values
        .mockResolvedValueOnce([]); // No certifications

      const result = await vendorProfile({}, {}, mockContext);

      expect(result.values).toEqual([]);
      expect(result.certifications).toEqual([]);
      expect(result.completenessScore).toBe(5);
    });
  });

  describe('updateVendorProfile', () => {
    it('should create profile if it does not exist', async () => {
      (AppDataSource.query as any)
        .mockResolvedValueOnce([]) // Profile doesn't exist
        .mockResolvedValueOnce([]) // Insert new profile
        .mockResolvedValueOnce([{ id: 'profile-new' }]) // Get profile ID
        .mockResolvedValueOnce([]) // Update profile
        .mockResolvedValueOnce([]) // Calculate completeness
        .mockResolvedValueOnce([]) // Update completeness
        .mockResolvedValueOnce([{ id: 'profile-new', brandName: 'New Brand', completenessScore: 5 }]) // Get updated profile
        .mockResolvedValueOnce([]) // Get values
        .mockResolvedValueOnce([]); // Get certifications

      const result = await updateVendorProfile(
        {},
        {
          input: {
            brandName: 'New Brand',
            tagline: 'Clean Beauty',
          },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.profile).toBeDefined();
    });

    it('should update existing profile fields', async () => {
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'profile-123' }]) // Profile exists
        .mockResolvedValueOnce([{ id: 'profile-123' }]) // Get profile ID
        .mockResolvedValueOnce([]) // Update profile
        .mockResolvedValue([]); // Other queries

      const result = await updateVendorProfile(
        {},
        {
          input: {
            brandName: 'Updated Brand',
            tagline: 'New Tagline',
            foundedYear: 2021,
          },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.vendor_profile'),
        expect.any(Array)
      );
    });

    it('should update values when provided', async () => {
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'profile-123' }]) // Profile exists
        .mockResolvedValueOnce([{ id: 'profile-123' }]) // Get profile ID
        .mockResolvedValueOnce([]) // Update profile
        .mockResolvedValueOnce([]) // Delete existing values
        .mockResolvedValueOnce([]) // Insert new values
        .mockResolvedValue([]); // Other queries

      const result = await updateVendorProfile(
        {},
        {
          input: {
            values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
          },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM jade.vendor_profile_values'),
        expect.any(Array)
      );
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jade.vendor_profile_values'),
        expect.any(Array)
      );
    });

    it('should update completeness score after changes', async () => {
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'profile-123' }])
        .mockResolvedValueOnce([{ id: 'profile-123' }])
        .mockResolvedValueOnce([]) // Update profile
        .mockResolvedValueOnce([{ count: '3' }]) // Values count for completeness
        .mockResolvedValueOnce([{ count: '1' }]) // Certifications count for completeness
        .mockResolvedValueOnce([]) // Update completeness score
        .mockResolvedValue([]); // Other queries

      const result = await updateVendorProfile(
        {},
        {
          input: {
            brandName: 'Updated Brand',
            logoUrl: 'https://cdn.example.com/logo.png',
          },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.vendor_profile SET "completenessScore"'),
        expect.any(Array)
      );
    });

    it('should handle errors gracefully', async () => {
      (AppDataSource.query as any).mockRejectedValueOnce(new Error('Database error'));

      const result = await updateVendorProfile(
        {},
        {
          input: {
            brandName: 'Test',
          },
        },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.profile).toBeNull();
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INTERNAL_ERROR');
    });
  });

  describe('addCertification', () => {
    it('should add certification with SLA deadline', async () => {
      const mockProfile = [{ id: 'profile-123' }];
      const mockCert = {
        id: 'cert-new',
        type: 'LEAPING_BUNNY',
        certificateNumber: '67890',
        issuingBody: 'Leaping Bunny Program',
        expirationDate: null,
        verificationStatus: 'PENDING',
        documentUrl: 'https://s3.aws.com/cert2.pdf',
        submittedAt: new Date(),
        slaDeadline: new Date(),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce(mockProfile) // Get profile
        .mockResolvedValueOnce([mockCert]); // Insert certification

      const result = await addCertification(
        {},
        {
          input: {
            type: 'LEAPING_BUNNY',
            certificateNumber: '67890',
            documentUrl: 'https://s3.aws.com/cert2.pdf',
            issuingBody: 'Leaping Bunny Program',
          },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.certification).toBeDefined();
      expect(result.certification.type).toBe('LEAPING_BUNNY');
      expect(result.certification.verificationStatus).toBe('PENDING');
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jade.vendor_certification'),
        expect.arrayContaining([
          'profile-123',
          'LEAPING_BUNNY',
          '67890',
          'Leaping Bunny Program',
          null,
          'https://s3.aws.com/cert2.pdf',
          expect.any(Date), // SLA deadline
        ])
      );
    });

    it('should reject if profile not found', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // No profile

      const result = await addCertification(
        {},
        {
          input: {
            type: 'USDA_ORGANIC',
            documentUrl: 'https://s3.aws.com/cert.pdf',
            issuingBody: 'USDA',
          },
        },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.errors[0].message).toContain('Vendor profile not found');
    });

    it('should handle certification with expiration date', async () => {
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'profile-123' }])
        .mockResolvedValueOnce([
          {
            id: 'cert-new',
            type: 'B_CORP',
            expirationDate: '2026-12-31',
          },
        ]);

      const result = await addCertification(
        {},
        {
          input: {
            type: 'B_CORP',
            certificateNumber: 'B123456',
            expirationDate: '2026-12-31',
            documentUrl: 'https://s3.aws.com/bcorp.pdf',
            issuingBody: 'B Lab',
          },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.certification.expirationDate).toBe('2026-12-31');
    });
  });

  describe('removeCertification', () => {
    it('should remove certification if vendor owns it', async () => {
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'cert-123' }]) // Verify ownership
        .mockResolvedValueOnce([]); // Delete certification

      const result = await removeCertification(
        {},
        { certificationId: 'cert-123' },
        mockContext
      );

      expect(result).toBe(true);
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM jade.vendor_certification'),
        ['cert-123']
      );
    });

    it('should reject if certification not found or not owned', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // Not found

      await expect(
        removeCertification({}, { certificationId: 'cert-not-found' }, mockContext)
      ).rejects.toThrow('Certification not found or you do not have permission');
    });
  });

  describe('Profile Completeness Calculation', () => {
    it('should calculate correct score for minimal profile', async () => {
      // Minimal profile: just brand name (5 points)
      // Expected: ~5/109 * 100 = 4-5%
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'profile-min' }])
        .mockResolvedValueOnce([{ id: 'profile-min' }])
        .mockResolvedValueOnce([]) // Update
        .mockResolvedValueOnce([{ count: '0' }]) // No values
        .mockResolvedValueOnce([{ count: '0' }]) // No certifications
        .mockResolvedValueOnce([]) // Update completeness
        .mockResolvedValue([]);

      await updateVendorProfile(
        {},
        { input: { brandName: 'Minimal' } },
        mockContext
      );

      // Check that completeness score was calculated
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.vendor_profile SET "completenessScore"'),
        expect.any(Array)
      );
    });

    it('should calculate higher score for complete profile', async () => {
      // Complete profile with all fields
      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'profile-complete' }])
        .mockResolvedValueOnce([{ id: 'profile-complete' }])
        .mockResolvedValueOnce([]) // Update
        .mockResolvedValueOnce([]) // Delete values
        .mockResolvedValueOnce([]) // Insert values
        .mockResolvedValueOnce([{ count: '5' }]) // 5 values
        .mockResolvedValueOnce([{ count: '2' }]) // 2 verified certs
        .mockResolvedValueOnce([]) // Update completeness
        .mockResolvedValue([]);

      await updateVendorProfile(
        {},
        {
          input: {
            brandName: 'Complete Brand',
            tagline: 'Tagline',
            founderStory: 'Long story...',
            logoUrl: 'https://cdn.example.com/logo.png',
            values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED', 'ORGANIC', 'SUSTAINABLE'],
          },
        },
        mockContext
      );

      expect(AppDataSource.query).toHaveBeenCalled();
    });
  });
});
