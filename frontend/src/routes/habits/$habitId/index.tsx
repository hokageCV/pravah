import { createFileRoute } from '@tanstack/react-router';
import ShowHabit from '../../../components/habits/show-habit';

export const Route = createFileRoute('/habits/$habitId/')({
  component: ShowHabit,
});
