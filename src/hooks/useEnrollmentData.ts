import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCountyMedicaid } from '../services/cmsApi'
import { useFilterStore } from '../store/filterStore'
import { STATE_ABBR_TO_FIPS } from '../lib/fipsUtils'

export function useEnrollmentData() {
  const appliedState = useFilterStore((s) => s.state)
  const stateFips = appliedState ? STATE_ABBR_TO_FIPS[appliedState] : undefined

  return useQuery({
    queryKey: ['medicaid-county', appliedState],
    queryFn: () => fetchCountyMedicaid(stateFips),
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
