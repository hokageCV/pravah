import { BASE_URL } from '../../constants';
import type { Log, LogResponse, StreakInfo } from '../../types';
import { safeFetch } from '../../utils/api';

export async function fetchLogs(habitId: number): Promise<LogResponse> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs?habit_id=${habitId}`,
    method: 'GET',
  });
  return result.data;
}

export async function createLog(data: Partial<Log>): Promise<Log> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs/`,
    method: 'POST',
    data,
  });
  return result.data;
}

export async function fetchLog(logId: number): Promise<Log> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs/${logId}`,
    method: 'GET',
  });
  return result.data;
}

export async function updateLog(log: Log): Promise<Log> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs/${log.id}`,
    method: 'PATCH',
    data: log,
  });
  return result.data;
}

export async function deleteLog(logId: number): Promise<Log> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs/${logId}`,
    method: 'DELETE',
  });
  return result.data;
}

export async function fetchGroupLogs(groupId: number): Promise<Log[]> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs/grouped-logs?group_id=${groupId}`,
    method: 'GET',
  });
  return result.data;
}

export async function fetchStreaks(habitId: number): Promise<StreakInfo> {
  let result = await safeFetch({
    url: `${BASE_URL}/habit_logs/streaks?habit_id=${habitId}`,
    method: 'GET',
  });
  return result.data;
}
