import { createFileRoute } from '@tanstack/react-router'
import { EditHabit } from '../../../components/habits/edit-habit'

export const Route = createFileRoute('/habits/$habitId/edit')({
  component: EditHabit
})
