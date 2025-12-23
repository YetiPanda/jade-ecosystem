/**
 * CapabilityVerifierService - Service Provider Capability Verification
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T109
 *
 * Purpose: Verify that service providers have the required certifications
 * and capabilities to perform requested services
 *
 * NOTE: This is a simplified version focused on internal capability checking.
 * Full state board license verification would be implemented in the vendor
 * wholesale marketplace for product sales compliance.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProvider, LicenseInfo } from '../entities/service-provider.entity';

/**
 * Verification Result
 */
export interface VerificationResult {
  isVerified: boolean;
  reasons: string[];
  warnings: string[];
  verifiedLicense?: LicenseInfo;
}

/**
 * Capability Check Input
 */
export interface CapabilityCheckInput {
  providerId: string;
  serviceType: string;
  state?: string; // Optional for state-specific requirements
}

/**
 * License Status
 */
export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  PENDING_RENEWAL = 'PENDING_RENEWAL',
}

@Injectable()
export class CapabilityVerifierService {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
  ) {}

  /**
   * Verify that a provider can perform a specific service
   *
   * Checks:
   * 1. Provider exists and is active
   * 2. Provider offers this service type
   * 3. Provider has required certifications
   * 4. Certifications are not expired
   */
  async verifyCapability(
    input: CapabilityCheckInput,
  ): Promise<VerificationResult> {
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Fetch provider
    const provider = await this.providerRepo.findOne({
      where: { id: input.providerId },
    });

    if (!provider) {
      reasons.push(`Provider with ID ${input.providerId} not found`);
      return {
        isVerified: false,
        reasons,
        warnings,
      };
    }

    // Check if provider is active
    if (!provider.isActive) {
      reasons.push('Provider account is not active');
      return {
        isVerified: false,
        reasons,
        warnings,
      };
    }

    // Check if provider offers this service
    const service = provider.services.find(
      (s) => s.serviceType === input.serviceType,
    );

    if (!service) {
      reasons.push(
        `Provider does not offer service type: ${input.serviceType}`,
      );
      return {
        isVerified: false,
        reasons,
        warnings,
      };
    }

    // Check if service requires certifications
    const requiredCerts = service.requiredCertifications || [];

    if (requiredCerts.length > 0) {
      // Get provider's active certifications
      const providerCerts = this.getProviderCertifications(provider);

      // Check each required certification
      for (const requiredCert of requiredCerts) {
        if (!providerCerts.includes(requiredCert)) {
          reasons.push(
            `Provider lacks required certification: ${requiredCert}`,
          );
        }
      }
    }

    // Check for active license if licenses exist
    let verifiedLicense: LicenseInfo | undefined;

    if (provider.licenses.length > 0) {
      const activeLicense = provider.getActiveLicense(input.state);

      if (!activeLicense) {
        reasons.push('Provider does not have an active license');
      } else {
        verifiedLicense = activeLicense;

        // Check if license covers this service
        if (
          activeLicense.authorizedServices.length > 0 &&
          !activeLicense.authorizedServices.includes(input.serviceType)
        ) {
          reasons.push(
            `License does not authorize service type: ${input.serviceType}`,
          );
        }

        // Check for expiring license (within 30 days)
        const expirationDate = new Date(activeLicense.expirationDate);
        const daysUntilExpiration = Math.floor(
          (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );

        if (daysUntilExpiration <= 30 && daysUntilExpiration > 0) {
          warnings.push(
            `Provider license expires in ${daysUntilExpiration} days`,
          );
        }
      }
    }

    // If no reasons, verification passed
    const isVerified = reasons.length === 0;

    return {
      isVerified,
      reasons,
      warnings,
      verifiedLicense,
    };
  }

  /**
   * Verify capabilities for multiple services
   */
  async verifyMultipleCapabilities(
    providerId: string,
    serviceTypes: string[],
  ): Promise<Record<string, VerificationResult>> {
    const results: Record<string, VerificationResult> = {};

    for (const serviceType of serviceTypes) {
      results[serviceType] = await this.verifyCapability({
        providerId,
        serviceType,
      });
    }

    return results;
  }

  /**
   * Get all valid certifications for a provider
   */
  private getProviderCertifications(provider: ServiceProvider): string[] {
    const certifications: string[] = [];

    // Get certifications from all active licenses
    for (const license of provider.licenses) {
      if (license.status === 'ACTIVE') {
        certifications.push(...license.certifications);
      }
    }

    return [...new Set(certifications)]; // Remove duplicates
  }

  /**
   * Check if provider needs license renewal
   */
  async checkLicenseRenewal(
    providerId: string,
  ): Promise<{
    needsRenewal: boolean;
    licenses: Array<{
      licenseNumber: string;
      expiresAt: string;
      daysRemaining: number;
    }>;
  }> {
    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      return {
        needsRenewal: false,
        licenses: [],
      };
    }

    const expiringLicenses = [];

    for (const license of provider.licenses) {
      if (license.status === 'ACTIVE') {
        const expirationDate = new Date(license.expirationDate);
        const daysRemaining = Math.floor(
          (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );

        // Consider licenses expiring within 60 days
        if (daysRemaining <= 60) {
          expiringLicenses.push({
            licenseNumber: license.licenseNumber,
            expiresAt: license.expirationDate,
            daysRemaining,
          });
        }
      }
    }

    return {
      needsRenewal: expiringLicenses.length > 0,
      licenses: expiringLicenses,
    };
  }

  /**
   * Get all providers capable of performing a service
   */
  async findCapableProviders(
    serviceType: string,
    state?: string,
  ): Promise<ServiceProvider[]> {
    const allProviders = await this.providerRepo.find({
      where: { isActive: true },
    });

    const capableProviders: ServiceProvider[] = [];

    for (const provider of allProviders) {
      const verification = await this.verifyCapability({
        providerId: provider.id,
        serviceType,
        state,
      });

      if (verification.isVerified) {
        capableProviders.push(provider);
      }
    }

    return capableProviders;
  }

  /**
   * Get provider capability summary
   */
  async getProviderCapabilitySummary(providerId: string): Promise<{
    providerId: string;
    providerName: string;
    isActive: boolean;
    totalServices: number;
    activeLicenses: number;
    expiringLicenses: number;
    totalCertifications: number;
    services: Array<{
      serviceType: string;
      isAuthorized: boolean;
      requiredCertifications: string[];
    }>;
  }> {
    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }

    // Count active licenses
    const activeLicenses = provider.licenses.filter(
      (l) => l.status === 'ACTIVE',
    ).length;

    // Count expiring licenses (within 60 days)
    const expiringLicenses = provider.licenses.filter((l) => {
      if (l.status === 'ACTIVE') {
        const expirationDate = new Date(l.expirationDate);
        const daysRemaining = Math.floor(
          (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        return daysRemaining <= 60 && daysRemaining > 0;
      }
      return false;
    }).length;

    // Get all certifications
    const certifications = this.getProviderCertifications(provider);

    // Check each service
    const serviceCapabilities = await Promise.all(
      provider.services.map(async (service) => {
        const verification = await this.verifyCapability({
          providerId: provider.id,
          serviceType: service.serviceType,
        });

        return {
          serviceType: service.serviceType,
          isAuthorized: verification.isVerified,
          requiredCertifications: service.requiredCertifications || [],
        };
      }),
    );

    return {
      providerId: provider.id,
      providerName: provider.name,
      isActive: provider.isActive,
      totalServices: provider.services.length,
      activeLicenses,
      expiringLicenses,
      totalCertifications: certifications.length,
      services: serviceCapabilities,
    };
  }

  /**
   * Batch verify capabilities for multiple providers and services
   * Useful for calendar views showing multiple providers
   */
  async batchVerifyCapabilities(
    checks: Array<{ providerId: string; serviceType: string }>,
  ): Promise<
    Array<{
      providerId: string;
      serviceType: string;
      isVerified: boolean;
      reasons: string[];
    }>
  > {
    const results = await Promise.all(
      checks.map(async (check) => {
        const verification = await this.verifyCapability(check);
        return {
          providerId: check.providerId,
          serviceType: check.serviceType,
          isVerified: verification.isVerified,
          reasons: verification.reasons,
        };
      }),
    );

    return results;
  }
}
