import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        return await getGalleries(req, res);
      case 'POST':
        return await createGallery(req, res);
      case 'PUT':
        return await updateGallery(req, res);
      case 'DELETE':
        return await deleteGallery(req, res);
      default:
        return errorResponse(res, 'Method tidak diizinkan', 405);
    }
  } catch (error) {
    console.error('Gallery API error:', error);
    return errorResponse(res, 'Terjadi kesalahan server', 500);
  }
}

async function getGalleries(req: NextApiRequest, res: NextApiResponse) {
  const { destinationId } = req.query;

  if (!destinationId) {
    return errorResponse(res, 'Destination ID diperlukan', 400);
  }

  const galleries = await prisma.destinationGallery.findMany({
    where: { destinationId: destinationId as string },
    orderBy: [
      { isPrimary: 'desc' },
      { order: 'asc' },
    ],
  });

  return successResponse(res, galleries, 'Gallery berhasil dimuat');
}

async function createGallery(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 'Token tidak ditemukan', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse(res, 'Token tidak valid', 401);
  }

  const { destinationId, imageUrl, caption, isPrimary, order } = req.body;

  if (!destinationId || !imageUrl) {
    return errorResponse(res, 'Destination ID dan image URL diperlukan', 400);
  }

  // Check if destination exists and user has permission
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    return errorResponse(res, 'Destinasi tidak ditemukan', 404);
  }

  if (destination.userId !== decoded.userId && decoded.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  // If setting as primary, unset other primary images
  if (isPrimary) {
    await prisma.destinationGallery.updateMany({
      where: {
        destinationId,
        isPrimary: true,
      },
      data: { isPrimary: false },
    });
  }

  const gallery = await prisma.destinationGallery.create({
    data: {
      destinationId,
      imageUrl,
      caption,
      isPrimary: isPrimary || false,
      order: order || 0,
    },
  });

  return successResponse(res, gallery, 'Gallery berhasil ditambahkan', 201);
}

async function updateGallery(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 'Token tidak ditemukan', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse(res, 'Token tidak valid', 401);
  }

  const { id, imageUrl, caption, isPrimary, order } = req.body;

  if (!id) {
    return errorResponse(res, 'Gallery ID diperlukan', 400);
  }

  const gallery = await prisma.destinationGallery.findUnique({
    where: { id },
    include: { destination: true },
  });

  if (!gallery) {
    return errorResponse(res, 'Gallery tidak ditemukan', 404);
  }

  if (gallery.destination.userId !== decoded.userId && decoded.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  // If setting as primary, unset other primary images
  if (isPrimary && !gallery.isPrimary) {
    await prisma.destinationGallery.updateMany({
      where: {
        destinationId: gallery.destinationId,
        isPrimary: true,
      },
      data: { isPrimary: false },
    });
  }

  const updated = await prisma.destinationGallery.update({
    where: { id },
    data: {
      ...(imageUrl && { imageUrl }),
      ...(caption !== undefined && { caption }),
      ...(isPrimary !== undefined && { isPrimary }),
      ...(order !== undefined && { order }),
    },
  });

  return successResponse(res, updated, 'Gallery berhasil diupdate');
}

async function deleteGallery(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 'Token tidak ditemukan', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse(res, 'Token tidak valid', 401);
  }

  const { id } = req.query;

  if (!id) {
    return errorResponse(res, 'Gallery ID diperlukan', 400);
  }

  const gallery = await prisma.destinationGallery.findUnique({
    where: { id: id as string },
    include: { destination: true },
  });

  if (!gallery) {
    return errorResponse(res, 'Gallery tidak ditemukan', 404);
  }

  if (gallery.destination.userId !== decoded.userId && decoded.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  await prisma.destinationGallery.delete({
    where: { id: id as string },
  });

  return successResponse(res, null, 'Gallery berhasil dihapus');
}
