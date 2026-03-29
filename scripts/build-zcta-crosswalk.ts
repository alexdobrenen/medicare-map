/**
 * Downloads the Census ZCTA-to-County relationship file and builds
 * a compact JSON mapping each ZCTA to its primary county (largest area overlap).
 *
 * Usage: npx tsx scripts/build-zcta-crosswalk.ts
 * Output: src/data/zcta-county.json
 */

const CENSUS_URL =
  'https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt'

async function main() {
  console.log('Downloading Census ZCTA-County relationship file...')
  const response = await fetch(CENSUS_URL)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const text = await response.text()

  const lines = text.split('\n')
  // Header: OID_ZCTA5_20|GEOID_ZCTA5_20|...|GEOID_COUNTY_20|...|AREALAND_PART|AREAWATER_PART
  // GEOID_ZCTA5_20 is index 1, GEOID_COUNTY_20 is index 9, AREALAND_PART is index 16

  const zctaCounties = new Map<string, { county: string; area: number }[]>()

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('|')
    if (parts.length < 17) continue
    const zcta = parts[1]
    const countyFips = parts[9]
    if (!zcta || !countyFips) continue
    const area = parseInt(parts[16]) || 0

    if (!zctaCounties.has(zcta)) {
      zctaCounties.set(zcta, [])
    }
    zctaCounties.get(zcta)!.push({ county: countyFips, area })
  }

  // Pick primary county (largest land area overlap) for each ZCTA
  const mapping: Record<string, string> = {}
  for (const [zcta, counties] of zctaCounties) {
    const primary = counties.reduce((a, b) => (b.area > a.area ? b : a))
    mapping[zcta] = primary.county
  }

  const { writeFileSync } = await import('fs')
  const { resolve } = await import('path')
  const outPath = resolve(import.meta.dirname!, '..', 'src', 'data', 'zcta-county.json')
  writeFileSync(outPath, JSON.stringify(mapping, null, 0))

  console.log(`Written ${Object.keys(mapping).length} ZCTA→county mappings to ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
