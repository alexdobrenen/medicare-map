import { useFilterStore } from '../../store/filterStore'
import { PLAN_TYPE_LABELS } from '../../lib/constants'
import type { PlanType } from '../../types/filters'

const planTypes = Object.keys(PLAN_TYPE_LABELS) as PlanType[]

export function PlanTypeFilter() {
  const pendingPlanType = useFilterStore((s) => s.pendingPlanType)
  const setPending = useFilterStore((s) => s.setPending)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Plan Type
      </label>
      <div className="space-y-1.5">
        {planTypes.map((pt) => (
          <label key={pt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="planType"
              value={pt}
              checked={pendingPlanType === pt}
              onChange={() => setPending({ pendingPlanType: pt })}
              className="accent-accent"
            />
            <span className="text-sm text-gray-300">
              {PLAN_TYPE_LABELS[pt]}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
