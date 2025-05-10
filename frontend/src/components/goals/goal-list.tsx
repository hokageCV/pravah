import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Goal } from '../../types'
import { useGoalStore } from './goal.store'
import { deleteGoal, fetchGoals } from './goals.api'

export function GoalList() {
  let queryClient = useQueryClient()

  let goals = useGoalStore((state) => state.goals)
  let setGoals = useGoalStore((state) => state.setGoals)
  let { habitId: habitIdParam } = useParams({ strict: false })
  let habitId = Number(habitIdParam)

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ['goals'],
    queryFn: () => fetchGoals(habitId),
  })

  useEffect(() => {
    if (data) setGoals(data)
  }, [data])

  let handleDelete = async (goal: Goal) => {
    if (confirm(`Are you sure you want to delete "${goal.description}"?`)) {
      try {
        await deleteGoal(goal.id)
        setGoals(goals.filter((g) => g.id !== goal.id))
        queryClient.invalidateQueries({ queryKey: ['goals'] })
      } catch (err) {
        alert((err as Error).message)
      }
    }
  }

  if (isLoading) return <div>Loading goals...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>

  if (!goals || goals.length === 0) return <div>No goals found.</div>

  return (
    <>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id} className='mb-2'>
            <strong>{goal.level}</strong>: {goal.description}
            <div style={{ display: 'inline-flex', gap: '0.5rem', marginLeft: '1rem' }}>
              <Link to='/goals/$goalId/edit' params={{ goalId: goal.id.toString() }}>
                Edit
              </Link>
              <button onClick={() => handleDelete(goal)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
