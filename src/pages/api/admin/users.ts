import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - List all users (Admin only)
  if (req.method === 'GET') {
    try {
      const authUser = requireAuth(req);

      if (authUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Admin access required',
        });
      }

      const {
        page = '1',
        limit = '20',
        role = '',
        search = '',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {
        deletedAt: null,
      };

      if (role) {
        where.role = role;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string } },
          { email: { contains: search as string } },
        ];
      }

      // Get total count
      const total = await prisma.user.count({ where });

      // Get users
      const users = await prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              bookings: true,
              destinations: true,
              reviews: true,
            },
          },
        },
      });

      // Calculate statistics
      const stats = {
        total,
        users: await prisma.user.count({ where: { ...where, role: 'user' } }),
        partners: await prisma.user.count({ where: { ...where, role: 'partner' } }),
        admins: await prisma.user.count({ where: { ...where, role: 'admin' } }),
      };

      return res.status(200).json({
        success: true,
        data: users,
        stats,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Get admin users error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
