import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return errorResponse(res, 'Destination ID diperlukan', 400);
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getReviews(req, res, id as string);
      default:
        return errorResponse(res, 'Method tidak diizinkan', 405);
    }
  } catch (error) {
    console.error('Reviews API error:', error);
    return errorResponse(res, 'Terjadi kesalahan server', 500);
  }
}

async function getReviews(req: NextApiRequest, res: NextApiResponse, destinationId: string) {
  const reviews = await prisma.review.findMany({
    where: { destinationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(res, reviews, 'Reviews berhasil dimuat');
}
