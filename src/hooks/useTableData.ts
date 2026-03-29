import { useMemo } from 'react'
import { useEnrollmentData } from './useEnrollmentData'
import { useFilterStore } from '../store/filterStore'
import { computeValue } from '../lib/computeValue'

export interface StateRow {
  state: string
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
  const ageBracket = useFilterStore((s) => s.ageBracket)
  const planType = useFilterStore((s) => s.planType)
  const countyFilter = useFilterStore((s) => s.county)

  return useMemo(() => {
    if (!rows) return { topStates: [], topCounties: [] }

    const stateMap = new Map<string, number>()
    const countyList: CountyRow[] = []

    for (const row of rows) {
      if (countyFilter && row.BENE_FIPS_CD !== countyFilter) continue
      const value = computeValue(row, ageBracket, planType)
      if (value === null) continue

      // Aggregate by state
      const st = row.BENE_STATE_ABRVTN
      stateMap.set(st, (stateMap.get(st) ?? 0) + value)

      // County-level rows
      countyList.push({
        fips: row.BENE_FIPS_CD,
        county: row.BENE_COUNTY_DESC,
        state: st,
        enrolled: value,
      })
    }

    const topStates: StateRow[] = [...stateMap.entries()]
      .map(([state, enrolled]) => ({ state, enrolled }))
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 50)

    const topCounties: CountyRow[] = countyList
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 50)

    return { topStates, topCounties }
  }, [rows, ageBracket, planType, countyFilter])
}
