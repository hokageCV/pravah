import type { DayData } from '../../types'
import { isSameDate } from '../../utils/date'

type DayCellProps = {
  dayObj: DayData | null
  logGoalLevels: Map<string, string>
  index: number
  habitId: number
  habitCreatedAt: string
}

export function DayCell({ dayObj, logGoalLevels, index, habitId, habitCreatedAt }: DayCellProps) {
  if (!dayObj) return <div key={index} />

  let dateKey = new Date(dayObj.date).toISOString().split('T')[0]
  let key = `${habitId}_${dateKey}`
  let goalLevel = logGoalLevels.get(key)
  let highlightClass = ''
  let dayDate = new Date(dayObj.date)
  let createdAtDate = new Date(habitCreatedAt)
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
    <div key={index} className={`p-1 rounded rounded-xs text-center ${highlightClass}`}>
      <span className={`text-white ${opacityClass}`}>{new Date(dayObj.date).getDate()}</span>
    </div>
  )
}
