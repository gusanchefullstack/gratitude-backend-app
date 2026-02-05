import { z } from "zod";

export const uuidSchema = z.uuid({ error: "Must be a valid uuid" });
export const dateSchema = z.iso.datetime({ error: "Must be a valid ISO date" });
export const passwordSchema = z
  .string()
  .min(8, { error: "The password must be at least 8 characters long" })
  .max(50, { error: "The password cannot exceed 50 characters" })
  .regex(/[A-Z]/, { error: "It must contain at least one capital letter" })
  .regex(/[a-z]/, { error: "It must contain at least one lowercase letter" })
  .regex(/[0-9]/, { error: "It must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    error: "It must contain at least one special character",
  });
