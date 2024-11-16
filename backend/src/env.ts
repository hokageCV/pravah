import { z, ZodError } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid URL")
    .min(1, "DATABASE_URL is required"),
  JWT_SECRET: z
    .string()
    .min(1, "JWT_SECRET is required")
    .optional(),
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a valid number")
    .transform(Number) // string to number
    .refine((val) => val >= 1000 && val <= 65535, {
      message: "PORT must be between 1000 and 65535",
    }),
  APIKEY: z
    .string()
    .min(1, "APIKEY is required"),
  APP_ENV: z
    .enum(['production', 'development'])
});


export function validateEnv(env: Record<string, unknown>): EnvType {
  try {
    return envSchema.parse(env);
  } catch (e) {
    const error = e as ZodError;
    console.error(error.flatten().fieldErrors)
    throw new Error('❌ Invalid environment variables');
  }
}

export type EnvType = z.infer<typeof envSchema>;
