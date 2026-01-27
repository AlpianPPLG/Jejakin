import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/api-response';
import { AppError } from '@/lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json(apiError('Token tidak ditemukan', 401));
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'partner')) {
      return res.status(403).json(apiError('Akses ditolak', 403));
    }

    switch (req.method) {
      case 'GET':
        return await getReviews(req, res, decoded);
      case 'DELETE':
        return await deleteReview(req, res, decoded);
      default:
        return res.status(405).json(apiError('Method tidak diizinkan', 405));
    }
  } catch (error) {
    console.error('Admin reviews API error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(apiError(error.message, error.statusCode));
    }
    return res.status(500).json(apiError('Terjadi kesalahan server', 500));
  }
}

async function getReviews(req: NextApiRequest, res: NextApiResponse, user: any) {
  const {
    page = '1',
    limit = '10',
    search = '',
    rating = '',
    destinationId = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { comment: { contains: search as string } },
      { user: { name: { contains: search as string } } },
      { destination: { name: { contains: search as string } } }
    ];
  }

  if (rating) {
    where.rating = parseInt(rating as string);
  }

  if (destinationId) {
    where.destinationId = destinationId as string;
  }

  // If partner, only show reviews for their destinations
  if (user.role === 'partner') {
    where.destination = {
      userId: user.userId
    };
  }

  // Get total count
  const total = await prisma.review.count({ where });

  // Get reviews with relations
  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          category: true
        }
      }
    },
    orderBy: {
      [sortBy as string]: sortOrder as 'asc' | 'desc'
    },
    skip,
    take: limitNum
  });

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json(
    apiResponse('Reviews berhasil dimuat', {
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    })
  );
}

async function deleteReview(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json(apiError('ID review tidak ditemukan', 400));
  }

  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: id as string },
    include: {
      destination: {
        select: {
          userId: true
        }
      }
    }
  });

  if (!review) {
    return res.status(404).json(apiError('Review tidak ditemukan', 404));
  }

  // If partner, check if they own the destination
  if (user.role === 'partner' && review.destination.userId !== user.userId) {
    return res.status(403).json(apiError('Anda tidak memiliki akses untuk menghapus review ini', 403));
  }

  // Delete review
  await prisma.review.delete({
    where: { id: id as string }
  });

  // Update destination rating
  const destinationReviews = await prisma.review.findMany({
    where: { destinationId: review.destinationId },
    select: { rating: true }
  });

  const avgRating = destinationReviews.length > 0
    ? destinationReviews.reduce((sum: any, r: { rating: any; }) => sum + r.rating, 0) / destinationReviews.length
    : 0;

  await prisma.destination.update({
    where: { id: review.destinationId },
    data: { rating: avgRating }
  });

  return res.status(200).json(apiResponse('Review berhasil dihapus'));
}
