import type { DayData, Log, MonthData } from '../types'

type GetMonthDataParams = {
  year: number
  monthName: string
  index: number
}

export function getMonthData({ year, monthName, index }: GetMonthDataParams): MonthData {
  let daysInMonth = new Date(Date.UTC(year, index + 1, 0)).getUTCDate()

  let days: DayData[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    let utcDate = new Date(Date.UTC(year, index, day))
    let weekday = utcDate.getUTCDay()

    days.push({
      day: utcDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' }),
      date: utcDate.toISOString().split('T')[0],
      weekday,
    })
  }

  let firstDay = days[0].weekday
  let paddedDays: (DayData | null)[] = Array(firstDay).fill(null).concat(days)

  return {
    name: monthName,
    days: paddedDays,
  }
}

export function getCalendarData(year: number): MonthData[] {
  let now = new Date()
  let currentYear = now.getFullYear()
  let currentMonth = now.getMonth()

  let lastMonthIndex = year === currentYear ? currentMonth : 11

  let months =
    Array.from({ length: lastMonthIndex + 1 }, (_, m) =>
      new Date(Date.UTC(year, m, 1)).toLocaleString('default', { month: 'long' })
    )

  let data = months.map((monthName, index) => getMonthData({ year, monthName, index }))

  return data
}

export function isSameDate(d1: Date, d2: Date): boolean {
  return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10)
}

export function mapLogToLevels(logs: Log[]): Map<string, string> {
  let logGoalLevels = new Map<string, string>()

  for (let log of logs) {
    let dateStr = new Date(log.date).toISOString().split('T')[0]
    let key = `${log.habitId}_${dateStr}`
    logGoalLevels.set(key, log.goalLevel ?? '')
  }

  return logGoalLevels
}
