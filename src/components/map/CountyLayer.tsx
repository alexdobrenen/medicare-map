import { Source, Layer } from 'react-map-gl/mapbox'
import type { ChoroplethData } from '../../types/map'
import {
  buildColorScale,
  buildMapboxFillExpression,
} from '../../lib/colorScale'

interface CountyLayerProps {
  data: ChoroplethData
}

export function CountyLayer({ data }: CountyLayerProps) {
  const { geojson, values, lookup } = data
  const colorScale = buildColorScale(values)
  const fillExpression = buildMapboxFillExpression(lookup, colorScale)

  return (
    <Source id="counties" type="geojson" data={geojson}>
      <Layer
        id="county-fill"
        type="fill"
        paint={{
          'fill-color': fillExpression,
          'fill-opacity': 0.8,
        }}
      />
      <Layer
        id="county-outline"
        type="line"
        paint={{
          'line-color': '#ffffff',
          'line-width': 0.5,
          'line-opacity': 0.6,
        }}
      />
    </Source>
  )
}
