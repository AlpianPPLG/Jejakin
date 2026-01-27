import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';

interface Wishlist {
  id: string;
  createdAt: string;
  destination: {
    id: string;
    name: string;
    slug: string;
    description: string;
    location: string;
    province: string;
    city: string;
    category: string;
    price: number;
    rating: number;
    images: string;
    status: string;
  };
}

function WishlistPage() {
  const { showSuccess, showError } = useToast();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wishlists', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlists(data.data);
      }
    } catch (error) {
      showError('Gagal memuat wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (destinationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishlists?destinationId=${destinationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showSuccess('Dihapus dari wishlist');
        fetchWishlists();
      }
    } catch (error) {
      showError('Gagal menghapus dari wishlist');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Head>
        <title>Wishlist Saya - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wishlist Saya</h1>
            <p className="text-gray-600 mt-1">
              Destinasi yang Anda simpan
            </p>
          </div>

          {/* Wishlist Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : wishlists.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🤍</div>
                <h3 className="text-xl font-semibold mb-2">Wishlist Kosong</h3>
                <p className="text-gray-500 mb-6">
                  Belum ada destinasi yang Anda simpan
                </p>
                <Link href="/dashboard/explore">
                  <Button>Explore Destinasi</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((wishlist) => {
                const images = wishlist.destination.images 
                  ? JSON.parse(wishlist.destination.images) 
                  : [];
                return (
                  <Card key={wishlist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt={wishlist.destination.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => removeFromWishlist(wishlist.destination.id)}
                          className="gap-2"
                        >
                          <span className="text-xl">❤️</span>
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="bg-white/90">
                          {wishlist.destination.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/destinations/${wishlist.destination.slug}`}>
                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                          {wishlist.destination.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {wishlist.destination.city}, {wishlist.destination.province}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {wishlist.destination.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Mulai dari</p>
                          <p className="text-lg font-bold text-blue-600">
                            {formatPrice(wishlist.destination.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">
                            {wishlist.destination.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <Link href={`/destinations/${wishlist.destination.slug}`}>
                        <Button className="w-full mt-4" size="sm">
                          Lihat Detail
                        </Button>
                      </Link>
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

export default withAuthRequired(WishlistPage);
