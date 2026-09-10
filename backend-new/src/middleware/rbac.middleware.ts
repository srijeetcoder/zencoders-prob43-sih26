import { Request, Response, NextFunction } from 'express';
import { AuthorizationError, AuthenticationError } from '../utils/errors';

// Role Hierarchy Sets
const GOV_ROLES = new Set([
  'SUPER_ADMIN',
  'STATE_ADMIN',
  'DISTRICT_ADMIN',
  'DEPARTMENT_OFFICER',
  'WAR_ROOM_ANALYST',
]);

const INST_ROLES = new Set([
  'INSTITUTION_ADMIN',
  'RESEARCHER',
  'LAB_MEMBER',
]);

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required to access this endpoint'));
    }

    const userRole = req.user.role.toUpperCase();

    // Check direct role match
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Check portal-level wildcard groups
    if (allowedRoles.includes('GOVERNMENT') && GOV_ROLES.has(userRole)) {
      return next();
    }
    if (allowedRoles.includes('INSTITUTION') && INST_ROLES.has(userRole)) {
      return next();
    }
    if (allowedRoles.includes('SUPER_ADMIN') && userRole === 'SUPER_ADMIN') {
      return next();
    }

    return next(new AuthorizationError(`Role [${userRole}] is not permitted for this resource.`));
  };
}

export function requireInstitutionScope(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new AuthenticationError('Authentication required'));
  }

  // Super admin bypasses institution scoping
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  if (!req.user.institution_id) {
    return next(new AuthorizationError('User is not associated with an academic institution'));
  }

  next();
}

export function requireDistrictScope(paramName: string = 'districtId') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    // State Admins & Super Admins have state-wide access
    if (['SUPER_ADMIN', 'STATE_ADMIN', 'WAR_ROOM_ANALYST'].includes(req.user.role)) {
      return next();
    }

    const targetDistrictId = req.params[paramName] || req.query[paramName] || req.body[paramName];
    if (req.user.district_id && targetDistrictId && req.user.district_id !== targetDistrictId) {
      return next(new AuthorizationError('Access denied: User district scope does not match requested district'));
    }

    next();
  };
}
