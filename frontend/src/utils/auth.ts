import { useAuthStore } from '../components/auth/auth.store';

export function isAuthenticated() {
  return useAuthStore.getState().user !== null;
}

export function getAuthToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('No token found in auth store');
  return token;
}
