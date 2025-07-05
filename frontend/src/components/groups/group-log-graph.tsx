import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { MemberHabit } from '../../types';
import { getMonthData, mapLogToLevels } from '../../utils/date';
import { capitalize } from '../../utils/text';
import { useAuthStore } from '../auth/auth.store';
import { DayCell } from '../logs/graph-day-cell';
import { fetchGroupLogs } from '../logs/log.api';
import { DeleteGroupHabit } from './delete-group-habit';

type GroupLogGraphProps = {
  groupId: number;
  usersData: MemberHabit[];
};

export function GroupLogGraph({ groupId, usersData }: GroupLogGraphProps) {
  let userId = useAuthStore((state) => state.user?.id);

  let {
    data: logs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['group_logs', groupId],
    queryFn: () => fetchGroupLogs(groupId),
  });

  let [filteredUsersData, setFilteredUsersData] = useState(usersData);

  let handleHabitDelete = (deletedHabitId: number) => {
    setFilteredUsersData((prev) =>
      prev.filter((user) => user.habitId !== deletedHabitId),
    );
  };

  if (isLoading) return undefined;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!logs) return undefined;

  let logGoalLevels = mapLogToLevels(logs);

  let now = new Date();
  let year = now.getFullYear();
  let monthName = now.toLocaleString('default', { month: 'long' });
  let monthIndex = now.getMonth();
  let monthData = getMonthData({ year, monthName, index: monthIndex });

  return (
    <div className='grid-flex my-4'>
      {filteredUsersData.map((userData, idx) => (
        <div
          key={`${userData.habitId}-${idx}`}
          className='min-h-64 p-2 grid grid-rows-[auto,1fr] grid-cols-[1fr,auto] bg-c-surface rounded-md shadow-md gap-2'
        >
          <div className='col-start-1 row-start-1 overflow-hidden'>
            <h2 className='text-xl font-semibold truncate'>
              {capitalize(userData.userName)}
            </h2>
            <p className='text-c-text-muted truncate'>
              {capitalize(userData.habitName)}
            </p>
          </div>

          <div className='col-start-2 row-start-1 flex gap-2 shrink-0 justify-self-end self-start'>
            {userId === userData.userId && (
              <DeleteGroupHabit
                groupId={groupId}
                habitId={userData.habitId}
                onDelete={() => handleHabitDelete(userData.habitId)}
              />
            )}
          </div>

          <div className='col-span-2 row-start-2'>
            <div className='grid grid-cols-7 gap-1 text-sm max-w-cell-w max-h-cell-h m-auto'>
              {monthData.days.map((dayObj, i) => (
                <DayCell
                  key={i}
                  dayObj={dayObj}
                  logGoalLevels={logGoalLevels}
                  index={i}
                  habitId={userData.habitId}
                  habitCreatedAt={userData.habitCreatedAt}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
