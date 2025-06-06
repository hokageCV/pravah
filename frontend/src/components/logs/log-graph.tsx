import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Habit, Log } from '../../types'
import { getCalendarData, mapLogToLevels } from '../../utils/date'
import { DayCell } from './graph-day-cell'
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

  let logGoalLevels = mapLogToLevels(logs)
  let results = getCalendarData(new Date().getFullYear())

  return (
    <div className='grid-flex'>
      {results.map((month, idx) => (
        <div key={idx} className='h-64  grid grid-rows-[auto_1fr] items-start justify-center'>
          <h2 className='text-xl font-semibold mb-2 '>{month.name}</h2>
          <div className='grid grid-cols-7 gap-1 text-sm content-start'>
            {month.days.map((dayObj, i) => (
              <DayCell
                dayObj={dayObj}
                logGoalLevels={logGoalLevels}
                index={i}
                habitId={habit.id}
                habitCreatedAt={habit.createdAt}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
