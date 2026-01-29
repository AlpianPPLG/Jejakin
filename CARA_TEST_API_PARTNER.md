# 🧪 Cara Test API Partner - MUDAH!

## 🚀 Metode 1: Menggunakan Test Page (PALING MUDAH)

### Langkah-langkah:

1. **Pastikan server running**:
   ```bash
   npm run dev
   ```

2. **Buka halaman test di browser**:
   ```
   http://localhost:3000/test-partner-api.html
   ```

3. **Klik tombol secara berurutan**:
   - ✅ Klik "Login Partner" → Harus success
   - ✅ Klik "Check User" → Harus tampil data partner
   - ✅ Klik "Fetch Bookings" → **INI YANG PENTING!**
   - ✅ Klik "Fetch Notifications" → Harus tampil 4 notifikasi

4. **Lihat hasil**:
   - Jika "Fetch Bookings" menampilkan data → **API BERFUNGSI!**
   - Jika "Fetch Bookings" kosong → Ada masalah di API

5. **Screenshot hasil** dan share ke saya

---

## 🔍 Metode 2: Test di Browser Console

### Langkah-langkah:

1. **Buka halaman partner bookings**:
   ```
   http://localhost:3000/dashboard/partner/bookings
   ```

2. **Buka Developer Tools** (F12)

3. **Jalankan command ini di Console tab**:

```javascript
// Step 1: Login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'partner@jejakin.com',
    password: 'password123',
    role: 'partner'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login Result:', data);
  if (data.token) {
    localStorage.setItem('token', data.token);
    console.log('✅ Token saved!');
  }
});
```

4. **Tunggu beberapa detik, lalu jalankan**:

```javascript
// Step 2: Fetch Bookings
fetch('/api/bookings', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Bookings Result:', data);
  console.log('Total bookings:', data.data ? data.data.length : 0);
});
```

5. **Lihat hasil di console**:
   - Jika ada data → API berfungsi
   - Jika kosong → Ada masalah

---

## 🎯 Yang Harus Dilihat

### Hasil yang BENAR:

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "bookingCode": "BK1769647456720F6M5W",
      "user": {
        "name": "fulan",
        "email": "fulan@gmail.com",
        "phone": null
      },
      "destination": {
        "name": "Gunung Bromo",
        "location": "Probolinggo"
      },
      "visitDate": "2026-01-29T00:00:00.000Z",
      "numberOfPeople": 1,
      "totalPrice": 50000,
      "status": "pending",
      "paymentStatus": "unpaid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Hasil yang SALAH:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0
  }
}
```

---

## 🔧 Jika Data Kosong

### Kemungkinan Masalah:

1. **Token tidak valid**
   - Solusi: Login ulang

2. **Role bukan partner**
   - Solusi: Pastikan login dengan role "partner"

3. **Destinasi tidak dimiliki partner**
   - Solusi: Cek database dengan `node debug-booking.js`

4. **API filter salah**
   - Solusi: Cek kode API

---

## 📋 Checklist Debugging

Jalankan test ini dan catat hasilnya:

- [ ] Test Page: Login Partner → ✅ Success / ❌ Failed
- [ ] Test Page: Check User → Role: ______
- [ ] Test Page: Fetch Bookings → Total: ______
- [ ] Test Page: Fetch Notifications → Total: ______
- [ ] Console: localStorage.getItem('token') → Ada / Tidak ada
- [ ] Console: Fetch bookings → Total: ______

---

## 🚨 Jika Masih Tidak Berfungsi

### Langkah Terakhir:

1. **Buat booking baru sebagai user**:
   - Login sebagai user
   - Pilih destinasi (Gunung Bromo, Candi Borobudur, dll)
   - Buat booking baru
   - Logout

2. **Login sebagai partner**:
   - Email: partner@jejakin.com
   - Password: password123
   - Role: Partner

3. **Test lagi dengan test page**:
   - Buka: http://localhost:3000/test-partner-api.html
   - Klik semua tombol
   - Screenshot hasil

4. **Share screenshot**:
   - Screenshot test page
   - Screenshot console (jika ada error)
   - Screenshot halaman kelola booking

---

## 📞 Bantuan Lebih Lanjut

Jika setelah test di atas masih tidak berfungsi, tolong share:

1. Screenshot dari test page (http://localhost:3000/test-partner-api.html)
2. Screenshot console error (jika ada)
3. Output dari command: `node debug-booking.js`

Dengan informasi ini, saya bisa debug lebih lanjut dan menemukan masalahnya.

---

## ✅ Expected Result

Setelah test, Anda harus melihat:

- ✅ Login berhasil
- ✅ User role: "partner"
- ✅ Bookings: 1 atau lebih
- ✅ Notifications: 4 atau lebih
- ✅ Halaman kelola booking menampilkan data

**Silakan test sekarang dan beri tahu hasilnya!** 🚀
