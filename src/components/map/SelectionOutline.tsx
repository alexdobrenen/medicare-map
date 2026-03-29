import { Source, Layer } from 'react-map-gl/mapbox'
import type { Feature, Geometry } from 'geojson'

interface SelectionOutlineProps {
  feature: Feature<Geometry>
}

export function SelectionOutline({ feature }: SelectionOutlineProps) {
  const geojson = {
    type: 'FeatureCollection' as const,
    features: [feature],
  }

  return (
    <Source id="selection-outline" type="geojson" data={geojson}>
      <Layer
        id="selection-outline-line"
        type="line"
        paint={{
          'line-color': '#60a5fa',
          'line-width': 3,
          'line-opacity': 0.9,
        }}
      />
      <Layer
        id="selection-outline-fill"
        type="fill"
        paint={{
          'fill-color': '#60a5fa',
          'fill-opacity': 0.08,
        }}
      />
    </Source>
  )
}
