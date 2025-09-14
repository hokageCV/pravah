import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { capitalize } from '../../utils/text';
import { GroupLeaderboard } from './group-leaderboard';
import { GroupLogGraph } from './group-log-graph';
import { useGroupStore } from './group.store';
import { fetchMembersWithHabits } from './group_members.api';

export function ShowGroup() {
  let { groupId } = useParams({ strict: false }) as { groupId: string };
  let id = Number(groupId);
  let group = useGroupStore((state) => state.groups.find((g) => g.id === id));

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ['groups', id],
    queryFn: () => fetchMembersWithHabits(id),
  });

  if (isLoading) return <div>Loading groups...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!data || data.length === 0) return <div>No group members found.</div>;

  return (
    <div className='max-w-5xl mx-auto py-4 px-2'>
      <div className='bg-c-surface rounded-md shadow-md w-full p-4 text-center'>
        <h2 className='text-xl text-c-text font-semibold'>
          {capitalize(group?.name)}
        </h2>
      </div>
      <GroupLeaderboard groupId={id} />
      <GroupLogGraph groupId={id} usersData={data} />
    </div>
  );
}
