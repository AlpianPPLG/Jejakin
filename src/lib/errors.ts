// Custom Error Classes

export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details?: any;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation error', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

// Error Handler for API Routes
export function handleApiError(error: any) {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        message: error.message,
        error: error.errorCode,
        ...(error.details && { details: error.details }),
      },
    };
  }

  // Prisma Errors
  if (error.code === 'P2002') {
    return {
      statusCode: 409,
      body: {
        success: false,
        message: 'Resource already exists',
        error: 'CONFLICT',
      },
    };
  }

  if (error.code === 'P2025') {
    return {
      statusCode: 404,
      body: {
        success: false,
        message: 'Resource not found',
        error: 'NOT_FOUND',
      },
    };
  }

  // Default error
  return {
    statusCode: 500,
    body: {
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR',
    },
  };
}

// Async Handler Wrapper
export function asyncHandler(handler: Function) {
  return async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      const { statusCode, body } = handleApiError(error);
      return res.status(statusCode).json(body);
    }
  };
}
