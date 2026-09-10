import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticationError } from '../utils/errors';
import { authRepo } from '../repositories/auth.repo';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  institution_id?: string;
  district_id?: string;
  department_id?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Bearer access token missing or malformed'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Lookup user in DB to verify active status
    const user = await authRepo.findById(payload.userId);
    if (!user || !user.is_active) {
      return next(new AuthenticationError('User account not found or deactivated'));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      institution_id: user.institution_id,
      district_id: user.district_id,
      department_id: user.department_id,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token has expired'));
    }
    return next(new AuthenticationError('Invalid signature or corrupted token'));
  }
}

/**
 * Optional authentication middleware for endpoints accessible anonymously or by logged-in citizens
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      const user = await authRepo.findById(payload.userId);
      if (user && user.is_active) {
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institution_id: user.institution_id,
          district_id: user.district_id,
          department_id: user.department_id,
        };
      }
    } catch {
      // Ignore token errors for optional authentication
    }
  }
  next();
}
