import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import GuestLayout from '@/components/layouts/GuestLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  province: string;
  city: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  images: string;
  _count: {
    bookings: number;
    reviews: number;
  };
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchDestinations();
  }, [categoryFilter, provinceFilter, sortBy]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (provinceFilter) params.append('province', provinceFilter);
      params.append('sortBy', sortBy);
      params.append('limit', '50');

      const response = await fetch(`/api/destinations?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data.data || []);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(search.toLowerCase()) ||
    dest.location.toLowerCase().includes(search.toLowerCase()) ||
    dest.description.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'BEACH': 'Pantai',
      'MOUNTAIN': 'Gunung',
      'CULTURAL': 'Budaya',
      'ADVENTURE': 'Petualangan',
      'CULINARY': 'Kuliner',
      'NATURE': 'Alam',
    };
    return labels[category] || category;
  };

  const uniqueProvinces = Array.from(new Set(destinations.map(d => d.province))).sort();

  return (
    <>
      <Head>
        <title>Destinasi Wisata - Jejakin</title>
        <meta name="description" content="Temukan destinasi wisata terbaik di Indonesia" />
      </Head>

      <GuestLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Destinasi Wisata
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Jelajahi keindahan Indonesia dengan berbagai destinasi wisata pilihan
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Cari destinasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kategori</SelectItem>
                    <SelectItem value="BEACH">Pantai</SelectItem>
                    <SelectItem value="MOUNTAIN">Gunung</SelectItem>
                    <SelectItem value="CULTURAL">Budaya</SelectItem>
                    <SelectItem value="ADVENTURE">Petualangan</SelectItem>
                    <SelectItem value="CULINARY">Kuliner</SelectItem>
                    <SelectItem value="NATURE">Alam</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Provinsi</SelectItem>
                    {uniqueProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Terbaru</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                    <SelectItem value="price">Harga Terendah</SelectItem>
                    <SelectItem value="name">Nama A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Menampilkan {filteredDestinations.length} dari {destinations.length} destinasi
            </p>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">
                  {search || categoryFilter || provinceFilter 
                    ? 'Tidak ada destinasi yang sesuai dengan filter' 
                    : 'Belum ada destinasi tersedia'
                  }
                </p>
                {(search || categoryFilter || provinceFilter) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setCategoryFilter('');
                      setProvinceFilter('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
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
                      <Badge className="absolute top-2 right-2">
                        {getCategoryLabel(destination.category)}
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="line-clamp-1">{destination.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📍 {destination.location}</span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {destination.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(destination.price)}
                          </p>
                          <p className="text-xs text-gray-500">per orang</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {destination._count.reviews} reviews
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/destinations/${destination.slug}`} className="flex-1">
                          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Lihat Detail
                          </button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </GuestLayout>
    </>
  );
}