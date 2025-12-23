/**
 * GraphQL Schema Loader
 *
 * Combines all GraphQL schema files into a single schema
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';

/**
 * Load all GraphQL schema files
 */
function loadSchemaFiles(): string {
  const schemaDir = __dirname;

  const schemaFiles = [
    'base.graphql',
    'auth.graphql',
    'organization.graphql',
    'product.graphql',
    'appointment.graphql',
    'taxonomy.graphql',
    // TODO: vendor.graphql conflicts with vendor-portal.graphql (Feature 011)
    // Need to merge or deprecate vendor.graphql
    // 'vendor.graphql',
    'vendor-portal.graphql', // Feature 011: Vendor Portal - profile, application, analytics
    'ska.graphql',
    'intelligence.graphql', // Intelligence MVP - knowledge thresholds, evidence, causal chains
    // TODO: Fix governance.graphql schema syntax error before re-enabling
    // 'governance.graphql', // AI Governance - ISO 42001 compliance, incident tracking, human oversight
    'sanctuary.graphql',
    'analytics.graphql',
    'skincare-search.graphql',
    'user-settings.graphql',
  ];

  return schemaFiles
    .map((file) => readFileSync(join(schemaDir, file), 'utf-8'))
    .join('\n\n');
}

/**
 * Create executable schema with resolvers
 */
export function createSchema(resolvers: any) {
  const typeDefs = loadSchemaFiles();

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}

/**
 * Export type definitions as string
 */
export const typeDefs = loadSchemaFiles();
