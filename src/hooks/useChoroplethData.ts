import { useMemo } from 'react'
import type { Feature, Geometry } from 'geojson'
import { useEnrollmentData } from './useEnrollmentData'
import { useCountyGeoJSON } from './useCountyGeoJSON'
import { useFilterStore } from '../store/filterStore'
import { buildFips, STATE_FIPS_TO_ABBR } from '../lib/fipsUtils'
import { computeValue } from '../lib/computeValue'
import type { ChoroplethData } from '../types/map'

export function useChoroplethData(): ChoroplethData | null {
  const { data: enrollmentRows, isLoading } = useEnrollmentData()
  const counties = useCountyGeoJSON()
  const medicaidFilter = useFilterStore((s) => s.medicaidFilter)
  const countyFilter = useFilterStore((s) => s.county)

  return useMemo(() => {
    if (!enrollmentRows || isLoading) return null

    const lookup = new Map<string, number>()
    const countyNames = new Map<string, { county: string; state: string }>()

    for (const row of enrollmentRows) {
      const fips = buildFips(row.state, row.county)
      if (countyFilter && fips !== countyFilter) continue
      const value = computeValue(row, medicaidFilter)
      if (value !== null) {
        lookup.set(fips, value)
      }
      // Parse "County Name, State Name" from NAME field
      const nameParts = row.NAME.split(', ')
      const countyName = nameParts[0] ?? 'Unknown'
      const stateAbbr = STATE_FIPS_TO_ABBR[row.state] ?? ''
      countyNames.set(fips, { county: countyName, state: stateAbbr })
    }

    const features: Feature<Geometry>[] = counties.features.map((f) => {
      const fips = String(f.id).padStart(5, '0')
      const names = countyNames.get(fips)
      return {
        ...f,
        properties: {
          ...f.properties,
          fips,
          value: lookup.get(fips) ?? null,
          countyName: names?.county ?? 'Unknown',
          stateName: names?.state ?? '',
        },
      }
    })

    const values = [...lookup.values()].filter((v) => v > 0)

    return {
      geojson: {
        type: 'FeatureCollection' as const,
        features,
      },
      values,
      lookup,
    }
  }, [enrollmentRows, isLoading, counties, medicaidFilter, countyFilter])
}
