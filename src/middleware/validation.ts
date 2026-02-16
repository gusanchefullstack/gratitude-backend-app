import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../utils/errors.js";

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          "Validation failed",
          error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }))
        );
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          "Invalid parameters",
          error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }))
        );
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          "Invalid query parameters",
          error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }))
        );
      }
      next(error);
    }
  };
};
