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
        <nav className='bg-c-surface shadow-md sticky top-0 z-50'>
          <div className='flex justify-between items-center px-4 py-3'>
            <div className='text-c-accent text-xl font-bold select-none'>Pravah</div>
            <div className='flex gap-5 text-lg items-center'>
              <Link
                to='/'
                activeProps={{ className: 'underline text-c-accent' }}
                activeOptions={{ exact: true }}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light'
              >
                Home
              </Link>
              <Link
                to='/about'
                activeProps={{ className: 'underline text-c-accent' }}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light'
              >
                About
              </Link>
              |
              <button
                onClick={handleLogout}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light'
              >
                Log out
              </button>
            </div>
          </div>
        </nav>
      )}
      <Outlet />
    </>
  )
}
