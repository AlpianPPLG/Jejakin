# 🏝️ Jejakin - Platform Pariwisata Indonesia

Platform pariwisata terbaik untuk menjelajahi destinasi wisata di Indonesia.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2d3748)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1)](https://www.mysql.com/)

## 🚀 Status Project

**Current Phase**: ✅ Foundation Complete - Building Features  
**Last Updated**: 27 Jan 2026

## ✨ Fitur Utama

- 🏖️ **Destinasi Wisata** - Jelajahi berbagai destinasi wisata di Indonesia
- 📅 **Booking Online** - Pesan tiket destinasi wisata dengan mudah
- ⭐ **Review & Rating** - Baca dan tulis review destinasi
- 🔐 **Authentication** - Login & Register dengan role-based access
- 📊 **Dashboard** - Dashboard untuk User, Partner, dan Admin
- 🎨 **Modern UI** - Interface yang modern dan responsif dengan shadcn/ui

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x + shadcn/ui
- **Animation**: Framer Motion
- **State Management**: React Context API

### Backend
- **API**: Next.js API Routes
- **Database**: MySQL 8.x
- **ORM**: Prisma 5.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js v18 atau lebih baru
- MySQL 8.x
- npm atau yarn

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd jejakin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi MySQL Anda:
```env
DATABASE_URL="mysql://root:@localhost:3306/jejakin"
JWT_SECRET="jejakin-secret-key-change-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Setup Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database (akan membuat database 'jejakin' otomatis)
npm run db:push

# Seed database dengan data awal
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000)

## 📝 Demo Login Credentials

Setelah seeding, gunakan kredensial berikut untuk login:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@jejakin.com | password123 |
| **Partner** | partner@jejakin.com | password123 |
| **User** | user@jejakin.com | password123 |

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with mock data
npm run db:studio    # Open Prisma Studio (Database GUI)
npm run db:setup     # Complete database setup (generate + push + seed)
```

## 🗂️ Project Structure

```
jejakin/
├── docs/                      # 📚 Documentation
├── prisma/                    # 🗄️ Database
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/                    # 🖼️ Static assets
├── src/
│   ├── components/           # 💻 React components
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # 🔄 React Context providers
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── ToastContext.tsx # Toast notifications
│   ├── lib/                 # 🛠️ Utilities
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # Auth utilities
│   │   └── utils.ts         # Helper functions
│   ├── pages/               # 📄 Next.js pages
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   └── destinations/ # Destinations endpoints
│   │   ├── index.tsx       # Landing page
│   │   ├── login.tsx       # Login page
│   │   └── register.tsx    # Register page
│   ├── styles/             # 🎨 Global styles
│   └── types/              # 📝 TypeScript types
├── .env                     # Environment variables
├── .env.example            # Environment template
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

## 🗄️ Database Schema

### Tables
1. **users** - User management (authentication & authorization)
2. **destinations** - Tempat wisata
3. **bookings** - Pemesanan tiket
4. **reviews** - Ulasan dan rating

### Relationships
```
User ──┬─< Destination (Partner mengelola destinasi)
       ├─< Booking (User melakukan booking)
       └─< Review (User memberikan review)

Destination ──┬─< Booking
              └─< Review
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (Protected)
```

### Destinations
```
GET    /api/destinations           - List all destinations
GET    /api/destinations/:id       - Get destination detail
POST   /api/destinations           - Create destination (Partner/Admin)
PUT    /api/destinations/:id       - Update destination (Partner/Admin)
DELETE /api/destinations/:id       - Delete destination (Partner/Admin)
```

## 🎨 UI Components (shadcn/ui)

Project ini menggunakan [shadcn/ui](https://ui.shadcn.com/) untuk komponen UI:

- ✅ Button
- ✅ Input
- ✅ Card
- ✅ Badge
- ✅ Label
- ✅ Textarea
- ✅ Select
- ✅ Dropdown Menu
- ✅ Dialog
- ✅ Alert
- ✅ Table
- ✅ Avatar
- ✅ Skeleton
- ✅ Separator
- ✅ Tabs

## 🔧 Development Tools

### Prisma Studio
Buka database GUI untuk melihat dan mengedit data:
```bash
npm run db:studio
```
Akan membuka di [http://localhost:5555](http://localhost:5555)

### ESLint
Check code quality:
```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Environment Variables untuk Production
```env
DATABASE_URL="mysql://user:password@host:3306/jejakin"
JWT_SECRET="production-secret-key-very-long-and-random"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
NODE_ENV="production"
```

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `docs/`:
- [PRD](docs/PRD.md) - Product Requirements Document
- [Architecture](docs/ARCHITECTURE.md) - System Architecture
- [API Specification](docs/API_SPECIFICATION.md) - API Documentation
- [Database ERD](docs/ERD.md) - Database Schema
- Dan banyak lagi...

## 🤝 Contributing

Lihat [CONTRIBUTING.md](pariwisata-plan/CONTRIBUTING.md) untuk panduan kontribusi.

## 📄 License

[MIT License](LICENSE)

## 👥 Team

- **Developer**: [Your Name]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ for Indonesian Tourism

**🎉 Happy Coding!**
