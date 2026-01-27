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
        return await getWishlists(req, res, decoded);
      case 'POST':
        return await addToWishlist(req, res, decoded);
      case 'DELETE':
        return await removeFromWishlist(req, res, decoded);
      default:
        return errorResponse(res, 'Method tidak diizinkan', 405);
    }
  } catch (error) {
    console.error('Wishlist API error:', error);
    return errorResponse(res, 'Terjadi kesalahan server', 500);
  }
}

async function getWishlists(req: NextApiRequest, res: NextApiResponse, user: any) {
  const wishlists = await prisma.wishlist.findMany({
    where: { userId: user.userId },
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          location: true,
          province: true,
          city: true,
          category: true,
          price: true,
          rating: true,
          images: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(res, wishlists, 'Wishlist berhasil dimuat');
}

async function addToWishlist(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { destinationId } = req.body;

  if (!destinationId) {
    return errorResponse(res, 'Destination ID diperlukan', 400);
  }

  // Check if destination exists
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    return errorResponse(res, 'Destinasi tidak ditemukan', 404);
  }

  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_destinationId: {
        userId: user.userId,
        destinationId,
      },
    },
  });

  if (existing) {
    return errorResponse(res, 'Destinasi sudah ada di wishlist', 400);
  }

  const wishlist = await prisma.wishlist.create({
    data: {
      userId: user.userId,
      destinationId,
    },
    include: {
      destination: true,
    },
  });

  return successResponse(res, wishlist, 'Berhasil ditambahkan ke wishlist', 201);
}

async function removeFromWishlist(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { destinationId } = req.query;

  if (!destinationId) {
    return errorResponse(res, 'Destination ID diperlukan', 400);
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId_destinationId: {
        userId: user.userId,
        destinationId: destinationId as string,
      },
    },
  });

  if (!wishlist) {
    return errorResponse(res, 'Wishlist tidak ditemukan', 404);
  }

  await prisma.wishlist.delete({
    where: { id: wishlist.id },
  });

  return successResponse(res, null, 'Berhasil dihapus dari wishlist');
}
