import { getAuthToken } from './auth';

type FetchMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type FetchOptions<T> = {
  url: string;
  method: FetchMethod;
  data?: T;
};

export async function safeFetch<T>({ url, method, data }: FetchOptions<T>) {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`,
  }

  let options: RequestInit = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  }

  let res = await fetch(url, options)
  let result = await res.json()

  if (!res.ok) throw new Error(result?.error || 'Unknown error')

  return result;
}
