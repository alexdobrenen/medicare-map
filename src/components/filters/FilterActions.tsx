import { useFilterStore } from '../../store/filterStore'

export function FilterActions() {
  const apply = useFilterStore((s) => s.apply)
  const reset = useFilterStore((s) => s.reset)

  return (
    <div className="flex gap-2 pt-2">
      <button
        onClick={apply}
        className="flex-1 bg-blue-500 hover:bg-blue-400 text-white rounded-md py-2 text-sm font-medium transition-colors cursor-pointer"
      >
        Apply Filters
      </button>
      <button
        onClick={reset}
        className="px-4 border border-border hover:bg-surface rounded-md py-2 text-sm font-medium text-gray-300 transition-colors cursor-pointer"
      >
        Reset
      </button>
    </div>
  )
}
