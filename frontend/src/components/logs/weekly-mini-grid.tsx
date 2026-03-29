import { useMemo } from 'react';
import type { Log } from '../../types';

type WeeklyMiniGridProps = {
  logs: Log[];
  habitId: number;
  habitCreatedAt: string;
};

function getWeekDates(): string[] {
  let dates: string[] = [];
  let today = new Date();
  for (let i = 6; i >= 0; i--) {
    let date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function getGoalClass(goalLevel: string | undefined): string {
  if (!goalLevel) return '';
  if (goalLevel === 'A') return 'bg-c-goal-a';
  if (goalLevel === 'B') return 'bg-c-goal-b';
  if (goalLevel === 'C') return 'bg-c-goal-c';
  return '';
}

export function WeeklyMiniGrid({ logs, habitId, habitCreatedAt }: WeeklyMiniGridProps) {
  let weekDates = useMemo(() => getWeekDates(), []);
  let logMap = useMemo(() => {
    let map = new Map<string, string>();
    logs.forEach((log) => {
      if (!log.goalLevel) return;
      let key = `${log.habitId}_${log.date}`;
      map.set(key, log.goalLevel);
    });
    return map;
  }, [logs]);

  let createdAtDateStr = habitCreatedAt.split('T')[0];
  let today = new Date().toISOString().split('T')[0];

  return (
    <div className='flex gap-1.5 sm:gap-1'>
      {weekDates.map((date) => {
        let key = `${habitId}_${date}`;
        let goalLevel = logMap.get(key);

        let bgClass = '';
        let showLevel = false;
        let isDot = false;
        let isToday = date === today;
        let isFuture = date > today;
        let isBeforeCreation = date < createdAtDateStr;

        if (isFuture || isBeforeCreation) {
          bgClass = 'bg-c-surface-muted opacity-30';
        } else if (goalLevel) {
          bgClass = getGoalClass(goalLevel);
          showLevel = true;
        } else {
          bgClass = 'bg-c-goal-miss';
          isDot = true;
        }

        let dayLabel = isToday ? date.split('-')[2] : '';
        let innerOpacity = isDot ? 'opacity-15' : '';
        let showNumber = isToday;

        return (
          <div
            key={date}
            className={`w-6 h-6 sm:w-7 sm:h-7 p-1 rounded text-center text-xs font-medium ${bgClass} ${isDot ? 'scale-25 rounded-4xl' : 'rounded-xs'} ${!showLevel && !isFuture && !isBeforeCreation ? 'text-c-text-muted' : 'text-white'}`}
            title={date}
          >
            <span className={`${innerOpacity} ${showNumber ? '' : 'invisible select-none'}`}>
              {dayLabel || '88'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
