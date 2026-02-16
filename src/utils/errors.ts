// Custom error classes for centralized error handling

interface ValidationDetail {
  field: string;
  message: string;
}

/**
 * Base class for all operational application errors
 * Extends Error to preserve stack trace and error properties
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: ValidationDetail[];
  public readonly isOperational: boolean = true;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: ValidationDetail[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where error was thrown (V8 engines only)
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error (400 Bad Request)
 * Used for request validation failures (e.g., Zod schema validation)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: ValidationDetail[]) {
    super(message, 400, "VALIDATION_ERROR", details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error (401 Unauthorized)
 * Used for missing, invalid, or expired authentication credentials
 */
export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, "AUTHENTICATION_ERROR");
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error (403 Forbidden)
 * Used when user is authenticated but lacks required permissions
 */
export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403, "AUTHORIZATION_ERROR");
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not Found Error (404 Not Found)
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND_ERROR");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict Error (409 Conflict)
 * Used for unique constraint violations and conflicting state
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT_ERROR");
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Database Error (500 Internal Server Error)
 * Used for database operation failures that aren't client errors
 */
export class DatabaseError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 500, code || "DATABASE_ERROR");
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
