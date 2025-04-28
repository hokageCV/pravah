import { Link, Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../components/auth/auth.store'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  let setUser = useAuthStore((state) => state.setUser)
  let user = useAuthStore((state) => state.user)
  let navigate = useNavigate()

  let handleLogout = () => {
    setUser(null)
    navigate({ to: '/auth/signup' })
  }

  return (
    <>
      {user && (
        <>
          <div className='p-2 flex gap-2 text-lg'>
            <Link to='/' activeProps={{ className: 'font-bold' }} activeOptions={{ exact: true }}>
              Home
            </Link>
            <Link to='/about' activeProps={{ className: 'font-bold' }}>
              About
            </Link>
            <button onClick={handleLogout}>log out</button>
          </div>
          <hr />
        </>
      )}
      <Outlet />
    </>
  )
}
