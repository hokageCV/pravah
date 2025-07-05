import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useSound } from 'react-sounds';
import type { Group, Habit } from '../../types';
import { addHabitToGroup, searchHabits } from './group_habits.api';

type AddHabitsProps = {
  group: Group;
  close: () => void;
};

type HabitOption = Pick<Habit, 'id' | 'name'>;

export function AddHabitsModal({ group, close }: AddHabitsProps) {
  let [query, setQuery] = useState('');
  let [results, setResults] = useState<HabitOption[]>([]);
  let [selectedHabit, setSelectedHabit] = useState<HabitOption | null>(null);
  let [showDropdown, setShowDropdown] = useState(false);
  let { play: playSuccess } = useSound('notification/success');

  let dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    let controller = new AbortController();

    searchHabits(group.id, query)
      .then((res) => setResults(res))
      .catch(console.error);

    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    let handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setShowDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let handleSelect = (habit: HabitOption) => {
    setSelectedHabit(habit);
    setQuery(habit.name);
    setShowDropdown(false);
  };

  let { mutate, status, error } = useMutation({
    mutationFn: () => {
      if (!selectedHabit) throw new Error('No habit selected');
      return addHabitToGroup(group.id, selectedHabit.id);
    },
    onSuccess: () => {
      playSuccess();
      setTimeout(close, 800);
    },
    onError: (err) => console.error('Membership creation failed:', err),
  });

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit) return;
    mutate();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.50)]'>
      <div className='bg-white p-6 rounded-xl shadow-xl w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>
          Add habits to {group.name}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='relative' ref={dropdownRef}>
            <input
              type='text'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              placeholder='Search by username'
              className='w-full border px-3 py-2 rounded-md'
            />
            {showDropdown && query.length >= 3 && (
              <ul className='absolute z-10 w-full bg-white border mt-1 rounded-md shadow max-h-60 overflow-y-auto'>
                {results.map((habit) => (
                  <li
                    key={habit.id}
                    onClick={() => handleSelect(habit)}
                    className='p-2 hover:bg-gray-100 cursor-pointer'
                  >
                    {habit.name}
                  </li>
                ))}

                {results.length === 0 && (
                  <li className='p-2 text-gray-500 cursor-default'>
                    No results found
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='submit'
              disabled={!selectedHabit || status == 'pending'}
              className='bg-c-accent text-white px-4 py-2 rounded-md hover:bg-c-accent-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {status == 'pending' ? 'Adding...' : 'Submit'}
            </button>
            <button
              type='button'
              onClick={close}
              className='bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
