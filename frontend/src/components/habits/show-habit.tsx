import { useNavigate, useParams } from '@tanstack/react-router'
import { useHabitStore } from './habit.store'

export default function ShowHabit() {
  let { habitId } = useParams({ strict: false }) as { habitId: string }
  let id = Number(habitId)

  let habit = useHabitStore((state) => state.habits.find((h) => h.id === id))
  if (!habit) return <p>Habit not found.</p>

  let navigate = useNavigate()
  let handleEditClick = () => {
    navigate({ to: `/habits/${habit.id}/edit` })
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
    </div>
  )
}
