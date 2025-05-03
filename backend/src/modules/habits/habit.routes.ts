import { Hono } from 'hono';
import { create, destroy, index, show, update } from './habit.controllers';

const habitRoutes = new Hono();

habitRoutes.get('/', index)
habitRoutes.get('/:id', show)
habitRoutes.post('/', create)
habitRoutes.patch('/:id', update)
habitRoutes.delete('/:id', destroy)

export default habitRoutes;
