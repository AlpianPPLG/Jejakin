# Component Library - [Nama Project]

**Version**: 1.0
**Date**: 27 Jan 2026
**Status**: Planning

## 1. Overview

Dokumentasi ini menjelaskan semua komponen UI yang akan dibangun untuk project ini. Setiap komponen mengikuti prinsip Atomic Design dan fully typed dengan TypeScript.

### Design Principles
- **Reusability**: Komponen dapat digunakan di berbagai konteks
- **Consistency**: Visual dan behavior yang konsisten
- **Accessibility**: WCAG 2.1 Level AA compliant
- **Performance**: Optimized untuk performa
- **Type Safety**: Fully typed dengan TypeScript

## 2. Atoms (Basic Components)

### 2.1 Button

**Purpose**: Komponen tombol untuk berbagai aksi user.

**Variants:**
- `primary`: Aksi utama (CTA)
- `secondary`: Aksi sekunder
- `ghost`: Aksi tersier/subtle
- `danger`: Aksi destructive

**Sizes:**
- `sm`: 32px height
- `md`: 40px height (default)
- `lg`: 48px height

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Usage:**
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" loading>
  Loading...
</Button>

<Button variant="danger" leftIcon={<TrashIcon />}>
  Delete
</Button>
```

**States:**
- Default
- Hover
- Active
- Disabled
- Loading

**Accessibility:**
- Keyboard accessible (Tab, Enter, Space)
- ARIA labels for icon-only buttons
- Disabled state properly communicated
- Loading state announced to screen readers


### 2.2 Input

**Purpose**: Text input field untuk form.

**Types:**
- `text`: Default text input
- `email`: Email input dengan validation
- `password`: Password input dengan toggle visibility
- `number`: Numeric input
- `tel`: Telephone input
- `url`: URL input

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}
```

**Usage:**
```tsx
<Input
  label="Email"
  type="email"
  placeholder="john@example.com"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>

<Input
  label="Password"
  type="password"
  leftIcon={<LockIcon />}
/>
```

**States:**
- Default
- Focus
- Error
- Disabled
- Filled

**Accessibility:**
- Label associated with input
- Error messages announced
- Required fields indicated
- Placeholder not used as label

### 2.3 Label

**Purpose**: Label untuk form fields.

**Props:**
```typescript
interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Label htmlFor="email" required>
  Email Address
</Label>
```

### 2.4 Badge

**Purpose**: Status indicator atau label kecil.

**Variants:**
- `default`: Gray
- `success`: Green
- `warning`: Yellow
- `error`: Red
- `info`: Blue

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Inactive</Badge>
```

### 2.5 Avatar

**Purpose**: User profile picture atau initial.

**Sizes:**
- `xs`: 24px
- `sm`: 32px
- `md`: 40px (default)
- `lg`: 48px
- `xl`: 64px

**Props:**
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: React.ReactNode;
}
```

**Usage:**
```tsx
<Avatar src="/avatar.jpg" alt="John Doe" size="md" />
<Avatar name="John Doe" size="lg" />
```

### 2.6 Icon

**Purpose**: Wrapper untuk icon library.

**Props:**
```typescript
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}
```

**Usage:**
```tsx
<Icon name="user" size={24} />
<Icon name="check" color="green" />
```

### 2.7 Spinner

**Purpose**: Loading indicator.

**Sizes:**
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

**Usage:**
```tsx
<Spinner size="md" />
<Spinner size="lg" color="primary" />
```

## 3. Molecules (Composite Components)

### 3.1 FormField

**Purpose**: Complete form field dengan label, input, dan error.

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}
```

**Usage:**
```tsx
<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

### 3.2 SearchBar

**Purpose**: Search input dengan icon dan button.

**Props:**
```typescript
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
}
```

**Usage:**
```tsx
<SearchBar
  placeholder="Search..."
  value={query}
  onChange={setQuery}
  onSearch={handleSearch}
/>
```

### 3.3 Card

**Purpose**: Container untuk konten dengan border dan shadow.

**Props:**
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Card
  title="Card Title"
  subtitle="Card subtitle"
  image="/image.jpg"
  hoverable
>
  Card content here
</Card>
```

### 3.4 Modal

**Purpose**: Dialog overlay untuk konten atau form.

**Sizes:**
- `sm`: 400px
- `md`: 600px (default)
- `lg`: 800px
- `xl`: 1000px
- `full`: Full screen

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Usage:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content here
</Modal>
```

**Accessibility:**
- Focus trap inside modal
- Escape key closes modal
- Focus returns to trigger element
- ARIA role="dialog"

### 3.5 Dropdown

**Purpose**: Menu dropdown untuk pilihan.

**Props:**
```typescript
interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}
```

**Usage:**
```tsx
<Dropdown
  trigger={<Button>Options</Button>}
  items={[
    { label: 'Edit', icon: <EditIcon />, onClick: handleEdit },
    { label: 'Delete', icon: <TrashIcon />, onClick: handleDelete, danger: true }
  ]}
/>
```

### 3.6 Tabs

**Purpose**: Tab navigation untuk konten.

**Props:**
```typescript
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<Tabs
  tabs={[
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

### 3.7 Alert

**Purpose**: Notification atau pesan penting.

**Variants:**
- `info`: Informasi
- `success`: Sukses
- `warning`: Peringatan
- `error`: Error

**Props:**
```typescript
interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
}
```

**Usage:**
```tsx
<Alert
  variant="success"
  title="Success"
  message="Operation completed successfully"
  closable
  onClose={handleClose}
/>
```

## 4. Organisms (Complex Components)

### 4.1 Header

**Purpose**: Navigation header aplikasi.

**Props:**
```typescript
interface HeaderProps {
  logo?: React.ReactNode;
  navigation?: NavItem[];
  user?: User;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}
```

**Features:**
- Logo/brand
- Navigation links
- User menu
- Mobile hamburger menu
- Sticky on scroll

### 4.2 Sidebar

**Purpose**: Side navigation untuk dashboard.

**Props:**
```typescript
interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  badge?: string;
}
```

**Features:**
- Collapsible
- Active state
- Badge support
- Nested items

### 4.3 DataTable

**Purpose**: Tabel data dengan sorting, filtering, pagination.

**Props:**
```typescript
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationProps;
  onSort?: (column: string, order: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
}

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}
```

**Features:**
- Sortable columns
- Custom cell rendering
- Row selection
- Pagination
- Loading state
- Empty state

### 4.4 Form

**Purpose**: Form wrapper dengan validation.

**Props:**
```typescript
interface FormProps {
  onSubmit: (data: any) => void;
  validationSchema?: any;
  defaultValues?: any;
  children: React.ReactNode;
}
```

**Features:**
- Form validation (Zod/Yup)
- Error handling
- Submit state
- Reset functionality

### 4.5 StatCard

**Purpose**: Card untuk menampilkan statistik.

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  loading?: boolean;
}
```

**Usage:**
```tsx
<StatCard
  title="Total Users"
  value={1234}
  change={12.5}
  trend="up"
  icon={<UsersIcon />}
/>
```

## 5. Layouts

### 5.1 GuestLayout

**Purpose**: Layout untuk halaman public (landing, login, register).

**Features:**
- Simple header
- Full-width content
- Footer

### 5.2 AuthLayout

**Purpose**: Layout untuk halaman yang memerlukan auth.

**Features:**
- Header dengan user menu
- Content area
- Footer

### 5.3 DashboardLayout

**Purpose**: Layout untuk dashboard dengan sidebar.

**Features:**
- Sidebar navigation
- Header
- Main content area
- Breadcrumbs

## 6. Component Development Checklist

### Before Development
- [ ] Design mockup reviewed
- [ ] Props interface defined
- [ ] Variants identified
- [ ] States documented
- [ ] Accessibility requirements clear

### During Development
- [ ] TypeScript interfaces complete
- [ ] All variants implemented
- [ ] All states handled
- [ ] Responsive behavior tested
- [ ] Accessibility features added
- [ ] Error states handled

### After Development
- [ ] Unit tests written
- [ ] Storybook story created
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Accessibility tested
- [ ] Cross-browser tested

---

**Note**: Dokumentasi ini akan di-update seiring development komponen.
