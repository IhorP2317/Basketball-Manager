import {BaseFiltersDto} from "../base-filters.dto";

export interface UserFiltersDto extends BaseFiltersDto {
  role: string | null,
  isMatchConfirmed:boolean| null,
}
