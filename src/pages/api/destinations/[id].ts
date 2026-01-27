import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // GET - Get destination by ID
  if (req.method === 'GET') {
    try {
      const destination = await prisma.destination.findFirst({
        where: {
          OR: [{ id: id as string }, { slug: id as string }],
          deletedAt: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      });

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: destination,
      });
    } catch (error) {
      console.error('Get destination error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // PUT - Update destination
  if (req.method === 'PUT') {
    try {
      const authUser = requireAuth(req);

      // Get existing destination
      const existingDestination = await prisma.destination.findUnique({
        where: { id: id as string },
      });

      if (!existingDestination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found',
        });
      }

      // Check permission
      if (
        authUser.role !== 'admin' &&
        existingDestination.userId !== authUser.userId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update your own destinations',
        });
      }

      const {
        name,
        description,
        location,
        province,
        city,
        category,
        price,
        images,
        facilities,
        latitude,
        longitude,
        status,
      } = req.body;

      // Update destination
      const destination = await prisma.destination.update({
        where: { id: id as string },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(location && { location }),
          ...(province && { province }),
          ...(city && { city }),
          ...(category && { category }),
          ...(price !== undefined && { price: parseInt(price) }),
          ...(images && { images: JSON.stringify(images) }),
          ...(facilities && { facilities: JSON.stringify(facilities) }),
          ...(latitude && { latitude: parseFloat(latitude) }),
          ...(longitude && { longitude: parseFloat(longitude) }),
          ...(status && { status }),
        },
        include: {
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
        message: 'Destination updated successfully',
        data: destination,
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Update destination error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // DELETE - Delete destination
  if (req.method === 'DELETE') {
    try {
      const authUser = requireAuth(req);

      // Get existing destination
      const existingDestination = await prisma.destination.findUnique({
        where: { id: id as string },
      });

      if (!existingDestination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found',
        });
      }

      // Check permission
      if (
        authUser.role !== 'admin' &&
        existingDestination.userId !== authUser.userId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only delete your own destinations',
        });
      }

      // Soft delete
      await prisma.destination.update({
        where: { id: id as string },
        data: {
          deletedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Destination deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Delete destination error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
