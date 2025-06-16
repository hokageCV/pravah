import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Group } from '../../types'
import { useAuthStore } from '../auth/auth.store'
import { AddSvg } from '../svgs/add'
import { AddHabitsModal } from './add-habits-modal'
import { fetchExistingHabits } from './group_habits.api'

type AddHabitsProp = {
  group: Group
}

export function AddHabits({ group }: AddHabitsProp) {
  let [showModal, setShowModal] = useState(false)
  let handleClose = () => setShowModal(false)

  let userId = useAuthStore((state) => state?.user?.id)
  if (!userId) return null

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ['group_habits', group.id, userId],
    queryFn: () => fetchExistingHabits(group.id, userId),
    enabled: !!userId,
  })

  if (isLoading || isError || (data && data?.length > 0)) return null

  return (
    <div>
      <button onClick={() => setShowModal(true)} className='px-4 py-2 rounded-md cursor-pointer'>
        <AddSvg className='w-4 h-4' />
      </button>

      {showModal && <AddHabitsModal group={group} close={handleClose} />}
    </div>
  )
}
