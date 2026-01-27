import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - List all bookings (Admin only)
  if (req.method === 'GET') {
    try {
      const authUser = requireAuth(req);

      // Check if user is admin or partner
      if (authUser.role !== 'admin' && authUser.role !== 'partner') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Admin or Partner access required',
        });
      }

      const {
        page = '1',
        limit = '20',
        status = '',
        search = '',
        userId = '',
        destinationId = '',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};

      // Partner can only see bookings for their destinations
      if (authUser.role === 'partner') {
        const partnerDestinations = await prisma.destination.findMany({
          where: { userId: authUser.userId },
          select: { id: true },
        });
        where.destinationId = {
          in: partnerDestinations.map((d: { id: any; }) => d.id),
        };
      }

      if (status) {
        where.status = status;
      }

      if (userId) {
        where.userId = userId as string;
      }

      if (destinationId) {
        where.destinationId = destinationId as string;
      }

      if (search) {
        where.OR = [
          { bookingCode: { contains: search as string } },
          { user: { name: { contains: search as string } } },
          { user: { email: { contains: search as string } } },
          { destination: { name: { contains: search as string } } },
        ];
      }

      // Get total count
      const total = await prisma.booking.count({ where });

      // Get bookings
      const bookings = await prisma.booking.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              location: true,
              images: true,
              category: true,
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      // Calculate statistics
      const stats = {
        total,
        pending: await prisma.booking.count({ where: { ...where, status: 'pending' } }),
        confirmed: await prisma.booking.count({ where: { ...where, status: 'confirmed' } }),
        completed: await prisma.booking.count({ where: { ...where, status: 'completed' } }),
        cancelled: await prisma.booking.count({ where: { ...where, status: 'cancelled' } }),
        totalRevenue: await prisma.booking.aggregate({
          where: { ...where, paymentStatus: 'paid' },
          _sum: { totalPrice: true },
        }),
      };

      return res.status(200).json({
        success: true,
        data: bookings,
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

      console.error('Get admin bookings error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
