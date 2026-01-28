# Quick Start - Admin Jejakin

## 🚀 Cara Login sebagai Admin

### 1. Jalankan Aplikasi
```bash
npm run dev
```

### 2. Buka Browser
Akses: `http://localhost:3000/login`

### 3. Login dengan Kredensial Admin
- **Email**: `admin@jejakin.com`
- **Password**: `password123`
- **Role**: Pilih **"Admin"** (tombol ketiga)

### 4. Dashboard Admin
Setelah login, Anda akan diarahkan ke: `http://localhost:3000/dashboard/admin`

## 📊 Fitur Admin yang Tersedia

### 1. Dashboard Overview
- Statistik platform (users, destinasi, bookings, revenue)
- Recent bookings
- Top destinations
- Quick actions

### 2. Manage Destinations
URL: `/dashboard/admin/destinations`
- Lihat semua destinasi dari semua partner
- Filter by status & category
- Update status destinasi
- Delete destinasi

### 3. Manage Users
URL: `/dashboard/admin/users`
- Lihat semua users (User, Partner, Admin)
- Filter by role
- View user activity

### 4. Manage Categories
URL: `/dashboard/admin/categories`
- Create kategori baru
- Edit kategori
- Delete kategori
- Toggle active/inactive

### 5. Manage Bookings
URL: `/dashboard/admin/bookings`
- Lihat semua bookings
- Filter by status
- Update booking status

### 6. Manage Reviews
URL: `/dashboard/admin/reviews`
- Lihat semua reviews
- Moderate reviews
- Delete inappropriate reviews

## 🔑 Kredensial Login

### Admin
- Email: `admin@jejakin.com`
- Password: `password123`
- Role: Admin

### Partner
- Email: `partner@jejakin.com`
- Password: `password123`
- Role: Partner

### User
- Email: `user@jejakin.com`
- Password: `password123`
- Role: User

## 🎯 Quick Actions

Dari dashboard admin, Anda bisa langsung akses:
1. **Manage Bookings** - Kelola semua booking
2. **Manage Destinations** - Kelola semua destinasi
3. **Manage Users** - Kelola semua users
4. **Manage Categories** - Kelola kategori
5. **Manage Reviews** - Moderasi reviews

## 📝 Catatan Penting

1. **Role Admin** memiliki akses penuh ke semua fitur
2. **Role Partner** hanya bisa mengelola destinasi mereka sendiri
3. **Role User** hanya bisa booking dan review
4. Pastikan sudah menjalankan `npm run seed` untuk data awal
5. Database harus sudah setup dengan benar

## 🔧 Troubleshooting

### Tidak bisa login?
- Pastikan database sudah di-seed: `npm run seed`
- Clear browser cache
- Check console untuk error

### Halaman admin tidak muncul?
- Pastikan login dengan role "Admin"
- Check token di localStorage
- Refresh halaman

### Data tidak muncul?
- Pastikan seed sudah dijalankan
- Check koneksi database
- Lihat console untuk error

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lengkap, lihat:
- `docs/ADMIN_GUIDE.md` - Panduan lengkap admin
- `docs/API_SPECIFICATION.md` - API documentation
- `docs/ARCHITECTURE.md` - System architecture

## 🎉 Selamat Menggunakan!

Anda sekarang bisa mengelola platform Jejakin dengan fitur admin yang lengkap!
