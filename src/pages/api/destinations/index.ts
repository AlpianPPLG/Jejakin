import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - List all destinations
  if (req.method === 'GET') {
    try {
      const {
        page = '1',
        limit = '20',
        search = '',
        category = '',
        province = '',
        slug = '',
        status = 'active',
        sortBy = 'createdAt',
        order = 'desc',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {
        deletedAt: null,
      };

      // If slug is provided, search by slug
      if (slug) {
        where.slug = slug as string;
      } else {
        // Only filter by status if not searching by slug
        where.status = status as string;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string } },
          { description: { contains: search as string } },
          { location: { contains: search as string } },
        ];
      }

      if (category) {
        where.category = category;
      }

      if (province) {
        where.province = province;
      }

      // Get total count
      const total = await prisma.destination.count({ where });

      // Get destinations
      const destinations = await prisma.destination.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: order,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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

      return res.status(200).json({
        success: true,
        data: destinations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error('Get destinations error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // POST - Create new destination (Partner/Admin only)
  if (req.method === 'POST') {
    try {
      const authUser = requireAuth(req);

      if (authUser.role !== 'partner' && authUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Partner or Admin access required',
        });
      }

      const {
        name,
        description,
        location,
        province,
        city,
        category,
        price = 0,
        images = [],
        facilities = [],
        latitude,
        longitude,
      } = req.body;

      // Validation
      if (!name || !description || !location || !province || !city || !category) {
        return res.status(400).json({
          success: false,
          message: 'Required fields are missing',
        });
      }

      // Generate slug
      const slug = generateSlug(name);

      // Check if slug already exists
      const existingDestination = await prisma.destination.findUnique({
        where: { slug },
      });

      if (existingDestination) {
        return res.status(409).json({
          success: false,
          message: 'Destination with this name already exists',
        });
      }

      // Create destination
      const destination = await prisma.destination.create({
        data: {
          name,
          slug,
          description,
          location,
          province,
          city,
          category,
          price: parseInt(price),
          images: JSON.stringify(images),
          facilities: JSON.stringify(facilities),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          userId: authUser.userId,
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

      return res.status(201).json({
        success: true,
        message: 'Destination created successfully',
        data: destination,
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Create destination error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
