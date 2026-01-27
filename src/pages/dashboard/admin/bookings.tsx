import { useState, useEffect } from 'react';
import Head from 'next/head';
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

interface Booking {
  id: string;
  bookingCode: string;
  visitDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  destination: {
    id: string;
    name: string;
    location: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

function AdminBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showError } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'partner') {
      router.push('/dashboard');
      return;
    }
    fetchBookings();
  }, [user, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const statusParam = statusFilter ? `&status=${statusFilter}` : '';
      const response = await fetch(`/api/admin/bookings?limit=100${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.data || []);
      setStats(data.stats);
    } catch (error) {
      showError('Gagal memuat booking');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    booking.user.name.toLowerCase().includes(search.toLowerCase()) ||
    booking.destination.name.toLowerCase().includes(search.toLowerCase())
  );

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
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'default',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: Record<string, any> = {
      unpaid: 'destructive',
      paid: 'default',
      refunded: 'secondary',
    };

    return (
      <Badge variant={variants[paymentStatus] || 'secondary'}>
        {paymentStatus}
      </Badge>
    );
  };

  return (
    <>
      <Head>
        <title>Manage Bookings - Admin - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage all bookings</p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
                  <div className="text-xs text-gray-500">Confirmed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                  <div className="text-xs text-gray-500">Cancelled</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search by booking code, user, or destination..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking Code</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Visit Date</TableHead>
                        <TableHead>People</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                        >
                          <TableCell className="font-mono text-sm">
                            {booking.bookingCode}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.user.name}</div>
                              <div className="text-xs text-gray-500">{booking.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.destination.name}</div>
                              <div className="text-xs text-gray-500">{booking.destination.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(booking.visitDate)}</TableCell>
                          <TableCell>{booking.numberOfPeople}</TableCell>
                          <TableCell className="font-semibold text-blue-600">
                            {formatCurrency(booking.totalPrice)}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(booking.createdAt)}
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
    </>
  );
}

export default withAuthRequired(AdminBookingsPage);
