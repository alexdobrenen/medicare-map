import { useMemo } from 'react'
import { useFilterStore } from '../../store/filterStore'
import { useEnrollmentData } from '../../hooks/useEnrollmentData'
import { SearchableSelect } from './SearchableSelect'

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
      const fips = row.BENE_FIPS_CD
      if (!seen.has(fips)) {
        seen.add(fips)
        counties.push({
          value: fips,
          label: `${row.BENE_COUNTY_DESC}, ${row.BENE_STATE_ABRVTN}`,
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
