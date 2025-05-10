import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { HabitList } from '../components/habits/habit-list'
import { isAuthenticated } from '../utils/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/auth/signup' })
  },
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className='p-2'>
      <div className='mb-4'>
        <Link
          to='/habits/create'
          className='inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
        >
          Create Habit
        </Link>
      </div>
      <HabitList />
    </div>
  )
}
