# Partner Booking Management Feature

**Date**: 28 Jan 2026  
**Status**: ✅ Implemented

---

## 📋 Overview

Partner sekarang dapat mengelola status booking dan payment status untuk destinasi mereka langsung dari halaman Manage Bookings.

---

## ✨ Features

### 1. Update Booking Status
Partner dapat mengubah status booking dari:
- **Pending** → Confirmed / Cancelled / Completed
- **Confirmed** → Completed / Cancelled
- **Completed** → (Final state)
- **Cancelled** → (Final state)

### 2. Update Payment Status
Partner dapat mengubah payment status dari:
- **Unpaid** → Paid / Refunded
- **Paid** → Refunded
- **Refunded** → (Final state)

---

## 🎯 Access Control

### Partner Role
- ✅ Dapat update status booking untuk **destinasi milik sendiri**
- ✅ Dapat update payment status untuk **destinasi milik sendiri**
- ✅ Melihat notifikasi real-time saat update berhasil
- ❌ Tidak bisa update booking destinasi partner lain

### Admin Role
- ✅ Dapat update status booking untuk **SEMUA destinasi**
- ✅ Dapat update payment status untuk **SEMUA destinasi**
- ✅ Full access ke semua bookings

### User Role
- ❌ Tidak bisa update status atau payment status
- ✅ Hanya bisa view booking sendiri
- ✅ Menerima notifikasi saat status berubah

---

## 🔧 Implementation Details

### Frontend Changes
**File**: `src/pages/dashboard/admin/bookings.tsx`

**Changes**:
1. Replaced static Badge components with Select dropdowns
2. Added `handleStatusUpdate()` function
3. Added `handlePaymentStatusUpdate()` function
4. Added success toast notifications
5. Added "Actions" column with "View Details" button

**UI Components**:
- Select dropdown untuk status booking
- Select dropdown untuk payment status
- Toast notification untuk feedback

### Backend Changes
**File**: `src/pages/api/bookings/[id].ts`

**Changes**:
1. Enhanced permission check untuk partner dan admin
2. Added notification creation saat status berubah
3. Added notification creation saat payment status berubah
4. Improved error handling

**Permissions**:
```typescript
// Partner and Admin can update status and paymentStatus
if (isPartner || isAdmin) {
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
}
```

---

## 📱 User Experience

### Partner Workflow
1. Login sebagai partner
2. Navigate ke `/dashboard/admin/bookings`
3. Lihat list bookings untuk destinasi sendiri
4. Click dropdown pada kolom "Status" atau "Payment"
5. Pilih status baru
6. Toast notification muncul: "Status booking berhasil diubah ke confirmed"
7. Table refresh otomatis dengan data terbaru

### User Notification
Saat partner/admin update status:
1. User menerima notifikasi di NotificationBell
2. Notifikasi berisi:
   - Title: "Booking Status Updated" atau "Payment Status Updated"
   - Message: Detail perubahan
   - Link: Direct link ke booking detail

---

## 🧪 Testing Checklist

### Status Update
- [ ] Partner update status pending → confirmed
- [ ] Partner update status confirmed → completed
- [ ] Partner update status pending → cancelled
- [ ] Admin update status untuk semua bookings
- [ ] User menerima notifikasi saat status berubah
- [ ] Toast notification muncul saat update berhasil
- [ ] Table refresh otomatis setelah update

### Payment Status Update
- [ ] Partner update payment unpaid → paid
- [ ] Partner update payment paid → refunded
- [ ] Admin update payment untuk semua bookings
- [ ] User menerima notifikasi saat payment status berubah
- [ ] Toast notification muncul saat update berhasil
- [ ] Table refresh otomatis setelah update

### Permission Testing
- [ ] Partner tidak bisa update booking destinasi lain
- [ ] User tidak bisa update status/payment
- [ ] Admin bisa update semua bookings
- [ ] Unauthorized access returns 403

---

## 🎨 UI/UX Improvements

### Before
- Status dan Payment ditampilkan sebagai Badge (read-only)
- Tidak ada cara untuk update status dari table
- Harus masuk ke detail page untuk update

### After
- Status dan Payment sebagai Select dropdown (editable)
- Update langsung dari table view
- Toast notification untuk instant feedback
- Auto-refresh setelah update
- "View Details" button untuk akses detail page

---

## 📊 API Endpoints

### PUT /api/bookings/:id
**Description**: Update booking status dan payment status

**Access**: Owner, Partner (for their destinations), Admin

**Request Body**:
```json
{
  "status": "confirmed",           // optional
  "paymentStatus": "paid",         // optional
  "visitDate": "2026-02-15",       // optional
  "numberOfPeople": 2,             // optional
  "notes": "Special request"       // optional
}
```

**Response**:
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "id": "...",
    "status": "confirmed",
    "paymentStatus": "paid",
    ...
  }
}
```

**Notifications Created**:
1. When status changes → "booking_status_updated"
2. When payment status changes → "payment_status_updated"

---

## 🚀 Future Enhancements

1. **Bulk Update**: Update multiple bookings sekaligus
2. **Status History**: Track semua perubahan status
3. **Confirmation Dialog**: Konfirmasi sebelum update status
4. **Email Notification**: Kirim email ke user saat status berubah
5. **Refund Processing**: Integrasi dengan payment gateway untuk refund otomatis
6. **Status Rules**: Validasi status transition (e.g., tidak bisa dari cancelled ke confirmed)

---

## 📝 Notes

- Update status dan payment status dilakukan secara independent
- Notifikasi dikirim ke user secara otomatis
- Partner hanya bisa update booking untuk destinasi mereka
- Admin memiliki full access ke semua bookings
- Toast notification memberikan instant feedback
- Table refresh otomatis setelah update berhasil

---

**Implemented by**: Kiro AI Assistant  
**Review Status**: Ready for Testing
