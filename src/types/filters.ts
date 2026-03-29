export type MedicaidFilter =
  | 'all'
  | 'under_19'
  | '19_to_64'
  | '65_plus'
  | 'male'
  | 'female'

export interface SelectedZip {
  zcta: string
  latitude: number
  longitude: number
}

export interface FilterState {
  state: string
  county: string
  medicaidFilter: MedicaidFilter
  selectedZip: SelectedZip | null
  pendingState: string
  pendingCounty: string
  pendingMedicaidFilter: MedicaidFilter
  setPending: (updates: Partial<PendingFields>) => void
  setSelectedZip: (zip: SelectedZip | null) => void
  apply: () => void
  reset: () => void
}

export interface PendingFields {
  pendingState: string
  pendingCounty: string
  pendingMedicaidFilter: MedicaidFilter
}
