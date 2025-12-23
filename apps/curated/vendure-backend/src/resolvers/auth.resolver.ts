/**
 * Authentication Resolvers
 *
 * Handles login, registration, token refresh, and user queries
 *
 * TODO: Implement actual user database operations once user table is created
 */

import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../graphql/apollo-server';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../lib/auth/jwt.strategy';
import { UserRole } from '@jade/shared-types';
import { logger } from '../lib/logger';

export const authResolvers = {
  Query: {
    /**
     * Get current authenticated user
     */
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // TODO: Fetch actual user from database
      return {
        id: context.user.userId,
        email: context.user.email,
        role: context.user.role,
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        avatarUrl: null,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        spaOrganization: null,
        vendorOrganization: null,
      };
    },
  },

  Mutation: {
    /**
     * Login user
     */
    login: async (
      _parent: unknown,
      { input }: { input: { email: string; password: string } },
      context: GraphQLContext
    ) => {
      try {
        const { email } = input;

        // TODO: Verify credentials against database
        // For now, accept any login for development
        logger.info('Login attempt', { email });

        const mockUser = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
          role: UserRole.SERVICE_PROVIDER,
          firstName: 'Test',
          lastName: 'User',
          phone: null,
          avatarUrl: null,
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          spaOrganization: null,
          vendorOrganization: null,
        };

        // Generate tokens
        const accessToken = generateAccessToken({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          spaOrganizationId: undefined,
          vendorOrganizationId: undefined,
        });

        const refreshToken = generateRefreshToken({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          spaOrganizationId: undefined,
          vendorOrganizationId: undefined,
        });

        logger.info('User logged in', { userId: mockUser.id, email: mockUser.email });

        return {
          success: true,
          user: mockUser,
          accessToken,
          refreshToken,
          errors: null,
        };
      } catch (error) {
        context.logger.error('Login error', { error });
        return {
          success: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          errors: [
            {
              code: 'AUTH_ERROR',
              field: 'email',
              message: 'Invalid email or password',
            },
          ],
        };
      }
    },

    /**
     * Register new user
     */
    register: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          email: string;
          password: string;
          firstName?: string | null;
          lastName?: string | null;
          role?: UserRole | null;
          phone?: string | null;
        };
      },
      context: GraphQLContext
    ) => {
      try {
        const { email, firstName, lastName, role, phone } = input;

        // TODO: Validate and create user in database
        logger.info('Registration attempt', { email, role });

        const mockUser = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
          role: role || UserRole.SERVICE_PROVIDER,
          firstName: firstName || 'User',
          lastName: lastName || 'Name',
          phone: phone || null,
          avatarUrl: null,
          isActive: true,
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          spaOrganization: null,
          vendorOrganization: null,
        };

        // Generate tokens
        const accessToken = generateAccessToken({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          spaOrganizationId: undefined,
          vendorOrganizationId: undefined,
        });

        const refreshToken = generateRefreshToken({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          spaOrganizationId: undefined,
          vendorOrganizationId: undefined,
        });

        logger.info('User registered', { userId: mockUser.id, email: mockUser.email });

        return {
          success: true,
          user: mockUser,
          accessToken,
          refreshToken,
          errors: null,
        };
      } catch (error) {
        context.logger.error('Registration error', { error });
        return {
          success: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          errors: [
            {
              code: 'AUTH_ERROR',
              field: 'email',
              message: 'Registration failed',
            },
          ],
        };
      }
    },

    /**
     * Refresh access token
     */
    refreshToken: async (
      _parent: unknown,
      { refreshToken }: { refreshToken: string },
      context: GraphQLContext
    ) => {
      try {
        // Verify refresh token - only returns userId
        const { userId } = verifyRefreshToken(refreshToken);

        // TODO: Get user from database using userId
        // For now, use mock data
        const mockUser = {
          id: userId,
          email: 'test@example.com',
          role: UserRole.SERVICE_PROVIDER,
          firstName: 'Test',
          lastName: 'User',
          phone: null,
          avatarUrl: null,
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          spaOrganization: null,
          vendorOrganization: null,
        };

        // Generate new tokens
        const newAccessToken = generateAccessToken({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          spaOrganizationId: undefined,
          vendorOrganizationId: undefined,
        });

        const newRefreshToken = generateRefreshToken({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          spaOrganizationId: undefined,
          vendorOrganizationId: undefined,
        });

        logger.info('Token refreshed', { userId });

        return {
          success: true,
          user: mockUser,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          errors: null,
        };
      } catch (error) {
        context.logger.error('Token refresh error', { error });
        return {
          success: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          errors: [
            {
              code: 'AUTH_ERROR',
              field: 'refreshToken',
              message: 'Invalid refresh token',
            },
          ],
        };
      }
    },

    /**
     * Logout user (client should clear tokens)
     */
    logout: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      logger.info('User logged out', { userId: context.user.userId });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    },
  },
};
