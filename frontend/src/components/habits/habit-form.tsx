import { useState } from 'react';
import type { Habit } from '../../types';

type HabitFormProps = {
  initialValue: Partial<Habit>;
  onSubmit: (habit: Partial<Habit>) => void;
};

export function HabitForm({ initialValue, onSubmit }: HabitFormProps) {
  let [formData, setFormData] = useState<Partial<Habit>>(initialValue);

  let handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className='py-8 px-4 flex items-center justify-center'>
      <div className='bg-c-surface border border-c-border rounded-2xl shadow-md p-8 w-full max-w-md'>
        <h2 className='text-xl font-semibold'>
          {initialValue.name ? 'Edit' : 'Create'} Habit
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-2'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-sm text-c-text'>
              Name
            </legend>
            <input
              type='text'
              name='name'
              value={formData.name ?? ''}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-c-border rounded-lg bg-white text-sm text-c-text focus:outline-none focus:ring-2 focus:ring-c-accent/40 focus:border-c-accent'
            />
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-sm text-c-text'>
              Why you want to have this habit ?
            </legend>
            <textarea
              name='description'
              value={formData.description ?? ''}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-c-border rounded-lg bg-white text-sm text-c-text focus:outline-none focus:ring-2 focus:ring-c-accent/40 focus:border-c-accent'
            ></textarea>
          </fieldset>

          <button
            type='submit'
            className='btn bg-c-accent hover:bg-c-accent-hover border-none self-end'
          >
            Save Habit
          </button>
        </form>
      </div>
    </div>
  );
}
