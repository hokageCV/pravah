import { notFound } from 'stoker/middlewares';
import createApp from '@/lib/create-app';
import authRoutes from './modules/auth/auth.routes';

const app = createApp()

app.get('/', (c) => {
  return c.text(`test key: ${c.env.APIKEY}`);
})

app.route("/auth", authRoutes);

app.notFound(notFound)

export default app
