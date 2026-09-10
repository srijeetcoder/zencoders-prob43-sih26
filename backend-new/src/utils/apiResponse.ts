import { Response } from 'express';

export function sendSuccess<T = any>(
  res: Response,
  data: T,
  statusCode: number = 200,
  extraMeta?: Record<string, any>
): Response {
  const requestId = (res.req as any)?.requestId || `req-${Date.now()}`;
  return res.status(statusCode).json({
    success: true,
    data,
    requestId,
    ...extraMeta,
  });
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number = 500,
  details?: any
): Response {
  const requestId = (res.req as any)?.requestId || `req-${Date.now()}`;
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    requestId,
  });
}
