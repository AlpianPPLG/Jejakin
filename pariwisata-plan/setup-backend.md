# Panduan Setup Backend [Nama Project]

Dokumen ini menjelaskan langkah-langkah detail untuk menyiapkan backend (Next.js API Routes + Prisma + Database).

## 1. Prasyarat Sistem
Pastikan komputer Anda sudah terinstall:
- **Node.js**: v18 atau lebih baru
- **Database**: SQLite (zero-config) atau MySQL/PostgreSQL
- **Git**: Untuk version control

## 2. Konfigurasi Environment Variable
Buat file `.env` di root folder project dan isi konfigurasi berikut:

```env
# Database Connection
# SQLite (Development - Recommended untuk mulai)
DATABASE_URL="file:./dev.db"

# MySQL (Production - Uncomment jika pakai MySQL)
# DATABASE_URL="mysql://root:@localhost:3306/database_name"

# PostgreSQL (Production Alternative)
# DATABASE_URL="postgresql://user:password@localhost:5432/database_name"

# JWT Secret (Untuk keamanan token login)
# Ganti dengan string acak yang panjang
JWT_SECRET="your-secret-key-change-this-in-production"

# App Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 3. Instalasi Dependency
Jalankan perintah ini di terminal untuk menginstall semua library yang dibutuhkan:

```bash
npm install
```

## 4. Setup Database (Prisma)
Langkah ini akan membuat tabel-tabel di database sesuai skema yang ada di `prisma/schema.prisma`.

```bash
# 1. Generate Prisma Client (Wajib dijalankan setiap ada perubahan schema)
npm run db:generate

# 2. Push Schema ke Database (Membuat tabel otomatis)
npm run db:push
```

## 5. Mengisi Data Awal (Seeding)
Agar aplikasi tidak kosong saat pertama dijalankan, kita perlu mengisi data contoh.

```bash
npm run db:seed
```
Jika berhasil, akan muncul pesan `✅ Seeding finished.`.

## 6. Jalankan Server
Sekarang backend sudah siap. Jalankan server development:

```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`.

## 7. Verifikasi Setup
Buka Prisma Studio untuk melihat data di database:

```bash
npm run db:studio
```
Akan membuka browser di `http://localhost:5555`.

---

## Daftar Endpoint API Tersedia

| Method | Endpoint | Deskripsi | Auth Required |
| :--- | :--- | :--- | :--- |
| **AUTH & USER** | | | |
| `POST` | `/api/auth/register` | Pendaftaran user baru | No |
| `POST` | `/api/auth/login` | Login user (dapat Token) | No |
| `GET` | `/api/auth/me` | Cek profil user login | **Yes** |
| `PUT` | `/api/user/profile` | Update profil user | **Yes** |
| **[FEATURE 1]** | | | |
| `GET` | `/api/[feature]` | List semua items | No |
| `GET` | `/api/[feature]/[id]` | Detail item | No |
| `POST` | `/api/[feature]` | Tambah item baru | **Yes** |
| `PUT` | `/api/[feature]/[id]` | Update item | **Yes** |
| `DELETE` | `/api/[feature]/[id]` | Hapus item | **Yes** |

## Testing API dengan cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Data (dengan token)
```bash
curl http://localhost:3000/api/[feature] \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Tips Troubleshooting

### Error: Connect ECONNREFUSED
- **Solusi**: Pastikan database server (MySQL/PostgreSQL) sudah running
- Untuk SQLite: Error ini tidak akan muncul karena file-based

### Error: P1001 (Can't reach database)
- **Solusi**: Cek kembali `DATABASE_URL` di file `.env`
- Pastikan format connection string benar

### Error: Prisma command not found
- **Solusi**: Jalankan `npm install` lagi

### Database locked (SQLite)
- **Solusi**: Tutup Prisma Studio dan restart dev server

### Migration failed
- **Solusi**: Reset database
```bash
rm prisma/dev.db  # Untuk SQLite
npm run db:push
npm run db:seed
```

## Development Workflow

### Mengubah Schema Database
1. Edit file `prisma/schema.prisma`
2. Jalankan `npm run db:push`
3. Regenerate client: `npm run db:generate`
4. Restart dev server

### Menambah Data Seed
1. Edit file `prisma/seed.ts`
2. Jalankan `npm run db:seed`

### Reset Database
```bash
# SQLite
rm prisma/dev.db
npm run db:setup

# MySQL/PostgreSQL
# Drop database manual, lalu:
npm run db:setup
```

## Production Deployment

### Persiapan Production:
1. Ganti `DATABASE_URL` ke production database (MySQL/PostgreSQL)
2. Ganti `JWT_SECRET` dengan string random yang kuat
3. Set `NODE_ENV=production`
4. Jalankan `npm run build`
5. Deploy ke Vercel/Netlify/VPS

### Environment Variables Production:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="production-secret-key-very-long-and-random"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
NODE_ENV="production"
```

---

## Checklist Setup
- [ ] Node.js terinstall
- [ ] Dependencies terinstall (`npm install`)
- [ ] File `.env` sudah dibuat
- [ ] Database schema di-push (`npm run db:push`)
- [ ] Data seed berhasil (`npm run db:seed`)
- [ ] Server berjalan (`npm run dev`)
- [ ] Prisma Studio bisa diakses (`npm run db:studio`)
- [ ] API endpoints bisa diakses

Selamat! Backend Anda sudah siap digunakan. 🚀
