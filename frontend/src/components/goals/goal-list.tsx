import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Goal } from '../../types'
import { capitalize } from '../../utils/text'
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
      <ul className='list'>
        {goals
          .sort((a, b) => a.level.localeCompare(b.level))
          .map((goal) => (
            <li
              key={goal.id}
              className='list-row p-2 border-none shadow shadow-sm m-1 bg-c-surface'
            >
              <div>
                <strong>
                  <span className='outline outline-c-accent-subtle text-c-text py-1 px-2 rounded-md'>
                    {goal.level}
                  </span>
                </strong>
              </div>
              <div>
                <span className='font-normal'>{capitalize(goal.description)}</span>
              </div>

              <Link
                to='/goals/$goalId/edit'
                params={{ goalId: goal.id.toString() }}
                className='text-c-text-muted font-light cursor-pointer'
              >
                ✎
              </Link>
              <button
                onClick={() => handleDelete(goal)}
                className='text-c-text-muted font-light cursor-pointer'
              >
                🗑
              </button>
            </li>
          ))}
      </ul>
    </>
  )
}
