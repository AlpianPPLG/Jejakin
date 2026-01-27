import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withAuthRequired } from '@/components/hoc/withAuth';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalDestinations: number;
    totalBookings: number;
    totalRevenue: number;
  };
  bookingStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  recentBookings: any[];
  topDestinations: any[];
  monthlyRevenue: Record<string, number>;
}

function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showError } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin or partner
    if (user && user.role !== 'admin' && user.role !== 'partner') {
      router.push('/dashboard');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      showError('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{user?.role === 'admin' ? 'Admin' : 'Partner'} Dashboard - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'admin' ? 'Admin' : 'Partner'} Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview dan statistik platform
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {user?.role === 'admin' && (
              <StatCard
                title="Total Users"
                value={stats.overview.totalUsers}
                description="Registered users"
                icon="👥"
              />
            )}
            <StatCard
              title="Total Destinasi"
              value={stats.overview.totalDestinations}
              description="Active destinations"
              icon="🏝️"
            />
            <StatCard
              title="Total Booking"
              value={stats.overview.totalBookings}
              description="All bookings"
              icon="📅"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.overview.totalRevenue)}
              description="Paid bookings"
              icon="💰"
            />
          </div>

          {/* Booking Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
              <CardDescription>Status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.bookingStats.pending}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Pending</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.bookingStats.confirmed}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Confirmed</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {stats.bookingStats.completed}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Completed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600">
                    {stats.bookingStats.cancelled}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings & Top Destinations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest 10 bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {booking.destination.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.user.name} • {formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(booking.totalPrice)}
                        </span>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/admin/bookings">
                  <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Bookings →
                  </button>
                </Link>
              </CardContent>
            </Card>

            {/* Top Destinations */}
            <Card>
              <CardHeader>
                <CardTitle>Top Destinations</CardTitle>
                <CardDescription>Most booked destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topDestinations.map((destination, index) => (
                    <div
                      key={destination.id}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {destination.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {destination._count.bookings} bookings • {destination._count.reviews} reviews
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-semibold">
                            {destination.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/destinations">
                  <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Destinations →
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/dashboard/admin/bookings">
                  <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-semibold">Manage Bookings</div>
                    <div className="text-xs text-gray-500">View all bookings</div>
                  </button>
                </Link>
                <Link href="/dashboard/destinations">
                  <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">🏝️</div>
                    <div className="font-semibold">Destinations</div>
                    <div className="text-xs text-gray-500">Manage destinations</div>
                  </button>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/dashboard/admin/users">
                    <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="font-semibold">Users</div>
                      <div className="text-xs text-gray-500">Manage users</div>
                    </button>
                  </Link>
                )}
                <Link href="/dashboard/admin/reviews">
                  <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="font-semibold">Reviews</div>
                    <div className="text-xs text-gray-500">Manage reviews</div>
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(AdminDashboardPage);
