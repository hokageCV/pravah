import { BASE_URL } from '../../constants';
import type { GroupHabit, Habit } from '../../types';
import { safeFetch } from '../../utils/api';

export async function searchHabits(
  groupId: number,
  query: string,
): Promise<Habit[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/habits/search?query=${query}`,
    method: 'GET',
  });
  return result.data;
}

export async function addHabitToGroup(
  groupId: number,
  habitId: number,
): Promise<GroupHabit> {
  let data = { habitId };

  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/habits`,
    method: 'POST',
    data,
  });
  return result.data;
}

export async function fetchExistingHabits(
  groupId: number,
  userId: number,
): Promise<Partial<Habit>[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/habits/${userId}`,
    method: 'GET',
  });
  return result.data;
}

export async function deleteGroupHabit(
  groupId: number,
  habitId: number,
): Promise<GroupHabit> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/habits/${habitId}`,
    method: 'DELETE',
  });
  return result.data;
}
