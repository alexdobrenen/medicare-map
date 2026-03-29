import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCountyEnrollment } from '../services/cmsApi'
import { useFilterStore } from '../store/filterStore'

export function useEnrollmentData() {
  const appliedState = useFilterStore((s) => s.state)

  return useQuery({
    queryKey: ['enrollment', '2023', appliedState],
    queryFn: () =>
      fetchCountyEnrollment('2023', appliedState || undefined),
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
