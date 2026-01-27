/**
 * Centralized API Client
 * Handles authentication, error handling, and common API patterns
 */

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Main API call function with automatic token handling
 */
export async function apiCall<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;

  // Setup headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers if provided
  if (fetchOptions.headers) {
    const existingHeaders = new Headers(fetchOptions.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add auth token if required
  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError('No authentication token', 401);
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make request
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError('Unauthorized', 401);
    }

    // Try to parse error message
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If can't parse JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status);
  }

  // Parse response
  try {
    return await response.json();
  } catch (e) {
    // If response is not JSON, return empty object
    return {} as T;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(url: string, options?: ApiOptions) =>
    apiCall<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, data?: any, options?: ApiOptions) =>
    apiCall<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(url: string, data?: any, options?: ApiOptions) =>
    apiCall<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: ApiOptions) =>
    apiCall<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: ApiOptions) =>
    apiCall<T>(url, { ...options, method: 'DELETE' }),
};

/**
 * Default export for backward compatibility
 */
export const apiClient = apiCall;

/**
 * Type-safe API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
