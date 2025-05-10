import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { Habit } from '../../types'
import { HabitForm } from './habit-form'
import { createHabit } from './habits.api'

let initialHabitValue: Partial<Habit> = { name: '', description: '' }

export function CreateHabit() {
  let queryClient = useQueryClient()
  let navigate = useNavigate()

  let { mutate, status, error } = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      navigate({ to: '/' })
    },
  })

  let handleSubmit = (data: Partial<Habit>) => mutate(data)

  return (
    <>
      <h2>Create Habit</h2>
      <HabitForm initialValue={initialHabitValue} onSubmit={handleSubmit} />

      {status === 'pending' && <p>Creating habit...</p>}
      {status === 'error' && <p>Error: {(error as Error).message}</p>}
      {status === 'success' && <p>Habit created!</p>}
    </>
  )
}
