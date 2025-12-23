/**
 * Apollo Server Setup
 *
 * Configures Apollo Server with Express integration
 */

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { typeDefs } from '../schema';
import { resolvers } from '../resolvers';
import { logger } from '../lib/logger';
import { verifyAccessToken, JWTPayload } from '../lib/auth/jwt.strategy';

const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * GraphQL context interface
 */
export interface GraphQLContext {
  user?: JWTPayload;
  req: Request;
  logger: typeof logger;
}

/**
 * Create Apollo Server instance
 */
export async function createApolloServer(httpServer: Server) {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: true, // Enable introspection in production for Apollo Sandbox
    plugins: [
      // Proper shutdown for HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Apollo Studio landing page (embedded sandbox enabled in both dev and production)
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    formatError: (formattedError) => {
      // Log errors
      logger.error('GraphQL Error:', {
        message: formattedError.message,
        path: formattedError.path,
        extensions: formattedError.extensions,
      });

      // Don't expose internal errors in production
      if (!IS_DEV && formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return {
          ...formattedError,
          message: 'An unexpected error occurred',
        };
      }

      return formattedError;
    },
    includeStacktraceInErrorResponses: IS_DEV,
  });

  await server.start();
  logger.info('🚀 Apollo Server started');

  return server;
}

/**
 * Create Apollo Server Express middleware
 */
export function createApolloMiddleware(
  server: ApolloServer<GraphQLContext>
): any {
  return expressMiddleware(server, {
    context: async ({ req }: { req: Request }): Promise<GraphQLContext> => {
      // Extract user from JWT token
      let user: JWTPayload | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          user = verifyAccessToken(token);
        } catch (error) {
          // Invalid token - user will be undefined
          logger.warn('Invalid token in GraphQL request', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return {
        user,
        req,
        logger,
      };
    },
  });
}

/**
 * Helper to check authentication in resolvers
 */
export function requireAuth(context: GraphQLContext): JWTPayload {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
}

/**
 * Helper to check role in resolvers
 */
export function requireRole(context: GraphQLContext, ...roles: string[]): JWTPayload {
  const user = requireAuth(context);

  if (!roles.includes(user.role)) {
    throw new Error(`Insufficient permissions. Required roles: ${roles.join(', ')}`);
  }

  return user;
}
