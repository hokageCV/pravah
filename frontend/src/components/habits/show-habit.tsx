import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { capitalize } from '../../utils/text'
import { GoalList } from '../goals/goal-list'
import { useGoalStore } from '../goals/goal.store'
import { CreateLog } from '../logs/create-log'
import { LogGraph } from '../logs/log-graph'
import { DeleteSvg } from '../svgs/delete'
import { EditSvg } from '../svgs/edit'
import { GoalSvg } from '../svgs/goal'
import { useHabitStore } from './habit.store'
import { deleteHabit } from './habits.api'

export default function ShowHabit() {
  let queryClient = useQueryClient()

  let { habitId } = useParams({ strict: false }) as { habitId: string }
  let id = Number(habitId)

  let habit = useHabitStore((state) => state.habits.find((h) => h.id === id))
  if (!habit) return <p>Habit not found.</p>

  let navigate = useNavigate()
  let handleEditClick = () => navigate({ to: `/habits/${habit.id}/edit` })

  let { mutate: deleteMutate } = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      navigate({ to: '/' })
    },
  })
  let handleDeleteClick = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) deleteMutate(habit.id)
  }

  let goals = useGoalStore((state) => state.goals)
  let habitGoals = goals.filter((goal) => goal.habitId === habit.id)
  let showCreateGoal = habitGoals.length < 3

  return (
    <div className='max-w-5xl mx-auto py-4 px-2 @container/main'>
      <div className='flex flex-col @3xl/main:flex-row gap-2'>
        <section className='bg-c-surface rounded-md shadow-md w-full p-4 @3xl/main:flex-1 @container/habit'>
          <div className='flex flex-col @lg/habit:flex-row  items-start gap-4'>
            <div className='flex-1 min-w-[200px]'>
              <h2 className='text-2xl text-c-text font-semibold'>{capitalize(habit.name)}</h2>
              {habit.description && (
                <p className='mt-2 break-words text-c-text/80'>{capitalize(habit.description)}</p>
              )}
            </div>

            <div className='flex flex-row items-start mt-2 shrink-0'>
              <button
                onClick={handleEditClick}
                className='p-2 rounded bg-c-accent-subtle hover:bg-c-accent-hover cursor-pointer'
              >
                <EditSvg />
              </button>
              <button
                onClick={handleDeleteClick}
                className='ml-2 px-4 py-2 rounded bg-c-accent-subtle hover:bg-c-accent-hover cursor-pointer'
              >
                <DeleteSvg />
              </button>
            </div>
          </div>
        </section>

        <div className='divider'></div>

        <section className='bg-c-surface rounded-md shadow-md w-full p-4 @3xl/main:flex-1'>
          <h3 className='text-xl text-text font-semibold inline-flex'>
            <GoalSvg />
            <span>Goals</span>
          </h3>

          <div className='flex flex-col justify-between'>
            <GoalList />
            {showCreateGoal && (
              <Link
                to='/goals/create'
                search={{ habitId: habit.id }}
                className='btn border-none bg-c-accent-subtle hover:bg-c-accent-hover self-end'
              >
                Create Goal
              </Link>
            )}
          </div>
        </section>
      </div>

      <div className='divider'></div>

      <section className='bg-c-surface rounded-md shadow-md w-full mt-4 p-4'>
        <div className='flex justify-between'>
          <h3 className='text-xl text-text font-semibold'>Progress</h3>
          <CreateLog habit={habit} />
        </div>
        <div>
          <LogGraph habit={habit} />
        </div>
      </section>
    </div>
  )
}
