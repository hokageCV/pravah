import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { HabitList } from '../components/habits/habit-list';
import { isAuthenticated } from '../utils/auth';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/info' });
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='mb-6'>
        <Link
          to='/habits/create'
          className='inline-block bg-c-text text-white font-semibold px-5 py-2 rounded-md shadow hover:bg-c-text-muted transition-colors'
        >
          + Create Habit
        </Link>
      </div>
      <HabitList />
    </div>
  );
}
