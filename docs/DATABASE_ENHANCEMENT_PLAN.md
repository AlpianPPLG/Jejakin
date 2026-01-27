# 📊 Database Enhancement Plan - Jejakin

## Current Database Structure
- ✅ Users (user, partner, admin)
- ✅ Destinations
- ✅ Bookings
- ✅ Reviews

---

## 🎯 Recommended New Tables & Enhancements

### 1. **Payment Transactions**
Untuk tracking pembayaran yang lebih detail.

```prisma
model Payment {
  id              String    @id @default(cuid())
  bookingId       String    @unique
  amount          Int
  paymentMethod   String    // credit_card, bank_transfer, e-wallet, cash
  paymentGateway  String?   // midtrans, xendit, manual
  transactionId   String?   @unique
  status          String    @default("pending") // pending, processing, success, failed, refunded
  paidAt          DateTime?
  refundedAt      DateTime?
  metadata        Json?     // Store payment gateway response
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  booking         Booking   @relation(fields: [bookingId], references: [id])
  
  @@index([bookingId])
  @@index([status])
  @@map("payments")
}
```

### 2. **Destination Categories** (Normalized)
Untuk kategori yang lebih terstruktur dan bisa di-manage.

```prisma
model Category {
  id          String        @id @default(cuid())
  name        String        @unique
  slug        String        @unique
  description String?
  icon        String?
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  destinations Destination[]
  
  @@map("categories")
}
```

### 3. **Destination Galleries**
Untuk mengelola gambar destinasi dengan lebih baik.

```prisma
model DestinationGallery {
  id            String      @id @default(cuid())
  destinationId String
  imageUrl      String
  caption       String?
  isPrimary     Boolean     @default(false)
  order         Int         @default(0)
  createdAt     DateTime    @default(now())
  
  destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  
  @@index([destinationId])
  @@map("destination_galleries")
}
```

### 4. **Facilities** (Normalized)
Untuk fasilitas yang bisa dipilih dari list.

```prisma
model Facility {
  id          String    @id @default(cuid())
  name        String    @unique
  icon        String?
  category    String    // amenities, activities, services
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  
  destinations DestinationFacility[]
  
  @@map("facilities")
}

model DestinationFacility {
  id            String      @id @default(cuid())
  destinationId String
  facilityId    String
  
  destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  facility      Facility    @relation(fields: [facilityId], references: [id])
  
  @@unique([destinationId, facilityId])
  @@map("destination_facilities")
}
```

### 5. **Wishlists / Favorites**
User bisa save destinasi favorit.

```prisma
model Wishlist {
  id            String      @id @default(cuid())
  userId        String
  destinationId String
  createdAt     DateTime    @default(now())
  
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  
  @@unique([userId, destinationId])
  @@index([userId])
  @@map("wishlists")
}
```

### 6. **Review Responses**
Partner/Admin bisa reply review.

```prisma
model ReviewResponse {
  id        String   @id @default(cuid())
  reviewId  String   @unique
  userId    String   // Partner or Admin who responded
  response  String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])
  
  @@map("review_responses")
}
```

### 7. **Notifications**
Sistem notifikasi untuk user.

```prisma
model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String    // booking_confirmed, payment_success, review_reply, etc
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

### 8. **Promo Codes / Vouchers**
Untuk sistem diskon dan promosi.

```prisma
model Voucher {
  id              String    @id @default(cuid())
  code            String    @unique
  name            String
  description     String?
  discountType    String    // percentage, fixed
  discountValue   Int
  minTransaction  Int       @default(0)
  maxDiscount     Int?
  usageLimit      Int?
  usedCount       Int       @default(0)
  validFrom       DateTime
  validUntil      DateTime
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  bookings        BookingVoucher[]
  
  @@map("vouchers")
}

model BookingVoucher {
  id            String   @id @default(cuid())
  bookingId     String
  voucherId     String
  discountAmount Int
  createdAt     DateTime @default(now())
  
  booking       Booking  @relation(fields: [bookingId], references: [id])
  voucher       Voucher  @relation(fields: [voucherId], references: [id])
  
  @@unique([bookingId])
  @@map("booking_vouchers")
}
```

### 9. **Activity Logs**
Untuk audit trail dan tracking aktivitas.

```prisma
model ActivityLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String   // login, create_booking, update_destination, etc
  entity      String?  // booking, destination, user
  entityId    String?
  description String   @db.Text
  ipAddress   String?
  userAgent   String?  @db.Text
  metadata    Json?
  createdAt   DateTime @default(now())
  
  user        User?    @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("activity_logs")
}
```

### 10. **Destination Pricing Tiers**
Untuk harga yang berbeda berdasarkan hari/musim.

```prisma
model DestinationPricing {
  id            String      @id @default(cuid())
  destinationId String
  name          String      // Weekday, Weekend, Holiday, Peak Season
  price         Int
  validFrom     DateTime?
  validUntil    DateTime?
  daysOfWeek    Json?       // [1,2,3,4,5] for weekdays
  isActive      Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  
  @@index([destinationId])
  @@map("destination_pricing")
}
```

### 11. **Booking Guests**
Detail tamu untuk setiap booking.

```prisma
model BookingGuest {
  id          String   @id @default(cuid())
  bookingId   String
  name        String
  age         Int?
  idType      String?  // ktp, passport
  idNumber    String?
  phone       String?
  email       String?
  createdAt   DateTime @default(now())
  
  booking     Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  
  @@index([bookingId])
  @@map("booking_guests")
}
```

### 12. **Partner Earnings**
Tracking pendapatan partner.

```prisma
model PartnerEarning {
  id              String    @id @default(cuid())
  partnerId       String
  bookingId       String    @unique
  grossAmount     Int
  platformFee     Int
  netAmount       Int
  status          String    @default("pending") // pending, paid, cancelled
  paidAt          DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  partner         User      @relation(fields: [partnerId], references: [id])
  booking         Booking   @relation(fields: [bookingId], references: [id])
  
  @@index([partnerId])
  @@index([status])
  @@map("partner_earnings")
}
```

---

## 🔄 Enhanced Existing Tables

### Update User Table
```prisma
model User {
  // ... existing fields
  phone         String?
  address       String?   @db.Text
  city          String?
  province      String?
  postalCode    String?
  dateOfBirth   DateTime?
  gender        String?   // male, female, other
  bio           String?   @db.Text
  isVerified    Boolean   @default(false)
  verifiedAt    DateTime?
  lastLoginAt   DateTime?
  
  // New relations
  wishlists         Wishlist[]
  notifications     Notification[]
  activityLogs      ActivityLog[]
  reviewResponses   ReviewResponse[]
  partnerEarnings   PartnerEarning[]
}
```

### Update Destination Table
```prisma
model Destination {
  // ... existing fields
  categoryId    String?
  duration      Int?          // in hours
  minPeople     Int?
  maxPeople     Int?
  difficulty    String?       // easy, moderate, hard
  bestTime      String?       // Best time to visit
  openingHours  Json?         // {mon: "08:00-17:00", ...}
  contactPhone  String?
  contactEmail  String?
  website       String?
  videoUrl      String?
  viewCount     Int           @default(0)
  bookingCount  Int           @default(0)
  
  // New relations
  category          Category?             @relation(fields: [categoryId], references: [id])
  galleries         DestinationGallery[]
  destinationFacilities DestinationFacility[]
  wishlists         Wishlist[]
  pricingTiers      DestinationPricing[]
}
```

### Update Booking Table
```prisma
model Booking {
  // ... existing fields
  checkInTime   String?
  specialRequests String?  @db.Text
  cancelledAt   DateTime?
  cancelReason  String?   @db.Text
  
  // New relations
  payment       Payment?
  voucher       BookingVoucher?
  guests        BookingGuest[]
  earning       PartnerEarning?
}
```

### Update Review Table
```prisma
model Review {
  // ... existing fields
  isVerified    Boolean   @default(false)
  helpfulCount  Int       @default(0)
  
  // New relations
  response      ReviewResponse?
}
```

---

## 📋 Implementation Priority

### Phase 1 (High Priority)
1. ✅ Payment Transactions
2. ✅ Notifications
3. ✅ Destination Galleries
4. ✅ Wishlists

### Phase 2 (Medium Priority)
5. ✅ Categories (Normalized)
6. ✅ Facilities (Normalized)
7. ✅ Review Responses
8. ✅ Booking Guests

### Phase 3 (Nice to Have)
9. ✅ Vouchers
10. ✅ Activity Logs
11. ✅ Destination Pricing Tiers
12. ✅ Partner Earnings

---

## 🎯 Benefits

1. **Better Data Structure**: Normalized tables untuk scalability
2. **Enhanced Features**: Payment tracking, notifications, wishlists
3. **Business Intelligence**: Activity logs, earnings tracking
4. **User Experience**: Vouchers, flexible pricing, guest management
5. **Partner Management**: Earnings tracking, review responses
6. **Admin Control**: Better monitoring and management tools

---

## 🚀 Migration Strategy

1. Create migration files incrementally
2. Test each migration in development
3. Backup production database before migration
4. Run migrations during low-traffic hours
5. Monitor for any issues post-migration

---

**Last Updated**: 27 Jan 2026
