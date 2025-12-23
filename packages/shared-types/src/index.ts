/**
 * @jade/shared-types
 *
 * Shared TypeScript types for JADE Spa Marketplace Platform
 *
 * This package provides:
 * - GraphQL generated types (from contracts)
 * - Zod validation schemas
 * - Utility types
 */

// Re-export all GraphQL generated types (primary source of truth)
export * from './graphql/generated';

// Validation schemas
export * from './validation';
