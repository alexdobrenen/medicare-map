import type { ACSMedicaidRow } from '../types/cms'

const ACS_BASE = 'https://api.census.gov/data/2022/acs/acs5'
const VARIABLES =
  'NAME,C27007_001E,C27007_004E,C27007_007E,C27007_010E,C27007_014E,C27007_017E,C27007_020E'

function parseACSResponse(
  data: string[][],
  geoType: 'county' | 'zcta',
): ACSMedicaidRow[] {
  const headers = data[0]
  return data.slice(1).map((row) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = row[i]
    })
    if (geoType === 'county') {
      return {
        NAME: obj['NAME'],
        C27007_001E: obj['C27007_001E'],
        C27007_004E: obj['C27007_004E'],
        C27007_007E: obj['C27007_007E'],
        C27007_010E: obj['C27007_010E'],
        C27007_014E: obj['C27007_014E'],
        C27007_017E: obj['C27007_017E'],
        C27007_020E: obj['C27007_020E'],
        state: obj['state'],
        county: obj['county'],
      } as ACSMedicaidRow
    }
    return {
      NAME: obj['NAME'],
      C27007_001E: obj['C27007_001E'],
      C27007_004E: obj['C27007_004E'],
      C27007_007E: obj['C27007_007E'],
      C27007_010E: obj['C27007_010E'],
      C27007_014E: obj['C27007_014E'],
      C27007_017E: obj['C27007_017E'],
      C27007_020E: obj['C27007_020E'],
      state: '',
      county: '',
      zcta: obj['zip code tabulation area'],
    } as ACSMedicaidRow
  })
}

export async function fetchCountyMedicaid(
  stateFips?: string,
): Promise<ACSMedicaidRow[]> {
  const geo = stateFips
    ? `for=county:*&in=state:${stateFips}`
    : 'for=county:*&in=state:*'
  const url = `${ACS_BASE}?get=${VARIABLES}&${geo}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Census API error: ${response.status}`)
  const data = (await response.json()) as string[][]
  return parseACSResponse(data, 'county')
}

export async function fetchZipMedicaid(): Promise<ACSMedicaidRow[]> {
  const url = `${ACS_BASE}?get=${VARIABLES}&for=zip%20code%20tabulation%20area:*`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Census API error: ${response.status}`)
  const data = (await response.json()) as string[][]
  return parseACSResponse(data, 'zcta')
}
