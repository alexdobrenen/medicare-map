import { useState, useCallback } from 'react'
import Map from 'react-map-gl/mapbox'
import type { MapMouseEvent } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

import { useChoroplethData } from '../../hooks/useChoroplethData'
import { useEnrollmentData } from '../../hooks/useEnrollmentData'
import { buildColorScale } from '../../lib/colorScale'
import { CountyLayer } from './CountyLayer'
import { HoverTooltip } from './HoverTooltip'
import { MapLegend } from './MapLegend'
import type { HoverInfo } from '../../types/map'

export function ChoroplethMap() {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const choroplethData = useChoroplethData()
  const { isLoading, isError, error } = useEnrollmentData()

  const colorScale =
    choroplethData && choroplethData.values.length > 0
      ? buildColorScale(choroplethData.values)
      : null

  const onMouseMove = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0]
    if (feature && feature.properties) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        countyName: feature.properties.countyName ?? 'Unknown',
        stateName: feature.properties.stateName ?? '',
        fips: feature.properties.fips ?? '',
        value:
          feature.properties.value != null
            ? Number(feature.properties.value)
            : null,
      })
    } else {
      setHoverInfo(null)
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    setHoverInfo(null)
  }, [])

  return (
    <div className="relative w-full h-full">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -98.5,
          latitude: 39.5,
          zoom: 3.5,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactiveLayerIds={['county-fill']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {choroplethData && <CountyLayer data={choroplethData} />}
        {hoverInfo && <HoverTooltip info={hoverInfo} />}
      </Map>

      <MapLegend colorScale={colorScale} />

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg text-sm text-gray-300 z-10">
          Loading Medicare data...
        </div>
      )}

      {isError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950/80 border border-red-800 rounded-lg px-4 py-2 shadow-lg text-sm text-red-300 z-10">
          Error loading data: {(error as Error).message}
        </div>
      )}
    </div>
  )
}
