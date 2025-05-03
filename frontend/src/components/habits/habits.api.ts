import { BASE_URL } from '../../constants'
import type { Habit } from '../../types'

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
