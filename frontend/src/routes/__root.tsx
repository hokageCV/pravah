import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Navbar } from '../components/navbar/navbar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
