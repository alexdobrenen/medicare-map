import { useMemo } from 'react'
import { useFilterStore } from '../../store/filterStore'
import { useEnrollmentData } from '../../hooks/useEnrollmentData'
import { SearchableSelect } from './SearchableSelect'
import { buildFips, STATE_FIPS_TO_ABBR } from '../../lib/fipsUtils'

export function CountySelect() {
  const pendingCounty = useFilterStore((s) => s.pendingCounty)
  const setPending = useFilterStore((s) => s.setPending)
  const { data: rows } = useEnrollmentData()

  const options = useMemo(() => {
    if (!rows) return [{ value: '', label: 'All Counties' }]

    const seen = new Set<string>()
    const counties: { value: string; label: string }[] = [
      { value: '', label: 'All Counties' },
    ]

    for (const row of rows) {
      const fips = buildFips(row.state, row.county)
      if (!seen.has(fips)) {
        seen.add(fips)
        const nameParts = row.NAME.split(', ')
        const stateAbbr = STATE_FIPS_TO_ABBR[row.state] ?? ''
        counties.push({
          value: fips,
          label: `${nameParts[0]}, ${stateAbbr}`,
        })
      }
    }

    counties.sort((a, b) => {
      if (a.value === '') return -1
      if (b.value === '') return 1
      return a.label.localeCompare(b.label)
    })

    return counties
  }, [rows])

  return (
    <SearchableSelect
      label="County"
      options={options}
      value={pendingCounty}
      onChange={(v) => setPending({ pendingCounty: v })}
      placeholder="Search counties..."
    />
  )
}
