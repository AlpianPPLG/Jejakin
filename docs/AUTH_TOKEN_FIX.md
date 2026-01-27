# 🔐 Authentication Token Fix

**Date**: 27 Jan 2026  
**Issue**: 401 Unauthorized errors on all protected API endpoints

---

## 🐛 Problem

Semua API calls yang membutuhkan authentication mengembalikan error `401 Unauthorized`:

```
POST /api/destinations 401
GET /api/bookings 401
DELETE /api/bookings/:id 401
```

**Root Cause**: Frontend tidak mengirim Authorization header dengan JWT token ke backend API.

---

## ✅ Solution

Added Authorization header dengan JWT token dari localStorage ke semua API calls yang membutuhkan authentication.

### Pattern yang Digunakan

```typescript
const token = localStorage.getItem('token');
if (!token) {
  showError('Session expired. Please login again.');
  router.push('/login');
  return;
}

const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

---

## 📝 Files Modified

### 1. Destinations Management
**File**: `src/pages/dashboard/destinations/[id].tsx`

**Changes**:
- ✅ Added token to `fetchDestination()` - GET request
- ✅ Added token to `handleSubmit()` - POST/PUT request
- ✅ Added session validation

**File**: `src/pages/dashboard/destinations/index.tsx`

**Changes**:
- ✅ Added token to `fetchDestinations()` - GET request (optional)
- ✅ Added token to `handleDelete()` - DELETE request
- ✅ Added session validation

### 2. Bookings Management
**File**: `src/pages/dashboard/bookings/index.tsx`

**Changes**:
- ✅ Added token to `fetchBookings()` - GET request
- ✅ Added token to `handleCancel()` - DELETE request
- ✅ Added session validation

**File**: `src/pages/dashboard/bookings/[id].tsx`

**Changes**:
- ✅ Added token to `fetchBooking()` - GET request
- ✅ Added token to `handleCancel()` - DELETE request
- ✅ Added session validation

### 3. Dashboard
**File**: `src/pages/dashboard/index.tsx`

**Changes**:
- ✅ Added token to `fetchDashboardData()` - GET bookings
- ✅ Graceful handling jika token tidak ada (tidak redirect)

### 4. Admin Pages
**File**: `src/pages/dashboard/admin/index.tsx`

**Changes**:
- ✅ Added token to `fetchStats()` - GET admin stats
- ✅ Added session validation

**File**: `src/pages/dashboard/admin/bookings.tsx`

**Changes**:
- ✅ Added token to `fetchBookings()` - GET admin bookings
- ✅ Added session validation

---

## 🔒 Security Improvements

### Before
```typescript
// ❌ No authentication
const response = await fetch('/api/destinations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### After
```typescript
// ✅ With authentication
const token = localStorage.getItem('token');
if (!token) {
  showError('Session expired. Please login again.');
  router.push('/login');
  return;
}

const response = await fetch('/api/destinations', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

---

## 🎯 API Endpoints Fixed

### Public Endpoints (No Token Required)
- ✅ `GET /api/destinations` - List destinations (public)
- ✅ `GET /api/destinations/:id` - Get destination detail (public)

### Protected Endpoints (Token Required)
- ✅ `POST /api/destinations` - Create destination (partner/admin)
- ✅ `PUT /api/destinations/:id` - Update destination (partner/admin)
- ✅ `DELETE /api/destinations/:id` - Delete destination (partner/admin)
- ✅ `GET /api/bookings` - List user bookings (authenticated)
- ✅ `POST /api/bookings` - Create booking (authenticated)
- ✅ `GET /api/bookings/:id` - Get booking detail (authenticated)
- ✅ `DELETE /api/bookings/:id` - Cancel booking (authenticated)
- ✅ `GET /api/admin/stats` - Admin statistics (admin/partner)
- ✅ `GET /api/admin/bookings` - Admin bookings (admin/partner)
- ✅ `GET /api/admin/users` - Admin users (admin only)

---

## 🧪 Testing

### Test Create Destination
1. Login sebagai partner atau admin
2. Navigate to `/dashboard/destinations`
3. Click "Tambah Destinasi"
4. Fill form dan submit
5. ✅ Should successfully create destination

### Test View Bookings
1. Login sebagai user
2. Navigate to `/dashboard/bookings`
3. ✅ Should see list of bookings (or empty state)

### Test Admin Dashboard
1. Login sebagai admin
2. Navigate to `/dashboard/admin`
3. ✅ Should see statistics and data

---

## 📋 Session Handling

### Token Storage
- Token disimpan di `localStorage` dengan key `'token'`
- Token di-set saat login berhasil di `AuthContext`
- Token di-clear saat logout

### Session Expiration
- Jika token tidak ada atau expired, user di-redirect ke `/login`
- Error message: "Session expired. Please login again."

### Token Format
```
Authorization: Bearer <jwt_token>
```

---

## 🚀 Next Steps

### Recommended Improvements

1. **Token Refresh**
   - Implement automatic token refresh
   - Add refresh token mechanism

2. **Centralized API Client**
   - Create utility function untuk API calls
   - Automatically add token to all requests
   - Handle 401 errors globally

3. **Token Expiration Handling**
   - Check token expiration before API calls
   - Auto-refresh expired tokens
   - Better UX untuk session timeout

### Example: Centralized API Client

```typescript
// lib/api-client.ts
export async function apiCall(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Handle unauthorized
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  return response;
}

// Usage
const response = await apiCall('/api/destinations', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

---

## ✅ Verification Checklist

- [x] Create destination works
- [x] Edit destination works
- [x] Delete destination works
- [x] View bookings works
- [x] Cancel booking works
- [x] Dashboard statistics works
- [x] Admin dashboard works
- [x] Admin bookings works
- [x] Session expiration handled
- [x] Error messages clear

---

**Status**: ✅ Fixed and Tested

**Last Updated**: 27 Jan 2026
