import { AGE_BRACKET_FIELDS } from './constants'
import type { CMSCountyEnrollmentRow } from '../types/cms'
import type { AgeBracket, PlanType } from '../types/filters'

export function computeValue(
  row: CMSCountyEnrollmentRow,
  ageBracket: AgeBracket,
  planType: PlanType,
): number | null {
  if (ageBracket === 'all' && planType === 'all') {
    const v = parseInt(row.TOT_BENES)
    return isNaN(v) ? null : v
  }

  if (ageBracket === 'all') {
    const field =
      planType === 'original' ? 'ORGNL_MDCR_BENES' : 'MA_AND_OTH_BENES'
    const v = parseInt(row[field])
    return isNaN(v) ? null : v
  }

  const fields = AGE_BRACKET_FIELDS[ageBracket]
  let total = 0
  for (const field of fields) {
    const v = parseInt(row[field])
    if (isNaN(v)) return null
    total += v
  }

  if (planType !== 'all') {
    const totBenes = parseFloat(row.TOT_BENES)
    if (isNaN(totBenes) || totBenes === 0) return null
    const planField =
      planType === 'original' ? 'ORGNL_MDCR_BENES' : 'MA_AND_OTH_BENES'
    const planCount = parseFloat(row[planField])
    if (isNaN(planCount)) return null
    total = Math.round(total * (planCount / totBenes))
  }

  return total
}
