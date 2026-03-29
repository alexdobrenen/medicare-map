import { StateSelect } from './StateSelect'
import { CountySelect } from './CountySelect'
import { AgeRangeFilter } from './AgeRangeFilter'
import { PlanTypeFilter } from './PlanTypeFilter'
import { FilterActions } from './FilterActions'

export function FilterPane() {
  return (
    <div className="space-y-5">
      <StateSelect />
      <CountySelect />
      <AgeRangeFilter />
      <PlanTypeFilter />
      <FilterActions />
    </div>
  )
}
