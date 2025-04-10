import { createFileRoute, redirect } from '@tanstack/react-router'
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
      <h3>Welcome Home!</h3>
      <p>asdfasdfasdfsadfsadf</p>
    </div>
  )
}
