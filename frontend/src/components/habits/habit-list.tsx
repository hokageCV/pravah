import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useHabitStore } from './habit.store'
import { fetchHabits } from './habits.api'

export function HabitList() {
  const habits = useHabitStore((state) => state.habits)
  const setHabits = useHabitStore((state) => state.setHabits)
  const user = useAuthStore((state) => state.user)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: () => {
      if (user?.id) return fetchHabits(user.id)
      return Promise.reject(new Error('User is not logged in.'))
    },
  })

  useEffect(() => {
    if (data) setHabits(data)
  }, [data])

  if (isLoading) return <div>Loading habits...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>

  if (!habits || habits.length === 0) return <div>No habits found.</div>

  return (
    <ul>
      {habits.map((habit) => (
        <li key={habit.id}>
          <strong>{habit.name}</strong>
          {habit.description && <span> — {habit.description}</span>}
        </li>
      ))}
    </ul>
  )
}
