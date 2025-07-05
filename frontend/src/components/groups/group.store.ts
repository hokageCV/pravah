import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Group } from '../../types';

type GroupState = {
  groups: Group[];
  lastUpdated: string;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (id: number) => void;
  setLastUpdated: (date: string) => void;
};

export const useGroupStore = create<GroupState>()(
  persist(
    (set) => ({
      groups: [],

      lastUpdated: new Date(0).toISOString(),

      setGroups: (groups) => set({ groups }),

      addGroup: (group) =>
        set((state) => ({
          groups: [...state.groups, group],
          lastUpdated: new Date().toISOString(),
        })),

      updateGroup: (group) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === group.id ? group : g)),
          lastUpdated: new Date().toISOString(),
        })),

      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          lastUpdated: new Date().toISOString(),
        })),

      setLastUpdated: (date) => set({ lastUpdated: date }),
    }),
    {
      name: 'pravah-group-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
