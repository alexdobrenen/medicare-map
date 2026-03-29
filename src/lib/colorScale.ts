import { scaleQuantile } from 'd3-scale'
import { schemeBlues } from 'd3-scale-chromatic'
import type { Expression } from 'mapbox-gl'

const BINS = 7

export function buildColorScale(values: number[]) {
  return scaleQuantile<string>()
    .domain(values)
    .range(schemeBlues[BINS])
}

export type ColorScale = ReturnType<typeof buildColorScale>

export function buildMapboxFillExpression(
  lookup: Map<string, number>,
  colorScale: ColorScale,
): Expression {
  const matchExpr: unknown[] = ['match', ['get', 'fips']]
  for (const [fips, value] of lookup) {
    matchExpr.push(fips, colorScale(value))
  }
  matchExpr.push('#ccc')
  return matchExpr as Expression
}

export function formatNumber(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`
  }
  return n.toLocaleString()
}
