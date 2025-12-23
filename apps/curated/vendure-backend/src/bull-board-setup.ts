/**
 * Bull Board Setup
 * Dashboard for monitoring BullMQ job queues
 */

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { Express } from 'express';

import { getRedisConnection } from './lib/redis/client';

// Import queue definitions (will be created in Phase 2)
// import { tensorQueue, embeddingQueue, analyticsQueue } from './workers/queues';

export function setupBullBoard(app: Express): void {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  // Get Redis connection
  const connection = getRedisConnection();

  // Create queue instances for monitoring
  // These will be populated in Phase 2 when we create the actual queues
  const queues: Queue[] = [];

  // Example queue setup (will be replaced with actual queues)
  const exampleQueue = new Queue('example', { connection });
  queues.push(exampleQueue);

  createBullBoard({
    queues: queues.map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());

  console.log('📊 Bull Board dashboard available at /admin/queues');
}
