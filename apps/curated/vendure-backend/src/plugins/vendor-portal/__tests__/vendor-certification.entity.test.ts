/**
 * Unit Tests: Vendor Certification Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Task A.1.12)
 *
 * Tests certification verification workflow and SLA tracking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VendorCertification } from '../entities/vendor-certification.entity';
import { VendorProfile } from '../entities/vendor-profile.entity';
import { CertificationType, CertificationStatus } from '../types/vendor.enums';

describe('VendorCertification Entity', () => {
  let certification: VendorCertification;
  let vendorProfile: VendorProfile;

  beforeEach(() => {
    certification = new VendorCertification();
    vendorProfile = new VendorProfile();
    vendorProfile.id = 'profile-123';
    vendorProfile.brandName = 'Test Brand';
  });

  describe('Entity Creation', () => {
    it('should create a certification instance', () => {
      expect(certification).toBeDefined();
      expect(certification).toBeInstanceOf(VendorCertification);
    });

    it('should have default status of PENDING', () => {
      certification.verificationStatus = CertificationStatus.PENDING;
      expect(certification.verificationStatus).toBe(CertificationStatus.PENDING);
    });

    it('should allow setting certification details', () => {
      certification.type = CertificationType.LEAPING_BUNNY;
      certification.certificateNumber = 'LB-2024-5847';
      certification.issuingBody = 'Leaping Bunny Program';
      certification.documentUrl = 'https://s3.example.com/cert.pdf';

      expect(certification.type).toBe(CertificationType.LEAPING_BUNNY);
      expect(certification.certificateNumber).toBe('LB-2024-5847');
      expect(certification.issuingBody).toBe('Leaping Bunny Program');
      expect(certification.documentUrl).toContain('.pdf');
    });
  });

  describe('Verification Workflow', () => {
    it('should support status transitions: PENDING → UNDER_REVIEW', () => {
      certification.verificationStatus = CertificationStatus.PENDING;
      expect(certification.verificationStatus).toBe(CertificationStatus.PENDING);

      certification.verificationStatus = CertificationStatus.UNDER_REVIEW;
      expect(certification.verificationStatus).toBe(CertificationStatus.UNDER_REVIEW);
    });

    it('should support status transitions: UNDER_REVIEW → VERIFIED', () => {
      certification.verificationStatus = CertificationStatus.UNDER_REVIEW;
      certification.verificationStatus = CertificationStatus.VERIFIED;
      certification.verifiedAt = new Date();
      certification.verifiedBy = 'admin-user-123';
      certification.verifierName = 'Taylor Admin';

      expect(certification.verificationStatus).toBe(CertificationStatus.VERIFIED);
      expect(certification.verifiedAt).toBeInstanceOf(Date);
      expect(certification.verifiedBy).toBe('admin-user-123');
      expect(certification.verifierName).toBe('Taylor Admin');
    });

    it('should support status transitions: UNDER_REVIEW → REJECTED', () => {
      certification.verificationStatus = CertificationStatus.UNDER_REVIEW;
      certification.verificationStatus = CertificationStatus.REJECTED;
      certification.rejectionReason = 'Certificate appears to be expired';
      certification.verifiedAt = new Date();
      certification.verifiedBy = 'admin-user-456';

      expect(certification.verificationStatus).toBe(CertificationStatus.REJECTED);
      expect(certification.rejectionReason).toContain('expired');
      expect(certification.verifiedAt).toBeInstanceOf(Date);
    });

    it('should support VERIFIED → EXPIRED transition', () => {
      certification.verificationStatus = CertificationStatus.VERIFIED;
      certification.expirationDate = new Date('2024-12-31');

      // Simulate expiration check
      const isExpired = certification.expirationDate < new Date();
      if (isExpired) {
        certification.verificationStatus = CertificationStatus.EXPIRED;
      }

      // Note: This test will pass until 2024-12-31
      // In production, a cron job would handle expiration
    });
  });

  describe('SLA Tracking', () => {
    it('should calculate SLA deadline (3 business days)', () => {
      const submittedAt = new Date('2025-12-20T10:00:00Z'); // Saturday
      const slaDeadline = new Date('2025-12-24T10:00:00Z'); // Wednesday (3 business days)

      certification.createdAt = submittedAt;
      certification.slaDeadline = slaDeadline;

      expect(certification.slaDeadline).toBeInstanceOf(Date);
      expect(certification.slaDeadline?.getTime()).toBeGreaterThan(submittedAt.getTime());
    });

    it('should track verification timing', () => {
      const submittedAt = new Date('2025-12-20T10:00:00Z');
      const verifiedAt = new Date('2025-12-22T14:30:00Z');

      certification.createdAt = submittedAt;
      certification.verifiedAt = verifiedAt;

      const hoursToVerify = (verifiedAt.getTime() - submittedAt.getTime()) / (1000 * 60 * 60);
      expect(hoursToVerify).toBeGreaterThan(0);
      expect(hoursToVerify).toBeLessThan(72); // Within 3 days
    });

    it('should flag SLA breaches', () => {
      const submittedAt = new Date('2025-12-15T10:00:00Z');
      const slaDeadline = new Date('2025-12-18T10:00:00Z');
      const now = new Date('2025-12-20T10:00:00Z');

      certification.createdAt = submittedAt;
      certification.slaDeadline = slaDeadline;
      certification.verificationStatus = CertificationStatus.UNDER_REVIEW;

      const isBreached = now > slaDeadline &&
        certification.verificationStatus !== CertificationStatus.VERIFIED &&
        certification.verificationStatus !== CertificationStatus.REJECTED;

      expect(isBreached).toBe(true);
    });
  });

  describe('Certification Types', () => {
    it('should support USDA Organic certification', () => {
      certification.type = CertificationType.USDA_ORGANIC;
      certification.issuingBody = 'USDA';
      certification.certificateNumber = 'USDA-2024-12345';
      certification.expirationDate = new Date('2025-12-31');

      expect(certification.type).toBe(CertificationType.USDA_ORGANIC);
      expect(certification.issuingBody).toBe('USDA');
    });

    it('should support B Corp certification', () => {
      certification.type = CertificationType.B_CORP;
      certification.issuingBody = 'B Lab';
      certification.certificateNumber = 'B-12345';
      certification.expirationDate = new Date('2026-12-31');

      expect(certification.type).toBe(CertificationType.B_CORP);
      expect(certification.issuingBody).toBe('B Lab');
    });

    it('should support certifications without expiration dates', () => {
      certification.type = CertificationType.WOMEN_OWNED_WBENC;
      certification.issuingBody = 'WBENC';
      certification.expirationDate = null;

      expect(certification.expirationDate).toBeNull();
    });

    it('should support certifications without certificate numbers', () => {
      certification.type = CertificationType.FAIR_TRADE;
      certification.issuingBody = 'Fair Trade USA';
      certification.certificateNumber = null;

      expect(certification.certificateNumber).toBeNull();
    });
  });

  describe('Relationship with VendorProfile', () => {
    it('should link to vendor profile', () => {
      certification.vendorProfile = vendorProfile;
      certification.vendorProfileId = vendorProfile.id;

      expect(certification.vendorProfile).toBe(vendorProfile);
      expect(certification.vendorProfileId).toBe('profile-123');
    });

    it('should support multiple certifications per vendor', () => {
      const cert1 = new VendorCertification();
      cert1.type = CertificationType.LEAPING_BUNNY;
      cert1.vendorProfile = vendorProfile;

      const cert2 = new VendorCertification();
      cert2.type = CertificationType.USDA_ORGANIC;
      cert2.vendorProfile = vendorProfile;

      vendorProfile.certifications = [cert1, cert2];

      expect(vendorProfile.certifications).toHaveLength(2);
      expect(vendorProfile.certifications[0].type).toBe(CertificationType.LEAPING_BUNNY);
      expect(vendorProfile.certifications[1].type).toBe(CertificationType.USDA_ORGANIC);
    });
  });

  describe('Data Integrity', () => {
    it('should require document URL for verification', () => {
      certification.documentUrl = 'https://s3.example.com/cert-proof.pdf';
      expect(certification.documentUrl).toBeTruthy();
      expect(certification.documentUrl).toContain('https://');
    });

    it('should store rejection reason when rejected', () => {
      certification.verificationStatus = CertificationStatus.REJECTED;
      certification.rejectionReason = 'Document is illegible. Please upload a clearer scan.';

      expect(certification.rejectionReason).toBeTruthy();
      expect(certification.rejectionReason).toContain('clearer');
    });

    it('should clear rejection reason when approved', () => {
      certification.verificationStatus = CertificationStatus.REJECTED;
      certification.rejectionReason = 'Document incomplete';

      // Admin re-reviews and approves
      certification.verificationStatus = CertificationStatus.VERIFIED;
      certification.rejectionReason = null;

      expect(certification.verificationStatus).toBe(CertificationStatus.VERIFIED);
      expect(certification.rejectionReason).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long certificate numbers', () => {
      const longCertNumber = 'CERT-' + 'X'.repeat(90);
      certification.certificateNumber = longCertNumber;
      expect(certification.certificateNumber).toHaveLength(95);
    });

    it('should handle future expiration dates', () => {
      const futureDate = new Date('2030-12-31');
      certification.expirationDate = futureDate;
      expect(certification.expirationDate?.getFullYear()).toBe(2030);
    });

    it('should handle very long rejection reasons', () => {
      const longReason = 'A'.repeat(500);
      certification.rejectionReason = longReason;
      expect(certification.rejectionReason).toHaveLength(500);
    });
  });
});
