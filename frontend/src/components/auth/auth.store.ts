import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../../types';

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: AuthState['user']) => void;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'pravah-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
