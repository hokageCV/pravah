import { Hono } from 'hono';
import { login, profile, signup } from './auth.controllers';

const authRoutes = new Hono();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/profile', profile);

export default authRoutes;
