import { StateSelect } from './StateSelect'
import { CountySelect } from './CountySelect'
import { ZipSelect } from './ZipSelect'
import { MedicaidFilterSelect } from './MedicaidFilterSelect'
import { FilterActions } from './FilterActions'

export function FilterPane() {
  return (
    <div className="space-y-5">
      <StateSelect />
      <CountySelect />
      <ZipSelect />
      <MedicaidFilterSelect />
      <FilterActions />
    </div>
  )
}
