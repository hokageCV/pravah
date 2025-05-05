import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthState = {
  user: { id: number; username: string } | null;
  setUser: (user: AuthState['user']) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'pravah-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
