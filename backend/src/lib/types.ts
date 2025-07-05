import type { EnvType } from '@/env';
import type { PinoLogger } from 'hono-pino';

export type AppBindings = {
  Bindings: EnvType;
  Variables: {
    logger: PinoLogger;
  };
};
