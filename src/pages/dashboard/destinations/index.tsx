import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';

interface Destination {
  id: string;
  name: string;
  location: string;
  province: string;
  city: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  images: string;
  status: string;
}

function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/destinations', { headers });
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data.data || []);
    } catch (error) {
      showError('Gagal memuat destinasi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/destinations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      showSuccess('Destinasi berhasil dihapus');
      fetchDestinations();
    } catch (error) {
      showError('Gagal menghapus destinasi');
    }
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Kelola Destinasi - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Destinasi</h1>
              <p className="text-gray-600 mt-1">Kelola destinasi wisata</p>
            </div>
            <Button onClick={() => router.push('/dashboard/destinations/create')}>
              + Tambah Destinasi
            </Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Cari destinasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {/* Destinations Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'Tidak ada destinasi yang ditemukan' : 'Belum ada destinasi'}
                </p>
                <Button onClick={() => router.push('/dashboard/destinations/create')}>
                  Tambah Destinasi Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => {
                const images = destination.images ? JSON.parse(destination.images) : [];
                return (
                <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <Badge
                      className="absolute top-2 right-2"
                      variant={destination.status === 'active' ? 'default' : 'secondary'}
                    >
                      {destination.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-1">{destination.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>📍 {destination.location}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {destination.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          Rp {destination.price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-gray-500">per orang</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {destination.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/destinations/${destination.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(destination.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(DestinationsPage);
