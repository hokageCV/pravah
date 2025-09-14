import { useQuery } from '@tanstack/react-query';
import { fetchGroupGrades } from './groups.api';

type GroupLeaderboardProps = {
  groupId: number;
};

export function GroupLeaderboard({ groupId }: GroupLeaderboardProps) {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1; // Months are 1-indexed in the backend

  let {
    data: grades,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['group_grades', groupId, year, month],
    queryFn: () => fetchGroupGrades(groupId, year, month),
  });

  if (isLoading) return <div>Loading Leaderboard...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!grades || grades.length === 0)
    return <div>No grades for this month.</div>;

  return (
    <div className='mt-4 bg-c-surface p-4 rounded-md shadow-md'>
      <h3 className='text-lg font-bold mb-2'>Monthly Leaderboard</h3>
      <ol className='list-decimal list-inside'>
        {grades.map((gradeEntry, index) => (
          <li
            key={gradeEntry.userId}
            className='flex justify-between items-center py-1'
          >
            <span>
              {index + 1}. {gradeEntry.username}
            </span>
            <span className='font-semibold'>{gradeEntry.grade} points</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
