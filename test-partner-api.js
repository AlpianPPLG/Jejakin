const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPartnerAPI() {
  console.log('🧪 Testing Partner API Logic...\n');

  const partner = await prisma.user.findUnique({
    where: { email: 'partner@jejakin.com' },
  });

  console.log('Partner ID:', partner.id);
  console.log('');

  // Simulate API GET /api/bookings for partner
  const where = {
    destination: {
      userId: partner.id,
    },
  };

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          location: true,
          images: true,
          category: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  console.log('✅ Bookings found for partner:', bookings.length);
  console.log('');
  console.log('Booking Details:');
  bookings.forEach((booking, index) => {
    console.log(`\n${index + 1}. Booking Code: ${booking.bookingCode}`);
    console.log(`   Customer: ${booking.user.name} (${booking.user.email})`);
    console.log(`   Destination: ${booking.destination.name}`);
    console.log(`   Visit Date: ${booking.visitDate}`);
    console.log(`   People: ${booking.numberOfPeople}`);
    console.log(`   Total: Rp ${booking.totalPrice.toLocaleString('id-ID')}`);
    console.log(`   Status: ${booking.status}`);
    console.log(`   Payment: ${booking.paymentStatus}`);
  });

  await prisma.$disconnect();
}

testPartnerAPI().catch(console.error);
