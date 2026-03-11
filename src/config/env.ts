import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_ORIGINS: z.string().optional(),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(20).default(10),
});

const parsedConfig = envSchema.parse(process.env);

export const config = {
  ...parsedConfig,
  // Fallback keeps backward compatibility when refresh secret is not yet configured.
  JWT_REFRESH_SECRET: parsedConfig.JWT_REFRESH_SECRET ?? parsedConfig.JWT_SECRET,
};
