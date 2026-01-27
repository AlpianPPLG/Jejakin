import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GuestLayout from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const features = [
    {
      icon: '🏖️',
      title: 'Destinasi Terlengkap',
      description: 'Jelajahi ribuan destinasi wisata terbaik di seluruh Indonesia',
    },
    {
      icon: '📅',
      title: 'Booking Mudah',
      description: 'Pesan tiket destinasi wisata dengan cepat dan aman',
    },
    {
      icon: '⭐',
      title: 'Review Terpercaya',
      description: 'Baca review dari wisatawan lain untuk pengalaman terbaik',
    },
    {
      icon: '💰',
      title: 'Harga Terjangkau',
      description: 'Dapatkan harga terbaik untuk liburan impian Anda',
    },
  ];

  const popularDestinations = [
    {
      name: 'Pantai Kuta, Bali',
      category: 'Pantai',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      rating: 4.5,
    },
    {
      name: 'Gunung Bromo',
      category: 'Gunung',
      image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800',
      rating: 4.8,
    },
    {
      name: 'Candi Borobudur',
      category: 'Budaya',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
      rating: 4.9,
    },
  ];

  return (
    <>
      <Head>
        <title>Jejakin - Platform Pariwisata Indonesia</title>
        <meta name="description" content="Platform pariwisata terbaik untuk menjelajahi destinasi wisata di Indonesia" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GuestLayout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  🎉 Platform Pariwisata #1 di Indonesia
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Jelajahi Keindahan
                  <br />
                  <span className="text-yellow-300">Indonesia Bersama Jejakin</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                  Temukan destinasi wisata terbaik, booking mudah, dan nikmati liburan impian Anda
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/destinations">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8">
                      Jelajahi Destinasi
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold text-lg px-8 border-2 border-yellow-500">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mengapa Memilih Jejakin?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Platform terpercaya untuk merencanakan liburan sempurna Anda
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-5xl mb-4">{feature.icon}</div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Destinasi Populer
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Jelajahi destinasi wisata favorit wisatawan
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularDestinations.map((destination, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                        {destination.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{destination.name}</CardTitle>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>⭐</span>
                        <span className="text-gray-900 font-semibold">{destination.rating}</span>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/destinations">
                <Button size="lg" className="text-lg px-8">
                  Lihat Semua Destinasi
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Siap Memulai Petualangan Anda?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Daftar sekarang dan dapatkan akses ke ribuan destinasi wisata terbaik di Indonesia
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8">
                    Daftar Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 border-2 border-white">
                    Sudah Punya Akun?
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '1000+', label: 'Destinasi Wisata' },
                { number: '50K+', label: 'Wisatawan Puas' },
                { number: '100+', label: 'Kota di Indonesia' },
                { number: '4.8', label: 'Rating Pengguna' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </GuestLayout>
    </>
  );
}
