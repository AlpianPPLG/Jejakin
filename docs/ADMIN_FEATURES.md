# Admin Features Documentation

**Date**: 28 Jan 2026  
**Status**: ✅ Implemented

---

## 📋 Overview

Admin memiliki akses penuh ke seluruh platform untuk mengelola users, destinations, categories, bookings, dan reviews.

---

## ✨ Admin Capabilities

### 1. Dashboard Overview
**URL**: `/dashboard/admin`

**Features**:
- Platform-wide statistics (users, destinations, bookings, revenue)
- Booking status breakdown
- Recent bookings list
- Top destinations by booking count
- Quick action buttons

**Access**: Admin, Partner (limited)

---

### 2. Manage Bookings
**URL**: `/dashboard/admin/bookings`

**Features**:
- View all bookings (admin) or partner's bookings
- Search by booking code, user, destination
- Filter by status (pending, confirmed, completed, cancelled)
- Update booking status via dropdown
- Update payment status via dropdown
- Statistics cards
- Auto-refresh after updates
- Toast notifications

**Permissions**:
- Admin: View and manage ALL bookings
- Partner: View and manage bookings for their destinations only

---

### 3. Manage Destinations
**URL**: `/dashboard/admin/destinations`

**Features**:
- View all destinations from all partners
- Search by name, location, or partner
- Filter by status (active, pending, inactive)
- Filter by category
- Update destination status via dropdown
- Delete destinations
- View destination details
- Statistics (total, active, pending, inactive)

**Permissions**:
- Admin ONLY: Full access to all destinations
- Partner: Cannot access this page (use /dashboard/destinations instead)

---

### 4. Manage Users
**URL**: `/dashboard/admin/users`

**Features**:
- View all users with details
- Search by name or email
- Filter by role (user, partner, admin)
- View user activity (bookings, destinations, reviews)
- User statistics
- Email verification status
- Join date and last update

**Permissions**:
- Admin ONLY

**Future Enhancements**:
- Edit user details
- Delete/suspend users
- Change user roles
- Send notifications to users

---

### 5. Manage Categories
**URL**: `/dashboard/admin/categories`

**Features**:
- View all categories
- Create new categories
- Edit existing categories
- Delete categories
- Toggle active/inactive status
- Set category icon (emoji)
- Add category description
- Auto-generate slug from name

**Permissions**:
- Admin ONLY

**Category Fields**:
- Name (required)
- Slug (auto-generated)
- Description (optional)
- Icon (emoji, optional)
- Status (active/inactive)

---

### 6. Manage Reviews
**URL**: `/dashboard/admin/reviews`

**Features**:
- View all reviews
- Search reviews
- Filter by rating (1-5 stars)
- Delete inappropriate reviews
- View destination and user details
- Pagination

**Permissions**:
- Admin: View and manage ALL reviews
- Partner: View and manage reviews for their destinations only

---

## 🎯 Access Control Summary

### Admin Role
✅ Full access to ALL features
✅ View all users, destinations, bookings, reviews
✅ Manage categories
✅ Update any booking/destination status
✅ Delete any content
✅ Platform-wide statistics

### Partner Role
✅ View own destinations
✅ View bookings for own destinations
✅ Update booking status for own destinations
✅ View reviews for own destinations
❌ Cannot manage users
❌ Cannot manage categories
❌ Cannot view other partners' data

### User Role
✅ View own bookings
✅ Create bookings
✅ Write reviews
❌ No admin access
❌ Cannot manage content

---

## 📊 Statistics Available

### Platform Overview (Admin Only)
- Total Users
- Total Destinations
- Total Bookings
- Total Revenue

### Booking Statistics
- Pending bookings
- Confirmed bookings
- Completed bookings
- Cancelled bookings

### User Statistics (Admin Only)
- Total users
- Regular users count
- Partners count
- Admins count

### Destination Statistics
- Total destinations
- Active destinations
- Pending destinations
- Inactive destinations

### Category Statistics
- Total categories
- Active categories
- Inactive categories

---

## 🔧 API Endpoints

All admin endpoints require authentication and admin role.

### GET /api/admin/stats
Get platform statistics

### GET /api/admin/bookings
Get all bookings with filters

### GET /api/admin/users
Get all users with filters

### GET /api/admin/reviews
Get all reviews with filters

### GET /api/destinations
Get all destinations (admin sees all)

### GET /api/categories
Get all categories

### POST /api/categories
Create new category (admin only)

### PUT /api/categories
Update category (admin only)

### DELETE /api/categories
Delete category (admin only)

---

## 🎨 UI Components Used

- Table (shadcn/ui)
- Dialog (shadcn/ui)
- Select (shadcn/ui)
- Input (shadcn/ui)
- Button (shadcn/ui)
- Badge (shadcn/ui)
- Card (shadcn/ui)
- Skeleton (shadcn/ui)
- Toast notifications

---

## 📝 Notes

- All admin pages are protected with `withAuthRequired` HOC
- Role checking happens on both frontend and backend
- Toast notifications provide instant feedback
- Auto-refresh after updates
- Responsive design for mobile/tablet
- Search and filter capabilities on all list pages

---

**Implemented by**: Kiro AI Assistant  
**Review Status**: Ready for Testing
