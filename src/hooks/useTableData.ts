import { useMemo } from 'react'
import { useEnrollmentData } from './useEnrollmentData'
import { useFilterStore } from '../store/filterStore'
import { computeValue } from '../lib/computeValue'
import { buildFips, STATE_FIPS_TO_ABBR } from '../lib/fipsUtils'
import { US_STATES } from '../lib/constants'

const ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  US_STATES.filter((s) => s.abbr).map((s) => [s.abbr, s.name]),
)

export interface StateRow {
  state: string
  stateName: string
  enrolled: number
}

export interface CountyRow {
  fips: string
  county: string
  state: string
  enrolled: number
}

export function useTableData() {
  const { data: rows } = useEnrollmentData()
  const medicaidFilter = useFilterStore((s) => s.medicaidFilter)
  const countyFilter = useFilterStore((s) => s.county)

  return useMemo(() => {
    if (!rows) return { topStates: [], topCounties: [] }

    const stateMap = new Map<string, number>()
    const countyList: CountyRow[] = []

    for (const row of rows) {
      const fips = buildFips(row.state, row.county)
      if (countyFilter && fips !== countyFilter) continue
      const value = computeValue(row, medicaidFilter)
      if (value === null) continue

      const stateAbbr = STATE_FIPS_TO_ABBR[row.state] ?? row.state
      stateMap.set(stateAbbr, (stateMap.get(stateAbbr) ?? 0) + value)

      const nameParts = row.NAME.split(', ')
      countyList.push({
        fips,
        county: nameParts[0] ?? 'Unknown',
        state: stateAbbr,
        enrolled: value,
      })
    }

    const topStates: StateRow[] = [...stateMap.entries()]
      .map(([state, enrolled]) => ({
        state,
        stateName: ABBR_TO_NAME[state] ?? state,
        enrolled,
      }))
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 50)

    const topCounties: CountyRow[] = countyList
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 50)

    return { topStates, topCounties }
  }, [rows, medicaidFilter, countyFilter])
}
