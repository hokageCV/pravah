import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { capitalize } from '../../utils/text';
import { useAuthStore } from '../auth/auth.store';
import { useGoalStore } from '../goals/goal.store';
import { CreateLog } from '../logs/create-log';
import { useHabitStore } from './habit.store';
import { fetchHabits } from './habits.api';

export function HabitList() {
  let habits = useHabitStore((state) => state.habits);
  let setHabits = useHabitStore((state) => state.setHabits);
  let user = useAuthStore((state) => state.user);
  let goals = useGoalStore((state) => state.goals);

  let { data, isError, error } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: () => {
      if (user?.id) return fetchHabits();
      return Promise.reject(new Error('User is not logged in.'));
    },
    initialData: habits.length ? habits : undefined,
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setHabits(data);
  }, [data]);

  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!data?.length) return <div>No habits found</div>;

  return (
    <>
      <ul className='space-y-4'>
        {data.map((habit) => {
          let hasGoal = goals.some((goal) => goal.habitId === habit.id);

          return (
            <li
              key={habit.id}
              className='border border-c-border rounded-lg p-4 max-w-xl bg-surface shadow-sm hover:shadow transition flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between'
            >
              <Link
                to='/habits/$habitId'
                params={{ habitId: habit.id.toString() }}
                className='min-w-0 flex-1'
              >
                <h2 className='text-xl font-semibold text-c-text truncate'>
                  {capitalize(habit.name)}
                </h2>
                {habit.description && (
                  <p className='text-sm text-c-text-muted truncate'>
                    {capitalize(habit.description)}
                  </p>
                )}
              </Link>
              {hasGoal && (
                <div className='flex sm:justify-end font-semibold shrink-0'>
                  <CreateLog habit={habit} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
