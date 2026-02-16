import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "../utils/errors.js";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let finalError: AppError;

  // Handle custom AppError instances
  if (error instanceof AppError) {
    finalError = error;
  }
  // Handle Zod validation errors
  else if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    finalError = new ValidationError("Validation failed", details);
  }
  // Handle Prisma errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    finalError = handlePrismaError(error);
  }
  // Handle JWT errors from jose library
  else if (error.name === "JWTExpired" || error.message.includes("expired")) {
    finalError = new AuthenticationError("Token has expired");
  } else if (
    error.name === "JWSSignatureVerificationFailed" ||
    error.name === "JWSInvalid" ||
    error.name === "JWTInvalid" ||
    error.message.includes("signature")
  ) {
    finalError = new AuthenticationError("Invalid authentication token");
  }
  // Handle generic errors
  else {
    finalError = new AppError(
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
      500,
      "INTERNAL_ERROR"
    );
  }

  // Log errors based on severity
  const isClientError = finalError.statusCode < 500;
  if (isClientError) {
    console.warn(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${finalError.statusCode}: ${finalError.message}`
    );
  } else {
    console.error(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${finalError.statusCode}: ${finalError.message}`
    );
    console.error(error.stack);
  }

  // Build error response
  const errorResponse: {
    error: string;
    code?: string;
    details?: Array<{ field: string; message: string }>;
    stack?: string;
  } = {
    error: finalError.message,
  };

  // Add optional fields if present
  if (finalError.code) {
    errorResponse.code = finalError.code;
  }
  if (finalError.details) {
    errorResponse.details = finalError.details;
  }
  // Include stack trace only in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = error.stack;
  }

  // Send error response
  res.status(finalError.statusCode).json(errorResponse);
};

/**
 * Transform Prisma errors into appropriate custom errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    // Unique constraint violation
    case "P2002": {
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] || "field";
      return new ConflictError(`${field} already exists`);
    }

    // Record not found
    case "P2025": {
      return new NotFoundError("Record not found");
    }

    // Foreign key constraint failed
    case "P2003": {
      const field = error.meta?.field_name as string | undefined;
      return new ValidationError(
        field ? `Invalid reference for ${field}` : "Invalid reference"
      );
    }

    // Required relation violation
    case "P2014": {
      return new ValidationError("Missing required relation");
    }

    // Missing required field
    case "P2012": {
      return new ValidationError("Missing required field");
    }

    // Default: generic database error
    default: {
      return new DatabaseError(
        process.env.NODE_ENV === "production"
          ? "Database operation failed"
          : error.message,
        error.code
      );
    }
  }
}
