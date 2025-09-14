export type StreakResult = {
  currentStreak: number;
  longestStreak: number;
};

export function calculateStreaks(logs: { date: string }[]): StreakResult {
  if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const loggedDates = new Set(sortedLogs.map((log) => log.date));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const allDates = Array.from(loggedDates).sort((a, b) => a.localeCompare(b));

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(allDates[i - 1]);
      const currDate = new Date(allDates[i]);
      const diffDays =
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) tempStreak++;
      else if (diffDays > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  let checkDate = new Date();
  checkDate.setUTCHours(0, 0, 0, 0);

  const todayISO = checkDate.toISOString().split('T')[0];
  if (!loggedDates.has(todayISO))
    checkDate.setUTCDate(checkDate.getUTCDate() - 1);

  while (true) {
    const currentDayISO = checkDate.toISOString().split('T')[0];
    if (loggedDates.has(currentDayISO)) {
      currentStreak++;
      checkDate.setUTCDate(checkDate.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
}
