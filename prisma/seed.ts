import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.destinationGallery.deleteMany();
  await prisma.destinationFacility.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Pantai',
        slug: 'pantai',
        description: 'Destinasi wisata pantai dengan pemandangan laut yang indah',
        icon: '🏖️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Gunung',
        slug: 'gunung',
        description: 'Destinasi wisata gunung untuk pendakian dan hiking',
        icon: '⛰️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Budaya',
        slug: 'budaya',
        description: 'Destinasi wisata budaya dan sejarah',
        icon: '🏛️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kuliner',
        slug: 'kuliner',
        description: 'Destinasi wisata kuliner dan makanan khas',
        icon: '🍜',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@jejakin.com',
      name: 'Admin Jejakin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: true,
    },
  });

  const partner = await prisma.user.create({
    data: {
      email: 'partner@jejakin.com',
      name: 'Partner Wisata',
      password: hashedPassword,
      role: 'partner',
      emailVerified: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user@jejakin.com',
      name: 'User Demo',
      password: hashedPassword,
      role: 'user',
      emailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@jejakin.com',
      name: 'User Demo 2',
      password: hashedPassword,
      role: 'user',
      emailVerified: true,
    },
  });

  console.log('✅ Users created');

  // Create Destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Pantai Kuta',
        slug: 'pantai-kuta',
        description: 'Pantai Kuta adalah salah satu pantai paling terkenal di Bali dengan pasir putih yang indah dan ombak yang cocok untuk berselancar. Tempat yang sempurna untuk menikmati sunset sambil bersantai.',
        location: 'Kuta, Badung',
        province: 'Bali',
        city: 'Badung',
        category: 'pantai',
        price: 0,
        rating: 4.5,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
        ]),
        facilities: JSON.stringify(['Parkir', 'Toilet', 'Warung Makan', 'Penyewaan Surfboard']),
        latitude: -8.7184,
        longitude: 115.1686,
        status: 'active',
        userId: partner.id,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Gunung Bromo',
        slug: 'gunung-bromo',
        description: 'Gunung Bromo adalah gunung berapi aktif yang terkenal dengan pemandangan sunrise yang spektakuler. Terletak di Taman Nasional Bromo Tengger Semeru, tempat ini menawarkan pengalaman mendaki yang tak terlupakan.',
        location: 'Probolinggo',
        province: 'Jawa Timur',
        city: 'Probolinggo',
        category: 'gunung',
        price: 50000,
        rating: 4.8,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
        ]),
        facilities: JSON.stringify(['Parkir', 'Toilet', 'Penginapan', 'Jeep Tour', 'Guide']),
        latitude: -7.9425,
        longitude: 112.9531,
        status: 'active',
        userId: partner.id,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Candi Borobudur',
        slug: 'candi-borobudur',
        description: 'Candi Borobudur adalah candi Buddha terbesar di dunia dan merupakan salah satu situs warisan dunia UNESCO. Arsitektur yang megah dan relief yang indah membuat tempat ini wajib dikunjungi.',
        location: 'Magelang',
        province: 'Jawa Tengah',
        city: 'Magelang',
        category: 'budaya',
        price: 50000,
        rating: 4.9,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47',
        ]),
        facilities: JSON.stringify(['Parkir', 'Toilet', 'Museum', 'Guide', 'Souvenir Shop']),
        latitude: -7.6079,
        longitude: 110.2038,
        status: 'active',
        userId: partner.id,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Raja Ampat',
        slug: 'raja-ampat',
        description: 'Raja Ampat adalah surga bagi para penyelam dengan keanekaragaman hayati laut terkaya di dunia. Pulau-pulau karst yang indah dan air laut yang jernih membuat tempat ini sangat istimewa.',
        location: 'Raja Ampat',
        province: 'Papua Barat',
        city: 'Raja Ampat',
        category: 'pantai',
        price: 200000,
        rating: 5.0,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        ]),
        facilities: JSON.stringify(['Diving Center', 'Penginapan', 'Restaurant', 'Boat Rental']),
        latitude: -0.2353,
        longitude: 130.5169,
        status: 'active',
        userId: partner.id,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Danau Toba',
        slug: 'danau-toba',
        description: 'Danau Toba adalah danau vulkanik terbesar di Indonesia dan Asia Tenggara. Pulau Samosir di tengah danau menawarkan pemandangan yang menakjubkan dan budaya Batak yang kaya.',
        location: 'Samosir',
        province: 'Sumatera Utara',
        city: 'Samosir',
        category: 'danau',
        price: 0,
        rating: 4.7,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
          'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
        ]),
        facilities: JSON.stringify(['Parkir', 'Penginapan', 'Restaurant', 'Boat Tour']),
        latitude: 2.6845,
        longitude: 98.8756,
        status: 'active',
        userId: partner.id,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Taman Mini Indonesia Indah',
        slug: 'taman-mini-indonesia-indah',
        description: 'Taman Mini Indonesia Indah (TMII) adalah taman wisata yang menampilkan miniatur dari berbagai rumah adat dan budaya dari seluruh Indonesia. Tempat yang sempurna untuk mengenal keragaman budaya Indonesia.',
        location: 'Jakarta Timur',
        province: 'DKI Jakarta',
        city: 'Jakarta',
        category: 'budaya',
        price: 25000,
        rating: 4.3,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47',
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
        ]),
        facilities: JSON.stringify(['Parkir', 'Toilet', 'Museum', 'Food Court', 'Cable Car']),
        latitude: -6.3025,
        longitude: 106.8952,
        status: 'active',
        userId: partner.id,
      },
    }),
  ]);

  console.log('✅ Destinations created');

  // Create Bookings
  await prisma.booking.create({
    data: {
      bookingCode: 'JJK-2024-001',
      userId: user1.id,
      destinationId: destinations[0].id,
      visitDate: new Date('2024-03-15'),
      numberOfPeople: 2,
      totalPrice: 0,
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Ingin booking untuk honeymoon',
    },
  });

  await prisma.booking.create({
    data: {
      bookingCode: 'JJK-2024-002',
      userId: user2.id,
      destinationId: destinations[1].id,
      visitDate: new Date('2024-04-20'),
      numberOfPeople: 4,
      totalPrice: 200000,
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: 'Trip keluarga',
    },
  });

  console.log('✅ Bookings created');

  // Create Reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      destinationId: destinations[0].id,
      rating: 5,
      comment: 'Pantai yang sangat indah! Sunset-nya luar biasa. Sangat recommended untuk liburan keluarga.',
      images: JSON.stringify([]),
    },
  });

  await prisma.review.create({
    data: {
      userId: user2.id,
      destinationId: destinations[1].id,
      rating: 5,
      comment: 'Pengalaman mendaki yang tak terlupakan. Sunrise di Bromo benar-benar spektakuler!',
      images: JSON.stringify([]),
    },
  });

  await prisma.review.create({
    data: {
      userId: user1.id,
      destinationId: destinations[2].id,
      rating: 5,
      comment: 'Candi yang megah dan penuh sejarah. Wajib dikunjungi saat ke Jogja!',
      images: JSON.stringify([]),
    },
  });

  console.log('✅ Reviews created');

  console.log('🎉 Seeding finished successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@jejakin.com / password123');
  console.log('Partner: partner@jejakin.com / password123');
  console.log('User: user@jejakin.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
