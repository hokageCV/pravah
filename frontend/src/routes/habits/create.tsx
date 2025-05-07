import { createFileRoute } from '@tanstack/react-router'
import { CreateHabit } from '../../components/habits/create-habit'

export const Route = createFileRoute('/habits/create')({
  component: CreateHabit
})

