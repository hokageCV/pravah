import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { Group } from '../../types'
import { GroupForm } from './group-form'
import { createGroup } from './groups.api'

let initialGroupValue: Partial<Group> = { name: '' }

export function CreateGroup() {
  let queryClient = useQueryClient()
  let navigate = useNavigate()

  let { mutate, status, error } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      navigate({ to: '/groups' })
    },
  })

  let handleSubmit = (data: Partial<Group>) => mutate(data)

  return (
    <>
      <GroupForm initialValue={initialGroupValue} onSubmit={handleSubmit} />

      {status === 'pending' && <p>Creating group...</p>}
      {status === 'error' && <p>Error: {(error as Error).message}</p>}
      {status === 'success' && <p>Group created!</p>}
    </>
  )
}
