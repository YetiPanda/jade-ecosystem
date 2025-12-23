/**
 * BullMQ Queue Factory
 *
 * Creates and manages Bull queues with Redis connection
 */

import { Queue, QueueOptions, Worker, WorkerOptions, Job } from 'bullmq';
import { getRedisConnection } from '../redis/client';
import { QueueName, JobOptions as CustomJobOptions } from './types';

// Store active queues and workers
const queues = new Map<string, Queue>();
const workers = new Map<string, Worker>();

/**
 * Get or create a Bull queue
 */
export function getQueue<T = any>(queueName: QueueName): Queue<T> {
  const existing = queues.get(queueName);
  if (existing) {
    return existing as Queue<T>;
  }

  const redisConnection = getRedisConnection();

  const queueOptions: QueueOptions = {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: {
        age: 24 * 3600, // Keep completed jobs for 24 hours
        count: 1000, // Keep last 1000 completed jobs
      },
      removeOnFail: {
        age: 7 * 24 * 3600, // Keep failed jobs for 7 days
      },
    },
  };

  const queue = new Queue<T>(queueName, queueOptions);
  queues.set(queueName, queue);

  console.log(`✅ Queue created: ${queueName}`);
  return queue;
}

/**
 * Add a job to a queue
 */
export async function addJob<T>(
  queueName: QueueName,
  jobName: string,
  data: T,
  options?: CustomJobOptions
): Promise<Job<T>> {
  const queue = getQueue<T>(queueName);

  const bullOptions = {
    priority: options?.priority,
    delay: options?.delay,
    attempts: options?.attempts,
    backoff: options?.backoff,
    removeOnComplete: options?.removeOnComplete,
    removeOnFail: options?.removeOnFail,
  };

  const job = await queue.add(jobName, data, bullOptions);
  console.log(`📝 Job added: ${queueName}/${jobName} (ID: ${job.id})`);

  return job;
}

/**
 * Register a worker for a queue
 */
export function registerWorker<T, R>(
  queueName: QueueName,
  processor: (job: Job<T>) => Promise<R>,
  options?: {
    concurrency?: number;
    limiter?: {
      max: number;
      duration: number;
    };
  }
): Worker<T, R> {
  const existing = workers.get(queueName);
  if (existing) {
    console.warn(`⚠️  Worker already registered for ${queueName}`);
    return existing as Worker<T, R>;
  }

  const redisConnection = getRedisConnection();

  const workerOptions: WorkerOptions = {
    connection: redisConnection,
    concurrency: options?.concurrency || 1,
    limiter: options?.limiter,
    autorun: true,
  };

  const worker = new Worker<T, R>(queueName, processor, workerOptions);

  // Event handlers
  worker.on('completed', (job) => {
    console.log(`✅ Job completed: ${queueName}/${job.name} (ID: ${job.id})`);
  });

  worker.on('failed', (job, err) => {
    console.error(
      `❌ Job failed: ${queueName}/${job?.name} (ID: ${job?.id})`,
      err.message
    );
  });

  worker.on('error', (err) => {
    console.error(`❌ Worker error in ${queueName}:`, err);
  });

  workers.set(queueName, worker);
  console.log(`✅ Worker registered: ${queueName} (concurrency: ${workerOptions.concurrency})`);

  return worker;
}

/**
 * Get job by ID
 */
export async function getJob<T>(
  queueName: QueueName,
  jobId: string
): Promise<Job<T> | undefined> {
  const queue = getQueue<T>(queueName);
  return queue.getJob(jobId);
}

/**
 * Get job status
 */
export async function getJobStatus(
  queueName: QueueName,
  jobId: string
): Promise<{
  state: string;
  progress?: any;
  result?: any;
  failedReason?: string;
} | null> {
  const job = await getJob(queueName, jobId);
  if (!job) return null;

  const state = await job.getState();
  const progress = job.progress;
  const result = job.returnvalue;
  const failedReason = job.failedReason;

  return {
    state,
    progress,
    result,
    failedReason,
  };
}

/**
 * Pause a queue
 */
export async function pauseQueue(queueName: QueueName): Promise<void> {
  const queue = queues.get(queueName);
  if (queue) {
    await queue.pause();
    console.log(`⏸️  Queue paused: ${queueName}`);
  }
}

/**
 * Resume a queue
 */
export async function resumeQueue(queueName: QueueName): Promise<void> {
  const queue = queues.get(queueName);
  if (queue) {
    await queue.resume();
    console.log(`▶️  Queue resumed: ${queueName}`);
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(queueName: QueueName): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}> {
  const queue = queues.get(queueName);
  if (!queue) {
    throw new Error(`Queue not found: ${queueName}`);
  }

  const counts = await queue.getJobCounts(
    'waiting',
    'active',
    'completed',
    'failed',
    'delayed',
    'paused'
  );

  return counts;
}

/**
 * Clean up old jobs
 */
export async function cleanQueue(
  queueName: QueueName,
  grace: number = 24 * 3600 * 1000, // 24 hours in milliseconds
  limit: number = 1000
): Promise<string[]> {
  const queue = queues.get(queueName);
  if (!queue) {
    throw new Error(`Queue not found: ${queueName}`);
  }

  const jobs = await queue.clean(grace, limit, 'completed');
  console.log(`🧹 Cleaned ${jobs.length} jobs from ${queueName}`);
  return jobs;
}

/**
 * Close all queues and workers
 */
export async function closeAll(): Promise<void> {
  console.log('🔌 Closing all queues and workers...');

  // Close all workers first
  for (const [name, worker] of workers.entries()) {
    await worker.close();
    console.log(`✅ Worker closed: ${name}`);
  }

  // Close all queues
  for (const [name, queue] of queues.entries()) {
    await queue.close();
    console.log(`✅ Queue closed: ${name}`);
  }

  queues.clear();
  workers.clear();

  console.log('✅ All queues and workers closed');
}

/**
 * Initialize all queues on startup
 */
export function initializeQueues(): void {
  console.log('🚀 Initializing queues...');

  // Create all queues
  Object.values(QueueName).forEach((queueName) => {
    getQueue(queueName);
  });

  console.log('✅ All queues initialized');
}
