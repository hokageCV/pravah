import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Habit } from '../../types'
import { HabitForm } from './habit-form'
import { createHabit } from './habits.api'
import { useAuthStore } from '../auth/auth.store'

let initialHabitValue: Partial<Habit> = { name: '', description: '' }

export function CreateHabit() {
  let userId = useAuthStore(state=> state.user!.id)
  let queryClient = useQueryClient()

  let { mutate, status, error } = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  let handleSubmit = (data: Partial<Habit>) => {
    mutate({ ...data, userId })
  }

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
