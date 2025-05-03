import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '../utils/auth'
import { HabitList } from '../components/habits/habit-list'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/auth/signup' })
  },
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
      <HabitList />
    </div>
  )
}
