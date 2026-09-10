export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid request parameters', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed or token missing/invalid') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access forbidden: Insufficient portal privileges or out-of-scope resource') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Requested resource was not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict or duplicate entry detected') {
    super(message, 409, 'CONFLICT');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class AIProviderError extends AppError {
  constructor(message: string = 'AI reasoning or embedding generation provider failed', details?: any) {
    super(message, 502, 'AI_PROVIDER_ERROR', details);
  }
}

export class RagIsolationError extends AppError {
  constructor(message: string = 'Cross-domain knowledge retrieval attempted or domain constraint violated') {
    super(message, 403, 'RAG_ISOLATION_ERROR');
  }
}

export class BomConstraintError extends AppError {
  constructor(message: string = 'Hardware Bill-of-Materials violated domain constraint rules', details?: any) {
    super(message, 422, 'BOM_CONSTRAINT_ERROR', details);
  }
}
