import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return errorResponse(res, 'Token tidak ditemukan', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, 'Token tidak valid', 401);
    }

    switch (req.method) {
      case 'GET':
        return await getPayments(req, res, decoded);
      case 'POST':
        return await createPayment(req, res, decoded);
      case 'PUT':
        return await updatePaymentStatus(req, res, decoded);
      default:
        return errorResponse(res, 'Method tidak diizinkan', 405);
    }
  } catch (error) {
    console.error('Payment API error:', error);
    return errorResponse(res, 'Terjadi kesalahan server', 500);
  }
}

async function getPayments(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { bookingId } = req.query;

  if (bookingId) {
    // Get specific payment
    const payment = await prisma.payment.findUnique({
      where: { bookingId: bookingId as string },
      include: {
        booking: {
          include: {
            destination: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return errorResponse(res, 'Payment tidak ditemukan', 404);
    }

    // Check authorization
    if (payment.booking.userId !== user.userId && user.role !== 'admin') {
      return errorResponse(res, 'Akses ditolak', 403);
    }

    return successResponse(res, payment, 'Payment berhasil dimuat');
  }

  // Get all payments for user
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        userId: user.userId,
      },
    },
    include: {
      booking: {
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(res, payments, 'Payments berhasil dimuat');
}

async function createPayment(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { bookingId, paymentMethod, paymentGateway } = req.body;

  if (!bookingId || !paymentMethod) {
    return errorResponse(res, 'Booking ID dan payment method diperlukan', 400);
  }

  // Check if booking exists and belongs to user
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return errorResponse(res, 'Booking tidak ditemukan', 404);
  }

  if (booking.userId !== user.userId) {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment) {
    return errorResponse(res, 'Payment sudah ada untuk booking ini', 400);
  }

  // Create payment
  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: booking.totalPrice,
      paymentMethod,
      paymentGateway,
      status: 'pending',
    },
    include: {
      booking: {
        include: {
          destination: true,
        },
      },
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: user.userId,
      type: 'payment_created',
      title: 'Payment Dibuat',
      message: `Payment untuk booking ${booking.bookingCode} telah dibuat. Silakan lakukan pembayaran.`,
      link: `/dashboard/bookings/${booking.id}`,
    },
  });

  return successResponse(res, payment, 'Payment berhasil dibuat', 201);
}

async function updatePaymentStatus(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { paymentId, status, transactionId, metadata } = req.body;

  if (!paymentId || !status) {
    return errorResponse(res, 'Payment ID dan status diperlukan', 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: true,
    },
  });

  if (!payment) {
    return errorResponse(res, 'Payment tidak ditemukan', 404);
  }

  // Check authorization
  if (payment.booking.userId !== user.userId && user.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  // Update payment
  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status,
      ...(transactionId && { transactionId }),
      ...(metadata && { metadata }),
      ...(status === 'success' && { paidAt: new Date() }),
      ...(status === 'refunded' && { refundedAt: new Date() }),
    },
  });

  // Update booking payment status
  if (status === 'success') {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: 'paid' },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: payment.booking.userId,
        type: 'payment_success',
        title: 'Pembayaran Berhasil',
        message: `Pembayaran untuk booking ${payment.booking.bookingCode} telah berhasil.`,
        link: `/dashboard/bookings/${payment.booking.id}`,
      },
    });
  }

  return successResponse(res, updated, 'Payment status berhasil diupdate');
}
