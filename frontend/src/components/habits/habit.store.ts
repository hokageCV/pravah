import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Habit } from '../../types';

type HabitState = {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  removeHabit: (id: number) => void;
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

      setHabits: (habits) => set({ habits }),

      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, habit],
      })),

      updateHabit: (habit) => set((state) => ({
        habits: state.habits.map(h => h.id === habit.id ? habit : h),
      })),

      removeHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id),
      })),
    }),
    {
      name: 'pravah-habit-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

