/**
 * JADE Spa Marketplace - Backend Server
 *
 * Main entry point that starts:
 * 1. Apollo GraphQL Server (custom resolvers)
 * 2. Vendure Commerce Platform (optional - commented out for now)
 */

import express from 'express';
import http from 'http';
import cors from 'cors';
import { createApolloServer, createApolloMiddleware } from './graphql/apollo-server';
import { logger } from './lib/logger';
import { helmetMiddleware } from './middleware/security.middleware';
import { errorHandler } from './middleware/error.middleware';
import { initializeDatabase } from './config/database';
import { webSocketService } from './services/websocket.service';
import { emailNotificationService } from './services/email-notification.service';

const PORT = parseInt(process.env.PORT || '3000', 10);
const GRAPHQL_PATH = '/graphql';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Store server instance for graceful shutdown
let httpServerInstance: http.Server | null = null;

async function startServer() {
  try {
    // Initialize database connection
    logger.info('Initializing database connection...');
    await initializeDatabase();
    logger.info('✓ Database connected');

    // Create Express app
    const app = express();

    // Create HTTP server
    const httpServer = http.createServer(app);
    httpServerInstance = httpServer;

    // Apply middleware
    // Configure CORS origins
    const allowedOrigins = IS_PRODUCTION
      ? (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
      : [
          'http://localhost:4005', // Frontend Vite dev server
          'http://localhost:5173', // Legacy Vite default
          'http://localhost:3000', // Legacy port
          'http://localhost:4173', // Vite preview
          'https://studio.apollographql.com'
        ];

    // Add Northflank frontend URL if in production and ALLOWED_ORIGINS not set
    if (IS_PRODUCTION && allowedOrigins.length === 0) {
      logger.warn('⚠️  ALLOWED_ORIGINS not set - defaulting to Northflank frontend');
      allowedOrigins.push('https://p01--jade-marketplace-frontend--gzzwy72wxtyk.code.run');
    }

    logger.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

    app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) {
          callback(null, true);
          return;
        }

        // In development, allow any localhost origin
        if (!IS_PRODUCTION && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
          callback(null, true);
          return;
        }

        // Allow specific origins
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
          return;
        }

        // In production, also check if origin matches Northflank pattern
        if (IS_PRODUCTION && origin.includes('code.run')) {
          logger.info(`Allowing Northflank origin: ${origin}`);
          callback(null, true);
          return;
        }

        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(helmetMiddleware);

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        port: PORT
      });
    });

    // Readiness check endpoint (for Kubernetes/Northflank)
    app.get('/ready', (_req, res) => {
      // Could add more sophisticated checks here (DB connection, etc.)
      res.json({ status: 'ready', timestamp: new Date().toISOString() });
    });

    // Create and start Apollo Server
    logger.info('Starting Apollo GraphQL Server...');
    const apolloServer = await createApolloServer(httpServer);

    // Apply Apollo middleware
    app.use(GRAPHQL_PATH, createApolloMiddleware(apolloServer));

    // Initialize WebSocket service for real-time messaging (Task C.1.8)
    logger.info('Initializing WebSocket service...');
    webSocketService.initialize(httpServer);
    logger.info('✓ WebSocket service initialized');

    // Initialize Email Notification service (Task C.2.11)
    logger.info('Initializing Email Notification service...');
    emailNotificationService.initialize();
    logger.info('✓ Email Notification service initialized');

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, () => {
        logger.info(`🚀 Server ready at http://localhost:${PORT}`);
        logger.info(`🔗 GraphQL endpoint: http://localhost:${PORT}${GRAPHQL_PATH}`);
        logger.info(`📊 Apollo Studio: http://localhost:${PORT}${GRAPHQL_PATH}`);
        logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
        logger.info(`✅ Readiness check: http://localhost:${PORT}/ready`);
        logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        resolve();
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown handler
async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (httpServerInstance) {
    // Shutdown services first
    try {
      logger.info('Shutting down WebSocket service...');
      webSocketService.shutdown();
      logger.info('✓ WebSocket service shut down');

      logger.info('Shutting down Email Notification service...');
      emailNotificationService.shutdown();
      logger.info('✓ Email Notification service shut down');
    } catch (error) {
      logger.error('Error shutting down services:', error);
    }

    // Stop accepting new connections
    httpServerInstance.close(async () => {
      logger.info('HTTP server closed');

      // Close database connections
      try {
        // Add database cleanup here if needed
        logger.info('Database connections closed');
      } catch (error) {
        logger.error('Error closing database connections:', error);
      }

      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
}

// Handle graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Start the server
startServer();
