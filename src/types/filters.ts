export type AgeBracket =
  | 'all'
  | 'lt65'
  | '65_69'
  | '70_74'
  | '75_79'
  | '80_84'
  | '85_plus'

export type PlanType = 'all' | 'original' | 'advantage'

export interface FilterState {
  state: string
  county: string
  ageBracket: AgeBracket
  planType: PlanType
  pendingState: string
  pendingCounty: string
  pendingAgeBracket: AgeBracket
  pendingPlanType: PlanType
  setPending: (updates: Partial<PendingFields>) => void
  apply: () => void
  reset: () => void
}

export interface PendingFields {
  pendingState: string
  pendingCounty: string
  pendingAgeBracket: AgeBracket
  pendingPlanType: PlanType
}
