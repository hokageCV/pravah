import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { Group } from '../../types'
import { capitalize } from '../../utils/text'
import { useAuthStore } from '../auth/auth.store'
import { AddSvg } from '../svgs/add'
import { DeleteSvg } from '../svgs/delete'
import { useGroupStore } from './group.store'
import { deleteGroup, fetchJoinedGroups } from './groups.api'

export function GroupList() {
  let queryClient = useQueryClient()

  let groups = useGroupStore((state) => state.groups)
  let setGroups = useGroupStore((state) => state.setGroups)
  let userId = useAuthStore((state) => state.user?.id)

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ['groups'],
    queryFn: () => fetchJoinedGroups(),
  })

  useEffect(() => {
    if (data) setGroups(data)
  }, [data])

  let handleAdd = (group: Group) => console.log('add')

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
      {groups.map((group) => (
        <li
          key={group.id}
          className='grid grid-cols-[1fr_auto_auto] items-center rounded-md p-1 hover:bg-c-surface transition'
        >
          <span>{capitalize(group.name)}</span>

          {group.ownerId == userId && (
            <button
              onClick={() => handleAdd(group)}
              className='p-1 text-c-text-muted hover:cursor-pointer'
              aria-label={`Edit ${group.name}`}
            >
              <AddSvg className='w-4 h-4' />
            </button>
          )}

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
