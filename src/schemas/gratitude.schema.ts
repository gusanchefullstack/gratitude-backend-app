import { z } from "zod";
import { uuidSchema } from "./common.schema.js";

const gratitudeBaseSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title must have at least 3 characters" })
    .max(100, { error: "Title cannot exceed 100 characters" }),
  details: z
    .string()
    .min(10, { error: "Details must have at least 10 characters" })
    .max(200, { error: "Details cannot exceed 200 characters" }),
  tags: z
    .array(
      z
        .string()
        .min(3, { error: "Tag must have at least 3 characters" })
        .max(20, { error: "Tag cannot exceed 20 characters" }),
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
