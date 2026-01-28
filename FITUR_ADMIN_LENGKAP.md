# 🎯 Fitur Admin Lengkap - Jejakin Platform

## ✅ Cara Register sebagai Admin

### Langkah-langkah:
1. Buka halaman register: `http://localhost:3000/register`
2. Isi form:
   - **Nama Lengkap**: Masukkan nama Anda
   - **Email**: Masukkan email valid
   - **Password**: Minimal 8 karakter
   - **Konfirmasi Password**: Sama dengan password
3. **Pilih Role "Admin"** (tombol ketiga dengan label "Kelola platform")
4. Klik tombol **"Daftar"**
5. Anda akan otomatis login dan diarahkan ke: `/dashboard/admin`

## 🎨 Dashboard Admin - Fitur Lengkap

### 1. 📊 Dashboard Overview (`/dashboard/admin`)

#### Statistik Platform (Cards)
- **Total Users**: Jumlah semua pengguna terdaftar
- **Total Destinasi**: Jumlah destinasi aktif di platform
- **Total Booking**: Jumlah semua booking
- **Total Revenue**: Total pendapatan dari booking yang sudah dibayar

#### Booking Statistics (Breakdown)
- **Pending**: Booking menunggu konfirmasi (warna kuning)
- **Confirmed**: Booking sudah dikonfirmasi (warna biru)
- **Completed**: Booking sudah selesai (warna hijau)
- **Cancelled**: Booking dibatalkan (warna merah)

#### Recent Bookings
- Menampilkan 10 booking terbaru
- Informasi: Nama destinasi, user, harga, status
- Link ke detail booking

#### Top Destinations
- 5 destinasi dengan booking terbanyak
- Menampilkan rating dan jumlah review
- Link ke halaman destinasi

#### Quick Actions (6 Tombol)
1. **📅 Manage Bookings** - Kelola semua booking
2. **🏝️ Destinations** - Kelola semua destinasi
3. **👥 Users** - Kelola semua users
4. **📁 Categories** - Kelola kategori
5. **⭐ Reviews** - Moderasi reviews

---

### 2. 🏝️ Manage Destinations (`/dashboard/admin/destinations`)

#### Fitur Utama:
✅ **Lihat Semua Destinasi** dari semua partner
✅ **Filter by Status**: Active, Pending, Inactive
✅ **Filter by Category**: Pantai, Gunung, Budaya, dll
✅ **Search**: Cari berdasarkan nama, lokasi, atau nama partner
✅ **Update Status**: Ubah status destinasi secara langsung
✅ **Delete Destination**: Hapus destinasi dengan konfirmasi

#### Statistik Cards:
- Total Destinations
- Active (hijau)
- Pending (kuning)
- Inactive (abu-abu)

#### Tabel Informasi:
| Kolom | Deskripsi |
|-------|-----------|
| Destination | Gambar + Nama + Lokasi |
| Partner | Nama + Email pemilik |
| Category | Badge kategori |
| Price | Harga dalam Rupiah |
| Rating | Rating bintang |
| Activity | Jumlah booking + review |
| Status | Dropdown untuk ubah status |
| Created | Tanggal dibuat |
| Actions | View + Delete |

#### Actions:
- **View**: Lihat detail lengkap destinasi
- **Change Status**: Dropdown untuk ubah status (Active/Pending/Inactive)
- **Delete**: Hapus destinasi (dengan dialog konfirmasi)

---

### 3. 👥 Manage Users (`/dashboard/admin/users`)

#### Fitur Utama:
✅ **Lihat Semua Users** (User, Partner, Admin)
✅ **Filter by Role**: User, Partner, Admin
✅ **Search**: Cari berdasarkan nama atau email
✅ **View Statistics**: Total users per role

#### Statistik Cards:
- Total Users (semua)
- Regular Users (biru)
- Partners (hijau)
- Admins (merah)

#### Tabel Informasi:
| Kolom | Deskripsi |
|-------|-----------|
| User | Avatar/Initial + Nama + Email |
| Role | Badge (User/Partner/Admin) |
| Status | Verified/Unverified |
| Activity | Bookings + Destinations + Reviews |
| Joined | Tanggal bergabung |
| Last Updated | Tanggal update terakhir |

#### Informasi Activity:
- **Bookings**: Jumlah booking yang dibuat
- **Destinations**: Jumlah destinasi (untuk partner)
- **Reviews**: Jumlah review yang ditulis

---

### 4. 📁 Manage Categories (`/dashboard/admin/categories`)

#### Fitur Utama:
✅ **Create Category**: Tambah kategori baru
✅ **Edit Category**: Update informasi kategori
✅ **Delete Category**: Hapus kategori (jika tidak digunakan)
✅ **Toggle Active/Inactive**: Aktifkan/nonaktifkan kategori

#### Statistik Cards:
- Total Categories
- Active (hijau)
- Inactive (abu-abu)

#### Form Category:
- **Name** (required): Nama kategori (e.g., Pantai, Gunung)
- **Icon**: Emoji icon (e.g., 🏖️, ⛰️)
- **Description**: Deskripsi kategori

#### Tabel Informasi:
| Kolom | Deskripsi |
|-------|-----------|
| Icon | Emoji icon |
| Name | Nama kategori |
| Slug | URL-friendly name |
| Description | Deskripsi kategori |
| Status | Active/Inactive badge |
| Created | Tanggal dibuat |
| Actions | Activate/Deactivate + Edit + Delete |

#### Actions:
- **Activate/Deactivate**: Toggle status kategori
- **Edit**: Update nama, icon, deskripsi
- **Delete**: Hapus kategori (hanya jika tidak ada destinasi yang menggunakan)

---

### 5. 📅 Manage Bookings (`/dashboard/admin/bookings`)

#### Fitur Utama:
✅ **Lihat Semua Bookings** dari semua user
✅ **Filter by Status**: Pending, Confirmed, Completed, Cancelled
✅ **Search**: Cari berdasarkan booking code, user, atau destinasi
✅ **Update Status**: Ubah status booking
✅ **View Details**: Lihat detail lengkap booking

#### Tabel Informasi:
| Kolom | Deskripsi |
|-------|-----------|
| Booking Code | Kode unik booking |
| User | Nama + Email user |
| Destination | Nama destinasi |
| Visit Date | Tanggal kunjungan |
| People | Jumlah orang |
| Total Price | Harga total |
| Payment Status | Paid/Unpaid |
| Status | Pending/Confirmed/Completed/Cancelled |
| Created | Tanggal booking |
| Actions | View + Update Status |

---

### 6. ⭐ Manage Reviews (`/dashboard/admin/reviews`)

#### Fitur Utama:
✅ **Lihat Semua Reviews** dari semua destinasi
✅ **Filter by Rating**: 1-5 stars
✅ **Filter by Destination**: Pilih destinasi
✅ **Moderate Reviews**: Approve/reject reviews
✅ **Delete Reviews**: Hapus review yang tidak sesuai

#### Tabel Informasi:
| Kolom | Deskripsi |
|-------|-----------|
| User | Nama + Email reviewer |
| Destination | Nama destinasi |
| Rating | Bintang 1-5 |
| Comment | Isi review |
| Images | Gambar review (jika ada) |
| Verified | Status verifikasi |
| Created | Tanggal review |
| Actions | Verify + Delete |

---

## 🔐 Permissions & Security

### Admin Role Permissions:
✅ Akses penuh ke semua fitur platform
✅ Lihat dan kelola semua destinasi (dari semua partner)
✅ Lihat dan kelola semua users
✅ Kelola kategori (create, edit, delete)
✅ Lihat statistik platform secara keseluruhan
✅ Moderasi reviews
✅ Kelola semua bookings
✅ Delete any content

### Partner Role Permissions:
- Kelola destinasi sendiri saja
- Lihat statistik destinasi sendiri
- Kelola booking untuk destinasi sendiri
- Tidak bisa akses user management
- Tidak bisa akses category management

### User Role Permissions:
- Booking destinasi
- Tulis review
- Kelola wishlist
- Lihat dashboard pribadi

---

## 🚀 Cara Menggunakan

### 1. Login sebagai Admin
```
Email: admin@jejakin.com
Password: password123
Role: Admin
```

### 2. Atau Register Admin Baru
1. Buka `/register`
2. Isi form lengkap
3. **Pilih role "Admin"** (tombol ketiga)
4. Klik "Daftar"
5. Otomatis masuk ke dashboard admin

### 3. Navigasi Dashboard
- Sidebar kiri: Menu navigasi
- Header: Notifikasi + Profile
- Main content: Konten halaman

### 4. Quick Actions
Dari dashboard utama, klik tombol quick action untuk langsung ke halaman yang diinginkan.

---

## 📊 API Endpoints Admin

### Statistics
```http
GET /api/admin/stats
Authorization: Bearer {token}
```

### Users Management
```http
GET /api/admin/users?page=1&limit=20&role=user
Authorization: Bearer {token}
```

### Destinations Management
```http
GET /api/destinations?status=active&category=pantai
PUT /api/destinations/{id}
DELETE /api/destinations/{id}
Authorization: Bearer {token}
```

### Categories Management
```http
GET /api/categories
POST /api/categories
PUT /api/categories
DELETE /api/categories?id={id}
Authorization: Bearer {token}
```

### Bookings Management
```http
GET /api/admin/bookings?status=pending
PUT /api/bookings/{id}
Authorization: Bearer {token}
```

### Reviews Management
```http
GET /api/admin/reviews?rating=5
DELETE /api/admin/reviews/{id}
Authorization: Bearer {token}
```

---

## 🎯 Best Practices

### 1. Regular Monitoring
- Check dashboard setiap hari
- Monitor pending bookings
- Review new destinations dari partner
- Check user activity

### 2. Content Moderation
- Review destinasi baru sebelum approve
- Moderate reviews yang tidak sesuai
- Hapus konten yang melanggar aturan
- Verify partner accounts

### 3. User Management
- Monitor aktivitas user yang mencurigakan
- Handle user complaints
- Manage user roles dengan hati-hati

### 4. Category Management
- Jaga kategori tetap relevan
- Gunakan icon emoji yang jelas
- Tulis deskripsi yang informatif
- Jangan hapus kategori yang masih digunakan

### 5. Data Management
- Backup database secara regular
- Export data penting
- Monitor storage usage
- Clean up old data

---

## 🔧 Troubleshooting

### Role masih "user" setelah register sebagai admin?
**Solusi:**
1. Pastikan API register sudah diperbaiki
2. Clear browser cache
3. Logout dan login kembali
4. Check database: role harus "admin"

### Tidak bisa akses halaman admin?
**Solusi:**
1. Pastikan login dengan role "admin"
2. Check token di localStorage
3. Refresh halaman
4. Logout dan login kembali

### Data tidak muncul di dashboard?
**Solusi:**
1. Check koneksi database
2. Pastikan seed data sudah dijalankan: `npm run db:seed`
3. Check console untuk error
4. Verify API endpoints

### Error saat update/delete?
**Solusi:**
1. Pastikan memiliki permission yang benar
2. Check apakah data masih digunakan (untuk delete)
3. Verify token masih valid
4. Check console untuk error details

---

## 📝 Testing Checklist

### ✅ Register & Login
- [ ] Register dengan role admin
- [ ] Login dengan admin credentials
- [ ] Redirect ke `/dashboard/admin`
- [ ] Token tersimpan di localStorage

### ✅ Dashboard Overview
- [ ] Statistik muncul dengan benar
- [ ] Recent bookings ditampilkan
- [ ] Top destinations ditampilkan
- [ ] Quick actions berfungsi

### ✅ Manage Destinations
- [ ] Lihat semua destinasi
- [ ] Filter by status berfungsi
- [ ] Filter by category berfungsi
- [ ] Search berfungsi
- [ ] Update status berfungsi
- [ ] Delete berfungsi

### ✅ Manage Users
- [ ] Lihat semua users
- [ ] Filter by role berfungsi
- [ ] Search berfungsi
- [ ] Statistics ditampilkan

### ✅ Manage Categories
- [ ] Create category berfungsi
- [ ] Edit category berfungsi
- [ ] Delete category berfungsi
- [ ] Toggle active/inactive berfungsi

### ✅ Manage Bookings
- [ ] Lihat semua bookings
- [ ] Filter by status berfungsi
- [ ] Update status berfungsi
- [ ] View details berfungsi

### ✅ Manage Reviews
- [ ] Lihat semua reviews
- [ ] Filter berfungsi
- [ ] Delete berfungsi

---

## 🎉 Selamat!

Anda sekarang memiliki dashboard admin yang lengkap dengan fitur:
- ✅ Kelola destinasi semua partner
- ✅ Kelola users (User, Partner, Admin)
- ✅ Kelola kategori
- ✅ Lihat statistik platform
- ✅ Kelola bookings
- ✅ Moderasi reviews

**Semua fitur sudah siap digunakan!** 🚀
