# ✅ Solusi: Notifikasi & Data Booking Partner

## 🔍 Hasil Debug

### Data di Database: ✅ SUDAH ADA!

1. **Partner User**: ✅ Ada (partner@jejakin.com)
2. **Destinasi Partner**: ✅ Ada 6 destinasi
3. **Booking untuk Destinasi Partner**: ✅ Ada 1 booking
4. **Notifikasi Partner**: ✅ Ada 4 notifikasi

### Booking yang Ada:
```
Booking Code: BK1769647456720F6M5W
Customer: fulan (fulan@gmail.com)
Destination: Gunung Bromo
Visit Date: 29 Januari 2026
People: 1 orang
Total: Rp 50.000
Status: pending
Payment: unpaid
```

---

## 🎯 Masalah & Solusi

### Masalah 1: Notifikasi Tidak Muncul di UI

**Penyebab:**
- Component NotificationBell mungkin tidak fetch data dengan benar
- Token expired atau tidak valid

**Solusi:**

1. **Logout dan Login Kembali**
   ```
   1. Klik profile di kanan atas
   2. Klik "Logout"
   3. Login kembali sebagai partner
   4. Email: partner@jejakin.com
   5. Password: password123
   6. Role: Partner
   ```

2. **Hard Refresh Browser**
   ```
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R
   ```

3. **Clear Browser Cache**
   ```
   - Buka Developer Tools (F12)
   - Klik kanan pada refresh button
   - Pilih "Empty Cache and Hard Reload"
   ```

---

### Masalah 2: Data Tidak Muncul di Kelola Booking

**Penyebab:**
- API endpoint tidak dipanggil dengan benar
- Filter status menghalangi data

**Solusi:**

1. **Cek URL Halaman**
   - Pastikan URL: `http://localhost:3000/dashboard/partner/bookings`
   - Bukan: `/dashboard/bookings` (ini untuk user)

2. **Reset Filter**
   - Set Status Filter ke "All Status"
   - Set Payment Filter ke "All Payment"
   - Clear search box

3. **Check Console untuk Error**
   ```
   1. Buka Developer Tools (F12)
   2. Tab Console
   3. Lihat apakah ada error merah
   4. Screenshot dan share jika ada error
   ```

4. **Check Network Tab**
   ```
   1. Buka Developer Tools (F12)
   2. Tab Network
   3. Refresh halaman
   4. Cari request ke /api/bookings
   5. Klik request tersebut
   6. Tab "Response" - lihat data yang dikembalikan
   ```

---

## 🚀 Langkah Testing yang Benar

### Step 1: Pastikan Server Running
```bash
npm run dev
```

### Step 2: Login sebagai Partner
```
URL: http://localhost:3000/login
Email: partner@jejakin.com
Password: password123
Role: Partner (tombol kedua)
```

### Step 3: Cek Notifikasi
```
1. Lihat icon 🔔 di header kanan atas
2. Harus ada badge merah dengan angka 4
3. Klik icon 🔔
4. Harus muncul dropdown dengan 4 notifikasi
5. Notifikasi teratas: "Booking Baru" dari fulan
```

### Step 4: Buka Kelola Booking
```
1. Klik menu "Kelola Booking" di sidebar
2. Atau akses langsung: http://localhost:3000/dashboard/partner/bookings
3. Harus muncul halaman dengan:
   - Statistik cards (Total: 1, Pending: 1)
   - Tabel dengan 1 booking
   - Booking Code: BK1769647456720F6M5W
```

### Step 5: Verifikasi Data di Tabel
```
Kolom yang harus terisi:
✅ Booking Code: BK1769647456720F6M5W
✅ Customer: fulan (fulan@gmail.com)
✅ Destination: Gunung Bromo
✅ Visit Date: 29 Jan 2026
✅ People: 1 orang
✅ Total: Rp 50.000
✅ Status: Badge "Pending" (kuning)
✅ Payment: Badge "Belum Bayar" (abu-abu)
✅ Actions: Tombol "View" dan "Update"
```

---

## 🔧 Troubleshooting Lanjutan

### Jika Notifikasi Masih Tidak Muncul:

**Cek 1: API Notifications**
```javascript
// Buka Console (F12) dan jalankan:
fetch('/api/notifications', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "type": "new_booking",
      "title": "Booking Baru",
      "message": "fulan (fulan@gmail.com) telah membuat booking...",
      "isRead": false,
      "createdAt": "..."
    }
  ]
}
```

---

### Jika Data Booking Masih Tidak Muncul:

**Cek 1: API Bookings**
```javascript
// Buka Console (F12) dan jalankan:
fetch('/api/bookings', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "bookingCode": "BK1769647456720F6M5W",
      "user": {
        "name": "fulan",
        "email": "fulan@gmail.com"
      },
      "destination": {
        "name": "Gunung Bromo"
      },
      "status": "pending",
      "paymentStatus": "unpaid"
    }
  ]
}
```

**Cek 2: Token Valid**
```javascript
// Buka Console (F12) dan jalankan:
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "partner@jejakin.com",
    "role": "partner"
  }
}
```

---

## 📸 Screenshot yang Dibutuhkan

Jika masih tidak berfungsi, tolong screenshot:

1. **Halaman Kelola Booking**
   - Full page screenshot
   - URL harus terlihat

2. **Developer Tools - Console Tab**
   - Screenshot semua error (jika ada)

3. **Developer Tools - Network Tab**
   - Screenshot request `/api/bookings`
   - Screenshot response body

4. **Developer Tools - Application Tab**
   - Screenshot localStorage
   - Pastikan ada `token`

---

## 🎯 Kesimpulan

**Data sudah ada di database:**
- ✅ 1 booking untuk destinasi partner
- ✅ 4 notifikasi untuk partner
- ✅ API logic sudah benar

**Yang perlu dilakukan:**
1. Logout dan login kembali
2. Hard refresh browser (Ctrl + Shift + R)
3. Akses `/dashboard/partner/bookings`
4. Reset semua filter
5. Cek console untuk error

**Jika masih tidak muncul:**
- Share screenshot console error
- Share screenshot network response
- Kita akan debug lebih lanjut

---

## 📞 Next Steps

Silakan coba langkah-langkah di atas dan beri tahu hasilnya:
- ✅ Berhasil: Notifikasi muncul dan data terlihat
- ❌ Gagal: Share screenshot error untuk debugging lebih lanjut

**Good luck!** 🚀
