import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Group } from '../../types';

type GroupState = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (id: number) => void;
};

export const useGroupStore = create<GroupState>()(
  persist(
    (set) => ({
      groups: [],

      setGroups: (groups) => set({ groups }),

      addGroup: (group) => set((state) => ({
        groups: [...state.groups, group],
      })),

      updateGroup: (group) => set((state) => ({
        groups: state.groups.map(g => g.id === group.id ? group : g),
      })),

      removeGroup: (id) => set((state) => ({
        groups: state.groups.filter(g => g.id !== id),
      })),
    }),
    {
      name: 'pravah-group-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

