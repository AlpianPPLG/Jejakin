# Project Structure Documentation (PSD)

Struktur folder proyek ini mengikuti konvensi **Next.js Pages Router** yang dikombinasikan dengan arsitektur **Feature-First**.

```
d:\Development\Plan\alpian
├── docs/                   # Dokumentasi Proyek (PRD, Architecture, ERD, dll)
├── public/                 # Aset statis (Gambar, Video, Logo)
│   ├── logo/
│   ├── images/
│   └── videos/
├── src/
│   ├── components/         # Komponen UI Reusable
│   │   ├── layouts/        # Layout wrapper (Admin, User, Guest)
│   │   ├── ui/             # Atomic components (Button, Modal, Toast)
│   │   └── features/       # Feature components
│   ├── contexts/           # Global State Management
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── LanguageContext.tsx
│   ├── data/               # Mock Data (Database Simulasi)
│   │   └── mockData.ts
│   ├── pages/              # Routing & Views
│   │   ├── api/            # API Routes (Next.js serverless functions)
│   │   ├── dashboard/      # Halaman Dashboard (Protected Routes)
│   │   ├── _app.tsx        # Global Wrapper (Context Providers)
│   │   └── index.tsx       # Homepage
│   ├── styles/             # Global CSS & Tailwind Directives
│   ├── types/              # TypeScript Definitions
│   └── lib/                # Utility functions & helpers
├── prisma/                 # Database Schema & Migrations
│   ├── schema.prisma
│   └── seed.ts
├── next.config.ts          # Konfigurasi Next.js
├── tailwind.config.ts      # Konfigurasi Tema & Warna
└── package.json            # Dependensi Proyek
```

## Key Files & Responsibilities

1.  **`src/data/mockData.ts`**:
    *   Berperan sebagai "Dummy Database". Semua data disimpan di sini untuk fase development awal.

2.  **`src/contexts/DataContext.tsx`**:
    *   Logic inti aplikasi. Menghubungkan UI dengan data management.
    *   Menggunakan `localStorage` untuk persistensi data.

3.  **`src/pages/dashboard/`**:
    *   Area privat yang tersegmentasi berdasarkan `user.role` dari `AuthContext`.

4.  **`prisma/schema.prisma`**:
    *   Definisi schema database untuk production.
