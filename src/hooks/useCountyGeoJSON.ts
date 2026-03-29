import { useMemo } from 'react'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { FeatureCollection, Geometry } from 'geojson'
// @ts-expect-error us-atlas has no type declarations
import countiesTopo from 'us-atlas/counties-10m.json'

export function useCountyGeoJSON(): FeatureCollection<Geometry> {
  return useMemo(() => {
    const topo = countiesTopo as Topology
    const counties = topo.objects.counties as GeometryCollection
    return feature(topo, counties) as FeatureCollection<Geometry>
  }, [])
}
