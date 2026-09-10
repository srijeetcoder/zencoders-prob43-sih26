import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/apiResponse';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req as any)?.requestId || `req-${Date.now()}`;
  
  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    sendError(res, 'VALIDATION_ERROR', `Validation failed: ${formatted}`, 400, err.errors);
    return;
  }

  // 2. Known AppError
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  // 3. PostgreSQL Database Error
  if (err.code && typeof err.code === 'string' && err.code.length === 5) {
    console.error(`[DB Error ${err.code}] (${requestId}):`, err.message);
    sendError(res, 'DATABASE_ERROR', 'A database constraint or connection error occurred.', 500);
    return;
  }

  // 4. Fallback Unexpected Error
  console.error(`[Unhandled Error] (${requestId}):`, err);
  sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : (err.message || 'Internal Server Error'),
    500
  );
}

