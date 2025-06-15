import { useState } from 'react'
import { Goal } from '../../types'
import { useGoalStore } from './goal.store'

type GoalFormProps = {
  initialValue: Partial<Goal>
  onSubmit: (goal: Partial<Goal>) => void
  habitId: number
}

export function GoalForm({ initialValue, onSubmit, habitId }: GoalFormProps) {
  let [formData, setFormData] = useState<Partial<Goal>>(initialValue)

  let goals = useGoalStore((state) => state.goals)
  let usedLevels = goals
    .filter((goal) => goal.habitId === habitId)
    .map((goal) => goal.level) as string[]
  let currentLevel = formData.level
  let levelOptions = ['A', 'B', 'C'].filter(
    (lvl) => !usedLevels.includes(lvl) || lvl === currentLevel
  )

  let handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }))
  }

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className='py-8 px-4 flex items-center justify-center'>
      <div className='bg-c-surface border border-c-border rounded-2xl shadow-md p-8 w-full max-w-md'>
        <h2 className='text-xl font-semibold'>{initialValue.habitId ? 'Edit' : 'Create'} Goal</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-2'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-sm text-c-text'>Value</legend>
            <select
              name='level'
              value={formData.level ?? ''}
              onChange={handleChange}
              required
              disabled={!!initialValue.level}
              className='select w-full px-3 py-2 border border-c-border rounded-lg bg-white text-sm text-c-text focus:outline-none focus:ring-2 focus:ring-c-accent/40 focus:border-c-accent disabled:bg-slate-300 disabled:text-c-text'
            >
              <option value='' disabled={true} className='text-c-text-muted'>
                Select one
              </option>
              {levelOptions.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-sm text-c-text'>Description</legend>
            <textarea
              name='description'
              value={formData.description ?? ''}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-c-border rounded-lg bg-white text-sm text-c-text focus:outline-none focus:ring-2 focus:ring-c-accent/40 focus:border-c-accent'
            ></textarea>
          </fieldset>

          <button
            type='submit'
            className='btn bg-c-accent hover:bg-c-accent-hover border-none self-end'
          >
            Save Goal
          </button>
        </form>
      </div>
    </div>
  )
}
