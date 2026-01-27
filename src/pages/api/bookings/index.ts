import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - List user's bookings
  if (req.method === 'GET') {
    try {
      const authUser = requireAuth(req);

      const {
        page = '1',
        limit = '20',
        status = '',
        userId = '',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};

      // Admin can see all bookings, others only their own
      if (authUser.role === 'admin') {
        if (userId) {
          where.userId = userId as string;
        }
      } else {
        where.userId = authUser.userId;
      }

      if (status) {
        where.status = status;
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
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: bookings,
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

      console.error('Get bookings error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // POST - Create new booking
  if (req.method === 'POST') {
    try {
      const authUser = requireAuth(req);

      const {
        destinationId,
        visitDate,
        numberOfPeople,
        notes,
      } = req.body;

      // Validation
      if (!destinationId || !visitDate || !numberOfPeople) {
        return res.status(400).json({
          success: false,
          message: 'Required fields are missing',
        });
      }

      // Get destination
      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
      });

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found',
        });
      }

      if (destination.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Destination is not available',
        });
      }

      // Calculate total price
      const totalPrice = destination.price * parseInt(numberOfPeople);

      // Generate booking code
      const bookingCode = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          bookingCode,
          userId: authUser.userId,
          destinationId,
          visitDate: new Date(visitDate),
          numberOfPeople: parseInt(numberOfPeople),
          totalPrice,
          notes: notes || null,
        },
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              location: true,
              images: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Create booking error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
