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
      // Admin, Partner, and booking owner can view
      if (
        authUser.role !== 'admin' &&
        authUser.role !== 'partner' &&
        booking.userId !== authUser.userId
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
      const isPartner = authUser.role === 'partner'; // Semua partner bisa update
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

      // Partner and Admin can update status and paymentStatus
      // Regular users can only update notes
      const updateData: any = {};

      if (isPartner || isAdmin) {
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
      }

      if (visitDate) updateData.visitDate = new Date(visitDate);
      if (notes !== undefined) updateData.notes = notes;

      // Calculate new total price if numberOfPeople changed
      if (numberOfPeople && numberOfPeople !== existingBooking.numberOfPeople) {
        updateData.numberOfPeople = parseInt(numberOfPeople);
        updateData.totalPrice = existingBooking.destination.price * parseInt(numberOfPeople);
      }

      // Update booking
      const booking = await prisma.booking.update({
        where: { id: id as string },
        data: updateData,
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

      // Create notification for user if status changed
      if (status && status !== existingBooking.status) {
        await prisma.notification.create({
          data: {
            userId: existingBooking.userId,
            type: 'booking_status_updated',
            title: 'Booking Status Updated',
            message: `Your booking ${existingBooking.bookingCode} status has been updated to ${status}`,
            link: `/dashboard/bookings/${existingBooking.id}`,
          },
        });
      }

      // Create notification for user if payment status changed
      if (paymentStatus && paymentStatus !== existingBooking.paymentStatus) {
        await prisma.notification.create({
          data: {
            userId: existingBooking.userId,
            type: 'payment_status_updated',
            title: 'Payment Status Updated',
            message: `Your payment for booking ${existingBooking.bookingCode} has been updated to ${paymentStatus}`,
            link: `/dashboard/bookings/${existingBooking.id}`,
          },
        });
      }

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
