/**
 * Database Configuration
 *
 * PostgreSQL connection using TypeORM DataSource
 * Supports SSL/TLS for production deployments (Northflank, AWS RDS, etc.)
 */

import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Import vendor portal entities
import { VendorApplication } from '../plugins/vendor-portal/entities/vendor-application.entity';
import { VendorOnboarding } from '../plugins/vendor-portal/entities/vendor-onboarding.entity';
import { OnboardingStep } from '../plugins/vendor-portal/entities/onboarding-step.entity';
import { VendorProfile } from '../plugins/vendor-portal/entities/vendor-profile.entity';
import { VendorCertification } from '../plugins/vendor-portal/entities/vendor-certification.entity';
import { VendorAnalyticsDaily } from '../plugins/vendor-portal/entities/vendor-analytics-daily.entity';
import { ProductPerformanceDaily } from '../plugins/vendor-portal/entities/product-performance-daily.entity';
import { DiscoveryImpression } from '../plugins/vendor-portal/entities/discovery-impression.entity';
import { SearchQuery } from '../plugins/vendor-portal/entities/search-query.entity';
import { QueryImpression } from '../plugins/vendor-portal/entities/query-impression.entity';
import { SpaVendorRelationship } from '../plugins/vendor-portal/entities/spa-vendor-relationship.entity';
import { MarketingCampaign } from '../plugins/vendor-portal/entities/marketing-campaign.entity';

// Import messaging entities
import { Conversation } from '../entities/Conversation.entity';
import { Message } from '../entities/Message.entity';

// Load environment variables
config();

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// SSL Configuration for Northflank and other managed databases
const getSSLConfig = () => {
  const sslEnabled = process.env.DATABASE_SSL === 'true';

  if (!sslEnabled) {
    return false;
  }

  // Check for SSL certificate file (Northflank provides this)
  const certPath = process.env.DATABASE_SSL_CERT_PATH || '/app/certs/db-ca-cert.crt';

  if (fs.existsSync(certPath)) {
    // Use certificate file for SSL
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync(certPath).toString(),
    };
  }

  // Fallback for managed databases without explicit cert files
  // (e.g., Northflank's managed PostgreSQL)
  return {
    rejectUnauthorized: false, // Northflank uses managed SSL
  };
};

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'jade_marketplace',
  schema: process.env.DATABASE_SCHEMA || 'jade',
  synchronize: false, // Never auto-sync in production
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: [
    // Vendor Portal entities
    VendorApplication,
    VendorOnboarding,
    OnboardingStep,
    VendorProfile,
    VendorCertification,
    VendorAnalyticsDaily,
    ProductPerformanceDaily,
    DiscoveryImpression,
    SearchQuery,
    QueryImpression,
    SpaVendorRelationship,
    MarketingCampaign,
    // Messaging entities
    Conversation,
    Message,
  ],
  migrations: IS_PRODUCTION
    ? [path.join(__dirname, '../migrations/**/*.js')]
    : [path.join(__dirname, '../migrations/**/*.ts')],
  ssl: getSSLConfig(),
  extra: {
    // Connection pool settings
    max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
    min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
};

export const AppDataSource = new DataSource(dataSourceOptions);

// Initialize connection
let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (!isInitialized) {
    await AppDataSource.initialize();
    isInitialized = true;
  }
}

export function isDatabaseInitialized(): boolean {
  return isInitialized;
}
