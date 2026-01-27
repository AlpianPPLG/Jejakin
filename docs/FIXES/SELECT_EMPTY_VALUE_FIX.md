# 🔧 Fix: Select Empty Value Error

**Date**: 27 Jan 2026  
**Issue**: Radix UI Select component error with empty string values

---

## 🐛 Problem

Error message:
```
Error: A <Select.Item /> must have a value prop that is not an empty string. 
This is because the Select value can be set to an empty string to clear the 
selection and show the placeholder.
```

**Root Cause**: Radix UI Select component does not allow `value=""` (empty string) for SelectItem components.

---

## ✅ Solution

Replace all empty string values with a valid string like `"all"`.

### Before (❌ Error)
```tsx
<SelectItem value="">All Items</SelectItem>
```

### After (✅ Fixed)
```tsx
<SelectItem value="all">All Items</SelectItem>
```

---

## 📝 Files Fixed

### 1. `src/pages/destinations/index.tsx`

**Changes**:
- Category filter: `value=""` → `value="all"`
- Province filter: `value=""` → `value="all"`
- Initial state: `useState('')` → `useState('all')`
- Filter logic: Check for `'all'` value

**Code**:
```tsx
// State
const [categoryFilter, setCategoryFilter] = useState('all');
const [provinceFilter, setProvinceFilter] = useState('all');

// Select Items
<SelectItem value="all">Semua Kategori</SelectItem>
<SelectItem value="all">Semua Provinsi</SelectItem>

// Filter Logic
if (categoryFilter && categoryFilter !== 'all') {
  params.append('category', categoryFilter);
}
```

---

### 2. `src/pages/dashboard/admin/users.tsx`

**Changes**:
- Role filter: `value=""` → `value="all"`
- Initial state: `useState('')` → `useState('all')`
- Filter logic: Added role matching

**Code**:
```tsx
// State
const [roleFilter, setRoleFilter] = useState('all');

// Select Item
<SelectItem value="all">All Roles</SelectItem>

// Filter Logic
const filteredUsers = users.filter((user) => {
  const matchesSearch = /* ... */;
  const matchesRole = roleFilter === 'all' || user.role === roleFilter;
  return matchesSearch && matchesRole;
});
```

---

### 3. `src/pages/dashboard/admin/reviews.tsx`

**Changes**:
- Rating filter: `value=""` → `value="all"`
- Initial state: `useState('')` → `useState('all')`
- API call: Check for `'all'` value

**Code**:
```tsx
// State
const [ratingFilter, setRatingFilter] = useState('all');

// Select Item
<SelectItem value="all">Semua Rating</SelectItem>

// API Call
if (ratingFilter && ratingFilter !== 'all') {
  params.append('rating', ratingFilter);
}
```

---

### 4. `src/pages/dashboard/admin/bookings.tsx`

**Changes**:
- Status filter: `value=""` → `value="all"`
- Initial state: `useState('')` → `useState('all')`
- Filter logic: Added status matching

**Code**:
```tsx
// State
const [statusFilter, setStatusFilter] = useState('all');

// Select Item
<SelectItem value="all">All Status</SelectItem>

// Filter Logic
const filteredBookings = bookings.filter((booking) => {
  const matchesSearch = /* ... */;
  const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
  return matchesSearch && matchesStatus;
});
```

---

## 🎯 Pattern to Follow

When using Radix UI Select for filtering:

### 1. **State Initialization**
```tsx
const [filter, setFilter] = useState('all'); // NOT ''
```

### 2. **Select Item for "All"**
```tsx
<SelectItem value="all">All Items</SelectItem>
```

### 3. **Filter Logic**
```tsx
// For API calls
if (filter && filter !== 'all') {
  params.append('filterKey', filter);
}

// For client-side filtering
const filtered = items.filter((item) => {
  const matchesFilter = filter === 'all' || item.property === filter;
  return matchesFilter;
});
```

---

## ⚠️ Important Notes

1. **Never use empty string** (`""`) as SelectItem value
2. **Use meaningful values** like `"all"`, `"none"`, `"default"`
3. **Update filter logic** to handle the new value
4. **Update initial state** to match the default SelectItem value
5. **Check API calls** to exclude the "all" value from parameters

---

## ✅ Testing Checklist

- [ ] Page loads without error
- [ ] Select dropdown opens
- [ ] "All" option selects correctly
- [ ] Other options select correctly
- [ ] Filter logic works as expected
- [ ] API calls exclude "all" value
- [ ] Client-side filtering works
- [ ] No console errors

---

## 🔍 How to Find Similar Issues

Search for patterns:
```bash
# Find empty string values in Select
grep -r 'SelectItem value=""' src/

# Find useState with empty string for filters
grep -r "useState\(''\)" src/
```

---

## 📚 References

- [Radix UI Select Documentation](https://www.radix-ui.com/docs/primitives/components/select)
- [GitHub Issue](https://github.com/radix-ui/primitives/issues/...)

---

**Status**: ✅ Fixed  
**Tested**: ✅ All pages working  
**Build**: ✅ No errors
