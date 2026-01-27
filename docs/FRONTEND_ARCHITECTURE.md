# Frontend Architecture - [Nama Project]

**Version**: 1.0
**Date**: 27 Jan 2026
**Status**: Planning

## 1. Architecture Overview

### Component Architecture
```
┌─────────────────────────────────────────────────┐
│              Application Root                   │
│                (_app.tsx)                       │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────┐           ┌──────────────┐
│ Context │           │   Layouts    │
│Provider │           │              │
└────┬────┘           └──────┬───────┘
     │                       │
     │    ┌──────────────────┴──────────────────┐
     │    │                                      │
     ▼    ▼                                      ▼
┌─────────────┐                         ┌──────────────┐
│   Pages     │                         │  Components  │
│             │                         │              │
│ - Home      │◄────────────────────────┤ - Layouts    │
│ - Dashboard │                         │ - Features   │
│ - [Feature] │                         │ - UI         │
└─────────────┘                         └──────────────┘
```

### Architecture Layers

#### 1. Application Layer (_app.tsx)
- Global providers (Context, Theme)
- Global styles
- Layout persistence
- Error boundaries

#### 2. Context Layer
- Global state management
- Authentication state
- User preferences
- Data caching

#### 3. Layout Layer
- Page structure templates
- Navigation components
- Header/Footer
- Sidebar

#### 4. Page Layer
- Route components
- Page-specific logic
- SEO metadata
- Data fetching

#### 5. Component Layer
- Reusable UI components
- Feature-specific components
- Atomic design pattern


## 2. Technology Stack

### Core Technologies
```
Framework:       Next.js 14 (Pages Router)
Language:        TypeScript 5.x
Styling:         Tailwind CSS 3.x
State:           React Context API
Animation:       Framer Motion
Icons:           Heroicons / Lucide React
```

### Additional Libraries
```
Forms:           React Hook Form
Validation:      Zod
HTTP Client:     Fetch API / Axios
Date:            date-fns
Charts:          Recharts / Chart.js
Tables:          TanStack Table
Notifications:   React Hot Toast
Modals:          Headless UI
```

## 3. Component Architecture

### Atomic Design Pattern

#### Atoms (Basic Building Blocks)
```
src/components/ui/
├── Button.tsx
├── Input.tsx
├── Label.tsx
├── Badge.tsx
├── Avatar.tsx
├── Icon.tsx
└── Spinner.tsx
```

**Characteristics:**
- Single responsibility
- Highly reusable
- No business logic
- Fully typed props
- Storybook documented

**Example: Button Component**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### Molecules (Simple Combinations)
```
src/components/ui/
├── FormField.tsx      (Label + Input + Error)
├── SearchBar.tsx      (Input + Icon + Button)
├── Card.tsx           (Container + Header + Body)
├── Modal.tsx          (Overlay + Content + Actions)
└── Dropdown.tsx       (Button + Menu + Items)
```


**Characteristics:**
- Combine atoms
- Specific purpose
- Minimal business logic
- Reusable across features

#### Organisms (Complex Components)
```
src/components/features/
├── Header.tsx
├── Sidebar.tsx
├── DataTable.tsx
├── UserProfile.tsx
├── StatisticsCard.tsx
└── [Feature]Form.tsx
```

**Characteristics:**
- Feature-specific
- Combine molecules & atoms
- May contain business logic
- Connected to context/state

#### Templates (Page Layouts)
```
src/components/layouts/
├── GuestLayout.tsx
├── AuthLayout.tsx
├── DashboardLayout.tsx
└── AdminLayout.tsx
```

**Characteristics:**
- Define page structure
- Consistent navigation
- Responsive behavior
- SEO optimization

#### Pages (Complete Views)
```
src/pages/
├── index.tsx              (Landing)
├── login.tsx
├── register.tsx
├── dashboard/
│   ├── index.tsx          (User Dashboard)
│   └── admin.tsx          (Admin Dashboard)
└── [feature]/
    ├── index.tsx          (List)
    └── [id].tsx           (Detail)
```

## 4. State Management

### Context API Strategy

#### Auth Context
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  updateProfile: (data) => Promise<void>;
}
```


**Usage:**
```typescript
const { user, login, logout } = useAuth();
```

#### Data Context
```typescript
interface DataContextType {
  items: Item[];
  isLoading: boolean;
  error: Error | null;
  fetchItems: () => Promise<void>;
  createItem: (data) => Promise<void>;
  updateItem: (id, data) => Promise<void>;
  deleteItem: (id) => Promise<void>;
}
```

#### Toast Context
```typescript
interface ToastContextType {
  showToast: (message, type) => void;
  showSuccess: (message) => void;
  showError: (message) => void;
  showWarning: (message) => void;
}
```

### Local State (useState)
- Component-specific state
- Form inputs
- UI toggles (modals, dropdowns)
- Temporary data

### Server State (SWR/React Query - Optional)
- API data caching
- Automatic revalidation
- Optimistic updates
- Background refetching

## 5. Routing Strategy

### Pages Router Structure
```
pages/
├── index.tsx                    # /
├── login.tsx                    # /login
├── register.tsx                 # /register
├── dashboard/
│   ├── index.tsx                # /dashboard
│   ├── admin.tsx                # /dashboard/admin
│   └── settings.tsx             # /dashboard/settings
├── [feature]/
│   ├── index.tsx                # /[feature]
│   ├── [id].tsx                 # /[feature]/123
│   └── create.tsx               # /[feature]/create
└── 404.tsx                      # Not Found
```

### Protected Routes
```typescript
// HOC Pattern
export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <Spinner />;
    if (!isAuthenticated) {
      router.push('/login');
      return null;
    }
    
    return <Component {...props} />;
  };
}
```


### Role-Based Routes
```typescript
// Middleware check
if (user.role !== 'admin') {
  router.push('/dashboard');
}
```

## 6. Data Fetching Patterns

### Client-Side Fetching (CSR)
```typescript
// For dynamic, user-specific data
useEffect(() => {
  fetchUserData();
}, []);
```

**Use Cases:**
- Dashboard data
- User-specific content
- Real-time updates
- Protected data

### Server-Side Rendering (SSR)
```typescript
export async function getServerSideProps(context) {
  const data = await fetchData();
  return { props: { data } };
}
```

**Use Cases:**
- SEO-critical pages
- Personalized content
- Authentication checks
- Dynamic metadata

### Static Generation (SSG)
```typescript
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data }, revalidate: 60 };
}
```

**Use Cases:**
- Landing pages
- Blog posts
- Documentation
- Marketing pages

### Incremental Static Regeneration (ISR)
```typescript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 3600 // Revalidate every hour
  };
}
```

## 7. Form Handling

### React Hook Form Pattern
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});

const onSubmit = async (data) => {
  try {
    await api.create(data);
    showSuccess('Created successfully');
  } catch (error) {
    showError(error.message);
  }
};
```

### Form Validation (Zod)
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  name: z.string().min(2, 'Min 2 characters')
});
```


### Form States
- Idle: Initial state
- Submitting: Loading state
- Success: Show success message
- Error: Show error message

## 8. Error Handling

### Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### API Error Handling
```typescript
try {
  const response = await api.call();
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    logout();
    router.push('/login');
  } else if (error.response?.status === 404) {
    showError('Resource not found');
  } else {
    showError('Something went wrong');
  }
}
```

### User-Friendly Errors
```typescript
const errorMessages = {
  'NETWORK_ERROR': 'Check your internet connection',
  'UNAUTHORIZED': 'Please login again',
  'VALIDATION_ERROR': 'Please check your input',
  'SERVER_ERROR': 'Server error, try again later'
};
```

## 9. Performance Optimization

### Code Splitting
```typescript
// Dynamic imports
const DashboardChart = dynamic(() => import('@/components/DashboardChart'), {
  loading: () => <Spinner />,
  ssr: false
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Memoization
```typescript
// Expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Callback functions
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```


### Lazy Loading
```typescript
// Components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Images
<img loading="lazy" src="..." alt="..." />
```

### Bundle Size Optimization
- Tree shaking (automatic with Next.js)
- Remove unused dependencies
- Use dynamic imports for heavy libraries
- Analyze bundle with `@next/bundle-analyzer`

## 10. Responsive Design

### Breakpoint Strategy
```typescript
// Tailwind breakpoints
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Extra large
```

### Mobile-First Approach
```tsx
// Default: Mobile
<div className="text-sm p-4">
  {/* Mobile styles */}
</div>

// Tablet and up
<div className="text-sm md:text-base p-4 md:p-6">
  {/* Responsive styles */}
</div>

// Desktop
<div className="text-sm md:text-base lg:text-lg p-4 md:p-6 lg:p-8">
  {/* Full responsive */}
</div>
```

### Responsive Components
```typescript
// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Show on mobile only
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## 11. Animation Strategy

### Framer Motion Patterns

#### Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```


#### Hover Effects
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400 }}
>
  Click me
</motion.button>
```

#### Scroll Animations
```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Animation Best Practices
- Keep animations under 300ms
- Use transform and opacity (GPU accelerated)
- Avoid animating layout properties
- Respect prefers-reduced-motion
- Test on low-end devices

## 12. Accessibility (A11y)

### Semantic HTML
```tsx
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <section>Content</section>
  </article>
</main>

<footer>
  Footer content
</footer>
```

### ARIA Labels
```tsx
<button aria-label="Close modal" onClick={onClose}>
  <XIcon />
</button>

<input
  type="text"
  aria-label="Search"
  aria-describedby="search-help"
/>
<span id="search-help">Enter keywords to search</span>
```

### Keyboard Navigation
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter') submitForm();
};
```

### Focus Management
```typescript
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);
```


### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Use tools like WebAIM Contrast Checker

## 13. Testing Strategy

### Unit Tests (Jest/Vitest)
```typescript
describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests
```typescript
describe('Login Flow', () => {
  it('logs in user successfully', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright/Cypress)
```typescript
test('complete user registration', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="name"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## 14. File Structure

### Complete Frontend Structure
```
src/
├── components/
│   ├── layouts/
│   │   ├── GuestLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   └── features/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── UserProfile.tsx
│       └── [Feature]Card.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── DataContext.tsx
│   ├── ToastContext.tsx
│   └── LanguageContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── constants.ts
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── dashboard/
│   └── [feature]/
├── styles/
│   ├── globals.css
│   └── tailwind.css
└── types/
    ├── index.ts
    └── api.ts
```


## 15. Development Workflow

### Component Development Process
```
1. Design mockup review
2. Create component file
3. Define TypeScript interfaces
4. Implement component logic
5. Add Tailwind styling
6. Add animations (if needed)
7. Write unit tests
8. Document in Storybook
9. Code review
10. Merge to main
```

### Git Workflow
```
main (production)
  └── develop (staging)
       └── feature/[feature-name]
       └── fix/[bug-name]
```

### Commit Convention
```
feat: Add user profile component
fix: Resolve login redirect issue
style: Update button hover states
refactor: Simplify auth context
test: Add tests for dashboard
docs: Update component documentation
```

## 16. Best Practices Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] No `any` types (use `unknown` if needed)
- [ ] Props interfaces documented
- [ ] Components have display names
- [ ] Consistent naming conventions

### Performance
- [ ] Images optimized (Next Image)
- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] Memoization where appropriate
- [ ] Bundle size monitored

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA labels added
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG

### Responsive Design
- [ ] Mobile-first approach
- [ ] Tested on all breakpoints
- [ ] Touch targets 44x44px minimum
- [ ] No horizontal scroll
- [ ] Readable font sizes

### Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for flows
- [ ] E2E tests for critical paths
- [ ] Test coverage > 70%
- [ ] Tests pass in CI/CD

### Documentation
- [ ] Component props documented
- [ ] Complex logic commented
- [ ] README updated
- [ ] Storybook stories created
- [ ] API integration documented

---

**Note**: Arsitektur ini akan berkembang seiring kebutuhan project.
