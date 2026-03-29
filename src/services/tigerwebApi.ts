import type { Feature, Geometry } from 'geojson'

const BASE =
  'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2022/MapServer'

async function queryLayer(
  layerId: number,
  where: string,
): Promise<Feature<Geometry> | null> {
  const params = new URLSearchParams({
    where,
    outFields: '*',
    f: 'geojson',
    outSR: '4326',
  })
  const response = await fetch(`${BASE}/${layerId}/query?${params}`)
  if (!response.ok) return null
  const data = await response.json()
  return data.features?.[0] ?? null
}

export async function fetchZctaBoundary(
  zcta: string,
): Promise<Feature<Geometry> | null> {
  return queryLayer(0, `BASENAME='${zcta}'`)
}
