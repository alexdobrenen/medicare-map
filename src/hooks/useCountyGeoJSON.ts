import { useMemo } from 'react'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import countiesTopo from 'us-atlas/counties-10m.json' with { type: 'json' }

export function useCountyGeoJSON(): FeatureCollection<Geometry> {
  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = countiesTopo as any
    return feature(topo, topo.objects.counties) as unknown as FeatureCollection<Geometry>
  }, [])
}
