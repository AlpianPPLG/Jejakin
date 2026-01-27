import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextApiRequest } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'jejakin-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Generate JWT Token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });
}

// Verify JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Hash Password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare Password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get User from Request
export function getUserFromRequest(req: NextApiRequest): JWTPayload | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Middleware to protect routes
export function requireAuth(req: NextApiRequest): JWTPayload {
  const user = getUserFromRequest(req);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Middleware to require admin role
export function requireAdmin(req: NextApiRequest): JWTPayload {
  const user = requireAuth(req);
  
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
}
