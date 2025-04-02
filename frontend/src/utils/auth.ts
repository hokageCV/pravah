import { useAuthStore } from '../components/auth/auth.store'

export function isAuthenticated() {
  return useAuthStore.getState().user !== null;
}
