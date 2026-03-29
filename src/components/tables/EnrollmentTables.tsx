import { useState } from 'react'
import { useTableData } from '../../hooks/useTableData'
import { useZipData } from '../../hooks/useZipData'
import { useFilterStore } from '../../store/filterStore'
// @ts-expect-error — us-zips is CJS with no type declarations
import usZips from 'us-zips/object'

const zipCentroids = usZips as Record<
  string,
  { latitude: number; longitude: number }
>

function CollapsibleTable({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-surface-alt border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Desktop: always-visible header */}
      <div className="hidden md:block px-4 py-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {/* Mobile: collapsible header */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border shrink-0 w-full text-left"
      >
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {/* Desktop: full height scroll. Mobile: capped height, collapsible */}
      <div
        className={`overflow-auto flex-1 md:max-h-none ${open ? 'max-h-[320px]' : 'max-h-0 overflow-hidden'} transition-[max-height] duration-300`}
      >
        {children}
      </div>
    </div>
  )
}

export function EnrollmentTables() {
  const { topStates, topCounties } = useTableData()
  const { zips, isLoading: zipsLoading } = useZipData()
  const setPending = useFilterStore((s) => s.setPending)
  const setSelectedZip = useFilterStore((s) => s.setSelectedZip)
  const activeState = useFilterStore((s) => s.state)
  const activeCounty = useFilterStore((s) => s.county)
  const selectedZip = useFilterStore((s) => s.selectedZip)

  const selectState = (abbr: string) => {
    const isDeselect = activeState === abbr
    setPending({
      pendingState: isDeselect ? '' : abbr,
      pendingCounty: '',
    })
    setTimeout(() => {
      useFilterStore.getState().apply()
    }, 0)
  }

  const selectCounty = (fips: string, state: string) => {
    const isDeselect = activeCounty === fips
    setPending({
      pendingState: isDeselect ? '' : state,
      pendingCounty: isDeselect ? '' : fips,
    })
    setTimeout(() => {
      useFilterStore.getState().apply()
    }, 0)
  }

  const selectZip = (zcta: string) => {
    if (selectedZip?.zcta === zcta) {
      setSelectedZip(null)
      return
    }
    const centroid = zipCentroids[zcta]
    if (centroid) {
      setSelectedZip({
        zcta,
        latitude: centroid.latitude,
        longitude: centroid.longitude,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:h-full">
      {/* States table */}
      <CollapsibleTable title="Top States by Medicaid Coverage">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-alt">
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-2 font-medium">#</th>
              <th className="text-left px-4 py-2 font-medium">State</th>
              <th className="text-right px-4 py-2 font-medium">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {topStates.map((row, i) => {
              const isSelected = activeState === row.state
              return (
                <tr
                  key={row.state}
                  onClick={() => selectState(row.state)}
                  className={`border-t border-border/50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent/20 hover:bg-accent/30'
                      : 'hover:bg-surface'
                  }`}
                >
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td
                    className={`px-4 py-2 ${isSelected ? 'text-accent-light font-medium' : 'text-gray-200'}`}
                  >
                    {row.state} - {row.stateName}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-200 tabular-nums">
                    {row.enrolled.toLocaleString()}
                  </td>
                </tr>
              )
            })}
            {topStates.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CollapsibleTable>

      {/* Counties table */}
      <CollapsibleTable title="Top Counties by Medicaid Coverage">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-alt">
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-2 font-medium">#</th>
              <th className="text-left px-4 py-2 font-medium">County</th>
              <th className="text-left px-4 py-2 font-medium">State</th>
              <th className="text-right px-4 py-2 font-medium">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {topCounties.map((row, i) => {
              const isSelected = activeCounty === row.fips
              return (
                <tr
                  key={row.fips}
                  onClick={() => selectCounty(row.fips, row.state)}
                  className={`border-t border-border/50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent/20 hover:bg-accent/30'
                      : 'hover:bg-surface'
                  }`}
                >
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td
                    className={`px-4 py-2 ${isSelected ? 'text-accent-light font-medium' : 'text-gray-200'}`}
                  >
                    {row.county}
                  </td>
                  <td className="px-4 py-2 text-gray-400">{row.state}</td>
                  <td className="px-4 py-2 text-right text-gray-200 tabular-nums">
                    {row.enrolled.toLocaleString()}
                  </td>
                </tr>
              )
            })}
            {topCounties.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CollapsibleTable>

      {/* ZIP codes table */}
      <CollapsibleTable title="Top ZIP Codes by Medicaid Coverage">
        {zipsLoading ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            Loading ZIP data...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface-alt">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-2 font-medium">#</th>
                <th className="text-left px-4 py-2 font-medium">ZIP</th>
                <th className="text-left px-4 py-2 font-medium">County</th>
                <th className="text-left px-4 py-2 font-medium">State</th>
                <th className="text-right px-4 py-2 font-medium">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {zips.map((row, i) => {
                const isSelected = selectedZip?.zcta === row.zcta
                return (
                  <tr
                    key={row.zcta}
                    onClick={() => selectZip(row.zcta)}
                    className={`border-t border-border/50 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-accent/20 hover:bg-accent/30'
                        : 'hover:bg-surface'
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td
                      className={`px-4 py-2 ${isSelected ? 'text-accent-light font-medium' : 'text-gray-200'}`}
                    >
                      {row.zcta}
                    </td>
                    <td className="px-4 py-2 text-gray-400">
                      {row.countyName}
                    </td>
                    <td className="px-4 py-2 text-gray-400">
                      {row.stateAbbr}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-200 tabular-nums">
                      {row.value.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
              {zips.length === 0 && !zipsLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CollapsibleTable>
    </div>
  )
}
