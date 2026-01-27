# Database Setup - [Nama Project]

## Technology Stack
- **Database**: SQLite (file-based, zero-config) / MySQL (production)
- **ORM**: Prisma v5.x
- **Location**: `./prisma/dev.db` (SQLite) atau MySQL Server

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (One Command)
```bash
npm run db:setup
```
This will:
- Generate Prisma Client
- Create database
- Run migrations
- Seed with mock data

### 3. Verify Database
```bash
npm run db:studio
```
Opens Prisma Studio at `http://localhost:5555`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with mock data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:setup` | Complete setup (generate + push + seed) |

## Database Schema

### Tables
1. **User** - User management (authentication & authorization)
2. **[Entity2]** - [Deskripsi entity]
3. **[Entity3]** - [Deskripsi entity]

### Relationships
```
User ──┬─< [Entity2]
       └─< [Entity3]
```

## Sample Data
Database seeded with:
- ✅ [X] Users (Admin, Regular Users)
- ✅ [X] [Entity2] items
- ✅ [X] [Entity3] items

## Environment Variables

Create `.env` file:
```env
# SQLite (Development)
DATABASE_URL="file:./dev.db"

# MySQL (Production) - Uncomment untuk production
# DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# JWT Secret
JWT_SECRET="your-secret-key-change-in-production"

# App URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## API Integration

All API endpoints in `/src/pages/api/*` connected to database:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### [Feature 1]
- `GET /api/[feature]` - List all items
- `GET /api/[feature]/[id]` - Get item detail
- `POST /api/[feature]` - Create new item
- `PUT /api/[feature]/[id]` - Update item
- `DELETE /api/[feature]/[id]` - Delete item

## Development Workflow

### Reset Database
```bash
rm prisma/dev.db
npm run db:setup
```

### Update Schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`
3. Regenerate client with `npm run db:generate`

### Add More Seed Data
Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

## Production Notes

For production deployment:
- Consider PostgreSQL/MySQL for better concurrency
- Current SQLite setup is perfect for demo/MVP
- Database file size: ~2-5MB with sample data
- Offline-capable (no network required for SQLite)

## Troubleshooting

### "prisma command not found"
```bash
npm install
```

### "Database locked" (SQLite)
Close Prisma Studio and restart dev server

### "Migration failed"
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### View Database File Directly (SQLite)
```bash
sqlite3 prisma/dev.db
.tables
.schema User
```

## Demo-Ready Checklist
- [ ] Database configured
- [ ] Schema migrated
- [ ] Sample data seeded
- [ ] API endpoints connected
- [ ] Prisma Studio accessible
- [ ] Authentication working
