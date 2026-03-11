# Gratitude App Backend API

Backend service for the Gratitude App. It provides authentication, user profile management, gratitude CRUD, dashboard summary metrics, and mantra-of-the-day content.

## Stack

- Node.js + Express 5
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod validation
- JWT (access + refresh)
- bcrypt password hashing
- Vitest + Supertest tests

## Codebase Analysis

## Architecture

The backend follows a layered structure:

- `routes` define endpoint paths and middleware chains.
- `controllers` handle request/response orchestration.
- `services` implement business logic and DB operations.
- `schemas` define request contracts using Zod.
- `middleware` centralizes auth, validation, rate limiting, observability, and error handling.
- `utils` includes JWT, password, and custom error helpers.

Flow pattern:

1. Route receives request
2. Validation middleware parses and sanitizes input
3. Auth middleware injects user context on protected routes
4. Controller delegates to service
5. Service performs Prisma operations
6. Global error handler formats consistent JSON errors

## Security and Reliability Highlights

- Access token + refresh token flow with session persistence in `refresh_sessions`
- Logout and refresh-session revocation support
- Auth endpoints have stricter rate limits than global API routes
- Environment-aware CORS allowlist (`FRONTEND_ORIGINS`)
- Helmet security headers
- Request ID + request logging for tracing
- Global error mapping for Zod/Prisma/JWT errors
- Transactional registration to avoid partial user creation

## Validation Rules Highlights

User payload validation:

- `username`: 3-20 chars, trimmed/lowercased, alphanumeric + underscore
- `email`: trimmed, valid email format, lowercased
- `password`: 8-50 chars, must include uppercase, lowercase, number, special char
- `firstName` and `lastName`: required, trimmed, max 50 chars

Gratitude payload validation:

- `title`: 3-70 chars
- `details`: 10-140 chars
- `tags`: max 5 tags, each tag 3-15 chars

## Data Model

Defined in `prisma/schema.prisma`:

- `User` -> mapped to table `users`
- `Gratitude` -> mapped to table `gratitudes`
- `RefreshSession` -> mapped to table `refresh_sessions`

Notes:

- `Gratitude.title` is currently globally unique (not per-user).
- Refresh sessions are hashed in DB (`tokenHash`) and can be revoked.

## Project Structure

```text
src/
  config/
  controllers/
  middleware/
  routes/
  schemas/
  services/
  utils/
prisma/
  schema.prisma
  migrations/
tests/
  integration/
  services/
```

## API Base URL

- `/api/v1`

## Health Endpoint

- `GET /health`

Returns service status, uptime, and timestamp.

## Available Endpoints

## Auth (Public)

- `POST /api/v1/auth/register`
  - Body: `username`, `email`, `password`, `firstName`, `lastName`
  - Returns: `user`, `token`, `refreshToken`
- `POST /api/v1/auth/login`
  - Body: `username`, `password`
  - Returns: `user`, `token`, `refreshToken`
- `POST /api/v1/auth/refresh`
  - Body: `refreshToken`
  - Rotates refresh session and returns new token pair
- `POST /api/v1/auth/logout`
  - Body: `refreshToken`
  - Revokes active refresh session

## Gratitudes (Protected)

Require `Authorization: Bearer <access_token>`.

- `GET /api/v1/gratitudes`
  - Query:
    - `page` (default `1`)
    - `limit` (default `10`, max `100`)
    - `search` (title/details/tags)
    - `tag`
    - `sortBy` (`createdAt`, `updatedAt`, `title`)
    - `order` (`asc`, `desc`)
- `GET /api/v1/gratitudes/:id`
- `POST /api/v1/gratitudes`
  - Body: `title`, `details`, `tags`
- `PATCH /api/v1/gratitudes/:id`
  - Body: partial `title`, `details`, `tags`
- `DELETE /api/v1/gratitudes/:id`

## Users (Protected)

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
  - Body: any of `username`, `email`, `firstName`, `lastName`
- `PATCH /api/v1/users/me/password`
  - Body: `currentPassword`, `newPassword`

## Dashboard (Protected)

- `GET /api/v1/dashboard/summary`
  - Returns:
    - `totalGratitudes`
    - `currentStreak`
    - `topTags`
    - `recentGratitudes`

## Mantra (Public)

- `GET /api/v1/mantraoftheday`
  - Returns daily deterministic mantra payload

## Error Format

All API errors are normalized:

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    { "field": "email", "message": "Must be a valid email" }
  ],
  "requestId": "uuid",
  "stack": "development only"
}
```

## Environment Variables

Core variables:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET` (optional; falls back to `JWT_SECRET`)
- `JWT_ACCESS_EXPIRES_IN` (default `1d`)
- `JWT_REFRESH_EXPIRES_IN` (default `7d`)
- `BCRYPT_ROUNDS`
- `FRONTEND_ORIGINS` (comma-separated allowlist for production CORS)

## Local Development

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

## Build and Test

```bash
npm run build
npm test
```

## Operational Notes

- If you get Prisma `P2021`, run migrations against the same DB URL used at runtime.
- Registration is transactional: user creation and refresh-session creation succeed or fail together.

