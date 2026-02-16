# Gratitude App - Backend API

A RESTful API for managing gratitude entries with full JWT authentication, built with Express.js, TypeScript, and PostgreSQL.

## Overview

This is the backend service for the Gratitude App, a fullstack application that helps users record and manage their daily gratitudes. The backend provides a complete CRUD API for gratitude entries with user authentication, authorization, and data isolation.

## Tech Stack

- **Runtime:** Node.js v22
- **Language:** TypeScript 5.9.3
- **Framework:** Express.js 5.2.1
- **Database:** PostgreSQL
- **ORM:** Prisma 7.2.0 with @prisma/adapter-pg
- **Authentication:** JWT (jose library v6.1.3) + bcrypt for password hashing
- **Dev Tools:** tsx (watch mode), TypeScript compiler

## Project Structure

```
src/
├── index.ts                          # Express app entry point
├── controllers/
│   ├── gratitudeController.ts        # CRUD handlers for gratitudes ✅
│   └── authController.ts             # Authentication handlers ✅
├── routes/
│   ├── index.ts                      # Main router /api/v1 setup
│   ├── gratitudeRoutes.ts            # Gratitude CRUD routes (protected)
│   └── authRoutes.ts                 # Auth routes (register/login)
├── services/
│   ├── gratitudeServices.ts          # Prisma database operations
│   └── authServices.ts               # User registration & login logic
├── middleware/
│   ├── auth.ts                       # JWT authentication middleware
│   ├── validation.ts                 # Zod schema validation middleware
│   └── errorHandler.ts               # Error handling middleware
├── schemas/
│   ├── gratitude.schema.ts           # Gratitude validation schemas
│   ├── user.schema.ts                # User validation schemas
│   └── common.schema.ts              # Shared schemas (UUID, password)
└── utils/
    ├── jwt.ts                        # JWT token generation & verification
    ├── passwords.ts                  # bcrypt password hashing
    └── errors.ts                     # Custom error classes ✅

lib/
└── prisma.ts                         # Prisma client initialization

prisma/
├── schema.prisma                     # Database schema
└── migrations/                       # Database migrations
```

## Database Schema

### User Model

```prisma
model User {
  id         String      @id @default(uuid())
  username   String      @unique
  password   String      # Hashed with bcrypt
  firstName  String
  lastName   String
  email      String      @unique
  gratitudes Gratitude[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@map("users")
}
```

### Gratitude Model

```prisma
model Gratitude {
  id        String   @id @default(uuid())
  title     String   @unique
  details   String
  tags      String[]
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("gratitudes")
}
```

**Relationship**: One User can have many Gratitudes. Each Gratitude belongs to one User.

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | User login | No |

### Gratitudes (Protected 🔒)

All gratitude endpoints require JWT authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/gratitudes` | Get all user's gratitudes | Yes 🔒 |
| GET | `/api/v1/gratitudes/:id` | Get single gratitude by ID | Yes 🔒 |
| POST | `/api/v1/gratitudes` | Create new gratitude | Yes 🔒 |
| PATCH | `/api/v1/gratitudes/:id` | Update gratitude | Yes 🔒 |
| DELETE | `/api/v1/gratitudes/:id` | Delete gratitude | Yes 🔒 |

**Note**: All gratitude operations are user-scoped. Users can only access, create, update, and delete their own gratitudes.

## Setup Instructions

### Prerequisites

- Node.js v22 (use nvm: `nvm use`)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd gratitude-backend-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env`:
   ```
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/gratitude_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "message": "User created",
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "message": "Login success",
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create a Gratitude (Protected)

```bash
curl -X POST http://localhost:3000/api/v1/gratitudes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful sunrise",
    "details": "Watched an amazing sunrise this morning",
    "tags": ["nature", "morning", "peace"]
  }'
```

### Get All Gratitudes (Protected)

```bash
curl http://localhost:3000/api/v1/gratitudes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Gratitude (Protected)

```bash
curl -X PATCH http://localhost:3000/api/v1/gratitudes/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated title",
    "details": "Updated details"
  }'
```

### Delete a Gratitude (Protected)

```bash
curl -X DELETE http://localhost:3000/api/v1/gratitudes/{id} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The API implements comprehensive error handling with consistent JSON responses and appropriate HTTP status codes.

### Error Response Format

All errors follow this standardized format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Validation errors, invalid input data |
| 401 | Unauthorized | Missing, invalid, or expired authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Requested resource doesn't exist |
| 409 | Conflict | Duplicate resource (username, email, etc.) |
| 500 | Internal Server Error | Unexpected server errors |

### Error Examples

#### Validation Error (400)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "ab", "email": "invalid", "password": "weak"}'
```

**Response:**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "username",
      "message": "String must contain at least 3 character(s)"
    },
    {
      "field": "email",
      "message": "Invalid email"
    },
    {
      "field": "password",
      "message": "It must contain at least one capital letter"
    }
  ]
}
```

#### Authentication Error (401)

```bash
# Missing token
curl http://localhost:3000/api/v1/gratitudes
```

**Response:**
```json
{
  "error": "Authentication token required",
  "code": "AUTHENTICATION_ERROR"
}
```

```bash
# Expired token
curl http://localhost:3000/api/v1/gratitudes \
  -H "Authorization: Bearer <expired_token>"
```

**Response:**
```json
{
  "error": "Token has expired",
  "code": "AUTHENTICATION_ERROR"
}
```

```bash
# Invalid credentials
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wrong", "password": "wrong"}'
```

**Response:**
```json
{
  "error": "Invalid username or password",
  "code": "AUTHENTICATION_ERROR"
}
```

#### Conflict Error (409)

```bash
# Duplicate username
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "existing_user",
    "email": "newemail@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "error": "username already exists",
  "code": "CONFLICT_ERROR"
}
```

#### Not Found Error (404)

```bash
curl -X GET http://localhost:3000/api/v1/gratitudes/non-existent-uuid \
  -H "Authorization: Bearer <valid_token>"
```

**Response:**
```json
{
  "error": "Gratitude not found",
  "code": "NOT_FOUND_ERROR"
}
```

### Error Handling Architecture

The error handling system uses a **centralized global error handler** with custom error classes:

**Custom Error Classes:**
- `AppError` - Base class for all operational errors
- `ValidationError` (400) - Zod validation failures
- `AuthenticationError` (401) - Missing/invalid/expired tokens, invalid credentials
- `AuthorizationError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Unique constraint violations
- `DatabaseError` (500) - Database operation failures

**Error Flow:**
1. Middleware/Controller/Service throws custom error or native error
2. Global error handler catches all errors
3. Transforms native errors (Zod, Prisma, JWT) into custom errors
4. Formats consistent JSON response
5. Logs error with appropriate severity level
6. Returns response with correct HTTP status code

**Prisma Error Transformation:**
- `P2002` (Unique constraint) → 409 ConflictError with field name
- `P2025` (Record not found) → 404 NotFoundError
- `P2003` (Foreign key failed) → 400 ValidationError
- `P2014` (Required relation) → 400 ValidationError
- Other Prisma errors → 500 DatabaseError

**Environment-Specific Behavior:**
- **Development**: Detailed error messages, stack traces included
- **Production**: Generic error messages for 500 errors, no stack traces

## Current Implementation Status

### ✅ Completed Features

- **Authentication & Authorization**:
  - User registration with password hashing (bcrypt, 10 salt rounds)
  - User login with JWT token generation (1-day expiration)
  - JWT authentication middleware (`authenticateToken`)
  - Protected routes with Bearer token verification
  - User model in Prisma schema with relationships

- **CRUD Operations**:
  - Complete gratitude CRUD operations
  - User-scoped data access (users can only access their own gratitudes)
  - User-gratitude relationship enforced at database level

- **Validation**:
  - Zod schemas for request validation
  - Validation middleware for body, params, and query
  - Strong password requirements (8-50 chars, uppercase, lowercase, number, special char)
  - Username validation (3-20 chars, alphanumeric + underscore)
  - Email validation

- **Infrastructure**:
  - Express middleware setup (CORS, JSON parsing)
  - Prisma ORM integration with PostgreSQL
  - TypeScript configuration with strict mode
  - Database migrations for users and gratitudes
  - Tag array support for gratitudes

- **Error Handling**:
  - Comprehensive global error handler middleware
  - Custom error classes (ValidationError, AuthenticationError, NotFoundError, ConflictError, etc.)
  - Automatic Zod validation error transformation
  - Prisma error detection and user-friendly messages
  - JWT error handling (expired, invalid, missing tokens)
  - Environment-aware error responses (stack traces in development only)
  - Consistent JSON error format across all endpoints
  - Appropriate HTTP status codes (400, 401, 403, 404, 409, 500)

### ⚠️ Known Limitations

1. **No Token Refresh**: JWT tokens expire after 1 day with no refresh mechanism
2. **CORS Wide Open**: Currently allows all origins (development mode only)
3. **No Rate Limiting**: API endpoints are not rate-limited
4. **No Request Logging**: Missing request/response logging middleware
5. **No Password Reset**: Missing password reset functionality
6. **No Email Verification**: Users can register without email verification
7. **Gratitude Title Uniqueness**: Title field has global unique constraint (should be per-user)

### 🔮 Future Enhancements

- Token refresh mechanism
- Password reset functionality
- Email verification
- Rate limiting
- Structured request logging (Morgan or Winston)
- API documentation (Swagger/OpenAPI)
- Unit and integration tests
- CI/CD pipeline
- Environment-based CORS configuration
- Error monitoring service integration (Sentry, Rollbar)

## Security Features

### Authentication & Authorization
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: HS256 algorithm with 1-day expiration
- **Protected Routes**: All gratitude endpoints require valid JWT
- **User Data Isolation**: Users can only access their own data

### Validation
- **Input Validation**: Zod schemas validate all request data
- **Password Requirements**:
  - Minimum 8 characters, maximum 50
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Username Rules**: 3-20 characters, alphanumeric + underscore only
- **Email Validation**: Proper email format required

### Error Handling
- **Centralized Error Handler**: All errors flow through global middleware
- **Type-Safe Error Classes**: Custom error hierarchy with proper HTTP status codes
- **Secure Error Messages**: Generic messages in production, detailed in development
- **No Sensitive Data Leaks**: Stack traces and internal details hidden in production
- **Consistent Error Format**: Standardized JSON responses for all error types

### Best Practices
- Passwords never stored in plain text
- JWT secrets stored in environment variables
- User IDs embedded in tokens (no user lookup on every request)
- Unique constraints on username and email
- TypeScript for type safety
- Environment-aware error responses
- Proper HTTP status code usage

## Integration with Frontend

The backend is designed to work with the React frontend located at:
`/Users/gusanche/fsdev/fullstack/gratitude-frontend-app`

### Frontend Tech Stack
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 4.1.18
- **Icons**: React Icons + Font Awesome

### CORS Configuration

CORS is enabled for all origins (development mode). Configure appropriately for production:

```javascript
// For production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com'
}));
```

### Frontend Integration Guide

**1. API Base URL**
```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

**2. Authentication Flow**
```javascript
// Register
const response = await fetch(`${API_BASE_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email, password, firstName, lastName })
});
const { token, user } = await response.json();
localStorage.setItem('token', token);

// Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { token, user } = await response.json();
localStorage.setItem('token', token);
```

**3. Protected API Calls**
```javascript
const token = localStorage.getItem('token');
const response = await fetch(`${API_BASE_URL}/gratitudes`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**4. Frontend TODO**
- [ ] Create Login/Register pages
- [ ] Implement token storage (localStorage/sessionStorage)
- [ ] Create authentication context
- [ ] Add Authorization header to all API calls
- [ ] Handle token expiration (401/403 responses)
- [ ] Implement logout functionality
- [ ] Wire up edit/delete buttons on gratitude cards

## Development Roadmap

### ✅ Phase 1: Complete Authentication
- [x] Wire up auth routes to main router
- [x] Complete user registration endpoint
- [x] Add User model to Prisma schema
- [x] Implement login endpoint
- [x] Create authentication middleware
- [x] Add request validation with Zod

### ✅ Phase 2: Secure Gratitudes
- [x] Add user-gratitude relationship
- [x] Protect gratitude routes with auth middleware
- [x] Filter gratitudes by authenticated user
- [x] Add user context to controllers

### ✅ Phase 3: Error Handling
- [x] Create custom error classes hierarchy
- [x] Implement global error handler middleware
- [x] Transform Zod validation errors
- [x] Transform Prisma database errors
- [x] Handle JWT authentication errors
- [x] Consistent error response format
- [x] Environment-aware error responses

### 🚧 Phase 4: Frontend Integration (Current)
- [ ] Build Login/Register UI in frontend
- [ ] Implement token management in frontend
- [ ] Wire up frontend authentication context
- [ ] Connect frontend CRUD operations to backend
- [ ] Handle authentication errors gracefully in UI
- [ ] Display validation errors on forms

### 📋 Phase 5: Production Readiness
- [ ] Implement refresh token rotation
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request logging (Morgan/Winston)
- [ ] Environment-based CORS configuration
- [ ] Add health check endpoint
- [ ] Set up database connection pooling

### 🧪 Phase 6: Testing & Quality
- [ ] Write unit tests for services (Jest/Vitest)
- [ ] Write integration tests for routes (Supertest)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add code coverage reporting
- [ ] Add database seeding scripts
- [ ] Performance testing and optimization

## Scripts

```json
{
  "dev": "tsx --watch --env-file .env src/index.ts",
  "start": "node --env-file .env dist/index.js",
  "build": "tsc",
  "test": "echo 'Error: no test specified' && exit 1"
}
```

## Contributing

This is a personal project. For changes:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Update this README if needed

## Recent Git History

```
6f0cc6b Add authentication and authorization to CRUD routes
5c3c309 Add schema validation for user and gratitude routes
76b7f70 Add route for register user and create user model in prisma
39d236e Add preliminary README.md, begin implementation of jwt authentication
a089a0f Add CRUD services for gratitude
```

## License

Private project - All rights reserved

---

**Last Updated:** 2026-02-16
**Status:** Backend Complete with Error Handling - Frontend Integration in Progress
**Version:** 1.1.0 (Error Handling Complete)
