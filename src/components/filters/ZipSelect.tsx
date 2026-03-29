import { useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useFilterStore } from '../../store/filterStore'
import { fetchZipMedicaid } from '../../services/cmsApi'
import { STATE_FIPS_TO_ABBR } from '../../lib/fipsUtils'
import { SearchableSelect } from './SearchableSelect'
import zctaCountyCrosswalk from '../../data/zcta-county.json'
import { useEnrollmentData } from '../../hooks/useEnrollmentData'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import usZips from 'us-zips/object'

const crosswalk = zctaCountyCrosswalk as Record<string, string>
const zipCentroids = usZips as Record<
  string,
  { latitude: number; longitude: number }
>

export function ZipSelect() {
  const selectedZip = useFilterStore((s) => s.selectedZip)
  const setSelectedZip = useFilterStore((s) => s.setSelectedZip)
  const stateFilter = useFilterStore((s) => s.state)
  const countyFilter = useFilterStore((s) => s.county)
  const { data: countyRows } = useEnrollmentData()

  const { data: allZips } = useQuery({
    queryKey: ['medicaid-zcta'],
    queryFn: fetchZipMedicaid,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  // County FIPS → name lookup
  const countyNameLookup = useMemo(() => {
    const map = new Map<string, string>()
    if (!countyRows) return map
    for (const row of countyRows) {
      const fips = row.state.padStart(2, '0') + row.county.padStart(3, '0')
      const nameParts = row.NAME.split(', ')
      map.set(fips, nameParts[0] ?? 'Unknown')
    }
    return map
  }, [countyRows])

  const options = useMemo(() => {
    const opts: { value: string; label: string }[] = [
      { value: '', label: 'All ZIP Codes' },
    ]
    if (!allZips) return opts

    for (const row of allZips) {
      const zcta = row.zcta
      if (!zcta) continue
      const countyFips = crosswalk[zcta]
      if (!countyFips) continue

      const stateFips = countyFips.slice(0, 2)
      const stateAbbr = STATE_FIPS_TO_ABBR[stateFips] ?? ''

      if (stateFilter && stateAbbr !== stateFilter) continue
      if (countyFilter && countyFips !== countyFilter) continue

      const countyName = countyNameLookup.get(countyFips) ?? ''
      opts.push({
        value: zcta,
        label: countyName
          ? `${zcta} — ${countyName}, ${stateAbbr}`
          : `${zcta} — ${stateAbbr}`,
      })
    }

    opts.sort((a, b) => {
      if (a.value === '') return -1
      if (b.value === '') return 1
      return a.value.localeCompare(b.value)
    })

    return opts
  }, [allZips, stateFilter, countyFilter, countyNameLookup])

  const handleChange = (value: string) => {
    if (!value) {
      setSelectedZip(null)
      return
    }
    const centroid = zipCentroids[value]
    if (centroid) {
      setSelectedZip({
        zcta: value,
        latitude: centroid.latitude,
        longitude: centroid.longitude,
      })
    }
  }

  return (
    <SearchableSelect
      label="ZIP Code"
      options={options}
      value={selectedZip?.zcta ?? ''}
      onChange={handleChange}
      placeholder="Search ZIP codes..."
    />
  )
}
