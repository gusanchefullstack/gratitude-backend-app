import { z } from "zod";

export const uuidSchema = z.object({
  id: z.uuid("Invalid gratitude id"),
});

export const createGratitudeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title must be max 50 characters long" }),
  details: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title must be max 100 characters long" }),
  tags: z
    .array(z.string())
    .max(5, { message: "Tags must not have more than 5 items" }),
});

export const updateGratitudeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "itle must be max 50 characters long" })
    .optional(),
  details: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "itle must be max 100 characters long" })
    .optional(),
  tags: z
    .array(z.string())
    .max(5, { message: "Tags must not have more than 5 items" })
    .optional(),
});
