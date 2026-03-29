export interface HoverInfo {
  longitude: number
  latitude: number
  countyName: string
  stateName: string
  fips: string
  value: number | null
}

export interface ChoroplethData {
  geojson: GeoJSON.FeatureCollection
  values: number[]
  lookup: Map<string, number>
}
