import { z } from "zod";
import { uuidSchema } from "./common.schema.js";

const gratitudeBaseSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title must have at least 3 characters" })
    .max(70, { error: "Title cannot exceed 70 characters" }),
  details: z
    .string()
    .min(10, { error: "Details must have at least 10 characters" })
    .max(140, { error: "Details cannot exceed 140 characters" }),
  tags: z
    .array(
      z
        .string()
        .min(3, { error: "Tag must have at least 3 characters" })
        .max(15, { error: "Tag cannot exceed 15 characters" }),
    )
    .max(5),
});

//CREATE
export const createGratitudeBodySchema = gratitudeBaseSchema.extend({
  // userId: uuidSchema,
});

//UPDATE
export const updateGratitudeBodySchema = gratitudeBaseSchema.partial();

//READ && DELETE
export const gratitudeParamsSchema = z.object({
  id: uuidSchema,
});

export const gratitudeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(70).optional(),
  tag: z.string().trim().min(1).max(15).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
