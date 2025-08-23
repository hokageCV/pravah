import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Habit, Log } from '../../types';
import { getCalendarData, mapLogToLevels } from '../../utils/date';
import { DayCell } from './graph-day-cell';
import { fetchLogs } from './log.api';

type LogGraphProps = {
  habit: Habit;
};

export function LogGraph({ habit }: LogGraphProps) {
  let [logs, setLogs] = useState<Log[]>([]);
  let [streakInfo, setStreakInfo] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });
  let habitId = habit.id;

  let {
    data: logResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['logs', { habitId }],
    queryFn: () => fetchLogs(habitId),
  });
  useEffect(() => {
    if (!logResponse) return;
    setLogs(logResponse.logs);
    setStreakInfo(logResponse.streakInfo);
  }, [logResponse]);

  if (isLoading) return <p>Loading logs...</p>;
  if (isError) return <p>Error loading logs: {error?.message}</p>;
  if (!logs || logs.length === 0)
    return <p className='text-c-text-muted'>No logs found.</p>;

  let logGoalLevels = mapLogToLevels(logs);
  let results = getCalendarData(new Date().getUTCFullYear());

  return (
    <>
      <StreakDisplay streakInfo={streakInfo} />

      <div className='grid-flex'>
        {results.map((month, idx) => (
          <div
            key={idx}
            className='h-64  grid grid-rows-[auto_1fr] items-start justify-center'
          >
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
    </>
  );
}

function StreakDisplay({
  streakInfo,
}: {
  streakInfo: { currentStreak: number; longestStreak: number };
}) {
  return (
    <div className='flex gap-6 justify-center mb-6 p-4 bg-muted/50 rounded-lg'>
      <div className='text-center'>
        <p className='text-2xl font-bold text-accent'>
          {streakInfo.currentStreak}
        </p>
        <p className='text-sm text-muted-foreground'>Current Streak</p>
      </div>
      <div className='text-center'>
        <p className='text-2xl font-bold text-muted-foreground'>
          {streakInfo.longestStreak}
        </p>
        <p className='text-sm text-muted-foreground'>Longest Streak</p>
      </div>
    </div>
  );
}
