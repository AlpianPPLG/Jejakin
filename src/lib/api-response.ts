import { NextApiResponse } from 'next';

// Success Response Helper
export function successResponse<T = any>(
  res: NextApiResponse,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

// Created Response Helper
export function createdResponse<T = any>(
  res: NextApiResponse,
  data: T,
  message: string = 'Created successfully'
) {
  return successResponse(res, data, message, 201);
}

// Error Response Helper
export function errorResponse(
  res: NextApiResponse,
  message: string,
  statusCode: number = 500,
  error?: string,
  details?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error }),
    ...(details && { details }),
  });
}

// Validation Error Response
export function validationErrorResponse(
  res: NextApiResponse,
  errors: any
) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    error: 'VALIDATION_ERROR',
    details: errors,
  });
}

// Unauthorized Response
export function unauthorizedResponse(
  res: NextApiResponse,
  message: string = 'Unauthorized'
) {
  return errorResponse(res, message, 401, 'UNAUTHORIZED');
}

// Forbidden Response
export function forbiddenResponse(
  res: NextApiResponse,
  message: string = 'Forbidden'
) {
  return errorResponse(res, message, 403, 'FORBIDDEN');
}

// Not Found Response
export function notFoundResponse(
  res: NextApiResponse,
  message: string = 'Resource not found'
) {
  return errorResponse(res, message, 404, 'NOT_FOUND');
}

// Conflict Response
export function conflictResponse(
  res: NextApiResponse,
  message: string = 'Resource already exists'
) {
  return errorResponse(res, message, 409, 'CONFLICT');
}

// Paginated Response Helper
export function paginatedResponse<T = any>(
  res: NextApiResponse,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message: string = 'Success'
) {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

// Method Not Allowed Response
export function methodNotAllowedResponse(
  res: NextApiResponse,
  allowedMethods: string[] = []
) {
  if (allowedMethods.length > 0) {
    res.setHeader('Allow', allowedMethods.join(', '));
  }
  return errorResponse(res, 'Method not allowed', 405, 'METHOD_NOT_ALLOWED');
}
