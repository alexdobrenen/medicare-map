import { useMemo } from 'react'
import { useFilterStore } from '../../store/filterStore'
import { US_STATES } from '../../lib/constants'
import { SearchableSelect } from './SearchableSelect'

export function StateSelect() {
  const pendingState = useFilterStore((s) => s.pendingState)
  const setPending = useFilterStore((s) => s.setPending)

  const options = useMemo(
    () => US_STATES.map((s) => ({ value: s.abbr, label: s.name })),
    [],
  )

  return (
    <SearchableSelect
      label="State"
      options={options}
      value={pendingState}
      onChange={(v) => setPending({ pendingState: v, pendingCounty: '' })}
      placeholder="Search states..."
    />
  )
}
