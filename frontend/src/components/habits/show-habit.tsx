import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useHabitStore } from './habit.store'
import { deleteHabit } from './habits.api'

export default function ShowHabit() {
  let queryClient = useQueryClient()

  let { habitId } = useParams({ strict: false }) as { habitId: string }
  let id = Number(habitId)

  let habit = useHabitStore((state) => state.habits.find((h) => h.id === id))
  if (!habit) return <p>Habit not found.</p>

  let navigate = useNavigate()
  let handleEditClick = () => {
    navigate({ to: `/habits/${habit.id}/edit` })
  }

  let { mutate: deleteMutate } = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      navigate({ to: '/' })
    },
  })
  let handleDeleteClick = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      deleteMutate(habit.id)
    }
  }

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold'>{habit.name}</h2>
      {habit.description && <p className='mt-2'>{habit.description}</p>}
      <button
        onClick={handleEditClick}
        className='mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Edit Habit
      </button>
      <button
        onClick={handleDeleteClick}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Delete
      </button>
    </div>
  )
}
