import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ConfirmationModal } from '../shared/confirmation-modal'
import { DeleteSvg2 } from '../svgs/delete2'
import { deleteGroupHabit } from './group_habits.api'

type DeleteGroupHabitProps = {
  groupId: number
  habitId: number
  onDelete?: () => void
}

export function DeleteGroupHabit({ groupId, habitId, onDelete }: DeleteGroupHabitProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => deleteGroupHabit(groupId, habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_logs', groupId] })
      onDelete?.()
    },
  })

  const handleDeleteClick = () => setIsModalOpen(true)
  const handleConfirmDelete = () => {
    deleteMutation.mutate()
    setIsModalOpen(false)
  }

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={deleteMutation.isPending}
        className='p-1 text-c-text hover:text-c-danger disabled:opacity-50 cursor-pointer'
        aria-label='Delete habit'
      >
        <DeleteSvg2 />
        {deleteMutation.isPending && ' Deleting...'}
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete this Habit?'
        message='This will remove the habit from the group. Are you sure?'
      />
    </>
  )
}
