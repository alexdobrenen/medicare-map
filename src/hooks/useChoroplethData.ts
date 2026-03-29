import { useMemo } from 'react'
import type { Feature, Geometry } from 'geojson'
import { useEnrollmentData } from './useEnrollmentData'
import { useCountyGeoJSON } from './useCountyGeoJSON'
import { useFilterStore } from '../store/filterStore'
import { padFips } from '../lib/fipsUtils'
import { computeValue } from '../lib/computeValue'
import type { ChoroplethData } from '../types/map'

export function useChoroplethData(): ChoroplethData | null {
  const { data: enrollmentRows, isLoading } = useEnrollmentData()
  const counties = useCountyGeoJSON()
  const ageBracket = useFilterStore((s) => s.ageBracket)
  const planType = useFilterStore((s) => s.planType)
  const countyFilter = useFilterStore((s) => s.county)

  return useMemo(() => {
    if (!enrollmentRows || isLoading) return null

    const lookup = new Map<string, number>()
    const countyNames = new Map<string, { county: string; state: string }>()

    for (const row of enrollmentRows) {
      if (countyFilter && row.BENE_FIPS_CD !== countyFilter) continue
      const fips = padFips(row.BENE_FIPS_CD)
      const value = computeValue(row, ageBracket, planType)
      if (value !== null) {
        lookup.set(fips, value)
      }
      countyNames.set(fips, {
        county: row.BENE_COUNTY_DESC,
        state: row.BENE_STATE_ABRVTN,
      })
    }

    const features: Feature<Geometry>[] = counties.features.map((f) => {
      const fips = padFips(String(f.id))
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
  }, [enrollmentRows, isLoading, counties, ageBracket, planType, countyFilter])
}
