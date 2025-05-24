export function getCalendarDataWithPadding(year: number) {
  let currentYear = new Date().getFullYear()
  let currentMonth = new Date().getMonth()

  let lastMonthIndex = year === currentYear ? currentMonth : 11

  let months =
    Array.from({ length: lastMonthIndex + 1 }, (_, m) =>
      new Date(Date.UTC(year, m, 1)).toLocaleString('default', { month: 'long' })
    )

  let data =
    months.map((monthName, index) => {
      let daysInMonth = new Date(Date.UTC(year, index + 1, 0)).getUTCDate()

      const days = []

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
      let paddedDays = Array(firstDay).fill(null).concat(days)

      return {
        name: monthName,
        days: paddedDays,
      }
    })

  return data
}

export function isSameDate(d1: Date, d2: Date): boolean {
  return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10)
}
