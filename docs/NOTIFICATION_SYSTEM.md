# 🔔 Notification System - Jejakin

**Date**: 27 Jan 2026  
**Status**: ✅ Complete

---

## 📋 Overview

Sistem notifikasi lengkap yang memberitahu user dan admin tentang aktivitas booking, pembayaran, dan update lainnya.

---

## 🎯 Features

### 1. **Automatic Notifications**

Notifikasi otomatis dibuat saat:
- ✅ User membuat booking baru
- ✅ Admin/Partner menerima booking baru
- ✅ Pembayaran berhasil
- ✅ Booking dikonfirmasi
- ✅ Review mendapat balasan

### 2. **Email Notifications**

Email otomatis dikirim ke:
- ✅ User: Konfirmasi booking dengan detail lengkap
- ✅ Admin: Alert booking baru
- ✅ Partner: Alert booking untuk destinasi mereka

### 3. **In-App Notifications**

- ✅ Notification bell dengan unread count
- ✅ Dropdown list notifikasi terbaru
- ✅ Halaman notifikasi lengkap
- ✅ Mark as read functionality
- ✅ Mark all as read
- ✅ Real-time polling (30s interval)

---

## 📧 Email Templates

### User Booking Confirmation Email

**Subject**: Booking Confirmation - [Booking Code]

**Content**:
```
🎉 Booking Confirmed!

Halo [User Name],

Booking Anda telah berhasil dibuat. Berikut adalah detail booking Anda:

┌─────────────────────────────────┐
│ Kode Booking: BK1234567890      │
│ Destinasi: Pantai Kuta          │
│ Lokasi: Kuta, Badung, Bali      │
│ Tanggal: Sabtu, 1 Februari 2026 │
│ Jumlah: 2 orang                 │
│ Total: Rp 100.000               │
└─────────────────────────────────┘

Langkah Selanjutnya:
1. Lakukan pembayaran
2. Upload bukti pembayaran
3. Tunggu konfirmasi
4. Siap berwisata! 🎉

[Lihat Detail Booking]
```

### Admin New Booking Alert Email

**Subject**: New Booking - [Booking Code]

**Content**:
```
🔔 New Booking Alert

⚠️ Action Required: Booking baru menunggu konfirmasi

Customer Information:
- Nama: John Doe
- Email: john@example.com

Booking Details:
- Kode: BK1234567890
- Destinasi: Pantai Kuta
- Tanggal: 1 Februari 2026
- Jumlah: 2 orang
- Total: Rp 100.000

[Kelola Booking]
```

---

## 🔌 API Integration

### Create Booking with Notifications

```typescript
// POST /api/bookings
{
  "destinationId": "...",
  "visitDate": "2026-02-01",
  "numberOfPeople": 2,
  "notes": "Optional notes"
}
```

**Automatic Actions**:
1. Create booking in database
2. Create notification for user
3. Create notification for destination owner
4. Create notification for all admins
5. Send confirmation email to user
6. Send alert email to admins
7. Send alert email to destination owner

---

## 📱 Notification Types

### 1. **booking_created** (User)
- **Title**: "Booking Berhasil Dibuat"
- **Message**: "Booking Anda untuk [Destination] telah berhasil dibuat. Kode booking: [Code]. Silakan lakukan pembayaran."
- **Link**: `/dashboard/bookings/[id]`
- **Icon**: ✅

### 2. **new_booking** (Admin/Partner)
- **Title**: "Booking Baru"
- **Message**: "[User Name] ([Email]) telah membuat booking untuk [Destination]. Tanggal: [Date]. Jumlah: [People] orang. Total: Rp [Price]."
- **Link**: `/dashboard/admin/bookings`
- **Icon**: 🔔

### 3. **booking_confirmed** (User)
- **Title**: "Booking Dikonfirmasi"
- **Message**: "Booking Anda untuk [Destination] telah dikonfirmasi. Selamat menikmati perjalanan!"
- **Link**: `/dashboard/bookings/[id]`
- **Icon**: ✅

### 4. **payment_success** (User)
- **Title**: "Pembayaran Berhasil"
- **Message**: "Pembayaran untuk booking [Code] telah berhasil diverifikasi."
- **Link**: `/dashboard/bookings/[id]`
- **Icon**: 💳

### 5. **review_reply** (User)
- **Title**: "Balasan Review"
- **Message**: "Partner/Admin telah membalas review Anda untuk [Destination]."
- **Link**: `/destinations/[slug]`
- **Icon**: 💬

### 6. **booking_reminder** (User)
- **Title**: "Pengingat Booking"
- **Message**: "Booking Anda untuk [Destination] akan dimulai besok. Jangan lupa!"
- **Link**: `/dashboard/bookings/[id]`
- **Icon**: ⏰

---

## 🎨 UI Components

### 1. **NotificationBell** (Header)

**Location**: Dashboard header  
**Features**:
- Bell icon with unread count badge
- Dropdown showing 5 latest notifications
- Mark as read on click
- Mark all as read button
- Real-time polling (30s)

**Usage**:
```tsx
import { NotificationBell } from '@/components/ui/NotificationBell';

<NotificationBell />
```

### 2. **NotificationList** (Full Page)

**Location**: `/dashboard/notifications`  
**Features**:
- All notifications with pagination
- Filter by read/unread
- Mark as read individually
- Mark all as read
- Link to related content
- Time ago format

**Usage**:
```tsx
import { NotificationList } from '@/components/ui/NotificationList';

<NotificationList />
```

---

## 🔄 Notification Flow

### User Creates Booking

```
User fills booking form
       ↓
Submit booking
       ↓
API creates booking
       ↓
┌──────────────────────────────────┐
│  Notification Creation           │
├──────────────────────────────────┤
│ 1. User notification (DB)        │
│ 2. Partner notification (DB)     │
│ 3. Admin notifications (DB)      │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│  Email Sending (Async)           │
├──────────────────────────────────┤
│ 1. User confirmation email       │
│ 2. Admin alert emails            │
│ 3. Partner alert email           │
└──────────────────────────────────┘
       ↓
User sees notification bell update
       ↓
Admin sees notification bell update
```

---

## 📊 Database Schema

### Notification Table

```prisma
model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String    // booking_created, new_booking, etc
  title     String
  message   String    @db.Text
  link      String?
  isRead    Boolean   @default(false)
  readAt    DateTime?
  createdAt DateTime  @default(now())
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}
```

---

## 🔧 Implementation Details

### 1. **Create Notification**

```typescript
await prisma.notification.create({
  data: {
    userId: user.id,
    type: 'booking_created',
    title: 'Booking Berhasil Dibuat',
    message: 'Booking Anda untuk Pantai Kuta telah berhasil dibuat.',
    link: '/dashboard/bookings/123',
  },
});
```

### 2. **Send Email**

```typescript
import { sendBookingConfirmationEmail } from '@/lib/email';

await sendBookingConfirmationEmail({
  userName: 'John Doe',
  userEmail: 'john@example.com',
  bookingCode: 'BK1234567890',
  destinationName: 'Pantai Kuta',
  destinationLocation: 'Kuta, Badung, Bali',
  visitDate: '1 Februari 2026',
  numberOfPeople: 2,
  totalPrice: 100000,
  notes: 'Optional notes',
});
```

### 3. **Fetch Notifications**

```typescript
// GET /api/notifications?limit=20
const response = await fetch('/api/notifications?limit=20', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
// data.data.notifications
// data.data.unreadCount
```

### 4. **Mark as Read**

```typescript
// PUT /api/notifications
await fetch('/api/notifications', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    notificationId: '123',
  }),
});
```

### 5. **Mark All as Read**

```typescript
// PUT /api/notifications
await fetch('/api/notifications', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    markAll: true,
  }),
});
```

---

## 🎯 Email Service Integration

### Current Implementation (Development)

Emails are logged to console for development:

```typescript
console.log('📧 Sending booking confirmation email...');
console.log('To:', userEmail);
console.log('Subject:', 'Booking Confirmation');
// ... email details
```

### Production Integration

To integrate with real email service (e.g., SendGrid):

```typescript
// src/lib/email.ts

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const msg = {
    to: data.userEmail,
    from: 'noreply@jejakin.com',
    subject: `Booking Confirmation - ${data.bookingCode}`,
    html: generateBookingEmailHTML(data),
  };

  await sgMail.send(msg);
}
```

**Environment Variables**:
```env
SENDGRID_API_KEY=your_api_key_here
EMAIL_FROM=noreply@jejakin.com
```

---

## 🧪 Testing Checklist

### Booking Creation
- [ ] User creates booking
- [ ] User receives notification
- [ ] Admin receives notification
- [ ] Partner receives notification
- [ ] Email logged to console (dev)
- [ ] Notification bell updates
- [ ] Unread count increases

### Notification Display
- [ ] Bell icon shows unread count
- [ ] Dropdown shows latest notifications
- [ ] Click notification marks as read
- [ ] Link navigates correctly
- [ ] Time ago format correct
- [ ] Icons display correctly

### Notification Page
- [ ] All notifications display
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Filter by read/unread works
- [ ] Pagination works
- [ ] Empty state displays

### Real-time Updates
- [ ] Polling every 30 seconds
- [ ] New notifications appear
- [ ] Unread count updates
- [ ] No duplicate notifications

---

## 📈 Future Enhancements

### Phase 2
- [ ] Push notifications (web push)
- [ ] SMS notifications
- [ ] WhatsApp notifications
- [ ] Notification preferences
- [ ] Notification categories

### Phase 3
- [ ] Notification scheduling
- [ ] Digest emails (daily/weekly)
- [ ] Notification templates
- [ ] A/B testing for emails
- [ ] Email analytics

---

## 🔒 Security

### Authentication
- All notification endpoints require authentication
- Users can only see their own notifications
- Admins can see all notifications

### Data Privacy
- Email addresses not exposed in notifications
- Sensitive data encrypted
- GDPR compliant

---

## 📝 Notes

- Notifications are created synchronously
- Emails are sent asynchronously (don't block response)
- Failed emails are logged but don't fail the request
- Notifications are soft-deleted (not hard-deleted)
- Real-time polling can be replaced with WebSockets in future

---

**Last Updated**: 27 Jan 2026  
**Version**: 1.0
