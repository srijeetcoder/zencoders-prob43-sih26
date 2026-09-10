import { Request, Response, NextFunction } from 'express';

export type UserRole = 'CITIZEN' | 'GOVERNMENT' | 'INSTITUTION' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentOrOrg?: string;
  district?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const DEMO_TOKENS: Record<string, AuthUser> = {
  'gov-token-secret-2026': {
    id: 'gov-001',
    name: 'Shri R. K. Soren (IAS)',
    email: 'gov.officer@jharkhand.gov.in',
    role: 'GOVERNMENT',
    departmentOrOrg: 'Urban Development & Housing Dept, Govt of Jharkhand',
    district: 'Ranchi',
  },
  'inst-token-secret-2026': {
    id: 'inst-001',
    name: 'Dr. Priya Murmu',
    email: 'rnd.director@bitmesra.ac.in',
    role: 'INSTITUTION',
    departmentOrOrg: 'Birsa Institute of Technology (BIT Mesra) IoT Center',
    district: 'Ranchi',
  },
  'admin-token-secret-2026': {
    id: 'admin-001',
    name: 'JanSahyog System Administrator',
    email: 'admin@jansahyog.gov.in',
    role: 'ADMIN',
    departmentOrOrg: 'National Informatics Centre / Govt of Jharkhand',
  },
};

/**
 * Verifies Bearer Token or Demo Header Token
 */
export function verifyAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const devRoleHeader = req.headers['x-demo-role'] as string | undefined;

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 1. Direct Demo Token Match
  if (token && DEMO_TOKENS[token]) {
    req.user = DEMO_TOKENS[token];
    return next();
  }

  // 2. Allow Developer / Demo Role Header in Development or Test Mode
  if (devRoleHeader) {
    const roleUpper = devRoleHeader.toUpperCase() as UserRole;
    if (['GOVERNMENT', 'INSTITUTION', 'ADMIN', 'CITIZEN'].includes(roleUpper)) {
      req.user = {
        id: `dev-${roleUpper.toLowerCase()}-01`,
        name: roleUpper === 'GOVERNMENT' ? 'Govt War Room Nodal Officer' : 'University Principal Investigator',
        email: `${roleUpper.toLowerCase()}@jansahyog.jharkhand.gov.in`,
        role: roleUpper,
        departmentOrOrg: roleUpper === 'GOVERNMENT' ? 'Govt of Jharkhand Innovation Cell' : 'BIT Mesra / IIT ISM Dhanbad',
        district: 'Ranchi',
      };
      return next();
    }
  }

  // 3. Reject unauthenticated request
  res.status(401).json({
    success: false,
    error: 'Unauthorized. Valid institutional or government credentials required.',
    code: 'AUTH_REQUIRED',
  });
}

/**
 * Enforces Role-Based Access Control
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required before accessing this portal.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: `Access forbidden. Role '${req.user.role}' does not have sufficient permissions for this endpoint. Required: [${allowedRoles.join(', ')}].`,
      });
      return;
    }

    next();
  };
}
