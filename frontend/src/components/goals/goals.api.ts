import { BASE_URL } from '../../constants';
import type { Goal } from '../../types';
import { safeFetch } from '../../utils/api';

export async function fetchGoals(habitId: number): Promise<Goal[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/goals?habit_id=${habitId}`,
    method: 'GET',
  });
  return result.data;
}

export async function createGoal(data: Partial<Goal>): Promise<Goal> {
  let result = await safeFetch({
    url: `${BASE_URL}/goals/`,
    method: 'POST',
    data,
  });
  return result.data;
}

export async function fetchGoal(goalId: number): Promise<Goal> {
  let result = await safeFetch({
    url: `${BASE_URL}/goals/${goalId}`,
    method: 'GET',
  });
  return result.data;
}

export async function updateGoal(goal: Goal): Promise<Goal> {
  let result = await safeFetch({
    url: `${BASE_URL}/goals/${goal.id}`,
    method: 'PATCH',
    data: goal,
  });
  return result.data;
}

export async function deleteGoal(goalId: number): Promise<Goal> {
  let result = await safeFetch({
    url: `${BASE_URL}/goals/${goalId}`,
    method: 'DELETE',
  });
  return result.data;
}
