/**
 * @jade/vector-db
 *
 * Zilliz Cloud client library for vector search operations
 *
 * Provides:
 * - Connection management to Zilliz Cloud
 * - Product tensor operations (13-D vectors)
 * - Semantic embedding operations (792-D vectors)
 * - Collection schema definitions
 * - Vector search abstraction layer
 * - Health monitoring and diagnostics
 */

// Client and connection management
export * from './client';

// Collection operations
export * from './collections';

// Vector search abstraction
export * from './search';

// Health checks and diagnostics
export * from './health';

// Types and schemas
export * from './types';
