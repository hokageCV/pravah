import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { createLog } from './log.api'

type LogModalProps = {
  habitId: number
  onClose: () => void
}

export function LogModal({ habitId, onClose }: LogModalProps) {
  let queryClient = useQueryClient()
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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-xl shadow-xl w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>Create Log</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type='hidden' value={habitId} />

          <div>
            <label className='block mb-2 font-medium'>Goal Level</label>
            <div className='flex gap-4'>
              {['A', 'B', 'C'].map((level) => (
                <label key={level} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='goalLevel'
                    value={level}
                    checked={goalLevel === level}
                    onChange={() => setGoalLevel(level as 'A' | 'B' | 'C')}
                    className='accent-blue-600 w-6 h-6 cursor-pointer'
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
            >
              Submit
            </button>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400'
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
