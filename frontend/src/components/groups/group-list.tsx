import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { Group } from '../../types'
import { capitalize } from '../../utils/text'
import { useAuthStore } from '../auth/auth.store'
import { DeleteSvg } from '../svgs/delete'
import { AddHabits } from './add-habits'
import { AddMembers } from './add-members'
import { useGroupStore } from './group.store'
import { deleteGroup, fetchJoinedGroups } from './groups.api'

export function GroupList() {
  let queryClient = useQueryClient()

  let groups = useGroupStore((state) => state.groups)
  let setGroups = useGroupStore((state) => state.setGroups)
  let userId = useAuthStore((state) => state.user?.id)

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ['groups', userId],
    queryFn: () => fetchJoinedGroups(),
  })

  useEffect(() => {
    if (data) setGroups(data)
  }, [data])

  let handleDelete = async (group: Group) => {
    if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
      try {
        await deleteGroup(group.id)
        setGroups(groups.filter((g) => g.id !== group.id))
        queryClient.invalidateQueries({ queryKey: ['groups'] })
      } catch (err) {
        alert((err as Error).message)
      }
    }
  }

  if (isLoading) return <p>Loading groups...</p>
  if (isError) return <p>Error loading groups: {error?.message}</p>
  if (!groups || groups.length === 0) return <p className='text-c-text-muted'>No groups found.</p>

  return (
    <ul className='grid gap-y-1 max-w-2xs'>
      {groups
        .filter((group) => group && group.id != null)
        .map((group) => (
          <li
            key={group.id}
            className='grid grid-cols-[1fr_auto_auto] items-center rounded-md p-1 hover:bg-c-surface transition'
          >
            <Link to='/groups/$groupId' params={{ groupId: group.id.toString() }}>
              <span>{capitalize(group.name)}</span>
            </Link>

            <div className='flex gap-1 max-w-sm'>
              {group.ownerId == userId && <AddMembers group={group} />}
              <AddHabits group={group} />
            </div>

            {group.ownerId == userId && (
              <button
                onClick={() => handleDelete(group)}
                className='p-1 text-c-text-muted hover:cursor-pointer'
                aria-label={`Delete ${group.name}`}
              >
                <DeleteSvg className='w-4 h-4' />
              </button>
            )}
          </li>
        ))}
    </ul>
  )
}
