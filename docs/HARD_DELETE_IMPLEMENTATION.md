# Hard Delete Implementation

## 📋 Overview
Sistem telah diubah dari **Soft Delete** menjadi **Hard Delete** untuk role Partner dan Admin.

## 🔄 Perubahan

### Sebelumnya (Soft Delete):
- Data yang dihapus hanya ditandai dengan `deletedAt` timestamp
- Data masih ada di database
- Bisa di-restore jika diperlukan

### Sekarang (Hard Delete):
- Data yang dihapus **benar-benar terhapus** dari database
- Data **tidak bisa di-restore**
- Database lebih bersih

## 📝 File yang Dimodifikasi

### 1. **src/pages/api/destinations/[id].ts**
```typescript
// BEFORE (Soft Delete)
await prisma.destination.update({
  where: { id: id as string },
  data: { deletedAt: new Date() },
});

// AFTER (Hard Delete)
await prisma.destination.delete({
  where: { id: id as string },
});
```

### 2. **src/pages/api/destinations/index.ts**
- Removed `deletedAt: null` filter from WHERE clause
- Sekarang query tidak lagi memfilter data yang "soft deleted"

### 3. **src/pages/api/destinations/[id].ts (GET method)**
- Removed `deletedAt: null` filter
- Query lebih sederhana

### 4. **src/pages/api/admin/users.ts**
- Removed `deletedAt: null` filter

### 5. **src/pages/api/admin/stats.ts**
- Removed `deletedAt: null` filter dari semua query
- Statistics sekarang hanya menghitung data yang benar-benar ada

## ⚠️ Peringatan

### Untuk Admin & Partner:
1. **Hati-hati saat menghapus data** - Data tidak bisa dikembalikan!
2. **Pastikan backup database** secara berkala
3. **Konfirmasi sebelum delete** - Gunakan dialog konfirmasi

### Untuk Developer:
1. Field `deletedAt` masih ada di schema untuk backward compatibility
2. Data lama yang sudah soft-deleted masih ada di database
3. Jika ingin membersihkan data lama, jalankan query manual

## 🗑️ Membersihkan Data Lama (Optional)

Jika ingin menghapus data yang sudah soft-deleted sebelumnya:

```sql
-- HATI-HATI! Ini akan menghapus PERMANEN
-- Backup database dulu sebelum menjalankan!

-- Hapus destinations yang sudah soft-deleted
DELETE FROM "Destination" WHERE "deletedAt" IS NOT NULL;

-- Hapus users yang sudah soft-deleted (jika ada)
DELETE FROM "User" WHERE "deletedAt" IS NOT NULL;
```

## ✅ Testing

### Test Delete Destination:
1. Login sebagai Partner/Admin
2. Buka halaman Manage Destinations
3. Klik "Hapus" pada destinasi
4. Konfirmasi delete
5. **Cek di frontend**: Destinasi hilang dari list ✓
6. **Cek di database**: Data benar-benar terhapus ✓

### Test Query:
```sql
-- Cek apakah data benar-benar terhapus
SELECT * FROM "Destination" WHERE name = 'Candi Prambanan';
-- Harusnya return 0 rows
```

## 🔐 Permission

Hard delete hanya bisa dilakukan oleh:
- ✅ **Admin** - Bisa hapus semua destinasi
- ✅ **Partner** - Hanya bisa hapus destinasi milik sendiri
- ❌ **User** - Tidak bisa hapus destinasi

## 📊 Impact

### Positive:
- ✅ Database lebih bersih
- ✅ Query lebih cepat (tidak perlu filter deletedAt)
- ✅ Storage lebih efisien
- ✅ Tidak ada data "zombie"

### Negative:
- ❌ Tidak bisa restore data yang terhapus
- ❌ Kehilangan audit trail untuk data yang dihapus
- ❌ Harus lebih hati-hati saat delete

## 🔄 Rollback (Jika Diperlukan)

Jika ingin kembali ke soft delete, restore code dari commit sebelumnya atau ubah kembali:

```typescript
// Change back to soft delete
await prisma.destination.update({
  where: { id: id as string },
  data: { deletedAt: new Date() },
});

// And add back the filter
const where: any = {
  deletedAt: null,
};
```

## 📅 Date Implemented
- **Date**: 2026-02-02
- **By**: Development Team
- **Reason**: User request for true deletion

---

**⚠️ IMPORTANT**: Always backup your database before performing delete operations!
