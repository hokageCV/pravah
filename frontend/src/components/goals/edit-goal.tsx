import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Goal } from '../../types'
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

  let {
    mutate,
    status: updateStatus,
    error: updateError,
  } = useMutation({
    mutationFn: updateGoal,
    onSuccess: (updatedGoal: Goal) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      navigate({ to: `/habits/${updatedGoal.habitId}` })
    },
  })
  let handleSubmit = (data: Partial<Goal>) => {
    if (!goal) return
    mutate({ ...goal, ...data })
  }

  if (!goal && isLoading) return <div>Loading...</div>
  if (!goal) return <div> goal not found</div>

  return (
    <>
      <GoalForm initialValue={goal} onSubmit={handleSubmit} />
      {updateStatus === 'pending' && <p>Updating goal...</p>}
      {updateStatus === 'error' && <p>Error: {(updateError as Error).message}</p>}
      {updateStatus === 'success' && <p>Goal updated!</p>}
    </>
  )
}
