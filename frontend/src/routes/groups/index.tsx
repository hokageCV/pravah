import { createFileRoute, Link } from '@tanstack/react-router';
import { GroupList } from '../../components/groups/group-list';

export const Route = createFileRoute('/groups/')({
  component: Component,
});

function Component() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='mb-6'>
        <Link
          to='/groups/create'
          className='inline-block bg-c-text text-white font-semibold px-5 py-2 rounded-md shadow hover:bg-c-text-muted transition-colors'
        >
          + Create Group
        </Link>
      </div>
      <GroupList />
    </div>
  );
}
