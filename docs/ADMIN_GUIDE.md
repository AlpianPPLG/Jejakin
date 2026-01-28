# Panduan Admin - Jejakin Platform

## Overview
Fitur admin memberikan kontrol penuh untuk mengelola platform Jejakin, termasuk mengelola users, destinasi, kategori, bookings, dan melihat statistik platform secara keseluruhan.

## Akses Admin

### Login sebagai Admin
1. Buka halaman login: `http://localhost:3000/login`
2. Pilih opsi **"Admin"** pada pilihan role
3. Masukkan kredensial admin:
   - Email: `admin@jejakin.com`
   - Password: `password123`
4. Klik **"Masuk"**
5. Anda akan diarahkan ke dashboard admin: `/dashboard/admin`

### Role Admin
- **Admin**: Akses penuh ke semua fitur platform
- **Partner**: Akses terbatas hanya untuk destinasi mereka sendiri
- **User**: Akses normal sebagai wisatawan

## Fitur Admin Dashboard

### 1. Dashboard Overview (`/dashboard/admin`)
Dashboard utama menampilkan:

#### Statistik Platform
- **Total Users**: Jumlah semua pengguna terdaftar
- **Total Destinasi**: Jumlah destinasi aktif
- **Total Booking**: Jumlah semua booking
- **Total Revenue**: Total pendapatan dari booking yang sudah dibayar

#### Booking Statistics
- **Pending**: Booking yang menunggu konfirmasi
- **Confirmed**: Booking yang sudah dikonfirmasi
- **Completed**: Booking yang sudah selesai
- **Cancelled**: Booking yang dibatalkan

#### Recent Bookings
- 10 booking terbaru dengan informasi:
  - Nama destinasi
  - Nama user
  - Total harga
  - Status booking
  - Tanggal booking

#### Top Destinations
- 5 destinasi dengan booking terbanyak
- Menampilkan rating dan jumlah review

#### Quick Actions
Akses cepat ke:
- Manage Bookings
- Manage Destinations
- Manage Users
- Manage Categories
- Manage Reviews

### 2. Manage Destinations (`/dashboard/admin/destinations`)

#### Fitur:
- **View All Destinations**: Melihat semua destinasi dari semua partner
- **Filter by Status**: Active, Pending, Inactive
- **Filter by Category**: Pantai, Gunung, Budaya, dll
- **Search**: Cari berdasarkan nama, lokasi, atau nama partner
- **Update Status**: Ubah status destinasi (Active/Pending/Inactive)
- **Delete Destination**: Hapus destinasi (dengan konfirmasi)

#### Informasi yang Ditampilkan:
- Gambar destinasi
- Nama dan lokasi
- Nama partner (pemilik)
- Kategori
- Harga
- Rating
- Jumlah booking dan review
- Status
- Tanggal dibuat

#### Actions:
- **View**: Lihat detail destinasi
- **Change Status**: Ubah status destinasi
- **Delete**: Hapus destinasi (tidak dapat dikembalikan)

### 3. Manage Users (`/dashboard/admin/users`)

#### Fitur:
- **View All Users**: Melihat semua pengguna platform
- **Filter by Role**: User, Partner, Admin
- **Search**: Cari berdasarkan nama atau email
- **View Statistics**: Total users, partners, admins

#### Informasi yang Ditampilkan:
- Avatar/Initial
- Nama dan email
- Role (User/Partner/Admin)
- Status verifikasi email
- Activity:
  - Jumlah booking
  - Jumlah destinasi (untuk partner)
  - Jumlah review
- Tanggal bergabung
- Tanggal update terakhir

### 4. Manage Categories (`/dashboard/admin/categories`)

#### Fitur:
- **Create Category**: Tambah kategori baru
- **Edit Category**: Update informasi kategori
- **Delete Category**: Hapus kategori (jika tidak digunakan)
- **Toggle Active/Inactive**: Aktifkan/nonaktifkan kategori

#### Form Category:
- **Name**: Nama kategori (required)
- **Icon**: Emoji icon untuk kategori
- **Description**: Deskripsi kategori

#### Informasi yang Ditampilkan:
- Icon emoji
- Nama kategori
- Slug (URL-friendly name)
- Deskripsi
- Status (Active/Inactive)
- Tanggal dibuat

#### Actions:
- **Activate/Deactivate**: Toggle status kategori
- **Edit**: Update informasi kategori
- **Delete**: Hapus kategori (hanya jika tidak ada destinasi yang menggunakan)

### 5. Manage Bookings (`/dashboard/admin/bookings`)

#### Fitur:
- **View All Bookings**: Melihat semua booking dari semua user
- **Filter by Status**: Pending, Confirmed, Completed, Cancelled
- **Search**: Cari berdasarkan booking code, user, atau destinasi
- **Update Status**: Ubah status booking
- **View Details**: Lihat detail lengkap booking

#### Informasi yang Ditampilkan:
- Booking code
- User information
- Destination information
- Visit date
- Number of people
- Total price
- Payment status
- Booking status
- Created date

### 6. Manage Reviews (`/dashboard/admin/reviews`)

#### Fitur:
- **View All Reviews**: Melihat semua review dari semua destinasi
- **Filter by Rating**: 1-5 stars
- **Moderate Reviews**: Approve/reject reviews
- **Delete Reviews**: Hapus review yang tidak sesuai

## API Endpoints untuk Admin

### Statistics
```
GET /api/admin/stats
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 100,
      "totalDestinations": 50,
      "totalBookings": 200,
      "totalRevenue": 50000000
    },
    "bookingStats": {
      "pending": 10,
      "confirmed": 50,
      "completed": 130,
      "cancelled": 10
    },
    "recentBookings": [...],
    "topDestinations": [...],
    "monthlyRevenue": {...}
  }
}
```

### Users Management
```
GET /api/admin/users?page=1&limit=20&role=user
Authorization: Bearer {token}
```

### Destinations Management
```
GET /api/destinations?status=active&category=pantai
PUT /api/destinations/{id}
DELETE /api/destinations/{id}
Authorization: Bearer {token}
```

### Categories Management
```
GET /api/categories
POST /api/categories
PUT /api/categories
DELETE /api/categories?id={id}
Authorization: Bearer {token}
```

## Security & Permissions

### Admin-Only Features:
- Manage all users
- Manage all destinations (from all partners)
- Manage categories
- View platform-wide statistics
- Delete any content

### Partner Features:
- Manage own destinations only
- View own statistics
- Manage bookings for own destinations

### Authorization:
- All admin endpoints require valid JWT token
- Token must contain `role: 'admin'` for admin-only features
- Unauthorized access returns 403 Forbidden

## Best Practices

### 1. Regular Monitoring
- Check dashboard daily untuk melihat aktivitas platform
- Monitor pending bookings yang perlu konfirmasi
- Review new destinations dari partner

### 2. Content Moderation
- Review destinasi baru sebelum approve
- Moderate reviews yang tidak sesuai
- Hapus konten yang melanggar aturan

### 3. User Management
- Monitor aktivitas user yang mencurigakan
- Verify partner accounts
- Handle user complaints

### 4. Category Management
- Jaga kategori tetap relevan dan up-to-date
- Gunakan icon emoji yang jelas
- Tulis deskripsi yang informatif

### 5. Data Backup
- Backup database secara regular
- Export data penting secara berkala
- Monitor storage usage

## Troubleshooting

### Tidak bisa login sebagai admin
- Pastikan menggunakan email: `admin@jejakin.com`
- Pastikan password: `password123`
- Pastikan memilih role "Admin" saat login
- Clear browser cache dan cookies

### Tidak bisa akses halaman admin
- Pastikan sudah login dengan role admin
- Check token di localStorage
- Refresh halaman atau logout/login kembali

### Data tidak muncul
- Check koneksi database
- Pastikan seed data sudah dijalankan
- Check console untuk error messages

### Error saat update/delete
- Pastikan memiliki permission yang benar
- Check apakah data masih digunakan (untuk delete)
- Verify token masih valid

## Development

### Menambah Admin User Baru
```typescript
// Jalankan di Prisma Studio atau seed file
const hashedPassword = await bcrypt.hash('password', 10);
await prisma.user.create({
  data: {
    email: 'newadmin@jejakin.com',
    name: 'New Admin',
    password: hashedPassword,
    role: 'admin',
    emailVerified: true,
  },
});
```

### Testing Admin Features
1. Run seed: `npm run seed`
2. Start dev server: `npm run dev`
3. Login sebagai admin
4. Test semua fitur admin
5. Check console untuk errors

## Support

Untuk bantuan lebih lanjut:
- Check dokumentasi di folder `/docs`
- Review API specification di `docs/API_SPECIFICATION.md`
- Check architecture di `docs/ARCHITECTURE.md`
