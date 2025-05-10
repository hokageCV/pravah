import { createFileRoute } from '@tanstack/react-router'
import { CreateGoal } from '../../components/goals/create-goal'

export const Route = createFileRoute('/goals/create')({
  component: CreateGoal,
})
