# 🎯 Fitur Partner - Kelola Booking & Notifikasi

## ✅ Fitur yang Sudah Dibuat

### 1. Notifikasi untuk Partner saat User Booking
- ✅ Saat user membuat booking, partner mendapat notifikasi
- ✅ Notifikasi muncul di dashboard partner
- ✅ Notifikasi berisi detail booking (nama user, destinasi, tanggal, jumlah orang, total harga)

### 2. Partner Bisa Kelola Status Booking
- ✅ Halaman "Kelola Booking" khusus untuk partner
- ✅ Partner bisa update **Booking Status**: Pending, Confirmed, Completed, Cancelled
- ✅ Partner bisa update **Payment Status**: Belum Bayar, Sudah Bayar, Refund
- ✅ Filter booking by status dan payment status
- ✅ Search booking by code, user, atau destinasi

### 3. Validasi Login berdasarkan Role
- ✅ Saat login, user harus pilih role yang sesuai
- ✅ Jika email/password benar tapi role salah, login ditolak
- ✅ Error message: "Akun ini tidak terdaftar sebagai {role}. Silakan pilih role yang sesuai."

---

## 🚀 Cara Menggunakan

### A. Login sebagai Partner

1. Buka: `http://localhost:3000/login`
2. Email: `partner@jejakin.com`
3. Password: `password123`
4. **Pilih role "Partner"** (tombol kedua)
5. Klik "Masuk"

### B. Akses Kelola Booking

Setelah login sebagai partner:
1. Lihat sidebar kiri
2. Klik menu **"Kelola Booking"** (icon 📋)
3. Atau akses langsung: `/dashboard/partner/bookings`

---

## 📊 Halaman Kelola Booking Partner

### Statistik Cards
- **Total Booking**: Semua booking untuk destinasi partner
- **Pending**: Booking yang menunggu konfirmasi
- **Confirmed**: Booking yang sudah dikonfirmasi
- **Sudah Bayar**: Booking yang sudah dibayar

### Filter & Search
- **Search**: Cari by booking code, nama user, atau nama destinasi
- **Filter Status**: All Status, Pending, Confirmed, Completed, Cancelled
- **Filter Payment**: All Payment, Belum Bayar, Sudah Bayar, Refund

### Tabel Booking
| Kolom | Deskripsi |
|-------|-----------|
| Booking Code | Kode unik booking + tanggal dibuat |
| Customer | Nama, email, phone user |
| Destination | Nama destinasi + lokasi |
| Visit Date | Tanggal kunjungan |
| People | Jumlah orang |
| Total | Total harga |
| Status | Badge status booking |
| Payment | Badge payment status |
| Actions | View + Update |

### Actions
1. **View**: Lihat detail lengkap booking
2. **Update**: Update status booking dan payment

---

## 🔄 Update Status Booking

### Langkah-langkah:
1. Klik tombol **"Update"** pada booking yang ingin diupdate
2. Dialog akan muncul dengan informasi booking
3. Pilih **Booking Status** baru:
   - **Pending**: Menunggu konfirmasi
   - **Confirmed**: Sudah dikonfirmasi
   - **Completed**: Sudah selesai
   - **Cancelled**: Dibatalkan
4. Pilih **Payment Status** baru:
   - **Belum Bayar**: User belum bayar
   - **Sudah Bayar**: User sudah bayar
   - **Refund**: Uang dikembalikan
5. Klik **"Update Status"**
6. ✅ Status berhasil diupdate
7. ✅ User mendapat notifikasi otomatis

### Notifikasi ke User
Saat partner update status, user otomatis mendapat notifikasi:
- **Booking Status Changed**: "Your booking {code} status has been updated to {status}"
- **Payment Status Changed**: "Your payment for booking {code} has been updated to {status}"

---

## 🔔 Notifikasi untuk Partner

### Kapan Partner Mendapat Notifikasi?
1. **Saat User Buat Booking Baru**
   - Title: "Booking Baru"
   - Message: "{User Name} ({Email}) telah membuat booking untuk {Destination}. Tanggal kunjungan: {Date}. Jumlah: {People} orang. Total: Rp {Price}."
   - Link: `/dashboard/bookings/{id}`

### Cara Melihat Notifikasi
1. Klik icon 🔔 (bell) di header
2. Atau klik menu "Notifications" di sidebar
3. Notifikasi baru ditandai dengan badge

---

## 🔐 Validasi Login berdasarkan Role

### Cara Kerja:
1. User pilih role saat login (User/Partner/Admin)
2. System cek apakah email/password benar
3. System cek apakah role yang dipilih sesuai dengan role di database
4. Jika role tidak sesuai → Login ditolak

### Contoh Kasus:

#### ✅ Login Berhasil
```
Email: partner@jejakin.com
Password: password123
Role dipilih: Partner
Role di database: partner
→ ✅ Login berhasil
```

#### ❌ Login Ditolak (Role Salah)
```
Email: partner@jejakin.com
Password: password123
Role dipilih: Admin
Role di database: partner
→ ❌ Error: "Akun ini tidak terdaftar sebagai admin. Silakan pilih role yang sesuai."
```

#### ❌ Login Ditolak (Email/Password Salah)
```
Email: partner@jejakin.com
Password: wrongpassword
→ ❌ Error: "Invalid email or password"
```

---

## 📋 API Endpoints

### Get Bookings (Partner)
```http
GET /api/bookings?status=pending&paymentStatus=unpaid
Authorization: Bearer {token}
```
Response: Hanya booking untuk destinasi partner

### Update Booking Status
```http
PUT /api/bookings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

### Login with Role Validation
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "partner@jejakin.com",
  "password": "password123",
  "role": "partner"
}
```

---

## 🎯 Permissions

### Partner Permissions:
- ✅ Lihat booking untuk destinasi sendiri
- ✅ Update status booking
- ✅ Update payment status
- ✅ Lihat detail booking
- ✅ Terima notifikasi booking baru
- ❌ Tidak bisa lihat booking destinasi partner lain
- ❌ Tidak bisa delete booking

### Admin Permissions:
- ✅ Lihat semua booking (semua partner)
- ✅ Update status booking
- ✅ Update payment status
- ✅ Delete booking

### User Permissions:
- ✅ Lihat booking sendiri
- ✅ Cancel booking sendiri
- ❌ Tidak bisa update status
- ❌ Tidak bisa update payment status

---

## 🧪 Testing

### Test 1: Login dengan Role Validation
```bash
1. Buka http://localhost:3000/login
2. Email: partner@jejakin.com
3. Password: password123
4. Pilih role "Admin" (salah)
5. Klik "Masuk"
6. ✅ Harus muncul error: "Akun ini tidak terdaftar sebagai admin"
7. Pilih role "Partner" (benar)
8. Klik "Masuk"
9. ✅ Harus berhasil login
```

### Test 2: Partner Kelola Booking
```bash
1. Login sebagai partner
2. Klik menu "Kelola Booking"
3. ✅ Harus muncul list booking untuk destinasi partner
4. Klik tombol "Update" pada salah satu booking
5. Ubah status ke "Confirmed"
6. Ubah payment ke "Sudah Bayar"
7. Klik "Update Status"
8. ✅ Status harus berhasil diupdate
9. ✅ User harus mendapat notifikasi
```

### Test 3: Notifikasi Partner
```bash
1. Login sebagai user
2. Buat booking baru untuk destinasi partner
3. Logout
4. Login sebagai partner
5. Klik icon notifikasi (🔔)
6. ✅ Harus ada notifikasi booking baru
7. Klik notifikasi
8. ✅ Harus redirect ke detail booking
```

---

## 📁 File yang Dibuat/Diupdate

### Frontend
```
✅ src/pages/login.tsx - Tambah validasi role
✅ src/pages/dashboard/partner/bookings.tsx - Halaman kelola booking partner
✅ src/components/layouts/DashboardLayout.tsx - Tambah menu partner
```

### Backend API
```
✅ src/pages/api/auth/login.ts - Validasi role saat login
✅ src/pages/api/bookings/[id].ts - Update status by partner
✅ src/pages/api/bookings/index.ts - Notifikasi ke partner
```

### Types
```
✅ src/types/index.ts - Tambah role di LoginCredentials
```

---

## 🎉 Summary

**Fitur yang sudah selesai:**

1. ✅ **Notifikasi Partner**: Partner mendapat notifikasi saat ada booking baru
2. ✅ **Kelola Status Booking**: Partner bisa update booking status dan payment status
3. ✅ **Validasi Login Role**: Login harus sesuai dengan role yang terdaftar
4. ✅ **Notifikasi ke User**: User mendapat notifikasi saat status diupdate
5. ✅ **Filter & Search**: Partner bisa filter dan search booking
6. ✅ **Statistics**: Partner bisa lihat statistik booking

**Semua fitur sudah siap digunakan!** 🚀

---

## 📚 Dokumentasi Terkait

- `ADMIN_QUICK_START.md` - Quick start guide admin
- `docs/ADMIN_GUIDE.md` - Panduan lengkap admin
- `FITUR_ADMIN_LENGKAP.md` - Dokumentasi fitur admin
- `docs/NOTIFICATION_SYSTEM.md` - Sistem notifikasi

---

## 🙏 Terima Kasih!

Fitur partner untuk kelola booking dan notifikasi sudah lengkap!
Selamat mengelola booking! 🎉
