import { z } from "zod";
import { uuidSchema, passwordSchema } from "./common.schema.js";

const userBaseSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "The username must have at least 3 characters")
    .max(20, "The username cannot exceed 20 caracters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only has letters, numbers and underscore",
    )
    .toLowerCase(),
  email: z.string().trim().email({ error: "Must be a valid email" }).toLowerCase(),
  firstName: z
    .string()
    .min(1, { error: "Name is required" })
    .max(50, { error: "Name cannot exceed 50 caracters" })
    .trim(),
  lastName: z
    .string()
    .min(1, { error: "Name is required" })
    .max(50, { error: "Name cannot exceed 50 caracters" })
    .trim(),
});

//CREATE
export const createUserBodySchema = userBaseSchema.extend({
  password: passwordSchema,
});

//UPDATE
export const updateUserBodySchema = userBaseSchema
  .partial()
  .extend({
    password: passwordSchema.optional(),
  })
  .refine(
    // Al menos un campo debe estar presente
    (data) => Object.keys(data).length > 0,
    { message: "Must provide at least one field for updating" },
  );

//READ && DELETE
export const userParamsSchema = z.object({
  userId: uuidSchema,
});

export const updateMyProfileBodySchema = userBaseSchema
  .pick({
    username: true,
    email: true,
    firstName: true,
    lastName: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Must provide at least one field for updating",
  });

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

//Login User
export const userLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});