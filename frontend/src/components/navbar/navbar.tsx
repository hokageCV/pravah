import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuthStore } from '../auth/auth.store';

export function Navbar() {
  let user = useAuthStore((state) => state.user);
  if (!user) return null;

  let [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  let closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <nav className='navbar bg-c-surface shadow-md sticky top-0 z-40 px-4'>
        <div className='flex items-center w-full'>
          <div className='flex-none lg:hidden mr-2'>
            <button
              onClick={toggleDrawer}
              className='btn btn-ghost'
              aria-label='Open menu'
            >
              <HamburgerIcon />
            </button>
          </div>

          <div className='text-c-accent text-xl font-bold select-none flex-1'>
            Pravah
          </div>

          <div className='flex lg:hidden gap-4 mr-2'>
            <MobileNavLink to='/' text='Home' />
            <MobileNavLink to='/groups' text='Groups' />
          </div>

          <DesktopNavbar />
        </div>
      </nav>

      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}

function MobileNavLink({ to, text }: { to: string; text: string }) {
  return (
    <Link
      to={to}
      activeProps={{ className: 'underline text-c-accent' }}
      activeOptions={to === '/' ? { exact: true } : undefined}
      className='text-c-text hover:text-c-accent-hover transition-colors font-light text-lg'
    >
      {text}
    </Link>
  );
}

function DesktopNavbar() {
  return (
    <div className='hidden lg:flex items-center'>
      <ul className='menu menu-horizontal gap-2'>
        <NavLinks />
      </ul>
    </div>
  );
}

function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  let navigate = useNavigate();
  let setUser = useAuthStore((state) => state.setUser);

  let handleLogout = () => {
    setUser(null);
    navigate({ to: '/auth/signup' });
    onItemClick?.();
  };

  return (
    <>
      <li>
        <Link
          to='/'
          activeProps={{ className: 'underline text-c-accent' }}
          activeOptions={{ exact: true }}
          className='text-c-text hover:text-c-accent-hover transition-colors font-light text-lg'
          onClick={onItemClick}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to='/groups'
          activeProps={{ className: 'underline text-c-accent' }}
          activeOptions={{ exact: true }}
          className='text-c-text hover:text-c-accent-hover transition-colors font-light text-lg'
          onClick={onItemClick}
        >
          Groups
        </Link>
      </li>
      <li>
        <Link
          to='/about'
          activeProps={{ className: 'underline text-c-accent' }}
          className='text-c-text hover:text-c-accent-hover transition-colors font-light text-lg'
          onClick={onItemClick}
        >
          About
        </Link>
      </li>
      <li>
        <Link
          to='/profile'
          activeProps={{ className: 'underline text-c-accent' }}
          activeOptions={{ exact: true }}
          className='text-c-text hover:text-c-accent-hover transition-colors font-light text-lg'
          onClick={onItemClick}
        >
          Profile
        </Link>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className='text-c-text hover:text-c-accent-hover transition-colors font-light text-lg text-left'
        >
          Log out
        </button>
      </li>
    </>
  );
}

function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity ${isOpen ? 'opacity-50' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        className={`absolute left-0 top-0 h-full w-[80vw] max-w-sm bg-c-surface shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='p-4 flex justify-between items-center border-b border-c-border'>
          <div className='text-c-accent text-xl font-bold select-none'>
            Pravah
          </div>
          <button onClick={onClose} className='btn btn-ghost'>
            <CloseIcon />
          </button>
        </div>
        <ul className='menu p-4 gap-4'>
          <NavLinks onItemClick={onClose} />
        </ul>
      </div>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      className='inline-block h-6 w-6 stroke-current'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M4 6h16M4 12h16M4 18h16'
      ></path>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      className='inline-block h-6 w-6 stroke-current'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M6 18L18 6M6 6l12 12'
      ></path>
    </svg>
  );
}
