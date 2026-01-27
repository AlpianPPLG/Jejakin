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
        return await getCategories(req, res);
      case 'POST':
        return await createCategory(req, res);
      case 'PUT':
        return await updateCategory(req, res);
      case 'DELETE':
        return await deleteCategory(req, res);
      default:
        return errorResponse(res, 'Method tidak diizinkan', 405);
    }
  } catch (error) {
    console.error('Category API error:', error);
    return errorResponse(res, 'Terjadi kesalahan server', 500);
  }
}

async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  const { activeOnly = 'true', includeCount = 'false' } = req.query;

  const where: any = {};
  if (activeOnly === 'true') {
    where.isActive = true;
  }

  const categories = await prisma.category.findMany({
    where,
    include: includeCount === 'true' ? {
      _count: {
        select: { destinations: true },
      },
    } : undefined,
    orderBy: { name: 'asc' },
  });

  return successResponse(res, categories, 'Kategori berhasil dimuat');
}

async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 'Token tidak ditemukan', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  const { name, slug, description, icon } = req.body;

  if (!name || !slug) {
    return errorResponse(res, 'Nama dan slug diperlukan', 400);
  }

  // Check if slug already exists
  const existing = await prisma.category.findUnique({
    where: { slug },
  });

  if (existing) {
    return errorResponse(res, 'Slug sudah digunakan', 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      icon,
    },
  });

  return successResponse(res, category, 'Kategori berhasil dibuat', 201);
}

async function updateCategory(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 'Token tidak ditemukan', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  const { id, name, slug, description, icon, isActive } = req.body;

  if (!id) {
    return errorResponse(res, 'Category ID diperlukan', 400);
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return errorResponse(res, 'Kategori tidak ditemukan', 404);
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return successResponse(res, updated, 'Kategori berhasil diupdate');
}

async function deleteCategory(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 'Token tidak ditemukan', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return errorResponse(res, 'Akses ditolak', 403);
  }

  const { id } = req.query;

  if (!id) {
    return errorResponse(res, 'Category ID diperlukan', 400);
  }

  const category = await prisma.category.findUnique({
    where: { id: id as string },
    include: {
      _count: {
        select: { destinations: true },
      },
    },
  });

  if (!category) {
    return errorResponse(res, 'Kategori tidak ditemukan', 404);
  }

  if (category._count.destinations > 0) {
    return errorResponse(res, 'Tidak dapat menghapus kategori yang masih digunakan', 400);
  }

  await prisma.category.delete({
    where: { id: id as string },
  });

  return successResponse(res, null, 'Kategori berhasil dihapus');
}
