import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Goal } from '../../types';

type GoalState = {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  removeGoal: (id: number) => void;
};

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],

      setGoals: (goals) => set({ goals }),

      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),

      updateGoal: (goal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goal.id ? goal : g)),
        })),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
    }),
    {
      name: 'pravah-goal-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
