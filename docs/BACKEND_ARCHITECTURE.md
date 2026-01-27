# Backend Architecture - [Nama Project]

**Version**: 1.0
**Date**: 27 Jan 2026
**Status**: Planning

## 1. Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────┐
│              Client (Browser)                   │
└────────────────┬────────────────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│         Next.js Application Server              │
│  ┌──────────────────────────────────────────┐  │
│  │         API Routes Layer                 │  │
│  │  /api/auth, /api/users, /api/[feature]  │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │      Business Logic Layer                │  │
│  │  (Services, Controllers, Validators)     │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │         Data Access Layer                │  │
│  │         (Prisma ORM)                     │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Database (SQLite/MySQL/PostgreSQL)      │
└─────────────────────────────────────────────────┘
```

### Architecture Layers

#### 1. API Routes Layer
- Entry point untuk semua HTTP requests
- Request validation
- Authentication & authorization
- Response formatting


#### 2. Business Logic Layer
- Core application logic
- Data transformation
- Business rules enforcement
- Service orchestration

#### 3. Data Access Layer
- Database queries via Prisma
- Data modeling
- Transaction management
- Query optimization

## 2. Technology Stack

### Core Technologies
```
Runtime:        Node.js v18+
Framework:      Next.js 14 (API Routes)
Language:       TypeScript 5.x
ORM:            Prisma 5.x
Database:       SQLite (Dev) / PostgreSQL (Prod)
Authentication: JWT (jsonwebtoken)
Validation:     Zod / Yup
```

### Additional Libraries
```
Password Hash:  bcryptjs
Date/Time:      date-fns
UUID:           @prisma/client (cuid)
Email:          nodemailer (optional)
File Upload:    multer (optional)
```

## 3. Database Design

### Database Strategy

#### Development
- **SQLite**: File-based, zero-config
- Location: `prisma/dev.db`
- Perfect untuk rapid development

#### Production
- **PostgreSQL**: Robust, scalable
- Hosted: Supabase, Railway, atau Neon
- Connection pooling enabled


### Schema Design Principles

1. **Normalization**: Minimize data redundancy
2. **Indexing**: Index foreign keys & frequently queried fields
3. **Timestamps**: All tables have createdAt & updatedAt
4. **Soft Deletes**: Use deletedAt instead of hard delete
5. **UUID/CUID**: Use CUID for primary keys

### Core Tables

#### Users Table
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          String    @default("user")
  emailVerified Boolean   @default(false)
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
}
```

#### Sessions Table (Optional)
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

## 4. API Design

### RESTful API Conventions

#### HTTP Methods
```
GET:    Retrieve resources
POST:   Create new resource
PUT:    Update entire resource
PATCH:  Partial update
DELETE: Remove resource
```


#### URL Structure
```
/api/[resource]           - Collection
/api/[resource]/[id]      - Single item
/api/[resource]/[id]/[sub] - Nested resource
```

#### Response Format
```typescript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### API Endpoints Structure

#### Authentication Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
POST   /api/auth/refresh       - Refresh token
POST   /api/auth/forgot        - Forgot password
POST   /api/auth/reset         - Reset password
```

#### User Management
```
GET    /api/users              - List users (admin)
GET    /api/users/:id          - Get user detail
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
GET    /api/users/me/profile   - Get own profile
PUT    /api/users/me/profile   - Update own profile
```


## 5. Authentication & Authorization

### JWT Strategy

#### Token Structure
```typescript
{
  "userId": "clx123abc",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

#### Token Storage
- **Client**: localStorage or httpOnly cookie
- **Server**: Verify on each protected request
- **Expiry**: 7 days (configurable)

### Authorization Levels

#### Role-Based Access Control (RBAC)
```
user:    Basic access
partner: Extended access + content management
admin:   Full access + user management
```

#### Permission Matrix
```
Resource    | User | Partner | Admin
------------|------|---------|-------
Read Public | ✓    | ✓       | ✓
Create Own  | ✓    | ✓       | ✓
Update Own  | ✓    | ✓       | ✓
Delete Own  | ✓    | ✓       | ✓
Read All    | ✗    | ✓       | ✓
Update All  | ✗    | ✗       | ✓
Delete All  | ✗    | ✗       | ✓
```

### Middleware Pattern

#### Auth Middleware
```typescript
// Verify JWT token
// Attach user to request
// Check permissions
```


## 6. Error Handling

### Error Types
```typescript
ValidationError:    400 Bad Request
UnauthorizedError:  401 Unauthorized
ForbiddenError:     403 Forbidden
NotFoundError:      404 Not Found
ConflictError:      409 Conflict
ServerError:        500 Internal Server Error
```

### Error Response Format
```typescript
{
  "success": false,
  "message": "User-friendly error message",
  "error": "ERROR_CODE",
  "details": {
    "field": "email",
    "issue": "Email already exists"
  }
}
```

## 7. Validation

### Input Validation Strategy
- Validate all user inputs
- Use Zod or Yup schemas
- Validate at API route level
- Return clear error messages

### Example Validation Schema
```typescript
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['user', 'partner', 'admin']).optional()
});
```

## 8. Security Best Practices

### Password Security
- Hash with bcrypt (10 rounds)
- Never store plain passwords
- Enforce strong password policy
- Rate limit login attempts


### API Security
- HTTPS only in production
- CORS configuration
- Rate limiting (express-rate-limit)
- Input sanitization
- SQL injection prevention (Prisma handles this)
- XSS prevention

### Environment Variables
- Never commit .env files
- Use strong JWT secrets
- Rotate secrets regularly
- Different secrets per environment

## 9. Performance Optimization

### Database Optimization
- Index frequently queried fields
- Use connection pooling
- Implement caching (Redis)
- Optimize N+1 queries
- Use database transactions

### API Optimization
- Implement pagination
- Use field selection (GraphQL-style)
- Compress responses (gzip)
- Cache static responses
- Use CDN for assets

### Query Optimization
```typescript
// Bad: N+1 query
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ 
    where: { userId: user.id } 
  });
}

// Good: Include relation
const users = await prisma.user.findMany({
  include: { posts: true }
});
```

## 10. Testing Strategy

### Test Pyramid
```
E2E Tests (10%)      - Full user flows
Integration (30%)    - API endpoints
Unit Tests (60%)     - Business logic
```


### Testing Tools
```
Unit:        Jest / Vitest
Integration: Supertest
E2E:         Playwright / Cypress
Mocking:     MSW (Mock Service Worker)
```

## 11. Logging & Monitoring

### Logging Strategy
```typescript
// Development: Console logs
console.log('User registered:', userId);

// Production: Structured logging
logger.info('User registered', {
  userId,
  email,
  timestamp: new Date()
});
```

### Monitoring Metrics
- API response times
- Error rates
- Database query performance
- Memory usage
- CPU usage

### Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: APM monitoring

## 12. Deployment Strategy

### Environment Setup
```
Development:  Local SQLite
Staging:      PostgreSQL (Supabase)
Production:   PostgreSQL (Supabase/Railway)
```

### CI/CD Pipeline
```
1. Code push to GitHub
2. Run tests
3. Build application
4. Deploy to Vercel
5. Run smoke tests
6. Notify team
```

### Environment Variables
```env
# Development
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret"

# Production
DATABASE_URL="postgresql://..."
JWT_SECRET="prod-secret-very-long"
```


## 13. File Structure

### Backend File Organization
```
src/
├── pages/api/
│   ├── auth/
│   │   ├── register.ts
│   │   ├── login.ts
│   │   └── me.ts
│   ├── users/
│   │   ├── index.ts
│   │   └── [id].ts
│   └── [feature]/
│       ├── index.ts
│       └── [id].ts
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Auth utilities
│   ├── validation.ts      # Validation schemas
│   └── errors.ts          # Error classes
├── services/
│   ├── userService.ts     # User business logic
│   └── [feature]Service.ts
├── middleware/
│   ├── auth.ts            # Auth middleware
│   ├── validation.ts      # Validation middleware
│   └── errorHandler.ts    # Error handler
└── types/
    ├── api.ts             # API types
    └── models.ts          # Model types
```

## 14. Development Workflow

### Setup Process
```bash
1. npm install
2. cp .env.example .env
3. npm run db:setup
4. npm run dev
```

### Development Cycle
```
1. Create/update Prisma schema
2. Run db:push
3. Create API route
4. Implement business logic
5. Add validation
6. Write tests
7. Test manually
8. Commit & push
```

## 15. Best Practices Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint configured
- [ ] Prettier for formatting
- [ ] Consistent naming conventions
- [ ] Code comments for complex logic


### Security
- [ ] All inputs validated
- [ ] Passwords hashed
- [ ] JWT secrets strong
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] SQL injection prevented
- [ ] XSS prevention

### Performance
- [ ] Database indexed
- [ ] Queries optimized
- [ ] Pagination implemented
- [ ] Caching strategy
- [ ] Response compression

### Testing
- [ ] Unit tests written
- [ ] Integration tests
- [ ] E2E critical paths
- [ ] Test coverage > 70%

### Documentation
- [ ] API endpoints documented
- [ ] Schema documented
- [ ] Setup guide complete
- [ ] Deployment guide
- [ ] Troubleshooting guide

---

**Note**: Arsitektur ini akan berkembang seiring kebutuhan project.
