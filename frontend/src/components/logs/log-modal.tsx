import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSound } from 'react-sounds';
import type { Habit } from '../../types';
import { capitalize } from '../../utils/text';
import { useGoalStore } from '../goals/goal.store';
import { fetchGoals } from '../goals/goals.api';
import { createLog } from './log.api';

type LogModalProps = {
  habit: Habit;
  onClose: () => void;
};

export function LogModal({ habit, onClose }: LogModalProps) {
  let queryClient = useQueryClient();
  let habitId = habit.id;
  let [goalLevel, setGoalLevel] = useState('A');
  let { play: playHabitLogged } = useSound('arcade/coin');
  let { play: playError } = useSound('notification/error');

  let { mutate, status, error } = useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      playHabitLogged();
      queryClient.invalidateQueries({ queryKey: ['logs', { habitId }] });
      setTimeout(onClose, 1000);
    },
    onError: () => playError(),
  });

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ habitId, goalLevel });
  };

  let storedGoals = useGoalStore((s) => s.goals).filter(
    (goal) => goal.habitId == habit.id,
  );
  let { data: fetchedGoals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => fetchGoals(habitId),
    enabled: !storedGoals,
  });
  let goals = storedGoals || fetchedGoals;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.50)]'>
      <div className='bg-white p-6 rounded-xl shadow-xl w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>
          Add Progress for
          <span className='text-c-primary'> {habit.name}</span>
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type='hidden' value={habitId} />

          <div>
            <ul>
              {goals.map((goal) => (
                <li
                  key={goal.level}
                  className=' grid grid-cols-[auto_auto_1fr] items-center gap-2 py-2'
                >
                  <input
                    type='radio'
                    name='goalLevel'
                    value={goal.level}
                    checked={goalLevel === goal.level}
                    onChange={() => setGoalLevel(goal.level)}
                    className='radio radio-lg bg-c-surface checked:bg-c-accent-subtle'
                  />
                  <div className='font-medium text-sm'>{goal.level}</div>
                  <div className='text-sm pl-3'>
                    {capitalize(goal.description)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='submit'
              className='bg-c-accent text-white px-4 py-2 rounded-md hover:bg-c-accent-hover cursor-pointer'
            >
              Submit
            </button>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer'
            >
              Cancel
            </button>
          </div>

          {status === 'pending' && (
            <p className='text-sm text-gray-500'>Creating...</p>
          )}
          {status === 'error' && (
            <p className='text-sm text-red-600'>{(error as Error).message}</p>
          )}
        </form>
      </div>
    </div>,
    document.body,
  );
}
