import type { ColorScale } from '../../lib/colorScale'
import { formatNumber } from '../../lib/colorScale'

interface MapLegendProps {
  colorScale: ColorScale | null
}

export function MapLegend({ colorScale }: MapLegendProps) {
  if (!colorScale) return null

  const quantiles = colorScale.quantiles()
  const colors = colorScale.range()

  return (
    <div className="absolute bottom-8 right-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs z-10 border border-border">
      <div className="font-semibold text-white mb-2">
        Medicaid Coverage
      </div>
      {colors.map((color, i) => {
        const low = i === 0 ? 0 : quantiles[i - 1]
        const high = i < quantiles.length ? quantiles[i] : undefined
        return (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div
              className="w-4 h-4 rounded-sm shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-300">
              {formatNumber(low)}
              {high !== undefined ? ` - ${formatNumber(high)}` : '+'}
            </span>
          </div>
        )
      })}
      <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border">
        <div className="w-4 h-4 rounded-sm shrink-0 bg-gray-600" />
        <span className="text-gray-400">No data</span>
      </div>
    </div>
  )
}
