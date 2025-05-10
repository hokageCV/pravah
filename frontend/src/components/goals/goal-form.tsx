import { useState } from 'react'
import { Goal } from '../../types'

type GoalFormProps = {
  initialValue: Partial<Goal>
  onSubmit: (goal: Partial<Goal>) => void
}

export function GoalForm({ initialValue, onSubmit }: GoalFormProps) {
  let [formData, setFormData] = useState<Partial<Goal>>(initialValue)

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='level'>Value</label>
        <select name='level' value={formData.level ?? ''} onChange={handleChange} required>
          <option value='' disabled>
            Select one
          </option>
          <option value='A'>A</option>
          <option value='B'>B</option>
          <option value='C'>C</option>
        </select>
      </div>
      <div>
        <label htmlFor='description'>Description</label>
        <textarea
          name='description'
          value={formData.description ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor='unit'>Unit</label>
        <input
          name='unit'
          type='text'
          value={formData.unit ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor='targetValue'>targetValue</label>
        <input
          name='targetValue'
          type='number'
          min={0}
          value={formData.targetValue ?? ''}
          onChange={handleChange}
          required
        />
      </div>

      <button type='submit'>Save Goal</button>
    </form>
  )
}
