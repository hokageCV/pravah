import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { Goal } from '../../types'
import { GoalForm } from './goal-form'
import { useGoalStore } from './goal.store'
import { createGoal } from './goals.api'

const initialGoalValue: Partial<Goal> = { level: undefined, description: '' }

export function CreateGoal() {
  let queryClient = useQueryClient()
  let navigate = useNavigate()
  let { addGoal } = useGoalStore()
  let { habitId: id } = useSearch({ strict: false }) as { habitId: string }
  let habitId = Number(id)

  let { mutate, status, error } = useMutation({
    mutationFn: createGoal,
    onSuccess: (newGoal) => {
      addGoal(newGoal)
      queryClient.setQueryData<Goal[]>(['goals', habitId], (old = []) => [...old, newGoal])

      navigate({ to: `/habits/${habitId}` })
    },
    onError: (error) => console.log(`Failed to create goal: ${error.message}`),
  })

  let handleSubmit = (data: Partial<Goal>) => mutate({ ...data, habitId })

  return (
    <>
      <GoalForm initialValue={initialGoalValue} onSubmit={handleSubmit} habitId={habitId} />

      {status === 'pending' && <p>Creating goal...</p>}
      {status === 'error' && <p>Error: {(error as Error).message}</p>}
      {status === 'success' && <p>Goal created!</p>}
    </>
  )
}
