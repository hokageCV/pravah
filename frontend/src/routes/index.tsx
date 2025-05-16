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
    <div className=' mx-auto px-4 py-6'>
      <div className='mb-6'>
        <Link
          to='/habits/create'
          className='inline-block bg-c-secondary text-white font-semibold px-5 py-2 rounded-md shadow hover:bg-green-700 transition-colors'
        >
          + Create Habit
        </Link>
      </div>
      <HabitList />
    </div>
  )
}
