import { createFileRoute } from '@tanstack/react-router';
import { ShowGroup } from '../../../components/groups/show-group';

export const Route = createFileRoute('/groups/$groupId/')({
  component: ShowGroup,
});
