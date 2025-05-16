import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { Goal } from '../../types'
import { GoalForm } from './goal-form'
import { createGoal } from './goals.api'

let initialGoalValue: Partial<Goal> = { level: undefined, description: '' }

export function CreateGoal() {
  let queryClient = useQueryClient()
  let navigate = useNavigate()

  let { habitId: id } = useSearch({ strict: false }) as { habitId: string }
  let habitId = Number(id)

  let { mutate, status, error } = useMutation({
    mutationFn: createGoal,
    onSuccess: (createdGoal: Goal, submittedGoal: Partial<Goal>) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      navigate({ to: `/habits/${createdGoal.habitId}` })
    },
  })

  let handleSubmit = (data: Partial<Goal>) => mutate({ ...data, habitId })

  return (
    <>
      <GoalForm initialValue={initialGoalValue} onSubmit={handleSubmit} />

      {status === 'pending' && <p>Creating goal...</p>}
      {status === 'error' && <p>Error: {(error as Error).message}</p>}
      {status === 'success' && <p>Goal created!</p>}
    </>
  )
}
