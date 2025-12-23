/**
 * Vector DB Health Check Utility
 *
 * Provides health check and diagnostic utilities for Zilliz Cloud
 */

import {
  getZillizClient,
  checkZillizHealth,
  collectionExists,
  getCollectionStats,
  ConnectionStatus,
} from './client';
import {
  PRODUCT_TENSORS_COLLECTION,
  PRODUCT_EMBEDDINGS_COLLECTION,
} from './collections';

/**
 * Collection health status
 */
export interface CollectionHealth {
  name: string;
  exists: boolean;
  loaded: boolean;
  rowCount?: number;
  error?: string;
}

/**
 * Overall vector DB health report
 */
export interface VectorDBHealthReport {
  connection: ConnectionStatus;
  collections: CollectionHealth[];
  healthy: boolean;
  timestamp: Date;
}

/**
 * Perform comprehensive health check
 */
export async function performHealthCheck(): Promise<VectorDBHealthReport> {
  const timestamp = new Date();

  // Check connection
  const connection = await checkZillizHealth();

  // Check collections
  const collections = await Promise.all([
    checkCollectionHealth(PRODUCT_TENSORS_COLLECTION),
    checkCollectionHealth(PRODUCT_EMBEDDINGS_COLLECTION),
  ]);

  // Determine overall health
  const healthy =
    connection.connected &&
    collections.every((col) => col.exists && !col.error);

  return {
    connection,
    collections,
    healthy,
    timestamp,
  };
}

/**
 * Check health of a specific collection
 */
export async function checkCollectionHealth(
  collectionName: string
): Promise<CollectionHealth> {
  try {
    const exists = await collectionExists(collectionName);

    if (!exists) {
      return {
        name: collectionName,
        exists: false,
        loaded: false,
      };
    }

    // Get collection statistics
    const stats = await getCollectionStats(collectionName);

    // Check if loaded
    const client = getZillizClient();
    const loadState = await client.getLoadState({
      collection_name: collectionName,
    });

    return {
      name: collectionName,
      exists: true,
      loaded: loadState.state === 'LoadStateLoaded',
      rowCount: stats.rowCount,
    };
  } catch (error) {
    return {
      name: collectionName,
      exists: false,
      loaded: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get detailed vector DB diagnostics
 */
export async function getDiagnostics(): Promise<{
  version: string;
  collections: Array<{
    name: string;
    rowCount: number;
    loaded: boolean;
  }>;
}> {
  const client = getZillizClient();

  // Get version
  const versionRes = await client.getVersion();

  // Get all collections
  const collectionsRes = await client.listCollections();

  // Get details for each collection
  const collectionDetails = await Promise.all(
    collectionsRes.data.map(async (collectionData: any) => {
      const name = collectionData.name || collectionData;
      try {
        const stats = await getCollectionStats(name);
        const loadState = await client.getLoadState({ collection_name: name });

        return {
          name,
          rowCount: stats.rowCount,
          loaded: loadState.state === 'LoadStateLoaded',
        };
      } catch (error) {
        return {
          name,
          rowCount: 0,
          loaded: false,
        };
      }
    })
  );

  return {
    version: versionRes.version,
    collections: collectionDetails,
  };
}

/**
 * Validate vector dimensions
 */
export function validateTensorDimension(vector: number[]): boolean {
  return vector.length === 13;
}

export function validateEmbeddingDimension(vector: number[]): boolean {
  return vector.length === 792;
}

/**
 * Format health report for logging
 */
export function formatHealthReport(report: VectorDBHealthReport): string {
  const lines = [
    '=== Vector DB Health Report ===',
    `Timestamp: ${report.timestamp.toISOString()}`,
    `Overall Status: ${report.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`,
    '',
    '--- Connection ---',
    `Connected: ${report.connection.connected ? '✅' : '❌'}`,
    `Database: ${report.connection.database || 'N/A'}`,
    `Version: ${report.connection.version || 'N/A'}`,
    report.connection.error ? `Error: ${report.connection.error}` : '',
    '',
    '--- Collections ---',
  ];

  report.collections.forEach((col) => {
    lines.push(`${col.name}:`);
    lines.push(`  Exists: ${col.exists ? '✅' : '❌'}`);
    lines.push(`  Loaded: ${col.loaded ? '✅' : '❌'}`);
    if (col.rowCount !== undefined) {
      lines.push(`  Row Count: ${col.rowCount.toLocaleString()}`);
    }
    if (col.error) {
      lines.push(`  Error: ${col.error}`);
    }
    lines.push('');
  });

  return lines.filter((line) => line !== undefined).join('\n');
}
