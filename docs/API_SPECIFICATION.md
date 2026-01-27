# API Specification - [Nama Project]

**Version**: 1.0
**Date**: 27 Jan 2026
**Status**: Planning
**Base URL**: `http://localhost:3000/api` (Development)

## 1. Overview

### API Design Principles
- RESTful architecture
- JSON request/response format
- JWT authentication
- Consistent error handling
- Pagination for list endpoints
- Rate limiting enabled

### Common Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": {
    "field": "email",
    "issue": "Email already exists"
  }
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 2. Authentication Endpoints

### 2.1 Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-27T10:00:00Z"
  }
}
```

**Errors:**
- `400`: Validation error (missing fields, invalid email)
- `409`: Email already exists
- `500`: Server error


### 2.2 Login User
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

### 2.3 Get Current User
**GET** `/api/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-27T10:00:00Z",
    "updatedAt": "2026-01-27T10:00:00Z"
  }
}
```

**Errors:**
- `401`: Unauthorized (invalid/expired token)
- `404`: User not found
- `500`: Server error

### 2.4 Logout User
**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 2.5 Refresh Token
**POST** `/api/auth/refresh`

Refresh expired JWT token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

## 3. User Management Endpoints

### 3.1 List Users (Admin Only)
**GET** `/api/users`

Get list of all users with pagination.

**Query Parameters:**
```
page:    1 (default)
limit:   20 (default, max 100)
search:  "john" (optional)
role:    "user" | "admin" | "partner" (optional)
sortBy:  "createdAt" | "name" | "email" (default: createdAt)
order:   "asc" | "desc" (default: desc)
```

**Example:**
```
GET /api/users?page=1&limit=20&role=user&search=john
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-01-27T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `500`: Server error


### 3.2 Get User by ID
**GET** `/api/users/:id`

Get specific user details.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-27T10:00:00Z",
    "updatedAt": "2026-01-27T10:00:00Z"
  }
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Forbidden (can only view own profile unless admin)
- `404`: User not found
- `500`: Server error

### 3.3 Update User
**PUT** `/api/users/:id`

Update user information.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "clx123abc",
    "name": "John Updated",
    "email": "john.new@example.com",
    "role": "user",
    "updatedAt": "2026-01-27T11:00:00Z"
  }
}
```

**Errors:**
- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (can only update own profile unless admin)
- `404`: User not found
- `409`: Email already exists
- `500`: Server error

### 3.4 Delete User
**DELETE** `/api/users/:id`

Delete user account (soft delete).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Forbidden (admin only)
- `404`: User not found
- `500`: Server error

### 3.5 Get User Profile
**GET** `/api/users/me/profile`

Get authenticated user's full profile.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://...",
    "preferences": {
      "language": "en",
      "notifications": true
    },
    "createdAt": "2026-01-27T10:00:00Z"
  }
}
```

### 3.6 Update User Profile
**PUT** `/api/users/me/profile`

Update authenticated user's profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "avatar": "https://...",
  "preferences": {
    "language": "id",
    "notifications": false
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

## 4. [Feature] Endpoints

### 4.1 List Items
**GET** `/api/[feature]`

Get list of items with pagination and filters.

**Query Parameters:**
```
page:     1 (default)
limit:    20 (default)
search:   "keyword" (optional)
status:   "active" | "inactive" (optional)
sortBy:   "createdAt" | "title" (default: createdAt)
order:    "asc" | "desc" (default: desc)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "item123",
      "title": "Item Title",
      "description": "Item description",
      "status": "active",
      "userId": "clx123abc",
      "createdAt": "2026-01-27T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

**Errors:**
- `400`: Invalid query parameters
- `500`: Server error


### 4.2 Get Item by ID
**GET** `/api/[feature]/:id`

Get specific item details.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "item123",
    "title": "Item Title",
    "description": "Full description here",
    "status": "active",
    "userId": "clx123abc",
    "user": {
      "id": "clx123abc",
      "name": "John Doe"
    },
    "createdAt": "2026-01-27T10:00:00Z",
    "updatedAt": "2026-01-27T10:00:00Z"
  }
}
```

**Errors:**
- `404`: Item not found
- `500`: Server error

### 4.3 Create Item
**POST** `/api/[feature]`

Create new item (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Item",
  "description": "Item description",
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": "item456",
    "title": "New Item",
    "description": "Item description",
    "status": "active",
    "userId": "clx123abc",
    "createdAt": "2026-01-27T11:00:00Z"
  }
}
```

**Errors:**
- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error

### 4.4 Update Item
**PUT** `/api/[feature]/:id`

Update existing item (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "inactive"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": "item123",
    "title": "Updated Title",
    "description": "Updated description",
    "status": "inactive",
    "updatedAt": "2026-01-27T12:00:00Z"
  }
}
```

**Errors:**
- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (not owner or admin)
- `404`: Item not found
- `500`: Server error

### 4.5 Delete Item
**DELETE** `/api/[feature]/:id`

Delete item (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Forbidden (not owner or admin)
- `404`: Item not found
- `500`: Server error

## 5. Error Codes

### Authentication Errors
```
INVALID_CREDENTIALS:     Invalid email or password
TOKEN_EXPIRED:           JWT token has expired
TOKEN_INVALID:           JWT token is invalid
UNAUTHORIZED:            Authentication required
FORBIDDEN:               Insufficient permissions
```

### Validation Errors
```
VALIDATION_ERROR:        Input validation failed
MISSING_FIELD:           Required field missing
INVALID_EMAIL:           Email format invalid
INVALID_PASSWORD:        Password too weak
FIELD_TOO_SHORT:         Field below minimum length
FIELD_TOO_LONG:          Field exceeds maximum length
```

### Resource Errors
```
NOT_FOUND:               Resource not found
ALREADY_EXISTS:          Resource already exists
CONFLICT:                Resource conflict
```

### Server Errors
```
SERVER_ERROR:            Internal server error
DATABASE_ERROR:          Database operation failed
NETWORK_ERROR:           Network request failed
```

## 6. Rate Limiting

### Limits
```
Anonymous:      60 requests / 15 minutes
Authenticated:  100 requests / 15 minutes
Admin:          Unlimited
```

### Rate Limit Headers
```
X-RateLimit-Limit:      100
X-RateLimit-Remaining:  95
X-RateLimit-Reset:      1706356800
```

### Rate Limit Exceeded Response (429)
```json
{
  "success": false,
  "message": "Too many requests",
  "error": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

## 7. Pagination

### Query Parameters
```
page:   Page number (default: 1)
limit:  Items per page (default: 20, max: 100)
```

### Response Format
```json
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## 8. Filtering & Sorting

### Filter Parameters
```
status:    Filter by status
search:    Search in title/description
userId:    Filter by user
dateFrom:  Filter from date
dateTo:    Filter to date
```

### Sort Parameters
```
sortBy:  Field to sort by
order:   "asc" or "desc"
```

### Example
```
GET /api/items?status=active&search=keyword&sortBy=createdAt&order=desc
```

## 9. Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Protected Resource
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Item",
    "description": "Description here"
  }'
```

## 10. Postman Collection

Import this collection to Postman for easy API testing:

**Collection Structure:**
```
Project API
├── Auth
│   ├── Register
│   ├── Login
│   └── Get Me
├── Users
│   ├── List Users
│   ├── Get User
│   ├── Update User
│   └── Delete User
└── [Feature]
    ├── List Items
    ├── Get Item
    ├── Create Item
    ├── Update Item
    └── Delete Item
```

**Environment Variables:**
```
base_url:  http://localhost:3000/api
token:     {{token}} (auto-set after login)
```

---

**Note**: API ini akan terus berkembang seiring kebutuhan project.
