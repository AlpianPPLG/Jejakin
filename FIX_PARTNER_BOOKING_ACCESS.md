# Fix Partner Booking Access

## Masalah
- Email `partner@jejakin.com` bisa kelola data booking turis
- Email `nova@gmail.com` (role: partner) tidak bisa kelola booking
- Padahal keduanya memiliki role yang sama: `partner`

## Penyebab
Logika sebelumnya membatasi partner hanya bisa melihat booking untuk **destinasi yang mereka buat sendiri**:

```typescript
// SEBELUM (SALAH)
if (authUser.role === 'partner') {
  where.destination = {
    userId: authUser.userId, // Hanya destinasi milik partner ini
  };
}
```

Ini menyebabkan:
- `partner@jejakin.com` bisa lihat booking karena punya destinasi
- `nova@gmail.com` tidak bisa lihat booking karena tidak punya destinasi

## Solusi
Mengubah logika agar **semua partner bisa kelola semua booking** (global access):

```typescript
// SESUDAH (BENAR)
if (authUser.role === 'partner') {
  // Partner sees ALL bookings (tidak ada filter)
  // Semua partner bisa kelola semua booking
}
```

## File yang Diubah

### 1. `src/pages/api/bookings/index.ts`
- **Baris 23-34**: Menghapus filter `destination.userId` untuk partner
- Partner sekarang bisa melihat semua booking tanpa batasan

### 2. `src/pages/api/bookings/[id].ts`
- **Baris 44-51**: Update permission check untuk GET booking
  - Partner bisa view semua booking
- **Baris 88-95**: Update permission check untuk UPDATE booking
  - Mengubah `isPartner` dari `existingBooking.destination.userId === authUser.userId` menjadi `authUser.role === 'partner'`
  - Semua partner bisa update status dan payment status booking

## Hasil
✅ Semua user dengan role `partner` sekarang bisa:
- Melihat semua booking (tidak terbatas pada destinasi mereka)
- Update status booking (pending, confirmed, completed, cancelled)
- Update payment status (unpaid, paid, refunded)
- View detail booking

## Testing
Untuk test perubahan ini:

1. Login sebagai `nova@gmail.com` (password dari database)
2. Akses `/dashboard/partner/bookings`
3. Seharusnya bisa melihat semua booking
4. Coba update status booking
5. Seharusnya berhasil

## Catatan
Jika di masa depan ingin kembali ke sistem "partner hanya kelola booking destinasi sendiri", kembalikan logika filter:

```typescript
if (authUser.role === 'partner') {
  where.destination = {
    userId: authUser.userId,
  };
}
```

Dan update permission check di `[id].ts`:
```typescript
const isPartner = existingBooking.destination.userId === authUser.userId;
```
