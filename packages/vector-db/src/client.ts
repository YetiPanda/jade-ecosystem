/**
 * Zilliz Cloud Connection Client
 *
 * Manages connection to Zilliz Cloud (managed Milvus service)
 * for vector search operations
 */

import { MilvusClient } from '@zilliz/milvus2-sdk-node';

export interface ZillizConfig {
  endpoint: string;
  token?: string;
  username?: string;
  password?: string;
  database?: string;
  timeout?: number;
}

export interface ConnectionStatus {
  connected: boolean;
  database?: string;
  version?: string;
  error?: string;
}

let client: MilvusClient | null = null;
let currentConfig: ZillizConfig | null = null;

/**
 * Get or create Zilliz Cloud client instance (singleton pattern)
 */
export function getZillizClient(config?: ZillizConfig): MilvusClient {
  if (client && currentConfig) {
    // Return existing client if config matches
    if (
      config &&
      (config.endpoint !== currentConfig.endpoint ||
        config.token !== currentConfig.token ||
        config.username !== currentConfig.username ||
        config.password !== currentConfig.password)
    ) {
      throw new Error(
        'Cannot reinitialize Zilliz client with different config. Call closeZillizClient() first.'
      );
    }
    return client;
  }

  if (!config) {
    throw new Error(
      'Zilliz client not initialized. Provide config on first call.'
    );
  }

  // Validate authentication credentials
  if (!config.token && (!config.username || !config.password)) {
    throw new Error(
      'Either token or username/password must be provided for authentication'
    );
  }

  // Create new client with appropriate authentication
  const clientConfig: any = {
    address: config.endpoint,
    database: config.database,
    timeout: config.timeout || 30000,
  };

  if (config.token) {
    clientConfig.token = config.token;
  } else if (config.username && config.password) {
    clientConfig.username = config.username;
    clientConfig.password = config.password;
  }

  client = new MilvusClient(clientConfig);

  currentConfig = config;
  return client;
}

/**
 * Initialize Zilliz client from environment variables
 * Supports both token-based and username/password authentication
 */
export function initializeZillizClient(): MilvusClient {
  const endpoint = process.env.ZILLIZ_ENDPOINT;
  const token = process.env.ZILLIZ_TOKEN;
  const username = process.env.ZILLIZ_USERNAME;
  const password = process.env.ZILLIZ_PASSWORD;
  const database = process.env.ZILLIZ_DATABASE || 'default';

  if (!endpoint) {
    throw new Error(
      'Missing required ZILLIZ_ENDPOINT environment variable.'
    );
  }

  // Check for either token or username/password
  if (!token && (!username || !password)) {
    throw new Error(
      'Missing Zilliz Cloud credentials. Set either ZILLIZ_TOKEN or both ZILLIZ_USERNAME and ZILLIZ_PASSWORD environment variables.'
    );
  }

  const config: ZillizConfig = {
    endpoint,
    database,
  };

  if (token) {
    config.token = token;
  } else if (username && password) {
    config.username = username;
    config.password = password;
  }

  return getZillizClient(config);
}

/**
 * Check connection status and health
 */
export async function checkZillizHealth(): Promise<ConnectionStatus> {
  try {
    const zilliz = getZillizClient();

    // Check server version
    const versionRes = await zilliz.getVersion();

    // List databases to verify connection
    await zilliz.listDatabases();

    return {
      connected: true,
      database: currentConfig?.database || 'default',
      version: versionRes.version,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Close Zilliz client connection
 */
export async function closeZillizClient(): Promise<void> {
  if (client) {
    // Milvus SDK doesn't have explicit close method
    // Just clear references
    client = null;
    currentConfig = null;
  }
}

/**
 * Check if a collection exists
 */
export async function collectionExists(
  collectionName: string
): Promise<boolean> {
  try {
    const zilliz = getZillizClient();
    const res = await zilliz.hasCollection({ collection_name: collectionName });
    return !!res.value;
  } catch (error) {
    console.error(`Error checking collection ${collectionName}:`, error);
    return false;
  }
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(collectionName: string) {
  const zilliz = getZillizClient();

  const stats = await zilliz.getCollectionStatistics({
    collection_name: collectionName,
  });

  return {
    rowCount: parseInt(stats.data.row_count, 10),
    stats: stats.stats,
  };
}

/**
 * Load collection into memory (required before search)
 */
export async function loadCollection(collectionName: string): Promise<void> {
  const zilliz = getZillizClient();
  await zilliz.loadCollection({ collection_name: collectionName });
}

/**
 * Release collection from memory
 */
export async function releaseCollection(
  collectionName: string
): Promise<void> {
  const zilliz = getZillizClient();
  await zilliz.releaseCollection({ collection_name: collectionName });
}
