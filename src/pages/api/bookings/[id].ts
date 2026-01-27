import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // GET - Get booking by ID
  if (req.method === 'GET') {
    try {
      const authUser = requireAuth(req);

      const booking = await prisma.booking.findFirst({
        where: {
          OR: [
            { id: id as string },
            { bookingCode: id as string },
          ],
        },
        include: {
          destination: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
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

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      // Check permission
      if (
        authUser.role !== 'admin' &&
        booking.userId !== authUser.userId &&
        booking.destination.userId !== authUser.userId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      return res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Get booking error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // PUT - Update booking
  if (req.method === 'PUT') {
    try {
      const authUser = requireAuth(req);

      // Get existing booking
      const existingBooking = await prisma.booking.findUnique({
        where: { id: id as string },
        include: {
          destination: true,
        },
      });

      if (!existingBooking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      // Check permission
      const isOwner = existingBooking.userId === authUser.userId;
      const isPartner = existingBooking.destination.userId === authUser.userId;
      const isAdmin = authUser.role === 'admin';

      if (!isOwner && !isPartner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      const {
        visitDate,
        numberOfPeople,
        status,
        paymentStatus,
        notes,
      } = req.body;

      // Calculate new total price if numberOfPeople changed
      let totalPrice = existingBooking.totalPrice;
      if (numberOfPeople && numberOfPeople !== existingBooking.numberOfPeople) {
        totalPrice = existingBooking.destination.price * parseInt(numberOfPeople);
      }

      // Update booking
      const booking = await prisma.booking.update({
        where: { id: id as string },
        data: {
          ...(visitDate && { visitDate: new Date(visitDate) }),
          ...(numberOfPeople && { 
            numberOfPeople: parseInt(numberOfPeople),
            totalPrice,
          }),
          ...(status && { status }),
          ...(paymentStatus && { paymentStatus }),
          ...(notes !== undefined && { notes }),
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

      return res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Update booking error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // DELETE - Cancel booking
  if (req.method === 'DELETE') {
    try {
      const authUser = requireAuth(req);

      // Get existing booking
      const existingBooking = await prisma.booking.findUnique({
        where: { id: id as string },
      });

      if (!existingBooking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      // Check permission
      if (
        authUser.role !== 'admin' &&
        existingBooking.userId !== authUser.userId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only cancel your own bookings',
        });
      }

      // Update status to cancelled
      await prisma.booking.update({
        where: { id: id as string },
        data: {
          status: 'cancelled',
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Cancel booking error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
