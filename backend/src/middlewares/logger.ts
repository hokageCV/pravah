import { pinoLogger } from 'hono-pino'
import pino from 'pino'

export default pinoLogger({
  pino: pino({
    level: 'info'
  }),
  http: {
    reqId: ()=> crypto.randomUUID()
  }
})
