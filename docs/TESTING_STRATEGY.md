# Testing Strategy - [Nama Project]

**Version**: 1.0
**Date**: 27 Jan 2026
**Status**: Planning

## 1. Overview

### Testing Philosophy
- **Test Pyramid**: 60% Unit, 30% Integration, 10% E2E
- **Test-Driven Development**: Write tests before implementation (when possible)
- **Continuous Testing**: Tests run on every commit
- **Coverage Target**: Minimum 70% code coverage
- **Quality over Quantity**: Focus on meaningful tests

### Testing Goals
1. Catch bugs early in development
2. Ensure code quality and maintainability
3. Enable confident refactoring
4. Document expected behavior
5. Prevent regressions

## 2. Testing Stack

### Frontend Testing
```
Unit Tests:        Jest / Vitest
Component Tests:   React Testing Library
E2E Tests:         Playwright / Cypress
Visual Tests:      Storybook (optional)
Coverage:          Istanbul / c8
```

### Backend Testing
```
Unit Tests:        Jest / Vitest
Integration Tests: Supertest
API Tests:         Postman / Newman
Database Tests:    In-memory SQLite
Mocking:           Jest mocks / MSW
```

### Additional Tools
```
Linting:          ESLint
Type Checking:    TypeScript
Formatting:       Prettier
Pre-commit:       Husky + lint-staged
CI/CD:            GitHub Actions
```

## 3. Unit Testing

### What to Test
- Pure functions
- Utility functions
- Business logic
- Data transformations
- Validation functions
- Helper functions

### Unit Test Structure
```typescript
describe('Component/Function Name', () => {
  // Setup
  beforeEach(() => {
    // Reset state, mocks, etc.
  });

  // Test cases
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });

  it('should handle edge case', () => {
    // Test edge cases
  });

  it('should throw error for invalid input', () => {
    // Test error cases
  });
});
```

### Example: Utility Function Test
```typescript
// src/lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}

// src/lib/utils.test.ts
describe('formatCurrency', () => {
  it('should format number as IDR currency', () => {
    expect(formatCurrency(1000000)).toBe('Rp1.000.000,00');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('Rp0,00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-5000)).toBe('-Rp5.000,00');
  });

  it('should handle decimal numbers', () => {
    expect(formatCurrency(1234.56)).toBe('Rp1.234,56');
  });
});
```

## 4. Component Testing

### What to Test
- Component renders correctly
- Props are handled properly
- User interactions work
- State changes correctly
- Conditional rendering
- Error states

### Component Test Structure
```typescript
import { render, screen, fireEvent } from '@testing/library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### Testing User Interactions
```typescript
describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    // Submit
    fireEvent.click(screen.getByText('Login'));

    // Wait for async operations
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows validation errors', async () => {
    render(<LoginForm />);

    // Submit without filling
    fireEvent.click(screen.getByText('Login'));

    // Check errors
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });
});
```

## 5. Integration Testing

### What to Test
- API endpoints
- Database operations
- Authentication flow
- Complete user flows
- Component interactions

### API Integration Test
```typescript
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.user.deleteMany();
  });

  it('registers new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('returns error for duplicate email', async () => {
    // Create user first
    await prisma.user.create({
      data: {
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashed'
      }
    });

    // Try to register with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('already exists');
  });

  it('validates required fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com'
        // Missing name and password
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

### Protected Route Test
```typescript
describe('GET /api/users/me', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    // Create user and get token
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed'
      }
    });
    userId = user.id;
    token = generateToken({ userId: user.id, email: user.email, role: 'user' });
  });

  it('returns user data with valid token', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(userId);
  });

  it('returns 401 without token', async () => {
    const response = await request(app)
      .get('/api/users/me');

    expect(response.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });
});
```

## 6. End-to-End Testing

### What to Test
- Critical user journeys
- Complete workflows
- Cross-page interactions
- Real browser behavior
- Authentication flows

### E2E Test Structure (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('complete registration process', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');

    // Fill registration form
    await page.fill('[name="name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="confirmPassword"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify welcome message
    await expect(page.locator('text=Welcome, John Doe')).toBeVisible();
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/register');

    // Submit without filling
    await page.click('button[type="submit"]');

    // Check error messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });
});

test.describe('Login and Dashboard', () => {
  test('login and view dashboard', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Check stats are visible
    await expect(page.locator('[data-testid="stat-card"]')).toHaveCount(4);
  });

  test('logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Verify redirect to login
    await expect(page).toHaveURL('/login');
  });
});
```

## 7. Test Data Management

### Test Database
```typescript
// Use in-memory SQLite for tests
const testDatabaseUrl = 'file::memory:?cache=shared';

// Setup before tests
beforeAll(async () => {
  process.env.DATABASE_URL = testDatabaseUrl;
  await prisma.$connect();
  await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
});

// Clean between tests
beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.item.deleteMany();
});

// Cleanup after tests
afterAll(async () => {
  await prisma.$disconnect();
});
```

### Test Fixtures
```typescript
// test/fixtures/users.ts
export const testUsers = {
  admin: {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  regular: {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
};

// Usage in tests
import { testUsers } from './fixtures/users';

it('creates admin user', async () => {
  const user = await createUser(testUsers.admin);
  expect(user.role).toBe('admin');
});
```

### Mock Data Generators
```typescript
// test/factories/userFactory.ts
export function createMockUser(overrides = {}) {
  return {
    id: 'user-' + Math.random(),
    name: 'Test User',
    email: `test${Math.random()}@example.com`,
    role: 'user',
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

// Usage
const user1 = createMockUser();
const admin = createMockUser({ role: 'admin' });
```

## 8. Mocking Strategies

### API Mocking (MSW)
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Function Mocking
```typescript
// Mock external service
jest.mock('../lib/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));

// Use in test
import { sendEmail } from '../lib/emailService';

it('sends welcome email', async () => {
  await registerUser(userData);
  expect(sendEmail).toHaveBeenCalledWith({
    to: userData.email,
    subject: 'Welcome'
  });
});
```

## 9. Coverage Requirements

### Coverage Targets
```
Statements:   70%
Branches:     70%
Functions:    70%
Lines:        70%
```

### Critical Paths (100% Coverage)
- Authentication logic
- Payment processing
- Data validation
- Security functions
- Core business logic

### Excluded from Coverage
- Configuration files
- Type definitions
- Test files
- Mock data
- Third-party integrations

## 10. CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 11. Testing Best Practices

### DO's
✅ Write descriptive test names
✅ Test one thing per test
✅ Use AAA pattern (Arrange, Act, Assert)
✅ Test edge cases and errors
✅ Keep tests independent
✅ Use meaningful assertions
✅ Mock external dependencies
✅ Clean up after tests

### DON'Ts
❌ Test implementation details
❌ Write flaky tests
❌ Skip error cases
❌ Use random data without seed
❌ Test third-party libraries
❌ Ignore failing tests
❌ Over-mock everything
❌ Write tests that depend on order

## 12. Testing Checklist

### Before Writing Tests
- [ ] Understand requirements
- [ ] Identify test cases
- [ ] Plan test data
- [ ] Set up test environment

### Writing Tests
- [ ] Write failing test first (TDD)
- [ ] Implement minimum code to pass
- [ ] Refactor code
- [ ] Add edge cases
- [ ] Test error scenarios

### After Writing Tests
- [ ] All tests pass
- [ ] Coverage meets target
- [ ] Tests are readable
- [ ] No flaky tests
- [ ] CI/CD passes
- [ ] Code reviewed

---

**Note**: Testing strategy akan di-update seiring development project.
