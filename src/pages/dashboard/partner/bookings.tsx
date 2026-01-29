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

interface Booking {
  id: string;
  bookingCode: string;
  visitDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  destination: {
    id: string;
    name: string;
    location: string;
    images: any;
  };
}

function PartnerBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  useEffect(() => {
    if (user && user.role !== 'partner') {
      router.push('/dashboard');
      return;
    }
    fetchBookings();
  }, [user, statusFilter, paymentFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    console.log('🔍 Fetching bookings...');
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentFilter && paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);

      console.log('Fetching with params:', params.toString());
      
      const response = await fetch(`/api/bookings?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      
      console.log('✅ Bookings data:', data);
      console.log('Total bookings:', data.data?.length || 0);
      
      setBookings(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      showError('Gagal memuat bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const updateData: any = {};
      if (newStatus) updateData.status = newStatus;
      if (newPaymentStatus) updateData.paymentStatus = newPaymentStatus;

      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update booking');

      showSuccess('Status booking berhasil diupdate');
      setUpdateDialog(false);
      setSelectedBooking(null);
      setNewStatus('');
      setNewPaymentStatus('');
      await fetchBookings();
    } catch (error) {
      showError('Gagal update status booking');
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setNewPaymentStatus(booking.paymentStatus);
    setUpdateDialog(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(search.toLowerCase()) ||
      booking.destination.name.toLowerCase().includes(search.toLowerCase());
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
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'default',
    };

    const labels: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, any> = {
      unpaid: 'secondary',
      paid: 'default',
      refunded: 'destructive',
    };

    const labels: Record<string, string> = {
      unpaid: 'Belum Bayar',
      paid: 'Sudah Bayar',
      refunded: 'Refund',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <>
      <Head>
        <title>Kelola Booking - Partner - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Booking</h1>
            <p className="text-gray-600 mt-1">Kelola booking untuk destinasi Anda</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{bookings.length}</div>
                <div className="text-xs text-gray-500">Total Booking</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-xs text-gray-500">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-xs text-gray-500">Confirmed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.paymentStatus === 'paid').length}
                </div>
                <div className="text-xs text-gray-500">Sudah Bayar</div>
              </CardContent>
            </Card>
          </div>

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
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment</SelectItem>
                    <SelectItem value="unpaid">Belum Bayar</SelectItem>
                    <SelectItem value="paid">Sudah Bayar</SelectItem>
                    <SelectItem value="refunded">Refund</SelectItem>
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
                    <Skeleton key={i} className="h-20 w-full" />
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
                        <TableHead>Customer</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Visit Date</TableHead>
                        <TableHead>People</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="font-mono text-sm font-semibold">
                              {booking.bookingCode}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(booking.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.user.name}</div>
                              <div className="text-sm text-gray-500">{booking.user.email}</div>
                              {booking.user.phone && (
                                <div className="text-xs text-gray-500">{booking.user.phone}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{booking.destination.name}</div>
                            <div className="text-sm text-gray-500">{booking.destination.location}</div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(booking.visitDate)}
                          </TableCell>
                          <TableCell className="text-center">
                            {booking.numberOfPeople} orang
                          </TableCell>
                          <TableCell className="font-semibold text-blue-600">
                            {formatCurrency(booking.totalPrice)}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/bookings/${booking.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openUpdateDialog(booking)}
                              >
                                Update
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

      {/* Update Status Dialog */}
      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Booking</DialogTitle>
            <DialogDescription>
              Update status booking dan payment status
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{selectedBooking.bookingCode}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedBooking.destination.name}</p>
                <p className="text-sm text-gray-500">Customer: {selectedBooking.user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Belum Bayar</SelectItem>
                    <SelectItem value="paid">Sudah Bayar</SelectItem>
                    <SelectItem value="refunded">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUpdateDialog(false);
                setSelectedBooking(null);
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withAuthRequired(PartnerBookingsPage);
