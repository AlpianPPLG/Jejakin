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
        return await getNotifications(req, res, decoded);
      case 'PUT':
        return await markAsRead(req, res, decoded);
      case 'DELETE':
        return await deleteNotification(req, res, decoded);
      default:
        return errorResponse(res, 'Method tidak diizinkan', 405);
    }
  } catch (error) {
    console.error('Notification API error:', error);
    return errorResponse(res, 'Terjadi kesalahan server', 500);
  }
}

async function getNotifications(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { unreadOnly = 'false', limit = '20' } = req.query;

  const where: any = { userId: user.userId };
  if (unreadOnly === 'true') {
    where.isRead = false;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
  });

  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.userId,
      isRead: false,
    },
  });

  return successResponse(res, {
    notifications,
    unreadCount,
  }, 'Notifikasi berhasil dimuat');
}

async function markAsRead(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { notificationId, markAll } = req.body;

  if (markAll) {
    await prisma.notification.updateMany({
      where: {
        userId: user.userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return successResponse(res, null, 'Semua notifikasi ditandai sudah dibaca');
  }

  if (!notificationId) {
    return errorResponse(res, 'Notification ID diperlukan', 400);
  }

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId: user.userId,
    },
  });

  if (!notification) {
    return errorResponse(res, 'Notifikasi tidak ditemukan', 404);
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return successResponse(res, updated, 'Notifikasi ditandai sudah dibaca');
}

async function deleteNotification(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { notificationId } = req.query;

  if (!notificationId) {
    return errorResponse(res, 'Notification ID diperlukan', 400);
  }

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId as string,
      userId: user.userId,
    },
  });

  if (!notification) {
    return errorResponse(res, 'Notifikasi tidak ditemukan', 404);
  }

  await prisma.notification.delete({
    where: { id: notificationId as string },
  });

  return successResponse(res, null, 'Notifikasi berhasil dihapus');
}
