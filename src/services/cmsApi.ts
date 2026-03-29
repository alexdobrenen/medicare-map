import type { CMSCountyEnrollmentRow } from '../types/cms'

const BASE = 'https://data.cms.gov/data-api/v1/dataset'
const DATASET_ID = 'd7fabe1e-d19b-4333-9eff-e80e0643f2fd'
const PAGE_SIZE = 1000

export async function fetchCountyEnrollment(
  year: string,
  state?: string,
): Promise<CMSCountyEnrollmentRow[]> {
  const params = new URLSearchParams({
    'filter[BENE_GEO_LVL]': 'County',
    'filter[YEAR]': year,
    'filter[MONTH]': 'Year',
    size: String(PAGE_SIZE),
  })
  if (state) {
    params.set('filter[BENE_STATE_ABRVTN]', state)
  }

  const url = `${BASE}/${DATASET_ID}/data?${params}`

  const firstPage = await fetch(`${url}&offset=0`).then((r) => {
    if (!r.ok) throw new Error(`CMS API error: ${r.status}`)
    return r.json() as Promise<CMSCountyEnrollmentRow[]>
  })

  if (firstPage.length < PAGE_SIZE) {
    return firstPage
  }

  // Estimate total pages and fetch in parallel
  const estimatedTotal = state ? firstPage.length : 3300
  const pageCount = Math.ceil(estimatedTotal / PAGE_SIZE)
  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, i) =>
      fetch(`${url}&offset=${(i + 1) * PAGE_SIZE}`).then((r) => {
        if (!r.ok) throw new Error(`CMS API error: ${r.status}`)
        return r.json() as Promise<CMSCountyEnrollmentRow[]>
      }),
    ),
  )

  return [firstPage, ...remainingPages].flat()
}
