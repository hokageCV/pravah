import createApp from '@/lib/create-app';
import { notFound } from 'stoker/middlewares';
import { secureRoute } from './middlewares/auth';
import authRoutes from './modules/auth/auth.routes';
import habitRoutes from './modules/habits/habit.routes';
import goalRoutes from './modules/goals/goal.routes';
import habitLogRoutes from './modules/habit_logs/habit_logs.routes';

const app = createApp()

app.get('/', (c) => {
  return c.text(`test key: ${c.env.APIKEY}`);
})

app.route('/auth', authRoutes);

secureRoute(app, '/habits', habitRoutes);
secureRoute(app, '/goals', goalRoutes);
secureRoute(app, '/habit_logs', habitLogRoutes);

app.notFound(notFound)

export default app
