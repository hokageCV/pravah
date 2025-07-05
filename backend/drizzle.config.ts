import { defineConfig } from 'drizzle-kit';
import env from '@/env-runtime';

export default defineConfig({
  dialect: 'turso',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  casing: 'snake_case',
  breakpoints: true,
  verbose: true,
  strict: true,
});
