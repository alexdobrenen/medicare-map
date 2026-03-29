import { useState, useCallback, useRef, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

import { useChoroplethData } from '../../hooks/useChoroplethData'
import { useEnrollmentData } from '../../hooks/useEnrollmentData'
import { useSelectionBoundary } from '../../hooks/useSelectionBoundary'
import { useFilterStore } from '../../store/filterStore'
import { buildColorScale } from '../../lib/colorScale'
import { CountyLayer } from './CountyLayer'
import { SelectionOutline } from './SelectionOutline'
import { HoverTooltip } from './HoverTooltip'
import { MapLegend } from './MapLegend'
import type { HoverInfo } from '../../types/map'

const INITIAL_VIEW = {
  longitude: -98.5,
  latitude: 39.5,
  zoom: 3.5,
}

export function ChoroplethMap() {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const mapRef = useRef<MapRef>(null)
  const hasInteracted = useRef(false)
  const choroplethData = useChoroplethData()
  const { isLoading, isError, error } = useEnrollmentData()
  const selectedZip = useFilterStore((s) => s.selectedZip)
  const stateFilter = useFilterStore((s) => s.state)
  const countyFilter = useFilterStore((s) => s.county)
  const selectionBoundary = useSelectionBoundary()

  const colorScale =
    choroplethData && choroplethData.values.length > 0
      ? buildColorScale(choroplethData.values)
      : null

  // Fly to selection boundary (state, county, or ZIP)
  useEffect(() => {
    if (!mapRef.current) return

    if (selectedZip) {
      hasInteracted.current = true
      mapRef.current.flyTo({
        center: [selectedZip.longitude, selectedZip.latitude],
        zoom: 12,
        duration: 1500,
      })
      return
    }

    if (selectionBoundary) {
      hasInteracted.current = true
      const [minLng, minLat, maxLng, maxLat] = selectionBoundary.bbox
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 60, duration: 1500 },
      )
      return
    }

    // No selection — reset to default view (but not on initial mount)
    if (hasInteracted.current) {
      mapRef.current.flyTo({
        center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
        zoom: INITIAL_VIEW.zoom,
        duration: 1500,
      })
    }
  }, [selectedZip, stateFilter, countyFilter, selectionBoundary])

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
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactiveLayerIds={['county-fill']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {choroplethData && <CountyLayer data={choroplethData} />}
        {selectionBoundary && (
          <SelectionOutline feature={selectionBoundary.feature} />
        )}
        {hoverInfo && <HoverTooltip info={hoverInfo} />}
        {selectedZip && (
          <Marker
            longitude={selectedZip.longitude}
            latitude={selectedZip.latitude}
            anchor="center"
          >
            <div className="w-5 h-5 rounded-full bg-accent border-2 border-white shadow-lg animate-pulse" />
          </Marker>
        )}
      </Map>

      <MapLegend colorScale={colorScale} />

      {selectedZip && (
        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg text-sm text-gray-300 z-10">
          ZIP {selectedZip.zcta}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg text-sm text-gray-300 z-10">
          Loading Medicaid data...
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
