/**
 * Vendure Configuration
 *
 * Main configuration for the JADE Spa Marketplace headless commerce backend
 */

import { VendureConfig, DefaultJobQueuePlugin, DefaultSearchPlugin } from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';
import * as dotenv from 'dotenv';

// Import custom field configurations
import { UserCustomFields } from './plugins/spa-management/entities/user.entity';
import { ProductCustomFields } from './plugins/intelligence/entities/product.entity';
import { OrderCustomFields } from './plugins/intelligence/entities/order.entity';

// Load environment variables
dotenv.config();

const IS_DEV = process.env.NODE_ENV !== 'production';

export const config: VendureConfig = {
  apiOptions: {
    port: parseInt(process.env.PORT || '3000', 10),
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    hostname: process.env.HOSTNAME || 'localhost',
    adminApiPlayground: IS_DEV,
    shopApiPlayground: IS_DEV,
    // CORS configuration
    cors: {
      origin: IS_DEV
        ? ['http://localhost:3000', 'http://localhost:4005', 'http://localhost:5173']
        : (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    cookieOptions: {
      secret: process.env.VENDURE_COOKIE_SECRET || 'change-this-in-production',
      httpOnly: true,
      secure: !IS_DEV,
      sameSite: 'lax',
    },
    sessionDuration: '7d',
    requireVerification: !IS_DEV,
  },
  dbConnectionOptions: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'jade_user',
    password: process.env.DATABASE_PASSWORD || 'jade_dev_password',
    database: process.env.DATABASE_NAME || 'jade_marketplace',
    schema: process.env.DATABASE_SCHEMA || 'jade',
    synchronize: false, // NEVER use synchronize in production!
    logging: process.env.DATABASE_LOGGING === 'true',
    migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
    // PostgreSQL SSL configuration
    ssl: process.env.DATABASE_SSL === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  },
  paymentOptions: {
    paymentMethodHandlers: [
      // Payment handlers will be added here
    ],
  },
  customFields: {
    // Custom fields for User entity (spa management)
    User: UserCustomFields as any,

    // Custom fields for Product entity (intelligence)
    Product: ProductCustomFields as any,

    // Custom fields for Order entity (intelligence)
    Order: OrderCustomFields as any,
  },
  plugins: [
    // Asset Server Plugin - handles product images and assets
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      assetUrlPrefix: IS_DEV ? 'http://localhost:3001/assets/' : process.env.ASSET_URL || '',
    }),

    // Default Job Queue Plugin - handles background jobs
    DefaultJobQueuePlugin.init({
      useDatabaseForBuffer: true,
    }),

    // Default Search Plugin - product search functionality
    DefaultSearchPlugin.init({
      indexStockStatus: true,
      searchStrategy: undefined, // Use default search strategy
    }),

    // Email Plugin - transactional emails
    EmailPlugin.init({
      devMode: IS_DEV,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: process.env.EMAIL_FROM || 'noreply@jade-marketplace.com',
        verifyEmailAddressUrl: process.env.VERIFY_EMAIL_URL || 'http://localhost:3000/verify',
        passwordResetUrl: process.env.PASSWORD_RESET_URL || 'http://localhost:3000/reset-password',
        changeEmailAddressUrl: process.env.CHANGE_EMAIL_URL || 'http://localhost:3000/verify-email-change',
      },
      transport: IS_DEV
        ? {
            type: 'file',
            outputPath: path.join(__dirname, '../static/email/output'),
            raw: false,
          }
        : {
            type: 'smtp',
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525', 10),
            auth: {
              user: process.env.SMTP_USER || '',
              pass: process.env.SMTP_PASS || '',
            },
          },
    }),

    // Admin UI Plugin - Vendure Admin interface
    AdminUiPlugin.init({
      route: 'admin',
      port: parseInt(process.env.PORT || '3001', 10),
      adminUiConfig: {
        apiHost: IS_DEV ? 'http://localhost' : (process.env.ADMIN_API_HOST || ''),
        apiPort: parseInt(process.env.PORT || '3001', 10),
      },
      app: {
        path: path.join(__dirname, '../admin-ui'),
      },
    }),
  ],
};
