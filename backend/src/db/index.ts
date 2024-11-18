import type { EnvType } from '@/env';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

export function createDb(env: EnvType) {
  const db = drizzle({
    connection: {
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    },
    casing: 'snake_case',
    schema,
    logger: true,
  })

  return db
}
