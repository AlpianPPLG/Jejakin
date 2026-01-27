import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - Get admin statistics
  if (req.method === 'GET') {
    try {
      const authUser = requireAuth(req);

      if (authUser.role !== 'admin' && authUser.role !== 'partner') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Admin or Partner access required',
        });
      }

      // For partners, filter by their destinations
      const partnerFilter = authUser.role === 'partner' ? {
        destination: {
          userId: authUser.userId,
        },
      } : {};

      // Get counts
      const [
        totalUsers,
        totalDestinations,
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        recentBookings,
        topDestinations,
      ] = await Promise.all([
        // Total users (admin only)
        authUser.role === 'admin' ? prisma.user.count({ where: { deletedAt: null } }) : 0,
        
        // Total destinations
        authUser.role === 'admin' 
          ? prisma.destination.count({ where: { deletedAt: null } })
          : prisma.destination.count({ where: { userId: authUser.userId, deletedAt: null } }),
        
        // Total bookings
        prisma.booking.count({ where: partnerFilter }),
        
        // Total revenue
        prisma.booking.aggregate({
          where: { ...partnerFilter, paymentStatus: 'paid' },
          _sum: { totalPrice: true },
        }),
        
        // Pending bookings
        prisma.booking.count({ where: { ...partnerFilter, status: 'pending' } }),
        
        // Confirmed bookings
        prisma.booking.count({ where: { ...partnerFilter, status: 'confirmed' } }),
        
        // Completed bookings
        prisma.booking.count({ where: { ...partnerFilter, status: 'completed' } }),
        
        // Cancelled bookings
        prisma.booking.count({ where: { ...partnerFilter, status: 'cancelled' } }),
        
        // Recent bookings
        prisma.booking.findMany({
          where: partnerFilter,
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            destination: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        }),
        
        // Top destinations by booking count
        prisma.destination.findMany({
          where: authUser.role === 'admin' 
            ? { deletedAt: null }
            : { userId: authUser.userId, deletedAt: null },
          take: 5,
          orderBy: {
            bookings: {
              _count: 'desc',
            },
          },
          include: {
            _count: {
              select: {
                bookings: true,
                reviews: true,
              },
            },
          },
        }),
      ]);

      // Calculate monthly revenue (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyRevenue = await prisma.booking.groupBy({
        by: ['createdAt'],
        where: {
          ...partnerFilter,
          paymentStatus: 'paid',
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        _sum: {
          totalPrice: true,
        },
      });

      // Process monthly revenue data
      const revenueByMonth: Record<string, number> = {};
      monthlyRevenue.forEach((item: { createdAt: string | number | Date; _sum: { totalPrice: any; }; }) => {
        const month = new Date(item.createdAt).toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'short' 
        });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (item._sum.totalPrice || 0);
      });

      return res.status(200).json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalDestinations,
            totalBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
          },
          bookingStats: {
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
          },
          recentBookings,
          topDestinations,
          monthlyRevenue: revenueByMonth,
        },
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Get admin stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
