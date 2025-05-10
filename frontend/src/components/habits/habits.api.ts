import { BASE_URL } from '../../constants';
import type { Habit } from '../../types';
import { safeFetch } from '../../utils/api';

export async function fetchHabits(): Promise<Habit[]> {
  let result = await safeFetch({ url: `${BASE_URL}/habits`, method: 'GET' })
  return result.data;
}

export async function createHabit(data: Partial<Habit>): Promise<Habit> {
  let result = await safeFetch({ url: `${BASE_URL}/habits`, method: 'POST', data })
  return result.data;
}

export async function fetchHabit(id: number): Promise<Habit> {
  let result = await safeFetch({ url: `${BASE_URL}/habits/${id}`, method: 'GET' })
  return result.data;
}

export async function updateHabit(habit: Habit): Promise<Habit> {
  let result = await safeFetch({ url: `${BASE_URL}/habits/${habit.id}`, method: 'PATCH', data: habit })
  return result.data;
}

export async function deleteHabit(id: number): Promise<Habit> {
  let result = await safeFetch({ url: `${BASE_URL}/habits/${id}`, method: 'DELETE' })
  return result.data;
}
