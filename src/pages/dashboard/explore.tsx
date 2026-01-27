import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { useToast } from '@/contexts/ToastContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Destination {
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
}

function ExplorePage() {
  const { showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    fetchDestinations();
  }, [selectedCategory, selectedProvince, search]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?activeOnly=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedProvince) params.append('province', selectedProvince);
      params.append('status', 'active');

      const response = await fetch(`/api/destinations?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.data || []);
      }
    } catch (error) {
      showError('Gagal memuat destinasi');
    } finally {
      setLoading(false);
    }
  };

  const provinces = Array.from(new Set(destinations.map(d => d.province))).sort();

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
        <title>Explore Destinasi - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Destinasi</h1>
            <p className="text-gray-600 mt-1">
              Temukan destinasi wisata impian Anda
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Cari destinasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="">Semua Provinsi</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Kategori</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                Semua
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                  className="gap-2"
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {destinations.length} Destinasi Ditemukan
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : destinations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">Tidak ada destinasi ditemukan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => {
                  const images = destination.images ? JSON.parse(destination.images) : [];
                  return (
                    <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gray-200">
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
                        <div className="absolute top-2 right-2">
                          <WishlistButton
                            destinationId={destination.id}
                            size="sm"
                            variant="default"
                          />
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            {destination.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Link href={`/destinations/${destination.slug}`}>
                          <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                            {destination.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {destination.city}, {destination.province}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {destination.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-xs text-gray-500">Mulai dari</p>
                            <p className="text-lg font-bold text-blue-600">
                              {formatPrice(destination.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <Link href={`/destinations/${destination.slug}`}>
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
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(ExplorePage);
