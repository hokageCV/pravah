import { createFileRoute } from '@tanstack/react-router';
import { EditGoal } from '../../../components/goals/edit-goal';

export const Route = createFileRoute('/goals/$goalId/edit')({
  component: EditGoal,
});
