# 🔧 Fix UI Partner Bookings

## ✅ Masalah Teridentifikasi

**API berfungsi dengan baik** ✅
- Login berhasil
- User info correct (role: partner)
- Bookings API mengembalikan 1 booking
- Notifications API mengembalikan data

**Masalah di UI** ❌
- Halaman "Kelola Booking" tidak menampilkan data
- Kemungkinan: Token tidak tersimpan dengan benar di localStorage

---

## 🔧 Perbaikan yang Sudah Dilakukan

### 1. Tambah Console Log untuk Debugging
File: `src/pages/dashboard/partner/bookings.tsx`

Sekarang akan menampilkan log di console:
- Token status (Found/Not found)
- Fetch params
- Response status
- Data yang diterima
- Total bookings

---

## 🧪 Cara Test Setelah Perbaikan

### Step 1: Rebuild & Start Server
```bash
# Hapus cache
rm -rf .next

# Start server
npm run dev
```

### Step 2: Login sebagai Partner
1. Buka: `http://localhost:3000/login`
2. Email: `partner@jejakin.com`
3. Password: `password123`
4. **Role: Partner** (tombol kedua)
5. Klik "Masuk"

### Step 3: Buka Halaman Kelola Booking
1. Klik menu "Kelola Booking" di sidebar
2. Atau akses: `http://localhost:3000/dashboard/partner/bookings`

### Step 4: Buka Developer Tools
1. Tekan **F12**
2. Tab **Console**
3. Lihat log yang muncul:

**Expected Log:**
```
🔍 Fetching bookings...
Token: Found
Fetching with params: 
Response status: 200
✅ Bookings data: {success: true, data: Array(1), ...}
Total bookings: 1
```

**Jika Token Not Found:**
```
🔍 Fetching bookings...
Token: Not found
Session expired. Please login again.
```

### Step 5: Verifikasi Data Muncul
Setelah log muncul, halaman harus menampilkan:
- ✅ Statistik cards: Total: 1, Pending: 1
- ✅ Tabel dengan 1 booking
- ✅ Booking Code: BK1769647456720F6M5W
- ✅ Customer: fulan (fulan@gmail.com)
- ✅ Destination: Gunung Bromo

---

## 🔍 Troubleshooting

### Jika Token Not Found:

**Solusi 1: Set Token Manual**
```javascript
// Buka Console (F12) dan jalankan:
localStorage.setItem('token', 'YOUR_TOKEN_FROM_TEST_PAGE');
location.reload();
```

**Solusi 2: Login Ulang**
1. Logout
2. Clear localStorage: `localStorage.clear()`
3. Login kembali sebagai partner

**Solusi 3: Copy Token dari Test Page**
1. Buka: `http://localhost:3000/test-partner-api.html`
2. Klik "Login Partner"
3. Copy token dari response
4. Buka Console di halaman kelola booking
5. Jalankan: `localStorage.setItem('token', 'PASTE_TOKEN_HERE')`
6. Refresh halaman

---

### Jika Data Masih Tidak Muncul:

**Cek 1: Response Data**
Lihat di console, apakah `data.data` berisi array?
```javascript
// Harus ada:
✅ Bookings data: {success: true, data: [{ ... }]}

// Bukan:
❌ Bookings data: {success: true, data: []}
```

**Cek 2: State Update**
Tambahkan log setelah setBookings:
```javascript
console.log('State updated, bookings:', bookings);
```

**Cek 3: Render Condition**
Cek apakah ada kondisi yang menghalangi render:
- Loading state
- Empty state
- Filter yang terlalu ketat

---

## 🎯 Solusi Alternatif

### Jika Masih Tidak Berfungsi:

**Opsi 1: Force Refresh dengan Token Baru**
```javascript
// 1. Login di test page
// 2. Copy token
// 3. Di halaman kelola booking, jalankan:
localStorage.setItem('token', 'NEW_TOKEN');
window.location.reload();
```

**Opsi 2: Bypass Auth Check**
Sementara untuk testing, kita bisa bypass auth check:
```typescript
// Di fetchBookings, comment out token check:
// if (!token) {
//   showError('Session expired. Please login again.');
//   router.push('/login');
//   return;
// }
```

**Opsi 3: Hard Code Token**
Untuk testing, hard code token:
```typescript
const token = localStorage.getItem('token') || 'YOUR_VALID_TOKEN';
```

---

## 📋 Checklist Debug

Jalankan dan catat hasilnya:

- [ ] Server running: `npm run dev`
- [ ] Login berhasil sebagai partner
- [ ] URL correct: `/dashboard/partner/bookings`
- [ ] Console log muncul: "🔍 Fetching bookings..."
- [ ] Token status: Found / Not found
- [ ] Response status: 200 / Other
- [ ] Data received: Yes / No
- [ ] Total bookings: ___
- [ ] Data muncul di UI: Yes / No

---

## 🚀 Next Steps

### Jika Berhasil:
1. ✅ Data muncul di halaman
2. ✅ Bisa update status
3. ✅ Notifikasi berfungsi
4. ✅ Semua fitur lengkap

### Jika Masih Gagal:
1. Screenshot console log
2. Screenshot halaman kelola booking
3. Screenshot network tab (request /api/bookings)
4. Share ke saya untuk debug lebih lanjut

---

## 📞 Bantuan

Jika setelah langkah di atas masih tidak berfungsi, tolong share:

1. **Screenshot Console Log** (F12 → Console tab)
2. **Screenshot Network Tab** (F12 → Network → /api/bookings)
3. **Screenshot Halaman** (Full page dengan URL terlihat)

Dengan informasi ini, saya bisa menemukan masalah pastinya dan memberikan solusi yang tepat.

---

## ✅ Expected Final Result

Setelah perbaikan, Anda harus melihat:

**Console Log:**
```
🔍 Fetching bookings...
Token: Found
Fetching with params: 
Response status: 200
✅ Bookings data: {success: true, data: Array(1)}
Total bookings: 1
```

**UI:**
- ✅ Statistik: Total: 1, Pending: 1, Confirmed: 0, Sudah Bayar: 0
- ✅ Tabel dengan 1 row
- ✅ Booking Code: BK1769647456720F6M5W
- ✅ Customer: fulan (fulan@gmail.com)
- ✅ Destination: Gunung Bromo
- ✅ Status: Pending (badge kuning)
- ✅ Payment: Belum Bayar (badge abu-abu)
- ✅ Actions: View + Update buttons

**Good luck!** 🚀
