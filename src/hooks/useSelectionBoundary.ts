import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { feature } from 'topojson-client'
import type { Feature, Geometry, FeatureCollection, BBox } from 'geojson'
import { useFilterStore } from '../store/filterStore'
import { useCountyGeoJSON } from './useCountyGeoJSON'
import { STATE_ABBR_TO_FIPS } from '../lib/fipsUtils'
import { fetchZctaBoundary } from '../services/tigerwebApi'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import statesTopo from 'us-atlas/states-10m.json' with { type: 'json' }

function computeBbox(feat: Feature<Geometry>): BBox {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity

  function processCoords(coords: number[]) {
    minLng = Math.min(minLng, coords[0])
    minLat = Math.min(minLat, coords[1])
    maxLng = Math.max(maxLng, coords[0])
    maxLat = Math.max(maxLat, coords[1])
  }

  function walk(geometry: Geometry) {
    if (geometry.type === 'Point') {
      processCoords(geometry.coordinates)
    } else if (geometry.type === 'MultiPoint' || geometry.type === 'LineString') {
      geometry.coordinates.forEach(processCoords)
    } else if (
      geometry.type === 'MultiLineString' ||
      geometry.type === 'Polygon'
    ) {
      geometry.coordinates.forEach((ring) => ring.forEach(processCoords))
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((poly) =>
        poly.forEach((ring) => ring.forEach(processCoords)),
      )
    } else if (geometry.type === 'GeometryCollection') {
      geometry.geometries.forEach(walk)
    }
  }

  walk(feat.geometry)
  return [minLng, minLat, maxLng, maxLat]
}

export interface SelectionBoundary {
  feature: Feature<Geometry>
  bbox: BBox
}

export function useSelectionBoundary(): SelectionBoundary | null {
  const stateFilter = useFilterStore((s) => s.state)
  const countyFilter = useFilterStore((s) => s.county)
  const selectedZip = useFilterStore((s) => s.selectedZip)
  const countyGeoJSON = useCountyGeoJSON()

  // State boundaries from us-atlas
  const statesGeoJSON = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = statesTopo as any
    return feature(
      topo,
      topo.objects.states,
    ) as unknown as FeatureCollection<Geometry>
  }, [])

  // Fetch ZIP boundary on demand
  const { data: zipBoundary } = useQuery({
    queryKey: ['zcta-boundary', selectedZip?.zcta],
    queryFn: () => fetchZctaBoundary(selectedZip!.zcta),
    enabled: !!selectedZip,
    staleTime: 30 * 60 * 1000,
  })

  return useMemo(() => {
    // Priority: ZIP > County > State
    if (selectedZip && zipBoundary) {
      return {
        feature: zipBoundary,
        bbox: computeBbox(zipBoundary),
      }
    }

    if (countyFilter) {
      const feat = countyGeoJSON.features.find(
        (f) => String(f.id).padStart(5, '0') === countyFilter,
      )
      if (feat) {
        return {
          feature: feat as Feature<Geometry>,
          bbox: computeBbox(feat as Feature<Geometry>),
        }
      }
    }

    if (stateFilter) {
      const stateFips = STATE_ABBR_TO_FIPS[stateFilter]
      if (stateFips) {
        const feat = statesGeoJSON.features.find(
          (f) => String(f.id).padStart(2, '0') === stateFips,
        )
        if (feat) {
          return {
            feature: feat as Feature<Geometry>,
            bbox: computeBbox(feat as Feature<Geometry>),
          }
        }
      }
    }

    return null
  }, [
    stateFilter,
    countyFilter,
    selectedZip,
    zipBoundary,
    countyGeoJSON,
    statesGeoJSON,
  ])
}
