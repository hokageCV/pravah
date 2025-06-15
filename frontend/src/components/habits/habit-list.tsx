import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { capitalize } from '../../utils/text'
import { useAuthStore } from '../auth/auth.store'
import { useGoalStore } from '../goals/goal.store'
import { CreateLog } from '../logs/create-log'
import { useHabitStore } from './habit.store'
import { fetchHabits } from './habits.api'

export function HabitList() {
  let habits = useHabitStore((state) => state.habits)
  let setHabits = useHabitStore((state) => state.setHabits)
  let user = useAuthStore((state) => state.user)
  let goals = useGoalStore((state) => state.goals)

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
        {habits.map((habit) => {
          let hasGoal = goals.some((goal) => goal.habitId === habit.id)

          return (
            <li
              key={habit.id}
              className='border border-c-border rounded-lg max-w-xl p-4 bg-surface shadow-sm hover:shadow transition flex justify-between'
            >
              <Link to='/habits/$habitId' params={{ habitId: habit.id.toString() }}>
                <h2 className='text-xl font-semibold text-c-text'>{capitalize(habit.name)}</h2>
                {habit.description && (
                  <p className='text-sm text-c-text-muted truncate w-72'>
                    {capitalize(habit.description)}
                  </p>
                )}
              </Link>
              {hasGoal && (
                <div className='flex justify-end font-semibold whitespace-nowrap'>
                  <CreateLog habit={habit} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
