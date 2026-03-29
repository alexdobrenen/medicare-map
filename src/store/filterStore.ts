import { create } from 'zustand'
import type { FilterState } from '../types/filters'

export const useFilterStore = create<FilterState>((set) => ({
  state: '',
  county: '',
  medicaidFilter: 'all',
  selectedZip: null,
  pendingState: '',
  pendingCounty: '',
  pendingMedicaidFilter: 'all',

  setPending: (updates) => set((s) => ({ ...s, ...updates })),

  setSelectedZip: (zip) => set({ selectedZip: zip }),

  apply: () =>
    set((s) => ({
      state: s.pendingState,
      county: s.pendingCounty,
      medicaidFilter: s.pendingMedicaidFilter,
      selectedZip: null,
    })),

  reset: () =>
    set({
      state: '',
      county: '',
      medicaidFilter: 'all',
      selectedZip: null,
      pendingState: '',
      pendingCounty: '',
      pendingMedicaidFilter: 'all',
    }),
}))
