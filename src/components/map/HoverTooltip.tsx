import { Popup } from 'react-map-gl/mapbox'
import type { HoverInfo } from '../../types/map'

interface HoverTooltipProps {
  info: HoverInfo
}

export function HoverTooltip({ info }: HoverTooltipProps) {
  return (
    <Popup
      longitude={info.longitude}
      latitude={info.latitude}
      closeButton={false}
      closeOnClick={false}
      anchor="bottom-left"
      offset={8}
    >
      <div className="text-sm leading-snug !bg-surface-alt !text-gray-200">
        <div className="font-semibold text-white">
          {info.countyName}, {info.stateName}
        </div>
        <div className="text-gray-400">FIPS: {info.fips}</div>
        <div className="text-gray-200 font-medium">
          Enrolled:{' '}
          {info.value !== null ? info.value.toLocaleString() : 'Suppressed'}
        </div>
      </div>
    </Popup>
  )
}
