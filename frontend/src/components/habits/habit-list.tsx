import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useHabitStore } from './habit.store'
import { fetchHabits } from './habits.api'

export function HabitList() {
  let habits = useHabitStore((state) => state.habits)
  let setHabits = useHabitStore((state) => state.setHabits)
  let user = useAuthStore((state) => state.user)

  let { data, isLoading, isError, error } = useQuery({
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
    <>
      <div className='mb-4'>
        <Link
          to='/habits/create'
          className='inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
        >
          Create Habit
        </Link>
      </div>
      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            <Link to='/habits/$habitId' params={{ habitId: habit.id.toString() }}>
              <strong>{habit.name}</strong>
            </Link>
            {habit.description && <span> — {habit.description}</span>}
          </li>
        ))}
      </ul>
    </>
  )
}
