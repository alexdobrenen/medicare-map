import { useTableData } from '../../hooks/useTableData'
import { useFilterStore } from '../../store/filterStore'

export function EnrollmentTables() {
  const { topStates, topCounties } = useTableData()
  const setPending = useFilterStore((s) => s.setPending)
  const activeState = useFilterStore((s) => s.state)
  const activeCounty = useFilterStore((s) => s.county)

  const selectState = (abbr: string) => {
    const isDeselect = activeState === abbr
    setPending({
      pendingState: isDeselect ? '' : abbr,
      pendingCounty: '',
    })
    // Apply immediately after pending state updates in next microtask
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:h-full">
      {/* Top States */}
      <div className="bg-surface-alt border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-white">
            Top States by Enrollment
          </h2>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface-alt">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-2 font-medium">#</th>
                <th className="text-left px-4 py-2 font-medium">State</th>
                <th className="text-right px-4 py-2 font-medium">Enrolled</th>
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
                      {row.state}
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
        </div>
      </div>

      {/* Top Counties */}
      <div className="bg-surface-alt border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-white">
            Top Counties by Enrollment
          </h2>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface-alt">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-2 font-medium">#</th>
                <th className="text-left px-4 py-2 font-medium">County</th>
                <th className="text-left px-4 py-2 font-medium">State</th>
                <th className="text-right px-4 py-2 font-medium">Enrolled</th>
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
        </div>
      </div>
    </div>
  )
}
