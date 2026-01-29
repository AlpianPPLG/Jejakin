const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  console.log('🔍 Debugging Booking System...\n');

  // 1. Check Partner User
  const partner = await prisma.user.findUnique({
    where: { email: 'partner@jejakin.com' },
    select: { id: true, name: true, email: true, role: true },
  });
  console.log('1. Partner User:');
  console.log(partner);
  console.log('');

  // 2. Check Destinations owned by Partner
  const destinations = await prisma.destination.findMany({
    where: { userId: partner.id },
    select: { id: true, name: true, userId: true, status: true },
  });
  console.log('2. Destinations owned by Partner:');
  console.log(destinations);
  console.log('');

  // 3. Check Bookings for Partner's Destinations
  const bookings = await prisma.booking.findMany({
    where: {
      destination: {
        userId: partner.id,
      },
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
      destination: {
        select: { name: true, userId: true },
      },
    },
  });
  console.log('3. Bookings for Partner Destinations:');
  console.log(JSON.stringify(bookings, null, 2));
  console.log('');

  // 4. Check Notifications for Partner
  const notifications = await prisma.notification.findMany({
    where: { userId: partner.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log('4. Partner Notifications (last 5):');
  console.log(JSON.stringify(notifications, null, 2));
  console.log('');

  // 5. Check All Bookings
  const allBookings = await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      destination: { select: { name: true, userId: true } },
    },
  });
  console.log('5. All Bookings in Database:');
  console.log(JSON.stringify(allBookings, null, 2));

  await prisma.$disconnect();
}

debug().catch(console.error);
