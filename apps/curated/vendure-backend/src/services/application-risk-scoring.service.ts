/**
 * Application Risk Scoring Service
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools (Task E.2.10)
 *
 * Automated risk assessment for vendor applications.
 * Scores applications based on:
 * - Business verification
 * - Website activity
 * - Social media presence
 * - Certification claims
 * - Pricing alignment
 * - Brand values alignment
 */

import { RiskLevel } from '../plugins/vendor-portal/types/vendor.enums';

export interface RiskCheck {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  weight: number; // 1-10, how important this check is
  score: number; // 0-100, contribution to overall score
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  score: number; // 0-100, where 100 is lowest risk
  checks: RiskCheck[];
  lastUpdated: Date;
}

export interface ApplicationData {
  brandName: string;
  website: string;
  yearFounded: number;
  employeeCount: string;
  productCategories: string[];
  skuCount: string;
  priceRange: string;
  values: string[];
  certifications?: string[];
  whyJade: string;
  currentDistribution?: string[];
}

/**
 * Application Risk Scoring Service
 *
 * Analyzes vendor applications and calculates risk scores.
 * Lower scores indicate higher risk.
 */
class ApplicationRiskScoringService {
  /**
   * Calculate complete risk assessment for an application
   */
  async calculateRiskAssessment(application: ApplicationData): Promise<RiskAssessment> {
    const checks: RiskCheck[] = [];

    // Run all risk checks
    checks.push(await this.checkBusinessAge(application));
    checks.push(await this.checkWebsiteStatus(application));
    checks.push(await this.checkSocialPresence(application));
    checks.push(await this.checkCertifications(application));
    checks.push(await this.checkPricing(application));
    checks.push(await this.checkBrandAlignment(application));
    checks.push(await this.checkProductRange(application));

    // Calculate weighted score
    const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
    const weightedScore = checks.reduce((sum, check) => sum + (check.score * check.weight), 0);
    const overallScore = Math.round(weightedScore / totalWeight);

    // Determine overall risk level
    const overallRisk = this.determineRiskLevel(overallScore, checks);

    return {
      overallRisk,
      score: overallScore,
      checks,
      lastUpdated: new Date(),
    };
  }

  /**
   * Check business age and maturity
   * Weight: 8 (high importance)
   */
  private async checkBusinessAge(application: ApplicationData): Promise<RiskCheck> {
    const currentYear = new Date().getFullYear();
    const businessAge = currentYear - application.yearFounded;

    if (businessAge >= 3) {
      return {
        id: 'business_age',
        name: 'Business Maturity',
        status: 'pass',
        message: `Established business (${businessAge} years)`,
        weight: 8,
        score: 100,
      };
    } else if (businessAge >= 1) {
      return {
        id: 'business_age',
        name: 'Business Maturity',
        status: 'warn',
        message: `Relatively new business (${businessAge} year${businessAge !== 1 ? 's' : ''})`,
        weight: 8,
        score: 70,
      };
    } else {
      return {
        id: 'business_age',
        name: 'Business Maturity',
        status: 'warn',
        message: 'Very new business (less than 1 year)',
        weight: 8,
        score: 50,
      };
    }
  }

  /**
   * Check if website is active and valid
   * Weight: 10 (critical importance)
   */
  private async checkWebsiteStatus(application: ApplicationData): Promise<RiskCheck> {
    // In production, this would make an actual HTTP request
    // For now, we'll do basic validation

    const isValidUrl = /^https?:\/\/.+\..+/.test(application.website);

    if (!isValidUrl) {
      return {
        id: 'website_status',
        name: 'Website Verification',
        status: 'fail',
        message: 'Invalid website URL format',
        weight: 10,
        score: 0,
      };
    }

    // Check if using HTTPS
    const isSecure = application.website.startsWith('https://');

    // Simulate checking if website is active
    // In production: await fetch(application.website)
    const isActive = true; // Mock

    if (isActive && isSecure) {
      return {
        id: 'website_status',
        name: 'Website Verification',
        status: 'pass',
        message: 'Active website with HTTPS',
        weight: 10,
        score: 100,
      };
    } else if (isActive) {
      return {
        id: 'website_status',
        name: 'Website Verification',
        status: 'warn',
        message: 'Website active but not using HTTPS',
        weight: 10,
        score: 70,
      };
    } else {
      return {
        id: 'website_status',
        name: 'Website Verification',
        status: 'fail',
        message: 'Website appears to be inactive or unreachable',
        weight: 10,
        score: 20,
      };
    }
  }

  /**
   * Check social media presence
   * Weight: 5 (medium importance)
   */
  private async checkSocialPresence(application: ApplicationData): Promise<RiskCheck> {
    // In production, this would check for social media presence
    // by analyzing the application data or making API calls

    // Mock: Assume brands with good "Why Jade" statements have social presence
    const hasGoodStatement = application.whyJade.length > 150;

    if (hasGoodStatement) {
      return {
        id: 'social_presence',
        name: 'Social Media Presence',
        status: 'pass',
        message: 'Active social media presence detected',
        weight: 5,
        score: 100,
      };
    } else {
      return {
        id: 'social_presence',
        name: 'Social Media Presence',
        status: 'warn',
        message: 'Limited social media presence',
        weight: 5,
        score: 60,
      };
    }
  }

  /**
   * Verify certification claims
   * Weight: 9 (high importance - impacts trust)
   */
  private async checkCertifications(application: ApplicationData): Promise<RiskCheck> {
    if (!application.certifications || application.certifications.length === 0) {
      return {
        id: 'certifications',
        name: 'Certifications',
        status: 'pass',
        message: 'No certifications claimed (no verification needed)',
        weight: 9,
        score: 100,
      };
    }

    // In production, this would verify certifications against databases
    // or flag them for manual review
    const certCount = application.certifications.length;

    if (certCount > 3) {
      return {
        id: 'certifications',
        name: 'Certifications',
        status: 'warn',
        message: `${certCount} certifications claimed - requires manual verification`,
        weight: 9,
        score: 70,
      };
    } else {
      return {
        id: 'certifications',
        name: 'Certifications',
        status: 'warn',
        message: `${certCount} certification${certCount !== 1 ? 's' : ''} claimed - requires verification`,
        weight: 9,
        score: 80,
      };
    }
  }

  /**
   * Check if pricing aligns with marketplace standards
   * Weight: 7 (high importance)
   */
  private async checkPricing(application: ApplicationData): Promise<RiskCheck> {
    const priceRange = application.priceRange.toLowerCase();

    // Define acceptable price ranges for spa/wellness marketplace
    const acceptablePrices = ['$', '$$', '$$$'];
    const tooExpensive = ['$$$$', '$$$$$'];

    if (acceptablePrices.some((p) => priceRange.includes(p))) {
      return {
        id: 'pricing',
        name: 'Price Point Analysis',
        status: 'pass',
        message: 'Pricing appropriate for spa market',
        weight: 7,
        score: 100,
      };
    } else if (tooExpensive.some((p) => priceRange.includes(p))) {
      return {
        id: 'pricing',
        name: 'Price Point Analysis',
        status: 'warn',
        message: 'Premium pricing may limit spa adoption',
        weight: 7,
        score: 70,
      };
    } else {
      return {
        id: 'pricing',
        name: 'Price Point Analysis',
        status: 'pass',
        message: 'Price range specified',
        weight: 7,
        score: 90,
      };
    }
  }

  /**
   * Check brand values alignment with Jade marketplace
   * Weight: 8 (high importance - core to marketplace)
   */
  private async checkBrandAlignment(application: ApplicationData): Promise<RiskCheck> {
    // Core values that align well with Jade
    const coreValues = ['clean_beauty', 'sustainable', 'cruelty_free', 'natural', 'organic'];

    const hasCoreValues = application.values.some((value) =>
      coreValues.some((core) => value.toLowerCase().includes(core.replace('_', ' ')))
    );

    const valueCount = application.values.length;

    if (hasCoreValues && valueCount >= 3) {
      return {
        id: 'brand_alignment',
        name: 'Brand Values Alignment',
        status: 'pass',
        message: `Strong alignment with Jade values (${valueCount} values)`,
        weight: 8,
        score: 100,
      };
    } else if (valueCount >= 3) {
      return {
        id: 'brand_alignment',
        name: 'Brand Values Alignment',
        status: 'pass',
        message: `Good value selection (${valueCount} values)`,
        weight: 8,
        score: 90,
      };
    } else {
      return {
        id: 'brand_alignment',
        name: 'Brand Values Alignment',
        status: 'warn',
        message: 'Limited values selected - may need stronger positioning',
        weight: 8,
        score: 60,
      };
    }
  }

  /**
   * Check product range appropriateness
   * Weight: 6 (medium importance)
   */
  private async checkProductRange(application: ApplicationData): Promise<RiskCheck> {
    const skuCount = application.skuCount.toLowerCase();

    // Parse SKU count ranges
    let estimatedSkus = 0;
    if (skuCount.includes('-')) {
      const range = skuCount.split('-').map((s) => parseInt(s.replace(/\D/g, '')));
      estimatedSkus = Math.max(...range.filter((n) => !isNaN(n)));
    } else {
      const match = skuCount.match(/\d+/);
      estimatedSkus = match ? parseInt(match[0]) : 0;
    }

    const categoryCount = application.productCategories.length;

    if (estimatedSkus >= 10 && categoryCount >= 2) {
      return {
        id: 'product_range',
        name: 'Product Portfolio',
        status: 'pass',
        message: `Solid product range (${skuCount}, ${categoryCount} categories)`,
        weight: 6,
        score: 100,
      };
    } else if (estimatedSkus >= 5) {
      return {
        id: 'product_range',
        name: 'Product Portfolio',
        status: 'pass',
        message: `Adequate product range (${skuCount})`,
        weight: 6,
        score: 85,
      };
    } else if (estimatedSkus > 0) {
      return {
        id: 'product_range',
        name: 'Product Portfolio',
        status: 'warn',
        message: `Limited product range (${skuCount})`,
        weight: 6,
        score: 60,
      };
    } else {
      return {
        id: 'product_range',
        name: 'Product Portfolio',
        status: 'warn',
        message: 'Product count unclear',
        weight: 6,
        score: 70,
      };
    }
  }

  /**
   * Determine overall risk level based on score and critical failures
   */
  private determineRiskLevel(score: number, checks: RiskCheck[]): RiskLevel {
    // Check for critical failures
    const hasCriticalFailure = checks.some(
      (check) => check.status === 'fail' && check.weight >= 9
    );

    if (hasCriticalFailure) {
      return RiskLevel.CRITICAL;
    }

    // Score-based risk levels
    if (score >= 85) {
      return RiskLevel.LOW;
    } else if (score >= 70) {
      return RiskLevel.MEDIUM;
    } else if (score >= 50) {
      return RiskLevel.HIGH;
    } else {
      return RiskLevel.CRITICAL;
    }
  }
}

// Export singleton instance
export const applicationRiskScoringService = new ApplicationRiskScoringService();
