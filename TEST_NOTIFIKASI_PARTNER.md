# 🧪 Testing Notifikasi Partner & Kelola Booking

## ✅ Perbaikan yang Sudah Dilakukan

### 1. API GET Bookings untuk Partner
- ✅ Partner sekarang bisa melihat booking untuk destinasi mereka
- ✅ Filter berdasarkan `destination.userId`
- ✅ Tambah filter `paymentStatus`
- ✅ Include `phone` user

### 2. Notifikasi Partner
- ✅ Link notifikasi mengarah ke `/dashboard/partner/bookings`
- ✅ Notifikasi dibuat saat user booking

### 3. Halaman Kelola Booking
- ✅ Halaman sudah dibuat di `/dashboard/partner/bookings`
- ✅ Partner bisa update status booking
- ✅ Partner bisa update payment status

---

## 🧪 Cara Testing

### Step 1: Login sebagai User dan Buat Booking

1. **Buka browser**: `http://localhost:3000/login`

2. **Login sebagai User**:
   ```
   Email: user@jejakin.com
   Password: password123
   Role: User (tombol pertama)
   ```

3. **Explore Destinasi**:
   - Klik menu "Explore" di sidebar
   - Pilih salah satu destinasi (misal: Candi Borobudur)

4. **Buat Booking**:
   - Klik tombol "Book Now"
   - Isi form booking:
     - Visit Date: Pilih tanggal
     - Number of People: 2
     - Notes: "Test booking"
   - Klik "Create Booking"
   - ✅ Harus muncul success message
   - ✅ Redirect ke halaman booking

5. **Cek Booking User**:
   - Klik menu "Bookings" di sidebar
   - ✅ Booking baru harus muncul
   - Status: Pending
   - Payment: Belum Bayar

---

### Step 2: Login sebagai Partner dan Cek Notifikasi

1. **Logout dari User**:
   - Klik profile di kanan atas
   - Klik "Logout"

2. **Login sebagai Partner**:
   ```
   Email: partner@jejakin.com
   Password: password123
   Role: Partner (tombol kedua)
   ```

3. **Cek Notifikasi**:
   - Lihat icon 🔔 (bell) di header kanan atas
   - ✅ Harus ada badge merah (jumlah notifikasi baru)
   - Klik icon 🔔
   - ✅ Harus muncul notifikasi "Booking Baru"
   - Isi notifikasi:
     ```
     Title: Booking Baru
     Message: {User Name} ({Email}) telah membuat booking untuk {Destination}.
              Tanggal kunjungan: {Date}. Jumlah: {People} orang.
              Total: Rp {Price}.
     ```

4. **Klik Notifikasi**:
   - Klik pada notifikasi
   - ✅ Harus redirect ke `/dashboard/partner/bookings`

---

### Step 3: Kelola Booking di Halaman Partner

1. **Lihat Halaman Kelola Booking**:
   - Setelah klik notifikasi, atau
   - Klik menu "Kelola Booking" di sidebar
   - ✅ Harus muncul halaman dengan list booking

2. **Cek Statistik Cards**:
   - ✅ Total Booking: Harus ada angka
   - ✅ Pending: Harus ada angka (minimal 1)
   - ✅ Confirmed: 0 atau lebih
   - ✅ Sudah Bayar: 0 atau lebih

3. **Cek Tabel Booking**:
   - ✅ Booking yang baru dibuat harus muncul
   - Kolom yang ditampilkan:
     - Booking Code: BK...
     - Customer: Nama + Email + Phone user
     - Destination: Nama destinasi + Lokasi
     - Visit Date: Tanggal kunjungan
     - People: Jumlah orang
     - Total: Harga total
     - Status: Badge "Pending"
     - Payment: Badge "Belum Bayar"
     - Actions: View + Update

4. **Update Status Booking**:
   - Klik tombol "Update" pada booking
   - ✅ Dialog harus muncul
   - Dialog berisi:
     - Booking Code
     - Destination Name
     - Customer Name
     - Dropdown Booking Status
     - Dropdown Payment Status
   
5. **Ubah Status**:
   - Pilih Booking Status: "Confirmed"
   - Pilih Payment Status: "Sudah Bayar"
   - Klik "Update Status"
   - ✅ Harus muncul success message
   - ✅ Status di tabel harus berubah
   - ✅ Badge harus berubah warna

6. **Cek Filter**:
   - Test filter Status: Pilih "Confirmed"
   - ✅ Hanya booking confirmed yang muncul
   - Test filter Payment: Pilih "Sudah Bayar"
   - ✅ Hanya booking sudah bayar yang muncul

7. **Test Search**:
   - Ketik booking code di search box
   - ✅ Booking yang sesuai harus muncul
   - Ketik nama user
   - ✅ Booking user tersebut harus muncul

---

### Step 4: Verifikasi User Mendapat Notifikasi

1. **Logout dari Partner**

2. **Login kembali sebagai User**:
   ```
   Email: user@jejakin.com
   Password: password123
   ```

3. **Cek Notifikasi User**:
   - Klik icon 🔔
   - ✅ Harus ada 2 notifikasi baru:
     1. "Booking Status Updated" - Status changed to confirmed
     2. "Payment Status Updated" - Payment changed to paid

4. **Cek Booking User**:
   - Klik menu "Bookings"
   - ✅ Status booking harus "Confirmed"
   - ✅ Payment status harus "Sudah Bayar"

---

## 🔍 Troubleshooting

### Notifikasi Tidak Muncul?

**Cek 1: Database**
```sql
SELECT * FROM notifications 
WHERE userId = '{partner_user_id}' 
ORDER BY createdAt DESC;
```

**Cek 2: Console Browser**
- Buka Developer Tools (F12)
- Lihat tab Console
- Cek apakah ada error

**Cek 3: API Response**
- Buka tab Network
- Cek response dari `/api/notifications`
- Pastikan ada data notifikasi

**Solusi:**
1. Refresh halaman (F5)
2. Clear browser cache
3. Logout dan login kembali
4. Restart dev server

---

### Booking Tidak Muncul di Kelola Booking?

**Cek 1: Role Partner**
```sql
SELECT id, email, role FROM users WHERE email = 'partner@jejakin.com';
```
Pastikan role = 'partner'

**Cek 2: Destination Owner**
```sql
SELECT id, name, userId FROM destinations WHERE id = '{destination_id}';
```
Pastikan userId = partner user id

**Cek 3: API Response**
- Buka Developer Tools
- Tab Network
- Cek response dari `/api/bookings`
- Pastikan ada data booking

**Solusi:**
1. Pastikan destinasi dimiliki oleh partner
2. Refresh halaman
3. Cek filter (set ke "All Status")
4. Clear search box

---

### Update Status Tidak Berfungsi?

**Cek 1: Permission**
- Pastikan login sebagai partner
- Pastikan destinasi milik partner

**Cek 2: API Response**
- Cek response dari `PUT /api/bookings/{id}`
- Lihat error message

**Solusi:**
1. Logout dan login kembali
2. Pastikan token valid
3. Cek console untuk error

---

## ✅ Checklist Testing

### Notifikasi Partner
- [ ] Partner mendapat notifikasi saat user booking
- [ ] Notifikasi muncul di icon bell
- [ ] Badge merah muncul
- [ ] Isi notifikasi lengkap (nama, email, destinasi, tanggal, jumlah, harga)
- [ ] Link notifikasi mengarah ke kelola booking

### Kelola Booking
- [ ] Halaman kelola booking muncul
- [ ] Statistik cards menampilkan angka yang benar
- [ ] Tabel booking menampilkan data
- [ ] Booking baru muncul di list
- [ ] Semua kolom terisi dengan benar
- [ ] Filter status berfungsi
- [ ] Filter payment berfungsi
- [ ] Search berfungsi

### Update Status
- [ ] Dialog update muncul
- [ ] Dropdown status berfungsi
- [ ] Dropdown payment berfungsi
- [ ] Update berhasil
- [ ] Status berubah di tabel
- [ ] Badge berubah warna
- [ ] User mendapat notifikasi

### Notifikasi User
- [ ] User mendapat notifikasi status update
- [ ] User mendapat notifikasi payment update
- [ ] Notifikasi muncul di bell icon
- [ ] Status booking berubah di halaman user

---

## 📊 Expected Results

### Database Changes

**Tabel: bookings**
```
id: {uuid}
bookingCode: BK...
userId: {user_id}
destinationId: {destination_id}
visitDate: {date}
numberOfPeople: 2
totalPrice: {price}
status: pending → confirmed
paymentStatus: unpaid → paid
```

**Tabel: notifications (Partner)**
```
userId: {partner_id}
type: new_booking
title: Booking Baru
message: {user} telah membuat booking...
link: /dashboard/partner/bookings
isRead: false
```

**Tabel: notifications (User - Status)**
```
userId: {user_id}
type: booking_status_updated
title: Booking Status Updated
message: Your booking {code} status has been updated to confirmed
link: /dashboard/bookings/{id}
isRead: false
```

**Tabel: notifications (User - Payment)**
```
userId: {user_id}
type: payment_status_updated
title: Payment Status Updated
message: Your payment for booking {code} has been updated to paid
link: /dashboard/bookings/{id}
isRead: false
```

---

## 🎯 Success Criteria

✅ **Notifikasi Partner**: Partner mendapat notifikasi real-time saat user booking
✅ **Data Masuk**: Booking muncul di halaman "Kelola Booking"
✅ **Update Status**: Partner bisa update booking status dan payment status
✅ **Notifikasi User**: User mendapat notifikasi saat status diupdate
✅ **Filter & Search**: Semua filter dan search berfungsi dengan baik

---

## 🚀 Ready to Test!

Ikuti langkah-langkah di atas untuk memverifikasi bahwa semua fitur berfungsi dengan baik.

**Good luck testing!** 🎉
