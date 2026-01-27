import { useAuth } from '@/contexts/AuthContext';
import { withAuthRequired } from '@/components/hoc/withAuth';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalSpent: number;
}

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch bookings
      const response = await fetch('/api/bookings?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const bookings = data.data || [];
        setRecentBookings(bookings);

        // Calculate stats
        const allBookingsResponse = await fetch('/api/bookings?limit=1000', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (allBookingsResponse.ok) {
          const allData = await allBookingsResponse.json();
          const allBookings = allData.data || [];

          setStats({
            totalBookings: allBookings.length,
            pendingBookings: allBookings.filter((b: any) => b.status === 'pending').length,
            completedBookings: allBookings.filter((b: any) => b.status === 'completed').length,
            totalSpent: allBookings
              .filter((b: any) => b.paymentStatus === 'paid')
              .reduce((sum: number, b: any) => sum + b.totalPrice, 0),
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>Dashboard - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang kembali, {user?.name}!</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Booking"
            value={stats.totalBookings}
            description="Semua booking Anda"
            icon="📅"
          />
          <StatCard
            title="Menunggu Konfirmasi"
            value={stats.pendingBookings}
            description="Booking pending"
            icon="⏳"
          />
          <StatCard
            title="Selesai"
            value={stats.completedBookings}
            description="Booking completed"
            icon="✅"
          />
          <StatCard
            title="Total Pengeluaran"
            value={`Rp ${stats.totalSpent.toLocaleString('id-ID')}`}
            description="Total yang sudah dibayar"
            icon="💰"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Booking Terbaru</CardTitle>
              <CardDescription>5 booking terakhir Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-sm">Memuat...</p>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Belum ada booking</p>
                  <Link href="/">
                    <Button size="sm">Jelajahi Destinasi</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => {
                    const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];
                    return (
                      <div key={booking.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {images[0] ? (
                            <img
                              src={images[0]}
                              alt={booking.destination.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{booking.destination.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(booking.visitDate)}</p>
                          <p className="text-xs text-gray-500">{booking.numberOfPeople} orang</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-blue-600">
                            Rp {(booking.totalPrice / 1000).toFixed(0)}k
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/dashboard/bookings">
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat Semua Booking
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Informasi akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Edit Profil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Partner/Admin Section */}
        {(user?.role === 'partner' || user?.role === 'admin') && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Panel {user.role === 'admin' ? 'Admin' : 'Partner'}</CardTitle>
              <CardDescription>
                Kelola destinasi dan data lainnya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/destinations">
                  <Button className="w-full">
                    🏝️ Kelola Destinasi
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link href="/dashboard/admin">
                      <Button className="w-full">
                        ⚙️ Admin Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/users">
                      <Button className="w-full">
                        👥 Kelola User
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Quick Actions */}
        {user?.role === 'user' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Explore Destinasi</CardTitle>
              <CardDescription>
                Temukan destinasi wisata impian Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/explore">
                  <Button className="w-full" size="lg">
                    🔍 Explore Destinasi
                  </Button>
                </Link>
                <Link href="/dashboard/wishlist">
                  <Button className="w-full" variant="outline" size="lg">
                    ❤️ Wishlist Saya
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(DashboardPage);
