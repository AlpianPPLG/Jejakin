import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';

interface BookingDetail {
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
    description: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

function BookingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetail | null>(null);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBooking(data.data);
    } catch (error) {
      showError('Gagal memuat detail booking');
      router.push('/dashboard/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
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
      router.push('/dashboard/bookings');
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
      pending: 'Menunggu Konfirmasi',
      confirmed: 'Dikonfirmasi',
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className="text-sm">
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
      <Badge variant={variants[paymentStatus] || 'secondary'} className="text-sm">
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return null;
  }

  const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];

  return (
    <>
      <Head>
        <title>Detail Booking - {booking.bookingCode} - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="max-w-4xl space-y-6">
          {/* Header */}
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/bookings')}
              className="mb-4"
            >
              ← Kembali
            </Button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Detail Booking</h1>
                <p className="text-gray-600 mt-1">
                  Kode: <span className="font-mono font-semibold">{booking.bookingCode}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(booking.status)}
                {getPaymentBadge(booking.paymentStatus)}
              </div>
            </div>
          </div>

          {/* Destination Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Destinasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="md:flex gap-6">
                {/* Image */}
                <div className="md:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0">
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

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {booking.destination.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    📍 {booking.destination.location}
                  </p>
                  <Badge variant="outline" className="mb-3">
                    {booking.destination.category}
                  </Badge>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {booking.destination.description}
                  </p>
                  <Link href={`/destinations/${booking.destination.id}`}>
                    <Button variant="link" className="px-0 mt-2">
                      Lihat Detail Destinasi →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tanggal Kunjungan</p>
                  <p className="font-semibold text-lg">{formatDate(booking.visitDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Jumlah Orang</p>
                  <p className="font-semibold text-lg">{booking.numberOfPeople} orang</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Harga per Orang</p>
                  <p className="font-semibold text-lg">
                    Rp {(booking.totalPrice / booking.numberOfPeople).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Harga</p>
                  <p className="font-semibold text-2xl text-blue-600">
                    Rp {booking.totalPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Catatan:</p>
                  <p className="text-gray-900">{booking.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Dibuat pada</p>
                    <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Terakhir diupdate</p>
                    <p className="font-medium">{formatDateTime(booking.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nama Partner</p>
                  <p className="font-semibold">{booking.destination.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{booking.destination.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {booking.status === 'pending' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                  >
                    Batalkan Booking
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard/bookings')}>
                    Kembali ke Daftar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(BookingDetailPage);
