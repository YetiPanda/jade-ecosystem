/**
 * User Service
 *
 * Handles user-related database operations
 */

import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { UserRole } from '@jade/shared-types';
import { NotFoundError, BadRequestError } from '../middleware/error.middleware';
import { logger } from '../lib/logger';

const SALT_ROUNDS = 12;

/**
 * Internal database user type (includes passwordHash which is not exposed via GraphQL)
 */
interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  spaOrganizationId?: string;
  vendorOrganizationId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  spaOrganizationId?: string;
  vendorOrganizationId?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export class UserService {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<DbUser | null> {
    try {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.user WHERE id = $1`,
        [id]
      );
      return result[0] || null;
    } catch (error) {
      logger.error('Error finding user by ID', { id, error });
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<DbUser | null> {
    try {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.user WHERE email = $1`,
        [email]
      );
      return result[0] || null;
    } catch (error) {
      logger.error('Error finding user by email', { email, error });
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(input: CreateUserInput): Promise<DbUser> {
    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(input.email);
      if (existingUser) {
        throw new BadRequestError('User with this email already exists');
      }

      // Validate role-organization relationship
      if (
        [UserRole.SPA_OWNER, UserRole.SPA_MANAGER, UserRole.SPA_STAFF].includes(input.role) &&
        !input.spaOrganizationId
      ) {
        throw new BadRequestError('Spa organization ID required for spa roles');
      }

      if (
        [UserRole.VENDOR_OWNER, UserRole.VENDOR_STAFF].includes(input.role) &&
        !input.vendorOrganizationId
      ) {
        throw new BadRequestError('Vendor organization ID required for vendor roles');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      // Insert user
      const result = await AppDataSource.query(
        `INSERT INTO jade.user
         (email, password_hash, first_name, last_name, role, spa_organization_id, vendor_organization_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          input.email,
          passwordHash,
          input.firstName,
          input.lastName,
          input.role,
          input.spaOrganizationId || null,
          input.vendorOrganizationId || null,
        ]
      );

      const user = result[0];
      logger.info('User created', { userId: user.id, email: user.email });
      return user;
    } catch (error) {
      logger.error('Error creating user', { input, error });
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(id: string, input: UpdateUserInput): Promise<DbUser> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.firstName !== undefined) {
        updates.push(`first_name = $${paramIndex++}`);
        values.push(input.firstName);
      }
      if (input.lastName !== undefined) {
        updates.push(`last_name = $${paramIndex++}`);
        values.push(input.lastName);
      }
      if (input.phoneNumber !== undefined) {
        updates.push(`phone_number = $${paramIndex++}`);
        values.push(input.phoneNumber);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }

      if (updates.length === 0) {
        return user;
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await AppDataSource.query(
        `UPDATE jade.user
         SET ${updates.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *`,
        values
      );

      logger.info('User updated', { userId: id });
      return result[0];
    } catch (error) {
      logger.error('Error updating user', { id, input, error });
      throw error;
    }
  }

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<DbUser | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return null;
      }

      // Check if user is active
      if (!user.isActive) {
        throw new BadRequestError('User account is inactive');
      }

      return user;
    } catch (error) {
      logger.error('Error verifying password', { email, error });
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify old password
      const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isValid) {
        throw new BadRequestError('Invalid current password');
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password
      await AppDataSource.query(
        `UPDATE jade.user
         SET password_hash = $1, updated_at = NOW()
         WHERE id = $2`,
        [passwordHash, id]
      );

      logger.info('User password changed', { userId: id });
    } catch (error) {
      logger.error('Error changing password', { id, error });
      throw error;
    }
  }

  /**
   * Delete user (soft delete)
   */
  async delete(id: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      await AppDataSource.query(
        `UPDATE jade.user
         SET is_active = false, updated_at = NOW()
         WHERE id = $1`,
        [id]
      );

      logger.info('User deleted', { userId: id });
    } catch (error) {
      logger.error('Error deleting user', { id, error });
      throw error;
    }
  }

  /**
   * Find users by organization
   */
  async findBySpaOrganization(spaOrganizationId: string): Promise<DbUser[]> {
    try {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.user
         WHERE spa_organization_id = $1
         AND is_active = true
         ORDER BY created_at DESC`,
        [spaOrganizationId]
      );
      return result;
    } catch (error) {
      logger.error('Error finding users by spa organization', { spaOrganizationId, error });
      throw error;
    }
  }

  /**
   * Find users by vendor organization
   */
  async findByVendorOrganization(vendorOrganizationId: string): Promise<DbUser[]> {
    try {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.user
         WHERE vendor_organization_id = $1
         AND is_active = true
         ORDER BY created_at DESC`,
        [vendorOrganizationId]
      );
      return result;
    } catch (error) {
      logger.error('Error finding users by vendor organization', { vendorOrganizationId, error });
      throw error;
    }
  }
}

export const userService = new UserService();
