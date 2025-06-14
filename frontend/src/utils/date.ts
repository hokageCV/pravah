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
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekday],
      date: utcDate.toISOString().split('T')[0],
      weekday,
    })
  }

  let firstDay = days[0].weekday

  let paddedDays: (DayData | null)[] = Array(firstDay).fill(null).concat(days)
  let remainder = paddedDays.length % 7
  if (remainder !== 0) {
    paddedDays = paddedDays.concat(Array(7 - remainder).fill(null))
  }

  return {
    name: monthName,
    days: paddedDays,
  }
}

export function getCalendarData(year: number): MonthData[] {
  let now = new Date()
  let currentYear = now.getUTCFullYear()
  let currentMonth = now.getUTCMonth()

  let lastMonthIndex = year === currentYear ? currentMonth : 11

  let monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]

  let months = Array.from({ length: lastMonthIndex + 1 }, (_, m) => monthNames[m])

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
