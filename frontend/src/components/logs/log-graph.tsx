import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Habit, Log } from '../../types'
import { getCalendarDataWithPadding, isSameDate } from '../../utils/date'
import { fetchLogs } from './log.api'

type LogGraphProps = {
  habit: Habit
}

export function LogGraph({ habit }: LogGraphProps) {
  let [logs, setLogs] = useState<Log[]>([])
  let habitId = habit.id

  let {
    data: fetchedLogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['logs', { habitId }],
    queryFn: () => fetchLogs(habitId),
  })
  useEffect(() => {
    if (fetchedLogs) setLogs(fetchedLogs)
  }, [fetchedLogs])

  if (isLoading) return <p>Loading logs...</p>
  if (isError) return <p>Error loading logs: {error?.message}</p>
  if (!logs || logs.length === 0) return <p className='text-c-text-muted'>No logs found.</p>

  let logGoalLevels = new Map<string, string>()
  for (let log of logs) {
    let dateStr = new Date(log.date).toISOString().split('T')[0]
    logGoalLevels.set(dateStr, log.goalLevel ?? '')
  }
  let results = getCalendarDataWithPadding(new Date().getFullYear())

  return (
    <div className='grid-flex'>
      {results.map((month, idx) => (
        <div key={idx} className='h-64  grid grid-rows-[auto_1fr] items-start justify-center'>
          <h2 className='text-xl font-semibold mb-2 '>{month.name}</h2>
          <div className='grid grid-cols-7 gap-1 text-sm content-start'>
            {month.days.map((dayObj, i) => {
              if (!dayObj) return <div key={i} />

              let dateKey = new Date(dayObj.date).toISOString().split('T')[0]
              let goalLevel = logGoalLevels.get(dateKey)
              let highlightClass = ''
              let dayDate = new Date(dayObj.date)
              let createdAtDate = new Date(habit.createdAt)
              let today = new Date()
              let hasGoal = !!goalLevel

              if (dayDate < createdAtDate) highlightClass = 'bg-c-surface-muted text-white'
              else if (dayDate > today) highlightClass = 'bg-c-surface-muted text-white'
              else if (hasGoal) {
                if (goalLevel === 'A') highlightClass = 'bg-c-goal-a  text-white'
                else if (goalLevel === 'B') highlightClass = 'bg-c-goal-b text-white'
                else if (goalLevel === 'C') highlightClass = 'bg-c-goal-c text-white'
              } else if (isSameDate(dayDate, today)) {
                highlightClass = 'bg-c-surface-muted text-white'
              } else if (!hasGoal) highlightClass = 'bg-c-goal-miss text-white'

              let isGoalMiss = highlightClass.includes('bg-c-goal-miss')
              let isValidGoal = ['bg-c-goal-a', 'bg-c-goal-b', 'bg-c-goal-c'].some((cls) =>
                highlightClass.includes(cls)
              )
              let opacityClass = ''
              if (isGoalMiss) opacityClass = 'opacity-15'
              else if (!isValidGoal) opacityClass = 'opacity-50'

              return (
                <div key={i} className={`p-1 rounded rounded-xs text-center ${highlightClass}`}>
                  <span className={`text-white ${opacityClass}`}>
                    {new Date(dayObj.date).getDate()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
