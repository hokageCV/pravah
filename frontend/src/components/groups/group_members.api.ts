import { BASE_URL } from '../../constants';
import type { MemberHabit, Membership, User } from '../../types';
import { safeFetch } from '../../utils/api';

export async function createMembership(
  groupId: number,
  userId: number,
): Promise<Membership> {
  let data = { userId };

  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/members`,
    method: 'POST',
    data,
  });
  return result.data;
}

export async function fetchMembers(groupId: number): Promise<User[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/members`,
    method: 'GET',
  });
  return result.data;
}

export async function fetchMembersWithHabits(
  groupId: number,
): Promise<MemberHabit[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/members/with-habits`,
    method: 'GET',
  });
  return result.data;
}

export async function searchUsers(
  groupId: number,
  query: string,
): Promise<User[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/groups/${groupId}/members/search?query=${query}`,
    method: 'GET',
  });
  return result.data;
}
