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
      if (user?.id) return fetchHabits()
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
      <ul className='space-y-4'>
        {habits.map((habit) => (
          <li
            key={habit.id}
            className='border border-c-border rounded-lg max-w-xl p-4 bg-surface shadow-sm hover:shadow transition'
          >
            <Link to='/habits/$habitId' params={{ habitId: habit.id.toString() }}>
              <h2 className='text-lg font-semibold text-c-text'>{habit.name}</h2>
            </Link>
            {habit.description && (
              <p className='text-sm text-c-text-muted'>{habit.description}</p>
            )}
            <div className='flex justify-end'>
              <button className='bg-c-accent hover:bg-c-accent-hover text-white py-2 px-4 rounded-md cursor-pointer'>
                Mark Complete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
