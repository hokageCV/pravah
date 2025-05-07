import { BASE_URL } from '../../constants';
import type { Habit } from '../../types';

export async function fetchHabits(userId: number): Promise<Habit[]> {
  const res = await fetch(`${BASE_URL}/habits?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Failed to fetch habits')
  const result = await res.json();

  return result.habits
}

export async function createHabit(data: Partial<Habit>): Promise<Habit> {
  const res = await fetch(`${BASE_URL}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Failed to create habit')
  const result = await res.json()

  return result.habit
}

export async function fetchHabit(id: number): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch habit');

  let result = await res.json();
  return result.habit;
}

export async function updateHabit(habit: Habit): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${habit.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  })
  if (!res.ok) throw new Error('Failed to update habit')

  return res.json()
}
