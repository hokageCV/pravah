import { BASE_URL } from '../../constants';
import type { Goal } from '../../types';
import { getAuthToken } from '../../utils/auth';

export async function fetchGoals(habitId: number): Promise<Goal[]> {
  let res = await fetch(`${BASE_URL}/goals?habit_id=${habitId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to fetch goals');

  return result.data
}

export async function createGoal(data: Partial<Goal>): Promise<Goal> {
  let res = await fetch(`${BASE_URL}/goals/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  })

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to create goal');

  return result.data
}

export async function fetchGoal(goalId: number): Promise<Goal> {
  let res = await fetch(`${BASE_URL}/goals/${goalId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to fetch goal');

  return result.data;
}

export async function updateGoal(goal: Goal): Promise<Goal> {
  let res = await fetch(`${BASE_URL}/goals/${goal.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(goal),
  })

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to update goal');

  return result.data;
}

export async function deleteGoal(goalId: number): Promise<Goal> {
  let res = await fetch(`${BASE_URL}/goals/${goalId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    }
  })

  let result = await res.json()
  if (!res.ok) throw new Error(result?.error || 'Failed to delete goal');

  return result.data;
}
