import { useFilterStore } from '../../store/filterStore'
import { AGE_BRACKET_LABELS } from '../../lib/constants'
import type { AgeBracket } from '../../types/filters'

const brackets = Object.keys(AGE_BRACKET_LABELS) as AgeBracket[]

export function AgeRangeFilter() {
  const pendingAgeBracket = useFilterStore((s) => s.pendingAgeBracket)
  const setPending = useFilterStore((s) => s.setPending)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Age Range
      </label>
      <div className="space-y-1.5">
        {brackets.map((bracket) => (
          <label
            key={bracket}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="ageBracket"
              value={bracket}
              checked={pendingAgeBracket === bracket}
              onChange={() => setPending({ pendingAgeBracket: bracket })}
              className="accent-accent"
            />
            <span className="text-sm text-gray-300">
              {AGE_BRACKET_LABELS[bracket]}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
