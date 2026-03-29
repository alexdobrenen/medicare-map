import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FilterPane } from './components/filters/FilterPane'
import { ChoroplethMap } from './components/map/ChoroplethMap'
import { EnrollmentTables } from './components/tables/EnrollmentTables'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen overflow-hidden">
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
    </QueryClientProvider>
  )
}

export default App
