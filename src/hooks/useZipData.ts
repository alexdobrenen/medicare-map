import { useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchZipMedicaid } from '../services/cmsApi'
import { useFilterStore } from '../store/filterStore'
import { computeValue } from '../lib/computeValue'
import { STATE_FIPS_TO_ABBR } from '../lib/fipsUtils'
import zctaCountyCrosswalk from '../data/zcta-county.json'
import { useEnrollmentData } from './useEnrollmentData'

const crosswalk = zctaCountyCrosswalk as Record<string, string>

export interface ZipRow {
  zcta: string
  value: number
  stateAbbr: string
  countyName: string
}

export function useZipData() {
  const medicaidFilter = useFilterStore((s) => s.medicaidFilter)
  const stateFilter = useFilterStore((s) => s.state)
  const countyFilter = useFilterStore((s) => s.county)
  const { data: countyRows } = useEnrollmentData()

  const { data: zipRows, isLoading } = useQuery({
    queryKey: ['medicaid-zcta'],
    queryFn: fetchZipMedicaid,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  // Build a county FIPS → county name lookup from the county enrollment data
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

  const zips = useMemo(() => {
    if (!zipRows) return []

    const result: ZipRow[] = []
    for (const row of zipRows) {
      const zcta = row.zcta
      if (!zcta) continue
      const countyFips = crosswalk[zcta]
      if (!countyFips) continue

      const stateFips = countyFips.slice(0, 2)
      const stateAbbr = STATE_FIPS_TO_ABBR[stateFips] ?? ''

      // Apply state filter
      if (stateFilter && stateAbbr !== stateFilter) continue
      // Apply county filter
      if (countyFilter && countyFips !== countyFilter) continue

      const value = computeValue(row, medicaidFilter)
      if (value === null) continue

      result.push({
        zcta,
        value,
        stateAbbr,
        countyName: countyNameLookup.get(countyFips) ?? 'Unknown',
      })
    }

    result.sort((a, b) => b.value - a.value)
    return result.slice(0, 50)
  }, [zipRows, medicaidFilter, stateFilter, countyFilter, countyNameLookup])

  return { zips, isLoading }
}
