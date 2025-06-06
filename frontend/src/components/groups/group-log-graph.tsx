import { useQuery } from '@tanstack/react-query'
import { MemberHabit } from '../../types'
import { getMonthData, mapLogToLevels } from '../../utils/date'
import { DayCell } from '../logs/graph-day-cell'
import { fetchGroupLogs } from '../logs/log.api'

type GroupLogGraphProps = {
  groupId: number
  usersData: MemberHabit[]
}

export function GroupLogGraph({ groupId, usersData }: GroupLogGraphProps) {
  let {
    data: logs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['group_logs', groupId],
    queryFn: () => fetchGroupLogs(groupId),
  })

  if (isLoading) return undefined
  if (isError) return <div>Error: {(error as Error).message}</div>
  if (!logs) return undefined

  let logGoalLevels = mapLogToLevels(logs)

  let now = new Date()
  let year = now.getFullYear()
  let monthName = now.toLocaleString('default', { month: 'long' })
  let monthIndex = now.getMonth()
  let monthData = getMonthData({ year, monthName, index: monthIndex })

  return (
    <div className='grid-flex'>
      {usersData.map((userData, idx) => (
        <div key={idx} className='h-64  grid grid-rows-[auto_1fr] items-start justify-center'>
          <h2 className='text-xl font-semibold mb-2 '>{userData.userName}</h2>
          <p>{userData.habitName}</p>
          <div className='grid grid-cols-7 gap-1 text-sm content-start'>
            {monthData.days.map((dayObj, i) => (
              <DayCell
                dayObj={dayObj}
                logGoalLevels={logGoalLevels}
                index={i}
                habitId={userData.habitId}
                habitCreatedAt={userData.habitCreatedAt}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
