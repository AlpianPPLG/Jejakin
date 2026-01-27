import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { Skeleton } from '@/components/ui/skeleton';

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
  facilities: string;
  latitude?: number;
  longitude?: number;
  status: string;
  user: {
    id: string;
    name: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export default function DestinationDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Booking form state
  const [visitDate, setVisitDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (slug) {
      fetchDestination();
    }
  }, [slug]);

  const fetchDestination = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/destinations?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setDestination(data.data[0]);
          // Fetch reviews for this destination
          fetchReviews(data.data[0].id);
        } else {
          showError('Destinasi tidak ditemukan');
          router.push('/destinations');
        }
      }
    } catch (error) {
      showError('Gagal memuat destinasi');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (destinationId: string) => {
    try {
      const response = await fetch(`/api/destinations/${destinationId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showError('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    if (!visitDate) {
      showError('Tanggal kunjungan harus diisi');
      return;
    }

    if (numberOfPeople < 1) {
      showError('Jumlah orang minimal 1');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const totalPrice = destination!.price * numberOfPeople;

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationId: destination!.id,
          visitDate: new Date(visitDate).toISOString(),
          numberOfPeople,
          totalPrice,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showSuccess('Booking berhasil dibuat!');
        router.push(`/dashboard/bookings/${data.data.id}`);
      } else {
        const data = await response.json();
        showError(data.message || 'Gagal membuat booking');
      }
    } catch (error) {
      showError('Terjadi kesalahan saat membuat booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return null;
  }

  const images = destination.images ? JSON.parse(destination.images) : [];
  const facilities = destination.facilities ? JSON.parse(destination.facilities) : [];

  return (
    <>
      <Head>
        <title>{destination.name} - Jejakin</title>
        <meta name="description" content={destination.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                  Jejakin
                </h1>
              </Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/register">
                      <Button>Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-blue-600">Destinations</Link>
            <span>/</span>
            <span className="text-gray-900">{destination.name}</span>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Image */}
              <div className="md:col-span-2 h-96 bg-gray-200 rounded-lg overflow-hidden">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="md:col-span-2 grid grid-cols-4 gap-4">
                  {images.slice(0, 4).map((image: string, index: number) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${destination.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {destination.name}
                      </h1>
                      <WishlistButton destinationId={destination.id} />
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        📍 {destination.city}, {destination.province}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {destination.rating.toFixed(1)} ({reviews.length} reviews)
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {destination.category}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Tentang Destinasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {destination.description}
                  </p>
                </CardContent>
              </Card>

              {/* Facilities */}
              {facilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Fasilitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {facilities.map((facility: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-blue-600">✓</span>
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Lokasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    📍 {destination.location}
                  </p>
                  {destination.latitude && destination.longitude && (
                    <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
                      Koordinat: {destination.latitude}, {destination.longitude}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Belum ada review untuk destinasi ini
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {review.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{review.user.name}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book Sekarang</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(destination.price)}
                    <span className="text-sm text-gray-600 font-normal"> / orang</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <Label htmlFor="visitDate">Tanggal Kunjungan</Label>
                      <Input
                        id="visitDate"
                        type="date"
                        min={getTodayDate()}
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="numberOfPeople">Jumlah Orang</Label>
                      <Input
                        id="numberOfPeople"
                        type="number"
                        min="1"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Catatan (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Tambahkan catatan untuk booking Anda..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          {formatPrice(destination.price)} x {numberOfPeople} orang
                        </span>
                        <span className="font-semibold">
                          {formatPrice(destination.price * numberOfPeople)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">
                          {formatPrice(destination.price * numberOfPeople)}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? 'Memproses...' : 'Book Sekarang'}
                    </Button>

                    {!user && (
                      <p className="text-sm text-center text-gray-600">
                        <Link href="/login" className="text-blue-600 hover:underline">
                          Login
                        </Link>{' '}
                        untuk melakukan booking
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
