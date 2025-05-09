import { BASE_URL } from '../../constants';
import type { Habit } from '../../types';
import { getAuthToken } from '../../utils/auth';

export async function fetchHabits(userId: number): Promise<Habit[]> {
  let res = await fetch(`${BASE_URL}/habits?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch habits')
  let result = await res.json();

  return result.habits
}

export async function createHabit(data: Partial<Habit>): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Failed to create habit')
  let result = await res.json()

  return result.habit
}

export async function fetchHabit(id: number): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch habit');

  let result = await res.json();
  return result.habit;
}

export async function updateHabit(habit: Habit): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${habit.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
     },
    body: JSON.stringify(habit),
  })
  if (!res.ok) throw new Error('Failed to update habit')

  return res.json()
}

export async function deleteHabit(id: number): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
     }
  })
  if (!res.ok) throw new Error('Failed to delete habit')

  return res.json()
}
