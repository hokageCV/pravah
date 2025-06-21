import { useMutation } from '@tanstack/react-query'
import { DeleteSvg2 } from '../svgs/delete2'
import { deleteGroupHabit } from './group_habits.api'

type DeleteGroupHabitProps = {
  groupId: number
  habitId: number
  onDelete?: () => void
}

export function DeleteGroupHabit({ groupId, habitId, onDelete }: DeleteGroupHabitProps) {
  let { mutate, isPending } = useMutation({
    mutationFn: () => deleteGroupHabit(groupId, habitId),
    onSuccess: () => {
      onDelete?.()
    },
  })

  let handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      mutate()
    }
  }

  return (
    <button
      onDoubleClick={handleDelete}
      disabled={isPending}
      className='p-1 text-c-text hover:text-c-danger disabled:opacity-50 cursor-pointer'
      aria-label='Delete habit'
    >
      <DeleteSvg2 />
      {isPending && ' Deleting...'}
    </button>
  )
}
