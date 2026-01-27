import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  const categories = [
    {
      name: 'Pantai',
      slug: 'pantai',
      description: 'Destinasi wisata pantai dengan pemandangan laut yang indah',
      icon: '🏖️',
    },
    {
      name: 'Gunung',
      slug: 'gunung',
      description: 'Destinasi wisata gunung untuk pendakian dan hiking',
      icon: '⛰️',
    },
    {
      name: 'Budaya',
      slug: 'budaya',
      description: 'Destinasi wisata budaya dan sejarah',
      icon: '🏛️',
    },
    {
      name: 'Kuliner',
      slug: 'kuliner',
      description: 'Destinasi wisata kuliner dan makanan khas',
      icon: '🍜',
    },
    {
      name: 'Alam',
      slug: 'alam',
      description: 'Destinasi wisata alam seperti air terjun, danau, dan hutan',
      icon: '🌳',
    },
    {
      name: 'Religi',
      slug: 'religi',
      description: 'Destinasi wisata religi dan tempat ibadah',
      icon: '🕌',
    },
    {
      name: 'Petualangan',
      slug: 'petualangan',
      description: 'Destinasi wisata petualangan dan olahraga ekstrem',
      icon: '🎢',
    },
    {
      name: 'Belanja',
      slug: 'belanja',
      description: 'Destinasi wisata belanja dan pusat perbelanjaan',
      icon: '🛍️',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log('✅ Categories seeded successfully!');
}

seedCategories()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
