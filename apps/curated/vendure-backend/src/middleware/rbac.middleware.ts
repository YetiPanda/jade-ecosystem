/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Enforces role-based permissions for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@jade/shared-types';

/**
 * Permission definitions for each role
 */
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'users:*',
    'spa-organizations:*',
    'vendor-organizations:*',
    'products:*',
    'orders:*',
    'appointments:*',
    'analytics:*',
    'settings:*',
  ],
  [UserRole.SPA_OWNER]: [
    'spa-organizations:read',
    'spa-organizations:update',
    'locations:*',
    'service-providers:*',
    'clients:*',
    'appointments:*',
    'orders:read',
    'orders:create',
    'products:read',
    'analytics:read',
  ],
  [UserRole.SPA_MANAGER]: [
    'spa-organizations:read',
    'locations:read',
    'service-providers:read',
    'clients:*',
    'appointments:*',
    'orders:read',
    'orders:create',
    'products:read',
  ],
  [UserRole.SERVICE_PROVIDER]: [
    'spa-organizations:read',
    'clients:read',
    'appointments:read',
    'appointments:update',
    'products:read',
  ],
  [UserRole.CLIENT]: [
    'appointments:read',
    'appointments:create',
    'orders:read',
    'orders:create',
    'products:read',
  ],
  [UserRole.VENDOR]: [
    'vendor-organizations:read',
    'vendor-organizations:update',
    'products:*',
    'orders:read',
    'orders:update',
    'fulfillments:*',
  ],
};

/**
 * Check if user has required role
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Check if user has required permission
 */
export function requirePermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasPermission = permissions.every((permission) =>
      checkPermission(permission, userPermissions)
    );

    if (!hasPermission) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
        required: permissions,
        userRole: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Check if specific permission is granted
 */
function checkPermission(required: string, userPermissions: string[]): boolean {
  // Direct match
  if (userPermissions.includes(required)) {
    return true;
  }

  // Wildcard match (e.g., 'users:*' grants 'users:read')
  const [resource, action] = required.split(':');
  const wildcardPermission = `${resource}:*`;
  if (userPermissions.includes(wildcardPermission)) {
    return true;
  }

  // Global wildcard
  if (userPermissions.includes('*')) {
    return true;
  }

  return false;
}

/**
 * Check if user owns the resource
 * Use this for resources that belong to a specific organization
 */
export function requireOwnership(organizationType: 'spa' | 'vendor') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    // Admins can access all resources
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    // Get organization ID from request params or body
    const organizationId =
      req.params.organizationId || req.body.organizationId;

    if (!organizationId) {
      res.status(400).json({
        error: 'Organization ID required',
        code: 'MISSING_ORGANIZATION_ID',
      });
      return;
    }

    // Check ownership based on organization type
    const userOrgId =
      organizationType === 'spa'
        ? req.user.spaOrganizationId
        : req.user.vendorOrganizationId;

    if (userOrgId !== organizationId) {
      res.status(403).json({
        error: 'Access denied to this organization',
        code: 'ORGANIZATION_MISMATCH',
      });
      return;
    }

    next();
  };
}

/**
 * Combine multiple permission checks (OR logic)
 */
export function requireAnyPermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAnyPermission = permissions.some((permission) =>
      checkPermission(permission, userPermissions)
    );

    if (!hasAnyPermission) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
        requiredAny: permissions,
        userRole: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Helper to get user permissions
 */
export function getUserPermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}
