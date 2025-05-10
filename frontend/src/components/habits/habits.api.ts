import { BASE_URL } from '../../constants';
import type { Habit } from '../../types';
import { getAuthToken } from '../../utils/auth';

export async function fetchHabits(): Promise<Habit[]> {
  let res = await fetch(`${BASE_URL}/habits`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to fetch habits');

  return result.data
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

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to create habit');

  return result.data
}

export async function fetchHabit(id: number): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to fetch habit');

  return result.data;
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

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to update habit');

  return result.data;
}

export async function deleteHabit(id: number): Promise<Habit> {
  let res = await fetch(`${BASE_URL}/habits/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    }
  })

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to delete habit');

  return result.data;
}
