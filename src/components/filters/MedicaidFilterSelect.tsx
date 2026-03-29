import { useFilterStore } from '../../store/filterStore'
import { MEDICAID_FILTER_LABELS } from '../../lib/constants'
import type { MedicaidFilter } from '../../types/filters'

const filters = Object.keys(MEDICAID_FILTER_LABELS) as MedicaidFilter[]

export function MedicaidFilterSelect() {
  const pendingMedicaidFilter = useFilterStore((s) => s.pendingMedicaidFilter)
  const setPending = useFilterStore((s) => s.setPending)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Demographic
      </label>
      <div className="space-y-1.5">
        {filters.map((filter) => (
          <label
            key={filter}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="medicaidFilter"
              value={filter}
              checked={pendingMedicaidFilter === filter}
              onChange={() => setPending({ pendingMedicaidFilter: filter })}
              className="accent-accent"
            />
            <span className="text-sm text-gray-300">
              {MEDICAID_FILTER_LABELS[filter]}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
