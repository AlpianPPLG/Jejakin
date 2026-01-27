import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';

interface Booking {
  id: string;
  bookingCode: string;
  visitDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  notes: string | null;
  destination: {
    id: string;
    name: string;
    location: string;
    images: string;
    category: string;
  };
  createdAt: string;
}

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const statusParam = activeTab !== 'all' ? `&status=${activeTab}` : '';
      const response = await fetch(`/api/bookings?${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.data || []);
    } catch (error) {
      showError('Gagal memuat booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan booking ini?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to cancel');

      showSuccess('Booking berhasil dibatalkan');
      fetchBookings();
    } catch (error) {
      showError('Gagal membatalkan booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'default',
    };

    const labels: Record<string, string> = {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: Record<string, any> = {
      unpaid: 'destructive',
      paid: 'default',
      refunded: 'secondary',
    };

    const labels: Record<string, string> = {
      unpaid: 'Belum Bayar',
      paid: 'Lunas',
      refunded: 'Refund',
    };

    return (
      <Badge variant={variants[paymentStatus] || 'secondary'}>
        {labels[paymentStatus] || paymentStatus}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>Booking Saya - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Saya</h1>
            <p className="text-gray-600 mt-1">Kelola semua booking Anda</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="pending">Menunggu</TabsTrigger>
              <TabsTrigger value="confirmed">Dikonfirmasi</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 mb-4">Belum ada booking</p>
                    <Button onClick={() => router.push('/')}>
                      Jelajahi Destinasi
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];
                    return (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="md:flex">
                          {/* Image */}
                          <div className="md:w-48 h-48 bg-gray-200">
                            {images[0] ? (
                              <img
                                src={images[0]}
                                alt={booking.destination.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {booking.destination.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  📍 {booking.destination.location}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Kode Booking: <span className="font-mono font-semibold">{booking.bookingCode}</span>
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {getStatusBadge(booking.status)}
                                {getPaymentBadge(booking.paymentStatus)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">Tanggal Kunjungan</p>
                                <p className="font-semibold">{formatDate(booking.visitDate)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Jumlah Orang</p>
                                <p className="font-semibold">{booking.numberOfPeople} orang</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Total Harga</p>
                                <p className="font-semibold text-blue-600">
                                  Rp {booking.totalPrice.toLocaleString('id-ID')}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Dibuat</p>
                                <p className="font-semibold">{formatDate(booking.createdAt)}</p>
                              </div>
                            </div>

                            {booking.notes && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Catatan:</p>
                                <p className="text-sm">{booking.notes}</p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                              >
                                Detail
                              </Button>
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleCancel(booking.id)}
                                >
                                  Batalkan
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(BookingsPage);
