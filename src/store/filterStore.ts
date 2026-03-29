import { create } from 'zustand'
import type { FilterState } from '../types/filters'

export const useFilterStore = create<FilterState>((set) => ({
  state: '',
  county: '',
  ageBracket: 'all',
  planType: 'all',
  pendingState: '',
  pendingCounty: '',
  pendingAgeBracket: 'all',
  pendingPlanType: 'all',

  setPending: (updates) => set((s) => ({ ...s, ...updates })),

  apply: () =>
    set((s) => ({
      state: s.pendingState,
      county: s.pendingCounty,
      ageBracket: s.pendingAgeBracket,
      planType: s.pendingPlanType,
    })),

  reset: () =>
    set({
      state: '',
      county: '',
      ageBracket: 'all',
      planType: 'all',
      pendingState: '',
      pendingCounty: '',
      pendingAgeBracket: 'all',
      pendingPlanType: 'all',
    }),
}))
