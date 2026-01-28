import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withAuthRequired } from '@/components/hoc/withAuth';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  province: string;
  category: string;
  price: number;
  rating: number;
  status: string;
  images: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    bookings: number;
    reviews: number;
  };
}

function AdminDestinationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchDestinations();
  }, [user, statusFilter, categoryFilter]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);

      const response = await fetch(`/api/destinations?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data.data || []);
    } catch (error) {
      showError('Gagal memuat destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (destinationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/destinations/${destinationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      showSuccess(`Status destinasi berhasil diubah ke ${newStatus}`);
      await fetchDestinations();
    } catch (error) {
      showError('Gagal update status destinasi');
    }
  };

  const handleDelete = async () => {
    if (!selectedDestination) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/destinations/${selectedDestination.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete destination');

      showSuccess('Destinasi berhasil dihapus');
      setDeleteDialog(false);
      setSelectedDestination(null);
      await fetchDestinations();
    } catch (error) {
      showError('Gagal menghapus destinasi');
    } finally {
      setDeleting(false);
    }
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.location.toLowerCase().includes(search.toLowerCase()) ||
      dest.user.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'secondary',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getImage = (images: any) => {
    if (!images) return '/placeholder.jpg';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return parsed[0] || '/placeholder.jpg';
      } catch {
        return images;
      }
    }
    if (Array.isArray(images)) {
      return images[0] || '/placeholder.jpg';
    }
    return '/placeholder.jpg';
  };

  return (
    <>
      <Head>
        <title>Manage Destinations - Admin - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Destinations</h1>
              <p className="text-gray-600 mt-1">View and manage all destinations</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{destinations.length}</div>
                <div className="text-xs text-gray-500">Total Destinations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {destinations.filter(d => d.status === 'active').length}
                </div>
                <div className="text-xs text-gray-500">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {destinations.filter(d => d.status === 'pending').length}
                </div>
                <div className="text-xs text-gray-500">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-600">
                  {destinations.filter(d => d.status === 'inactive').length}
                </div>
                <div className="text-xs text-gray-500">Inactive</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search by name, location, or partner..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pantai">Pantai</SelectItem>
                    <SelectItem value="gunung">Gunung</SelectItem>
                    <SelectItem value="budaya">Budaya</SelectItem>
                    <SelectItem value="kuliner">Kuliner</SelectItem>
                    <SelectItem value="alam">Alam</SelectItem>
                    <SelectItem value="religi">Religi</SelectItem>
                    <SelectItem value="petualangan">Petualangan</SelectItem>
                    <SelectItem value="belanja">Belanja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Destinations ({filteredDestinations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : filteredDestinations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No destinations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Destination</TableHead>
                        <TableHead>Partner</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDestinations.map((destination) => (
                        <TableRow key={destination.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={getImage(destination.images)}
                                alt={destination.name}
                                className="w-16 h-16 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">{destination.name}</div>
                                <div className="text-sm text-gray-500">{destination.location}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{destination.user.name}</div>
                              <div className="text-xs text-gray-500">{destination.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{destination.category}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-blue-600">
                            {formatCurrency(destination.price)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{destination._count.bookings} bookings</div>
                              <div className="text-gray-500">{destination._count.reviews} reviews</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={destination.status}
                              onValueChange={(value) => handleStatusUpdate(destination.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(destination.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/destinations/${destination.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDestination(destination);
                                  setDeleteDialog(true);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this destination? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDestination && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{selectedDestination.name}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedDestination.location}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Partner: {selectedDestination.user.name}
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withAuthRequired(AdminDestinationsPage);
