import { z } from 'zod';

// Auth Validations
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(100, 'Password maksimal 100 karakter'),
  role: z.enum(['user', 'partner']).optional(),
});

// Destination Validations
export const createDestinationSchema = z.object({
  name: z.string().min(3, 'Nama destinasi minimal 3 karakter').max(200, 'Nama destinasi maksimal 200 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  location: z.string().min(3, 'Lokasi minimal 3 karakter'),
  province: z.string().min(3, 'Provinsi harus diisi'),
  city: z.string().min(3, 'Kota harus diisi'),
  category: z.string().min(3, 'Kategori harus diisi'),
  price: z.number().min(0, 'Harga tidak boleh negatif').optional(),
  images: z.array(z.string().url('URL gambar tidak valid')).optional(),
  facilities: z.array(z.string()).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

// Booking Validations
export const createBookingSchema = z.object({
  destinationId: z.string().min(1, 'Destinasi harus dipilih'),
  visitDate: z.string().or(z.date()),
  numberOfPeople: z.number().min(1, 'Jumlah orang minimal 1').max(100, 'Jumlah orang maksimal 100'),
  notes: z.string().optional(),
});

export const updateBookingSchema = z.object({
  visitDate: z.string().or(z.date()).optional(),
  numberOfPeople: z.number().min(1).max(100).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).optional(),
  notes: z.string().optional(),
});

// Review Validations
export const createReviewSchema = z.object({
  destinationId: z.string().min(1, 'Destinasi harus dipilih'),
  rating: z.number().min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5'),
  comment: z.string().min(10, 'Komentar minimal 10 karakter').max(1000, 'Komentar maksimal 1000 karakter'),
  images: z.array(z.string().url('URL gambar tidak valid')).optional(),
});

export const updateReviewSchema = createReviewSchema.partial().omit({ destinationId: true });

// User Profile Validations
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter').optional(),
  avatar: z.string().url('URL avatar tidak valid').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama harus diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter').max(100, 'Password baru maksimal 100 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password harus diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password baru dan konfirmasi tidak cocok',
  path: ['confirmPassword'],
});

// Query Validations
export const paginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
});

export const searchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  province: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
}).merge(paginationSchema);

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
