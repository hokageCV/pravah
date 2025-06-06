import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { GroupLogGraph } from './group-log-graph'
import { fetchMembersWithHabits } from './group_members.api'

export function ShowGroup() {
  let { groupId } = useParams({ strict: false }) as { groupId: string }
  let id = Number(groupId)

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ['groups', id],
    queryFn: () => fetchMembersWithHabits(id),
  })

  if (isLoading) return <div>Loading groups...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>
  if (!data || data.length === 0) return <div>No group members found.</div>

  return (
    <>
      <div className='max-w-5xl mx-auto py-4 px-2 space-y-4'>
        <ul>
          {data.map((user) => (
            <li key={user.userId}>{user.userName}</li>
          ))}
        </ul>
      </div>
      <GroupLogGraph groupId={id} usersData={data} />
    </>
  )
}
