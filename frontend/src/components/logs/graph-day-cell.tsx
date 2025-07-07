import type { DayData } from '../../types';

type DayCellProps = {
  dayObj: DayData | null;
  logGoalLevels: Map<string, string>;
  index: number;
  habitId: number;
  habitCreatedAt: string;
};

export function DayCell({
  dayObj,
  logGoalLevels,
  index,
  habitId,
  habitCreatedAt,
}: DayCellProps) {
  if (!dayObj || !dayObj.date) return <div key={index} />;
  if (!habitCreatedAt) {
    console.warn('habitCreatedAt is undefined in DayCell', { habitId, index });
    return <div key={index} />;
  }

  let dayDateStr = dayObj.date;
  let key = `${habitId}_${dayDateStr}`;
  let goalLevel = logGoalLevels.get(key);

  let createdAtDateStr = habitCreatedAt.split('T')[0];
  let today = new Date().toISOString().split('T')[0];

  let hasGoal = !!goalLevel;

  let highlightClass = '';
  if (dayDateStr < createdAtDateStr && !hasGoal)
    highlightClass = 'bg-c-surface-muted text-c-text';
  else if (dayDateStr > today)
    highlightClass = 'bg-c-surface-muted text-c-text';
  else if (hasGoal) {
    if (goalLevel === 'A') highlightClass = 'bg-c-goal-a  text-white';
    else if (goalLevel === 'B') highlightClass = 'bg-c-goal-b text-white';
    else if (goalLevel === 'C') highlightClass = 'bg-c-goal-c text-white';
  } else if (dayDateStr === today) {
    highlightClass = 'bg-c-surface-muted text-c-text';
  } else if (!hasGoal) highlightClass = 'bg-c-goal-miss text-c-text';

  let isGoalMiss = highlightClass.includes('bg-c-goal-miss');
  let isValidGoal = ['bg-c-goal-a', 'bg-c-goal-b', 'bg-c-goal-c'].some((cls) =>
    highlightClass.includes(cls),
  );
  let opacityClass = '';
  if (isGoalMiss) opacityClass = 'opacity-15';
  else if (!isValidGoal) opacityClass = 'opacity-50';

  return (
    <div
      key={index}
      className={`p-1 rounded rounded-xs text-center ${highlightClass}`}
    >
      <span
        className={` ${opacityClass} ${dayDateStr === today ? '' : 'invisible select-none'}`}
      >
        {dayDateStr === today ? dayDateStr.split('-')[2] : '88'}
      </span>
    </div>
  );
}
