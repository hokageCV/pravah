import { Hono } from 'hono';
import { create as habitsCreate, destroy as habitsDestroy, index as habitsIndex, search as habitsSearch, show as habitsShow } from './group_habits.controllers';
import { create as membershipCreate, destroy as membershipDestroy, index as membershipIndex, search as membershipSearch, membersWithHabits } from './group_member.controllers';
import { create, destroy, index, joined } from './groups.controllers';

const groupRoutes = new Hono();

groupRoutes.get('/joined', joined)
groupRoutes.post('/', create)
groupRoutes.get('/', index)
groupRoutes.delete('/:groupId', destroy)

groupRoutes.get('/:groupId/members/search', membershipSearch)
groupRoutes.get('/:groupId/members/with-habits', membersWithHabits)
groupRoutes.get('/:groupId/members', membershipIndex)
groupRoutes.post('/:groupId/members', membershipCreate)
groupRoutes.delete('/:groupId/members', membershipDestroy)

groupRoutes.get('/:groupId/habits/search', habitsSearch)
groupRoutes.get('/:groupId/habits/:userId', habitsShow)
groupRoutes.get('/:groupId/habits', habitsIndex)
groupRoutes.post('/:groupId/habits', habitsCreate)
groupRoutes.delete('/:groupId/habits/:habitId', habitsDestroy)

export default groupRoutes;
