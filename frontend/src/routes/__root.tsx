import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from '@tanstack/react-router';
import { useAuthStore } from '../components/auth/auth.store';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  let setUser = useAuthStore((state) => state.setUser);
  let user = useAuthStore((state) => state.user);
  let navigate = useNavigate();

  let handleLogout = () => {
    setUser(null);
    navigate({ to: '/auth/signup' });
  };

  return (
    <>
      {user && (
        <nav className='bg-c-surface shadow-md sticky top-0 z-50'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 gap-3 sm:gap-0'>
            <div className='text-c-accent text-xl font-bold select-none text-center sm:text-left'>
              Pravah
            </div>

            <div className='flex flex-wrap justify-center gap-x-5 gap-y-2 text-lg sm:items-center'>
              <Link
                to='/'
                activeProps={{ className: 'underline text-c-accent' }}
                activeOptions={{ exact: true }}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light px-2 py-1'
              >
                Home
              </Link>
              <Link
                to='/groups'
                activeProps={{ className: 'underline text-c-accent' }}
                activeOptions={{ exact: true }}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light px-2 py-1'
              >
                Groups
              </Link>
              <Link
                to='/about'
                activeProps={{ className: 'underline text-c-accent' }}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light px-2 py-1'
              >
                About
              </Link>

              <span className='hidden sm:inline text-c-text'>|</span>

              <button
                onClick={handleLogout}
                className='text-c-text hover:text-c-accent-hover transition-colors font-light px-2 py-1'
              >
                Log out
              </button>
            </div>
          </div>
        </nav>
      )}
      <Outlet />
    </>
  );
}
