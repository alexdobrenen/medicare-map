import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FilterPane } from './components/filters/FilterPane'
import { ChoroplethMap } from './components/map/ChoroplethMap'
import { EnrollmentTables } from './components/tables/EnrollmentTables'

const queryClient = new QueryClient()

function App() {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen w-screen overflow-hidden">
        <aside className="w-[300px] shrink-0 border-r border-border overflow-y-auto p-5 bg-surface-alt">
          <h1 className="text-lg font-bold text-white mb-5">
            Medicare Map
          </h1>
          <FilterPane />
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden bg-surface">
          <div className="h-[55vh] shrink-0 relative">
            <ChoroplethMap />
          </div>
          <div className="flex-1 min-h-0">
            <EnrollmentTables />
          </div>
        </main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col h-screen w-screen overflow-hidden bg-surface">
        <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-surface-alt border-b border-border">
          <h1 className="text-lg font-bold text-white">Medicare Map</h1>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="px-3 py-1.5 text-sm rounded-md bg-accent/20 text-accent-light border border-accent/30 hover:bg-accent/30 transition-colors"
          >
            {filtersOpen ? 'Hide Filters' : 'Filters'}
          </button>
        </header>

        {filtersOpen && (
          <div className="shrink-0 max-h-[60vh] overflow-y-auto p-4 bg-surface-alt border-b border-border">
            <FilterPane />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="h-[50vh] min-h-[300px] relative">
            <ChoroplethMap />
          </div>
          <div className="min-h-[400px]">
            <EnrollmentTables />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
