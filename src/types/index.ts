// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'partner';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'user' | 'partner' | 'admin';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'partner' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
