/**
 * Redis Client Configuration
 * Used for BullMQ job queues, caching, and session storage
 */

import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export function getRedisConnection(config?: RedisConfig): Redis {
  if (redisClient) {
    return redisClient;
  }

  const redisConfig: RedisConfig = config || {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  };

  redisClient = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    db: redisConfig.db,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  return redisClient;
}

export function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    const client = redisClient;
    redisClient = null;
    return client.quit();
  }
  return Promise.resolve();
}
