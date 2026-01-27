import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Trash2, Search, Filter } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: string[] | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  destination: {
    id: string;
    name: string;
    slug: string;
    images: any;
    category: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminReviews() {
  const router = useRouter();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin' && user.role !== 'partner') {
      router.push('/dashboard');
      return;
    }

    fetchReviews();
  }, [user, pagination.page, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (ratingFilter) params.append('rating', ratingFilter);

      const response = await apiClient(`/api/admin/reviews?${params}`);
      
      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchReviews();
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    try {
      setDeleting(true);
      const response = await apiClient(`/api/admin/reviews?id=${selectedReview.id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setDeleteDialog(false);
        setSelectedReview(null);
        fetchReviews();
      }
    } catch (error: any) {
      console.error('Error deleting review:', error);
      alert(error.message || 'Gagal menghapus review');
    } finally {
      setDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getDestinationImage = (images: any) => {
    if (!images) return '/placeholder-destination.jpg';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return parsed[0] || '/placeholder-destination.jpg';
      } catch {
        return images;
      }
    }
    if (Array.isArray(images)) {
      return images[0] || '/placeholder-destination.jpg';
    }
    return '/placeholder-destination.jpg';
  };

  if (!user || (user.role !== 'admin' && user.role !== 'partner')) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Reviews</h1>
          <p className="text-gray-600 mt-2">
            Kelola dan moderasi ulasan dari pengguna
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari review, user, atau destinasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                Cari
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Rating</SelectItem>
                    <SelectItem value="5">5 Bintang</SelectItem>
                    <SelectItem value="4">4 Bintang</SelectItem>
                    <SelectItem value="3">3 Bintang</SelectItem>
                    <SelectItem value="2">2 Bintang</SelectItem>
                    <SelectItem value="1">1 Bintang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Tidak ada review ditemukan</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destinasi</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Komentar</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={getDestinationImage(review.destination.images)}
                            alt={review.destination.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.destination.name}
                            </p>
                            <Badge variant="secondary" className="mt-1">
                              {review.destination.category}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {review.user.avatar ? (
                            <img
                              src={review.user.avatar}
                              alt={review.user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                              {review.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {review.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStars(review.rating)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {review.comment}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review);
                            setDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Menampilkan {reviews.length} dari {pagination.total} review
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNext}
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Review</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus review ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {selectedReview.destination.name}
                </p>
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm text-gray-600">
                    oleh {selectedReview.user.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedReview.comment}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
