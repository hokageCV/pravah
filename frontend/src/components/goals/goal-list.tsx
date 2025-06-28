import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Goal } from '../../types'
import { capitalize } from '../../utils/text'
import { DeleteSvg } from '../svgs/delete'
import { EditSvg } from '../svgs/edit'
import { useGoalStore } from './goal.store'
import { deleteGoal, fetchGoals } from './goals.api'

export function GoalList() {
  let queryClient = useQueryClient()
  let { habitId: habitIdParam } = useParams({ strict: false })
  let habitId = Number(habitIdParam)

  let { goals: storedGoals, setGoals, removeGoal } = useGoalStore()

  let currentHabitGoals = storedGoals.filter((g) => g.habitId === habitId)
  let hasGoals = currentHabitGoals.length > 0

  let {
    data: fetchedGoals,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['goals', habitId],
    queryFn: () => fetchGoals(habitId),
    enabled: !hasGoals,
  })

  useEffect(() => {
    if (fetchedGoals) {
      let otherHabitGoals = storedGoals.filter((g) => g.habitId !== habitId)
      setGoals([...otherHabitGoals, ...fetchedGoals])
    }
  }, [fetchedGoals])

  let handleDelete = async (goal: Goal) => {
    if (confirm(`Delete "${goal.description}"?`)) {
      try {
        await deleteGoal(goal.id)
        removeGoal(goal.id)
        queryClient.setQueryData<Goal[]>(['goals', goal.habitId], (old = []) =>
          old.filter((g) => g.id !== goal.id)
        )
      } catch (err) {
        console.log((err as Error).message)
      }
    }
  }

  let goals = hasGoals ? currentHabitGoals : fetchedGoals || []

  if (isLoading && !hasGoals) return <div>Loading goals...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>
  if (!goals.length) return <div>No goals found.</div>

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

              <div className='inline-flex items-center gap-2 mt-1'>
                <Link
                  to='/goals/$goalId/edit'
                  params={{ goalId: goal.id.toString() }}
                  className='text-c-text-muted font-light cursor-pointer'
                >
                  <EditSvg />
                </Link>
              </div>
              <div className='inline-flex items-center gap-2 mt-1'>
                <button
                  onClick={() => handleDelete(goal)}
                  className='text-c-text-muted font-light cursor-pointer'
                >
                  <DeleteSvg />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  )
}
