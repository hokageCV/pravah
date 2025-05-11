import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Log } from '../../types'
import { deleteLog, fetchLogs } from './log.api'

type LogListProps = {
  habitId: number
}

export function LogList({ habitId }: LogListProps) {
  let queryClient = useQueryClient()
  let [logs, setLogs] = useState<Log[]>([])

  let {
    data: fetchedLogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['logs', { habitId }],
    queryFn: () => fetchLogs(habitId),
  })
  useEffect(() => {
    if (fetchedLogs) setLogs(fetchedLogs)
  }, [fetchedLogs])

  let { mutate } = useMutation({
    mutationFn: deleteLog,
    onSuccess: (_data, logId) => {
      queryClient.invalidateQueries({ queryKey: ['logs', { habitId }] })
      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId))
    },
  })

  let handleDelete = (logId: number) => mutate(logId)

  if (isLoading) return <p>Loading logs...</p>
  if (isError) return <p>Error loading logs: {error?.message}</p>
  if (!logs || logs.length === 0) return <p>No logs found.</p>

  return (
    <>
      <div>log list</div>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <span>
              {log.goalLevel}: {log.date}{' '}
            </span>
            <button onClick={() => handleDelete(log.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  )
}
