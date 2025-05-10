import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import type { Habit } from '../../types'
import { HabitForm } from './habit-form'
import { fetchHabit, updateHabit } from './habits.api'

export function EditHabit() {
  let queryClient = useQueryClient()
  let navigate = useNavigate()

  let { habitId: id } = useParams({ strict: false }) as { habitId: string }

  let {
    data: habit,
    isPending,
    error,
  } = useQuery({
    queryKey: ['habit', id],
    queryFn: () => fetchHabit(Number(id)),
  })

  let {
    mutate,
    status: updateStatus,
    error: updateError,
  } = useMutation({
    mutationFn: updateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      navigate({ to: '/' })
    },
  })

  let handleSubmit = (data: Partial<Habit>) => {
    if (!habit) return
    mutate({ ...habit, ...data })
  }

  if (isPending) return <p>Loading habit...</p>
  if (error) return <p>Error: {(error as Error).message}</p>
  if (!habit) return <p>Habit not found</p>

  return (
    <>
      <h2>Edit Habit</h2>
      <HabitForm initialValue={habit} onSubmit={handleSubmit} />
      {updateStatus === 'pending' && <p>Updating habit...</p>}
      {updateStatus === 'error' && <p>Error: {(updateError as Error).message}</p>}
      {updateStatus === 'success' && <p>Habit updated!</p>}
    </>
  )
}
