import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import type { Goal } from '../../types'
import { GoalForm } from './goal-form'
import { useGoalStore } from './goal.store'
import { fetchGoal, updateGoal } from './goals.api'

export function EditGoal() {
  let queryClient = useQueryClient()
  let navigate = useNavigate()
  let { goalId: id } = useParams({ strict: false })
  let goalId = Number(id)

  let storedGoal = useGoalStore((s) => s.goals.find((g) => g.id === goalId))
  let { data: fetchedGoal, isLoading } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: () => fetchGoal(goalId),
    enabled: !storedGoal,
  })
  let goal = storedGoal || fetchedGoal

  let { mutate, status, error } = useMutation({
    mutationFn: updateGoal,
    onSuccess: (updatedGoal) => {
      useGoalStore.getState().updateGoal(updatedGoal)

      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      queryClient.invalidateQueries({ queryKey: ['goals', updatedGoal.habitId] })

      navigate({ to: `/habits/${updatedGoal.habitId}` })
    },
  })

  let handleSubmit = (data: Partial<Goal>) => {
    if (!goal) return
    mutate({ ...goal, ...data } as Goal)
  }

  if (!goal && isLoading) return <div>Loading...</div>
  if (!goal) return <div>Goal not found</div>

  return (
    <>
      <GoalForm initialValue={goal} onSubmit={handleSubmit} habitId={goal.habitId} />

      {status === 'pending' && <p>Updating goal...</p>}
      {status === 'error' && <p>Error: {error?.message}</p>}
      {status === 'success' && <p>Goal updated!</p>}
    </>
  )
}
