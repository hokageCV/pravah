import { EnvType } from '@/env';
import { PinoLogger } from 'hono-pino';

export type AppBindings = {
  Bindings: EnvType,
  Variables: {
    logger: PinoLogger;
  }
};
