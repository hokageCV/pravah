import { useState } from 'react'
import type { Habit } from '../../types'

type HabitFormProps = {
  initialValue: Partial<Habit>
  onSubmit: (habit: Partial<Habit>) => void
}

export function HabitForm({ initialValue, onSubmit }: HabitFormProps) {
  let [formData, setFormData] = useState<Partial<Habit>>(initialValue)

  let handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input name='name' value={formData.name ?? ''} onChange={handleChange} required />
      </div>

      <div>
        <label>Description</label>
        <textarea name='description' value={formData.description ?? ''} onChange={handleChange} />
      </div>

      <button type='submit'>Save Habit</button>
    </form>
  )
}
