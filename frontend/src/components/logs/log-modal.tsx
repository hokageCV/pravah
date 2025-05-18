import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Habit } from '../../types'
import { createLog } from './log.api'

type LogModalProps = {
  habit: Habit
  onClose: () => void
}

export function LogModal({ habit, onClose }: LogModalProps) {
  let queryClient = useQueryClient()
  let habitId = habit.id
  let [goalLevel, setGoalLevel] = useState('A')

  let { mutate, status, error } = useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', { habitId }] })
      onClose()
    },
  })

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ habitId, goalLevel })
  }

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
            <label className='block mb-2 font-medium'>Goal Level</label>
            <div className='flex gap-4'>
              {['A', 'B', 'C'].map((level) => (
                <label key={level} className='flex items-center gap-2 text-lg'>
                  <input
                    type='radio'
                    name='goalLevel'
                    value={level}
                    checked={goalLevel === level}
                    onChange={() => setGoalLevel(level as 'A' | 'B' | 'C')}
                    className='radio radio-lg bg-c-surface checked:bg-c-accent-subtle'
                  />
                  {level}
                </label>
              ))}
            </div>
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

          {status === 'pending' && <p className='text-sm text-gray-500'>Creating...</p>}
          {status === 'error' && <p className='text-sm text-red-600'>{(error as Error).message}</p>}
        </form>
      </div>
    </div>,
    document.body
  )
}
