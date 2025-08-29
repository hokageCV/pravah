import { z, type ZodError } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid URL')
    .min(1, 'DATABASE_URL is required'),
  DATABASE_AUTH_TOKEN: z.string(),
  FRONTEND_URLS: z
    .string()
    .min(1, 'At least one FRONTEND_URL is required')
    .refine((val) => {
      return val.split(',').every((url) => {
        try {
          new URL(url.trim())
          return true
        } catch {
          return false
        }
      })
    }, 'FRONTEND_URLS must be a comma-separated list of valid URLs'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').optional(),
  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a valid number')
    .transform(Number) // string to number
    .refine((val) => val >= 1000 && val <= 65535, {
      message: 'PORT must be between 1000 and 65535',
    }),
  APIKEY: z.string().min(1, 'APIKEY is required'),
  APP_ENV: z.enum(['production', 'development']),
  DB_SEEDING: z.string(),
  DB_MIGRATING: z.string(),
});

export function validateEnv(env: Record<string, unknown>): EnvType {
  try {
    return envSchema.parse(env);
  } catch (e) {
    const error = e as ZodError;
    console.error(error.flatten().fieldErrors);
    throw new Error('❌ Invalid environment variables');
  }
}

export type EnvType = z.infer<typeof envSchema>;
