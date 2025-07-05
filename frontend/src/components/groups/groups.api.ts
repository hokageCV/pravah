import { BASE_URL } from '../../constants';
import type { Group } from '../../types';
import { safeFetch } from '../../utils/api';

export async function fetchGroups(): Promise<Group[]> {
  let result = await safeFetch({ url: `${BASE_URL}/groups`, method: 'GET' });
  return result.data;
}

export async function fetchJoinedGroups(): Promise<Group[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/joined`,
    method: 'GET',
  });
  return result.data;
}

export async function createGroup(data: Partial<Group>): Promise<Group> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups`,
    method: 'POST',
    data,
  });
  return result.data;
}

export async function deleteGroup(id: number): Promise<Group> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${id}`,
    method: 'DELETE',
  });
  return result.data;
}
