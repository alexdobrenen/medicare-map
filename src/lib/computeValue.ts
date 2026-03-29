import { MEDICAID_FILTER_FIELDS } from './constants'
import type { ACSMedicaidRow } from '../types/cms'
import type { MedicaidFilter } from '../types/filters'

export function computeValue(
  row: ACSMedicaidRow,
  filter: MedicaidFilter,
): number | null {
  const fields = MEDICAID_FILTER_FIELDS[filter]
  let total = 0
  for (const field of fields) {
    const raw = row[field]
    if (raw === null || raw === undefined || raw === '') return null
    const v = parseInt(raw, 10)
    if (isNaN(v)) return null
    total += v
  }
  return total
}
