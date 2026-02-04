# Gratitude App - Backend API

A RESTful API for managing gratitude entries with authentication support, built with Express.js, TypeScript, and PostgreSQL.

## Overview

This is the backend service for the Gratitude App, a fullstack application that helps users record and manage their daily gratitudes. The backend provides a complete CRUD API for gratitude entries and is being extended with user authentication capabilities.

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
├── index.ts                          # Express app setup with CORS and JSON middleware
├── controllers/
│   ├── gratitudeController.ts        # CRUD handlers for gratitudes (complete)
│   └── authController.ts             # Auth handlers (in progress)
├── routes/
│   ├── index.ts                      # Main router /api/v1 setup
│   ├── gratitudeRoutes.ts            # Gratitude CRUD routes
│   └── authRoutes.ts                 # Auth routes (skeleton)
├── services/
│   └── gratitudeServices.ts          # Prisma database operations
└── utils/
    ├── jwt.ts                        # JWT token generation
    └── passwords.ts                  # bcrypt password hashing

lib/
└── prisma.ts                         # Prisma client initialization

prisma/
├── schema.prisma                     # Database schema
└── migrations/                       # Database migrations
```

## Database Schema

### Gratitude Model

```prisma
model Gratitude {
  id         String   @id @default(uuid())
  title      String   @unique
  details    String
  tags       String[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("gratitudes")
}
```

## API Endpoints

### Gratitudes

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/v1/gratitudes` | Get all gratitudes | ✅ Complete |
| GET | `/api/v1/gratitudes/:id` | Get single gratitude by ID | ✅ Complete |
| POST | `/api/v1/gratitudes` | Create new gratitude | ✅ Complete |
| PATCH | `/api/v1/gratitudes/:id` | Update gratitude | ✅ Complete |
| DELETE | `/api/v1/gratitudes/:id` | Delete gratitude | ✅ Complete |

### Authentication

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | ⚠️ In Progress |
| POST | `/api/v1/auth/login` | User login | ❌ Not Started |

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

### Create a Gratitude

```bash
curl -X POST http://localhost:3000/api/v1/gratitudes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful sunrise",
    "details": "Watched an amazing sunrise this morning",
    "tags": ["nature", "morning", "peace"]
  }'
```

### Get All Gratitudes

```bash
curl http://localhost:3000/api/v1/gratitudes
```

### Update a Gratitude

```bash
curl -X PATCH http://localhost:3000/api/v1/gratitudes/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "details": "Updated details"
  }'
```

### Delete a Gratitude

```bash
curl -X DELETE http://localhost:3000/api/v1/gratitudes/{id}
```

## Current Implementation Status

### ✅ Completed Features

- Complete CRUD operations for gratitudes
- Express middleware setup (CORS, JSON parsing)
- Prisma ORM integration with PostgreSQL
- TypeScript configuration with strict mode
- Database migrations for gratitudes table
- JWT token generation utility
- Password hashing utility
- Tag array support for gratitudes

### ⚠️ In Progress

- Authentication system:
  - Register endpoint skeleton created (`src/controllers/authController.ts`)
  - Auth routes defined but not integrated into main router (`src/routes/index.ts:7`)
  - JWT and password utilities ready for use

### ❌ Pending

- Complete user registration endpoint
- User login endpoint
- JWT authentication middleware
- User model in Prisma schema
- Protected routes requiring authentication
- Token refresh mechanism
- User-gratitude relationship (associate gratitudes with users)

## Known Issues

1. **Auth routes not wired:** Line 7 in `src/routes/index.ts` is missing the `authRouter` parameter
2. **Incomplete register function:** `src/controllers/authController.ts` has skeleton code
3. **Missing HTTP status codes:** Controllers should return appropriate status codes
4. **Untyped parameters:** Some service functions have `any` type parameters
5. **No request validation:** Need to add input validation middleware
6. **No error handling middleware:** Global error handler needed

## Integration with Frontend

The backend is designed to work with the React frontend located at:
`/Users/gusanche/fsdev/fullstack/gratitude-frontend-app`

### CORS Configuration

CORS is enabled for all origins (development mode). Configure appropriately for production.

### Expected Frontend Connection

```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

## Development Roadmap

### Phase 1: Complete Authentication (Current)
- [ ] Wire up auth routes to main router
- [ ] Complete user registration endpoint
- [ ] Add User model to Prisma schema
- [ ] Implement login endpoint
- [ ] Create authentication middleware

### Phase 2: Secure Gratitudes
- [ ] Add user-gratitude relationship
- [ ] Protect gratitude routes with auth middleware
- [ ] Filter gratitudes by authenticated user
- [ ] Add user context to controllers

### Phase 3: Enhancements
- [ ] Add request validation (express-validator or zod)
- [ ] Implement refresh token rotation
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Implement rate limiting
- [ ] Add comprehensive error handling
- [ ] Add request logging

### Phase 4: Testing & Quality
- [ ] Write unit tests for services
- [ ] Write integration tests for routes
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline
- [ ] Add code coverage reporting

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
a089a0f Add CRUD services for gratitude
38d2f6a Add CRUD controller for gratitudes
e7cf7bb Add CRUD routes for gratitudes
4d7f8b6 Add cors and express.json middlewares
095abae Initial setup of app and router
```

## License

Private project - All rights reserved

---

**Last Updated:** 2026-02-03
**Status:** Active Development
**Version:** 0.1.0 (Pre-release)
